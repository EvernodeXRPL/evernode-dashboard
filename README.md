# evernode-dashboard
Evernode system dashboard

## Streamer

Create a config file named `streamer/config.json` in the following format and populate.
```json
{
    "hostname": "",
    "path": "",
    "azure_table": {
        "host": "",
        "table": "",
        "sas": ""
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
