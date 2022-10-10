import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  View,
  Text,
  Switch
} from 'react-native';
import styles from '../../styles/styles';
import Meteor from '@meteorrn/core';
import OneSignal from 'react-native-onesignal';
import { trackEvent } from '../../utilities/Analytics';

export default class NotificationSettings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      matches: true,
      pickupline: true,
      offers: true,
    };
    this.onValueChangeMatches = this.onValueChangeMatches.bind(this);
    this.onValueChangePickupline = this.onValueChangePickupline.bind(this);
    this.onValueChangeOffers = this.onValueChangeOffers.bind(this);
    this._updatePushType = this._updatePushType.bind(this);
  }

  componentWillMount() {
    // Meteor.call('hasPushEnabled', Meteor.user()._id, (err, result) => {
    //     if (!err) {
    //         this.setState({
    //             silenceSwitchOn: result,
    //         });
    //     }
    // });
    Meteor.call('getPushType', Meteor.user()._id, (err, res) => {
      this.setState({ ...res });
    });
  }

  onValueChangeMatches(value) {
    trackEvent('Settings_Profile', 'slider_noti_MatchMessages', value);
    this.setState({
      matches: value
    }, this._updatePushType);
  }

  onValueChangePickupline(value) {
    trackEvent('Settings_Profile', 'slider_noti_pickupline', value);
    this.setState({
      pickupline: value
    }, this._updatePushType);
  }

  onValueChangeOffers(value) {
    trackEvent('Settings_Profile', 'Slider_noti_offers', value);
    this.setState({
      offers: value
    }, this._updatePushType);
  }

  _updatePushType() {
    const {
      matches,
      pickupline,
      offers,
    } = this.state;
    Meteor.call('updatePushType', Meteor.user()._id, {
      matches,
      pickupline,
      offers,
    });
    if (!matches &&
      !pickupline &&
      !offers
    ) {
      // OneSignal.setSubscription(false);
      Meteor.call('disablePush', Meteor.user()._id);
    } else {
      // OneSignal.setSubscription(true);
      Meteor.call('enablePush', Meteor.user()._id);
    }

    // OneSignal.sendTags({ want_offers: offers });
    OneSignal.sendTags({ want_pickupline: pickupline });
  }

  render() {
    return(
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 5}} >
          <Text style={[styles.subtituloSettings,{fontFamily: 'Montserrat-Regular', fontSize: 13}]}>{I18n.t('app.components.SettingsComponents.NotificationSettings.newMatches')}</Text>
          <Switch
            value={this.state.matches}
            onValueChange={this.onValueChangeMatches}/>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 5}} >
            <Text style={[styles.subtituloSettings,{fontFamily: 'Montserrat-Regular', fontSize: 13}]}>{I18n.t('app.components.SettingsComponents.NotificationSettings.pickUpLine')}</Text>
            <Switch
              value={this.state.pickupline}
              onValueChange={this.onValueChangePickupline}/>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 5}} >
              <Text style={[styles.subtituloSettings,{fontFamily: 'Montserrat-Regular', fontSize: 13}]}>{I18n.t('app.components.SettingsComponents.NotificationSettings.offers')}</Text>
              <Switch
                value={this.state.offers}
                onValueChange={this.onValueChangeOffers}/>
              </View>
            </View>
          );
        }
      }
