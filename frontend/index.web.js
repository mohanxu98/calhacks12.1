import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register the main component
AppRegistry.registerComponent(appName, () => App);

// For web, we need to run the app
if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root');
  if (rootTag) {
    AppRegistry.runApplication(appName, {
      initialProps: {},
      rootTag: rootTag,
    });
  }
}
