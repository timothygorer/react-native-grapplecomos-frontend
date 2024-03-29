//@ts-nocheck
import NotificationsIOS from 'react-native-notifications';
import AbstractPlatform from './abstract-platform';
import logService from '../log.service';
import sessionService from '../session.service';

/**
 * Ios Platform
 */
export default class IosPlatfom extends AbstractPlatform {
  /**
   * Init push service
   */
  init() {
    NotificationsIOS.addEventListener(
      'remoteNotificationsRegistered',
      this._onPushRegistered.bind(this),
    );
    NotificationsIOS.addEventListener(
      'remoteNotificationsRegistrationFailed',
      this._onPushRegistrationFailed.bind(this),
    );
    NotificationsIOS.addEventListener(
      'notificationOpened',
      this._onNotificationOpened.bind(this),
    );
  }

  /**
   * Stop push service
   */
  stop() {
    NotificationsIOS.removeEventListener(
      'remoteNotificationsRegistered',
      this._onPushRegistered.bind(this),
    );
    NotificationsIOS.removeEventListener(
      'remoteNotificationsRegistrationFailed',
      this._onPushRegistrationFailed.bind(this),
    );
    NotificationsIOS.removeEventListener(
      'notificationOpened',
      this._onNotificationOpened.bind(this),
    );
  }

  registerOnNotificationReceived(callback: (notification) => void) {
    NotificationsIOS.addEventListener(
      'notificationReceivedForeground',
      callback,
    );
  }

  unregisterOnNotificationReceived(callback: (notification) => void) {
    NotificationsIOS.removeEventListener(
      'notificationReceivedForeground',
      callback,
    );
  }

  /**
   * Set app badge
   * @param {integer} num
   */
  setBadgeCount(num) {
    NotificationsIOS.setBadgeCount(num);
  }

  /**
   * Set on notification opened handler
   * @param {function} handler
   */
  setOnNotificationOpened(handler) {
    this._onNotificationOpenedHandler = handler;
  }

  /**
   * Handle the notification that open the app
   */
  async handleInitialNotification() {
    try {
      const notification = await NotificationsIOS.getInitialNotification();
      if (notification && this.onInitialNotification) {
        this.onInitialNotification(notification);
      }
    } catch (err) {
      logService.exception('[PushService]', err);
    }
  }

  requestPermission() {
    return NotificationsIOS.requestPermissions();
  }

  /**
   * Returns a promise that resolves the user permissions
   */
  checkPermissions() {
    return NotificationsIOS.checkPermissions();
  }

  _onNotificationOpened(notification) {
    this._onNotificationOpenedHandler(notification);
  }

  _onPushRegistered(deviceToken) {
    this.token = deviceToken;
    sessionService.deviceToken = deviceToken;

    if (this.shouldRegister) {
      this.registerToken();
    }
  }

  // register token into backend
  registerToken() {
    super.registerToken('apns');
  }

  _onPushRegistrationFailed(error) {
    // For example:
    //
    // error={
    //   domain: 'NSCocoaErroDomain',
    //   code: 3010,
    //   localizedDescription: 'remote notifications are not supported in the simulator'
    // }
    logService.error(error.localizedDescription);
  }
}
