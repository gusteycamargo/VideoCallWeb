# React bootstrap project for ConnectyCube platform

Our ConnectyCube team prepared the sample to show how to integrate the ConnectyCube JS SDK to React project.
We've used the npm module [react-app-rewired](https://www.npmjs.com/package/react-app-rewired) to modify Webpack config in React project.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Actions in order:
1. Init React App: `npm init react-app you-future-app-name`
2. Go to the app folder: `cd you-future-app-name`
3. Install ConnectyCube JS SDK dependency: `npm install connectycube`
4. Install *react-app-rewired* as devDependency: `npm install react-app-rewired --save-dev`
5. Create a *config-overrides.js* file in the root of your project
```
module.exports = config => {
  config.externals = [
    'nativescript-xmpp-client',
    'node-xmpp-client',
    'node-fetch',
    'form-data'
  ];

  return config;
}
```
6. In *package.json* chage scripts “start” and “build”:
```
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build"
  }
```
7. You are ready to import the ConnectyCube as npm package:
```
import ConnectyCube from 'connectycube';
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## Can't build yourself?

Got troubles with building Cordova code sample? Just create an issue at [Issues page](https://github.com/ConnectyCube/sample-init-react-js-app/issues) - we will create the sample for you. For FREE!
