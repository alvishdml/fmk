import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  View,
  Text,
  Switch,
  TouchableOpacity
} from 'react-native';
import styles from '../../styles/styles';
import Meteor from '@meteorrn/core';
import OneSignal from 'react-native-onesignal';
import { Actions } from 'react-native-router-flux';
import { trackEvent } from '../../utilities/Analytics';

export default class UniSettings extends Component {

  constructor(props) {
    super(props);
    var switchValue = Meteor.user().profile.unirace;
    let disabled = false;
    if(switchValue == null || switchValue === undefined){
      disabled = true;
    }
    this.state = {
      silenceSwitchOn: Meteor.user().profile.unirace,
      disabled: disabled
    };
  }

  componentWillMount() {

  }

  onValueChange(value) {
    trackEvent('Settings_Profile', 'slider_uniChallenge', value);
    Meteor.call('setUniRace', Meteor.user()._id, value, (err, result)=> {
      if(err){
        this.setState({
          silenceSwitchOn: !value
        });
      } else {
        this.props.container.setState({uniraceActive: value})
      }
    })
    this.setState({
      silenceSwitchOn: value
    });
  }

  render() {
    return(
      <View>
        {!this.state.disabled &&
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 5}} >
            <Text style={[styles.subtituloSettings,{fontFamily: 'Montserrat-Regular', fontSize: 13}]}>{I18n.t('app.components.SettingsComponents.UniSettings.universityChallenge')}</Text>
            <Switch
              value={this.state.silenceSwitchOn}
              disabled={this.state.disabled}
              onValueChange={this.onValueChange.bind(this)}/>
          </View>
        }
        {this.state.disabled &&
          <TouchableOpacity onPress={() => {Actions.uniRace({mainPage: this.props.mainPage})}} style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 5}} >
            <Text style={[styles.subtituloSettings,{fontFamily: 'Montserrat-Regular', fontSize: 13}]}>{I18n.t('app.components.SettingsComponents.UniSettings.universityChallenge')}</Text>
            <Switch
              value={this.state.silenceSwitchOn}
              disabled={this.state.disabled}
              onValueChange={this.onValueChange.bind(this)}/>
          </TouchableOpacity>
        }
      </View>

    );
  }
}
