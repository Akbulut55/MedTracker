/**
 * @format
 */
import 'react-native-gesture-handler';
import notifee from '@notifee/react-native';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

notifee.onBackgroundEvent(async () => {});

AppRegistry.registerComponent(appName, () => App);
