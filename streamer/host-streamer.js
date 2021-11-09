const fs = require('fs');
const exec = require('child_process').exec;
const fetch = require('node-fetch');

const logFileName = __dirname + '/log.txt';
const mbServiceName = 'sashimono-mb-xrpl.service';
let lastSeen = false;
let missedChecks = 0;
let reportedMissing = false;
const LAST_SEEN_INTERVAL = 60 * 1000; // Every 1 minute.
const INSTANCE_COUNT_INTERVAL = 30 * 1000; // Broadcast instance count every 30 seconds.
let host_address = null;

const events = {
    ONLINE: 'host_online',
    OFFLINE: 'host_offline',
    CREATION: 'host_create',
    CREATION_TIMEOUT: 'host_timeout',
    EXPIRE: 'host_expire',
    COUNT: 'host_count'
};

function subscribeForLogs() {
    exec(`journalctl -fu ${mbServiceName} > ${logFileName}`, function (error, stdout, stderr) {
        if (error || stderr) {
            console.log(error || stderr);
        }
    });
}

function watchForFileChanges() {
    fs.watchFile(logFileName, async (current, previous) => {
        // Check if file modified time is less than last time.
        // If so, nothing changed so don't bother parsing.
        if (current.mtime <= previous.mtime) { return; }

        let fileSize = previous.size;

        // We're only going to read the portion of the file that
        // we have not read so far. Obtain new file size.
        var newFileSize = current.size;
        // Calculate size difference.
        var sizeDiff = newFileSize - fileSize;
        // If the diff is negative, file may be truncated. Read the full file.
        if (sizeDiff < 0) {
            fileSize = 0;
            sizeDiff = newFileSize;
        }
        // Create a buffer to hold only the data we intend to read.
        var buffer = new Buffer.alloc(sizeDiff);
        // Obtain reference to the file's descriptor.
        var fileDescriptor = fs.openSync(logFileName, 'r');
        // Synchronously read from the file starting from where we read
        // to last time and store data in our buffer.
        fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize);
        fs.closeSync(fileDescriptor);

        await parseLogs(buffer);
    });
}

async function broadcast(event, eventData) {
    const data = JSON.stringify({
        systemDashboard: {
            event: event,
            data: eventData
        }
    });
    console.log(`Broadcasting ${event}: ${data.length} bytes`);
    const config = {
        hostname: "func-hotpocket.azurewebsites.net",
        path: "/api/receiver?code=iDGN8ayISFzntjY3B3ALBzp6vRK2wjUr7BQajchT7EDqbFMDx1zhHQ=="
    }
    await fetch(`https://${config.hostname}${config.path}`, {
        port: 443,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        },
        body: data
    }).catch(error => { console.error(error) });
}

async function parseLogs(buffer) {
    // Iterate over each line in the buffer.
    let str = buffer.toString();
    str.split('\n').forEach(async (line) => {
        if (line.length > 0) {
            if (line.includes('Destroyed ')) {
                await broadcast(events.EXPIRE, {
                    host: host_address,
                });
                console.log('An instance was expired.');
            } else if (line.includes('Alive')) {
                lastSeen = true;
            } else if (line.includes('Instance creation timeout.')) {
                await broadcast(events.CREATION_TIMEOUT, {
                    host: host_address,
                });
                console.log('Instance creation timeout.');
            } else if (line.includes('Instance created for')) {
                await broadcast(events.CREATION, {
                    host: host_address,
                });
                console.log('Instance creation.');
            }
        }
    });
};

function monitorLastSeen() {
    setInterval(async () => {
        if (lastSeen) {
            if (reportedMissing) {
                reportedMissing = false;
                await broadcast(events.ONLINE, {
                    host: host_address,
                });
                console.log('Reporting sashimono is back up..');
            }
            missedChecks = 0;
            lastSeen = false;
        } else {
            if (missedChecks > 3) {
                console.log('Sashimono was not seen in the last 3 checks. Reporting offline status.');
                await broadcast(events.OFFLINE, {
                    host: host_address
                });
                reportedMissing = true;
            }
            missedChecks++;
        }
    }, LAST_SEEN_INTERVAL);
}

function monitorInstanceCount() {
    setInterval(async () => {
        exec(`/usr/bin/sashi list`, async (error, stdout, stderr) => {
            if (error || stderr) {
                console.log(error || stderr);
                return;
            }

            if (stdout)
            {
                // Remove the last new line character from the string.
                const str = stdout.substr(0, stdout.length - 1);
                const arr = str.split('\n');
                await broadcast(events.COUNT, {
                    host: host_address,
                    count: arr.length - 2
                });

            }
        });
    }, INSTANCE_COUNT_INTERVAL);
}


function main() {
    const mb_config_path = '/etc/sashimono/mb-xrpl/mb-xrpl.cfg';
    if (fs.existsSync(mb_config_path)) {
        const data = fs.readFileSync(mb_config_path, 'utf-8');
        const config = JSON.parse(data);
        host_address = config.xrpl.address;
    }
    if (!host_address)
    {
        console.error("Couldn't obtain host address from mb-xrpl.cfg");
        process.exit(1);
    }
    console.log(`Starting sashimono host monitor for host ${host_address}`);
    subscribeForLogs();
    watchForFileChanges();
    monitorLastSeen();
    monitorInstanceCount();
}
main();