# Evernode System Dashboard and Streamer
Evernode system dashboard web app. (ReactJS) and central streamer.

## Dashboard

### Configs
Edit the `public/config.js` to specify the evernode system dashboard configs.
Contains the list on countries specified in cluster creation.
Contains azure signalR and table storage keys.

```
yarn install

# Production build
yarn build

# Development server
yarn start
```

### URL
Must use "evernode" sub directory (eg. http://localhost:3000/evernode). This is controlled in `.env` file.


## Central Streamer

Create a config file named `streamer/config.json` in the following format and populate. Access keys are in project wiki.
```json
{
    "azure_function": {
        "hostname": "",
        "path": ""
    },
    "azure_table": {
        "host": "",
        "table": "",
        "sas": ""
    },
    "vultr": {
        "api_key": "",
        "group": ""
    }
}
```
### Running

Default:
```bash
node streamer.js
```
To override the hook address streamer listens to:
```bash
HOOK_ADDRESS='r4Y3oZ22QLbF7m2jQDcdG8byYWe9rxfMq7' node streamer.js
```

## Sashi Streamer
- Upload the build output of sashi streamer in to the evernode blob storage if any new changes are done.
- `sashi-streamer-install.sh` script installs sashi streamer as a systemd service in host machine.

```bash
https://sthotpocket.blob.core.windows.net/evernode/sashi-streamer-install.sh | bash
```
Use the above command to install sashi streamer on a host machine.
