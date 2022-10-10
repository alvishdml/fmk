import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import { View, Text, Switch } from 'react-native';
import styles from '../../styles/styles';
import Meteor from '@meteorrn/core';

import { trackEvent } from '../../utilities/Analytics';

export default class OwnGenderSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      male: Meteor.user().profile.gender === 'male',
      female: Meteor.user().profile.gender === 'female',
    };
  }

  changeOption(value, gender) {
    let newGender = gender;
    if (!value && gender === 'female') {
      newGender = 'male';
    } else if (!value && gender === 'male') {
      newGender = 'female';
    }
    trackEvent('Settings_Profile', 'slider_own_gender', newGender);
    Meteor.call('changeUserGender', Meteor.user()._id, newGender, (err) => {
      if (!err) {
        this.setState({
          male: newGender === 'male',
          female: newGender === 'female',
        });
      }
    });
  }

  render() {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <Text
            style={[
              styles.subtituloSettings,
              { fontFamily: 'Montserrat-Regular', fontSize: 13 },
            ]}
          >
            {I18n.t('app.components.SettingsComponents.ChangeGender.female')}
          </Text>
          <Switch
            onValueChange={(value) => {
              this.changeOption(value, 'female');
            }}
            value={this.state.female}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <Text
            style={[
              styles.subtituloSettings,
              { fontFamily: 'Montserrat-Regular', fontSize: 13 },
            ]}
          >
            {I18n.t('app.components.SettingsComponents.ChangeGender.male')}
          </Text>
          <Switch
            onValueChange={(value) => {
              this.changeOption(value, 'male');
            }}
            value={this.state.male}
          />
        </View>
      </View>
    );
  }
}
