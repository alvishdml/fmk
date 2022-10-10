import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions, ActionConst } from 'react-native-router-flux';
import { checkForInstaToken } from './CustomLoginInstagramButton';
import Meteor from '@meteorrn/core';
import styles from '../../styles/styles';
const FBSDK = require('react-native-fbsdk-next');
const { LoginManager, AccessToken } = FBSDK;
import OneSignal from 'react-native-onesignal';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setupAnalytics, trackEvent } from '../../utilities/Analytics';

const BD = require('../../utilities/DAAsyncStorage');
const myBD = new BD();
const USER_TOKEN_KEY = 'user_token';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const DPI = PixelRatio.get();
const APP_VERSION = '1.1.10';
const ONE_SIGNAL_TAGS = [
  'name',
  'first_name',
  'last_name',
  'birthday',
  'picture',
  'gender',
  'age',
];

// reference to native module for opening Location Settings
// Android only
let AppInstallSource = NativeModules.AppInstallSource;

export const loginWithTokens = async () => {
  const installSource = null //await AppInstallSource.installSource();
  const Data = Meteor.getData();
  console.log
  let token = '';
  AccessToken.getCurrentAccessToken().then((res) => {
    if (res) {
      token = res;
      Meteor.call(
        'login',
        { facebook: res, origin: installSource },
        (err, result) => {
          if (!err) {
            AsyncStorage.setItem(USER_TOKEN_KEY, result.token);
            Data._tokenIdSaved = result.token;
            Meteor._userIdSaved = result.id;
            setupAnalytics(result.id);
            trackEvent('Login', 'Login_Facebook');
            OneSignal.getTags((receivedTags) => {
              let correct_tags = _.every(
                ONE_SIGNAL_TAGS,
                _.partial(_.has, receivedTags),
              );
              if (_.size(receivedTags) == 0 || !correct_tags) {
                let user_details = {
                  name: Meteor.user().profile.name,
                  lang: I18n.currentLocale(),
                  first_name: Meteor.user().profile.first_name,
                  last_name: Meteor.user().profile.last_name,
                  picture: Meteor.user().profile.custom_picture
                    ? Meteor.user().profile.custom_picture
                    : Meteor.user().profile.picture,
                  birthday: Meteor.user().profile.birthday,
                  gender: Meteor.user().profile.gender,
                  interested_in: Meteor.user().profile.interested_in,
                  age: Meteor.user().profile.age,
                  school_name:
                    Meteor.user().profile.school &&
                    Meteor.user().profile.school.name,
                  school_country:
                    Meteor.user().profile.school &&
                    Meteor.user().profile.school.country,
                  school_students:
                    Meteor.user().profile.school &&
                    Meteor.user().profile.school.students,
                  followers: Meteor.user().profile.followers || -1,
                  purchased: Meteor.user().profile.purchased,
                };
                OneSignal.sendTags(user_details);
              }
            });
            myBD.buscarItem('onesignal_id', (onesignal_id) => {
              if (onesignal_id) {
                Meteor.call(
                  'registerOneSignalId',
                  Meteor.user()._id,
                  onesignal_id,
                );
              }
            });
            myBD.buscarItem('app_version', (version) => {
              if (version) {
                if (version !== APP_VERSION) {
                  Meteor.call('setAppVersion', Meteor.user()._id, APP_VERSION);
                  myBD.criarItem('app_version', APP_VERSION, () => {});
                }
              } else {
                Meteor.call('setAppVersion', Meteor.user()._id, APP_VERSION);
                myBD.criarItem('app_version', APP_VERSION, () => {});
              }
            });
            myBD.buscarItem('gender_search_option', (item) => {
              if (!item) {
                let gender = Meteor.user().profile.gender;
                if (gender === 'female') {
                  myBD.criarItem('gender_search_option', 'male', () => {});
                } else if (gender === 'male') {
                  myBD.criarItem('gender_search_option', 'female', () => {});
                } else {
                  myBD.criarItem('gender_search_option', 'both', () => {});
                }
              }
            });

            Actions.mainPage({
              idUser: result.id,
              initialPage: 1,
              type: ActionConst.RESET,
            });
          } else {
            trackEvent('Login', 'Login_Error', err.errorType);
            if (err.error == 500) {
              if (err.errorType == 'Meteor.Error') {
                Actions.login();
              }
            }
          }
        },
      );
    } else {
      checkForInstaToken();
      // Actions.login();
    }
  });
};

function loginWithCustomPermissions(navegador) {
  trackEvent('Login_Facebook_Button', 'click');
  // Change this if there's any error about Facebook hash keys
  // LoginManager.setLoginBehavior('web'); //ios
  // LoginManager.setLoginBehavior('web_only'); //android
  LoginManager.logInWithPermissions([
    'public_profile',
    'email',
    'user_photos',
    'user_birthday',
    'user_gender',
    'user_age_range',
  ]).then(
    function(result) {
      if (result.isCancelled) {
        trackEvent('Login', 'Facebook_Login_Canceled');
      } else {
        loginWithTokens(); 
      }
    },
    function(error) {
      trackEvent('Login', 'Login_Facebook_Error', error.errorType);
      if (error == 'Error: CONNECTION_FAILURE: CONNECTION_FAILURE') {
      } else {
        //console.log('--------ERRO ',error)
        //alert('Login fail with error: ' + error);
      }
    },
  );
}

export class CustomLoginButton extends Component {
  constructor(props) {
    super(props);
    let screenSize = WIDTH * DPI;
    let small = false;
    if (screenSize <= 480) {
      small = true;
    }
    this.state = {
      small: small,
    };
  }

  render() {
    let customFontText = {};
    let customButtonSize = {};

    if (this.state.small) {
      customFontText.fontSize = 12;
      customButtonSize.width = 230;
      customButtonSize.height = 45;
    }

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.4}
          style={[
            styles.loginButton,
            customButtonSize,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
          onPress={loginWithCustomPermissions.bind(
            this,
            this.props.navegadorBotao,
          )}
        >
          <Icon
            style={{ backgroundColor: 'transparent' }}
            name={'facebook-square'}
            size={20}
            color={'#fff'}
          />
          <Text
            style={[
              {
                fontFamily: 'Montserrat-Light',
                color: 'white',
                backgroundColor: 'transparent',
                fontSize: 12,
                margin: 0,
                marginLeft: 10,
              },
            ]}
          >
            {I18n.t('app.components.login.CustomLoginButton.signFacebook')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
