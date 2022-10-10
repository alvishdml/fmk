import React, { Component } from 'react';
import Meteor from '@meteorrn/core';
import OneSignal from 'react-native-onesignal';
import NotificationCounter from './NotificationCounter';
import DeepLinking from './DeepLinking';
import { trackEvent } from '../utilities/Analytics.js';

const BD = require('./DAAsyncStorage');
const myBD = new BD();
const DEEP_LINKING = new DeepLinking();

export default class OneSignalPush extends Component {

    componentWillMount() {
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('registered', this.onRegistered);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived(notification) {
        let customData = notification.payload.additionalData;
        if (customData && customData.tab && customData.tab == 'chat') {
            NotificationCounter.newNotification();
        }
    }

    onOpened(openResult) {
        let customData = openResult.notification.payload.additionalData;
        if(customData && customData.ga_keyword){
          trackEvent('OneSignal_Open', customData.ga_keyword);
        } else {
          trackEvent('OneSignal_Open', 'undefined');
        }
        if (customData) {
            DEEP_LINKING.handle(customData);
        }
    }

    onRegistered(notifData) {
        myBD.buscarItem('onesignal_token', (onesignal_token) => {
            if (onesignal_token && (onesignal_token !== notifData.deviceToken)) {
                myBD.criarItem('onesignal_token', notifData.deviceToken, () => {});
            }
        });
    }

    onIds(device) {
      myBD.buscarItem('onesignal_id', (onesignal_id) => {
          if(!onesignal_id) {
              myBD.criarItem('onesignal_id', device.userId, () => {});
          } else if (onesignal_id !== device.userId) {
              myBD.criarItem('onesignal_id', device.userId, () => {});
          }
      });
    }

    render() {
        return (
            null
        )
    }

}


//(required) Called when a remote or local notification is opened or received
// onNotification(notification) {
//     console.log(notification);
//     let deepLinking = new DeepLinking();
//     const clicked = notification.userInteraction
//     if (clicked) {
//         if (notification.redirect && Meteor.user()._id) {
//             deepLinking.handle(notification);
//         }
//     } else if (notification.foreground && notification.tab == 'chat') {
//         //main.newNotification();
//         NotificationCounter.newNotification();
//     }
// },
