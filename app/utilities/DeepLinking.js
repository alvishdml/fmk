import { IntentAndroid } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { trackEvent } from '../utilities/Analytics.js';
import Meteor from '@meteorrn/core';
const BD = require('./DAAsyncStorage');
const myBD = new BD();

export default class DeepLinking {
  handle(notification) {
    if (Meteor.user() && Meteor.user()._id) {
      Actions.mainPage({
        idUser: Meteor.user()._id,
        initialPage: 1,
        type: ActionConst.RESET,
      });
      let tab = notification.tab;
      if (tab) {
        myBD.criarItem('trigger_tab', notification.tab, () => {});
      }
      let offer = notification.offer;
      if (offer) {
        myBD.criarItem('trigger_offer', notification.offer, () => {});
      }
      let popup = notification.popup;
      if (popup) {
        myBD.criarItem('trigger_popup', notification.trigger, () => {});
      }
      switch (tab) {
        case 'feed':
          setTimeout(() => {
            Actions.mainPage({
              idUser: Meteor.user()._id,
              initialPage: 1,
              type: ActionConst.RESET,
            });
            if (notification.action) {
              this.handleChatActions(notification);
            }
          }, 1000);
          trackEvent('Deep_Link', 'feed');
          break;

        case 'chat':
          setTimeout(() => {
            Actions.mainPage({
              idUser: Meteor.user()._id,
              initialPage: 2,
              type: ActionConst.RESET,
            });
            if (notification.action) {
              this.handleChatActions(notification);
              trackEvent('Deep_Link', 'chatMessage');
            } else {
              trackEvent('Deep_Link', 'chatMatch');
            }
          }, 1000);
          break;

        case 'profile':
          setTimeout(() => {
            Actions.mainPage({
              idUser: Meteor.user()._id,
              initialPage: 0,
              type: ActionConst.RESET,
            });
            trackEvent('Deep_Link', 'profile');
          }, 1000);
          break;

        case 'referral':
          Actions.monetizationSlideshow({ changeView: 'true', initialPage: 4 });
          trackEvent('Deep_Link', 'referral');
          break;

        case 'uniChallenge':
          Actions.uniRace();
          trackEvent('Deep_Link', 'uniRace');
          break;

        case 'votedFuck':
          Actions.whoVoted({
            typeSelected: 'fuck',
          });
          trackEvent('Deep_Link', 'votedFuck');
          break;

        case 'votedMarry':
          Actions.whoVoted({
            typeSelected: 'marry',
          });
          trackEvent('Deep_Link', 'votedMarry');
          break;

        case 'inappPurchases':
          setTimeout(() => {
            Actions.mainPage({
              initialPage: 3,
              type: ActionConst.RESET,
            });
            trackEvent('Deep_Link', 'inappPurchases');
          }, 1000);
          break;

        default:
          console.log('something went wrong with deep link from notification');
          break;
      }
    } else {
      setTimeout(() => {
        this.handle(notification);
      }, 750);
    }
  }

  handleChatActions(notification) {
    let action = notification.action;
    let id = Meteor.user()._id;
    switch (action) {
      case 'message':
        Meteor.call('matchInfo', notification.deep_link, (err, result) => {
          if (!err) {
            // get the other user profile picture
            let otherUserId = '';
            let first = result.first;
            let second = result.second;
            let type = result.type;
            let unread = result.unread;
            if (id == result.first) {
              // second is the user we want
              otherUserId = result.second;
            } else {
              // second is the user we want
              otherUserId = result.first;
            }
            Meteor.call('userPhoto', otherUserId, (err, result) => {
              if (!err && result) {
                Actions.chatWindow({
                  idMatch: notification.deep_link,
                  first: first,
                  second: second,
                  matchType: type,
                  numPaginasPop: 1,
                  unread: unread,
                  image: { uri: result },
                  notification: true,
                });
              } else {
                console.log('Something went wrong getting a photo!');
              }
            });
          }
        });
        break;
      case 'update':
        IntentAndroid.openURL('market://details?id=com.builduplabs.fmk');
        break;
      default:
        console.log('Something went wrong with the action');
    }
  }
}
