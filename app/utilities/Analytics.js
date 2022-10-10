
import Meteor from '@meteorrn/core';

import { AppEventsLogger } from 'react-native-fbsdk-next';
// import firebase from './Firebase';
import analytics from '@react-native-firebase/analytics';


export const trackRevenue = ({ product, category, price, quantity, id }) => {
  // GoogleAnalytics.trackPurchaseEvent({
  //   id: product,
  //   name: category,
  //   price: price/10000,
  //   quantity: 1,
  // }, {
  //   id,
  // }, 'Monetization', 'Purchase');
  
  AppEventsLogger.logPurchase(price/10000, 'EUR', { product, category, quantity: 1 });
};

export const setupUserId = (id) => {
  if (analytics()) {
    analytics().setUserId(id);
  }
  AppEventsLogger.setUserID(id);
};

export const trackEvent = (name, action, data) => {
  const eventData = {};
  if (data) {
    if (typeof data !== 'string') {
      eventData.label = data.toString();
    } else {
      eventData.label = data;
    }
  }
  // trackEvent(name, action, eventData);
  if (analytics()) {
    if (data) {
      analytics().logEvent(name.replace('-', '_').replace(' ', '_'), { action, data: typeof data !== 'string' ? data.toString() : data });
    } else {
      analytics().logEvent(name.replace('-', '_').replace(' ', '_'), { action, data });
    }
  }

};

export const trackScreen = (name) => {
  // GoogleAnalytics.trackScreenView(name);
  // if (analytics()) {
  //   analytics().setCurrentScreen(name);
  // }
};

export const setupAnalytics = (userId) => {
  // GoogleAnalytics.setUser(Meteor.user()._id);
  if (analytics()) {
    //analytics().setUserId(Meteor.user()._id);
    analytics().setUserId(userId)
  }
};

export const initAnalytics = async () => {
  // GoogleAnalytics.setTrackerId('UA-84242210-1');
  // GoogleAnalytics.allowIDFA(true);
  // const installSource = await AppInstallSource.installSource();
  // GoogleAnalytics.trackScreenView('CustomDimensions', { customDimensions: { 2: installSource } });
};
