# Evernode Host Dashboard
Evernode host dashboard web app (ReactJS).

## Environment
Add `.env.development.local` file in root directory and specify testnet.
Add `.env.production.local` file in root directory and specify mainnet.
```
REACT_APP_DEFAULT_NETWORK=<network>
```
__Overriding the governor address__
```
REACT_APP_OVERRIDE_<network in upper case>_GOVERNOR_ADDRESS=<governor address>
```
Example:
```
REACT_APP_OVERRIDE_DEVNET_GOVERNOR_ADDRESS=<devnet governor address>
```

### URL
Must use "evernode-host-dashboard" sub directory (eg. http://localhost:3000/evernode-host-dashboard). This is controlled in `.env` file.

## Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
