# Evernode System Dashboard and Streamer
Evernode system dashboard web app. (ReactJS) and central streamer.

## Dashboard

### Configs
Edit the `public/config.js` to specify the evernode system dashboard configs.
Contains the list on regions specified in cluster creation.
Contains azure signalR and table storage keys.

```
yarn install

# Production build
yarn build

# Development server
yarn start
```


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
