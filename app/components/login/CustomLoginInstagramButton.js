import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  AsyncStorage,
  NativeModules,
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import Meteor from '@meteorrn/core';
import styles from '../../styles/styles';
const FBSDK = require('react-native-fbsdk-next');
const {
  LoginManager,
  AccessToken
} = FBSDK;
import OneSignal from 'react-native-onesignal';
import _ from 'lodash';
import branch from 'react-native-branch'
import InstagramLogin from 'react-native-instagram-login';
import Icon from 'react-native-vector-icons/FontAwesome';
import { trackEvent } from '../../utilities/Analytics';

const BD = require('../../utilities/DAAsyncStorage');
const myBD = new BD();
const USER_TOKEN_KEY = 'user_token';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const DPI = PixelRatio.get();
const APP_VERSION = '1.1.10';
const ONE_SIGNAL_TAGS = ['name', 'first_name', 'last_name', 'birthday', 'picture', 'gender'];

// reference to native module for opening Location Settings
// Android only
let AppInstallSource = NativeModules.AppInstallSource;

export const checkForInstaToken = () => {

  myBD.buscarItem('instagram_access_token', (instagram_access_token) => {
    if (instagram_access_token) {
      //trackEvent('Instagram_Login ', 'User_already_exists');
      loginWithTokens(instagram_access_token, false, false, false, false, false, true);
    }else{
      Actions.login();
    }
  });

}

export const loginWithTokens = async (token, gender, birthdate, age, interestedInMale, interestedInFemale, inCache) => {
  const Data = Meteor.getData()
  if (gender) {
    const birthDate = `${birthdate.getMonth()+1}/${birthdate.getDate()}/${birthdate.getFullYear()}`;
    if (interestedInMale && interestedInFemale){
    var interestedIn = 'both';
    } else {
      var interestedIn = interestedInMale ? 'male' : 'female';
    }
    const installSource = null //await AppInstallSource.installSource();
    var data = {
      instagram: token,
      gender: gender,
      age: age,
      birthdate: birthDate,
      interestedIn: interestedIn,
      from: installSource,
      created: true
    };
  } else {
    if(!inCache){
      myBD.criarItem('instagram_access_token',token,() => {});
    }
    data = { instagram: token };
  }

  Meteor.call(
    'login',
    { instagram: data},
    (err, result) => {
      if (!err) {
        AsyncStorage.setItem(USER_TOKEN_KEY, result.token);
        Data._tokenIdSaved = result.token;
        Meteor._userIdSaved = result.id;
        if(Object.keys(data).length == 1){
          trackEvent('Login', 'Login_Instagram');
        }
        // GoogleAnalytics.setUser(result.id);
        OneSignal.getTags((receivedTags) => {
          let correct_tags = _.every(ONE_SIGNAL_TAGS, _.partial(_.has, receivedTags));
          if (_.size(receivedTags) == 0 || !correct_tags) {
            let user_details = {
              name: Meteor.user().profile.name,
              lang: I18n.currentLocale(),
              first_name: Meteor.user().profile.first_name,
              last_name: Meteor.user().profile.last_name,
              picture: Meteor.user().profile.custom_picture ? Meteor.user().profile.custom_picture : Meteor.user().profile.picture,
              birthday: Meteor.user().profile.birthday,
              gender: Meteor.user().profile.gender,
            }
            OneSignal.sendTags(user_details);
          }
        });
        myBD.buscarItem('onesignal_id', (onesignal_id) => {
          if (onesignal_id) {
            Meteor.call('registerOneSignalId', Meteor.user()._id, onesignal_id);
          }
        });
        myBD.buscarItem('app_version', (version) => {
          if(version) {
            if(version !== APP_VERSION) {
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
              myBD.criarItem('gender_search_option', 'male', () => {} );
            } else if (gender === 'male') {
              myBD.criarItem('gender_search_option', 'female', () => {} );
            } else {
              myBD.criarItem('gender_search_option', 'both', ()=>{} );
            }
          }
        });

        //GoogleAnalytics.trackEvent('Instagram Login ', 'Succesfully logged in');
        Actions.mainPage({ idUser: result.id, initialPage: 0, type: ActionConst.RESET });
      } else {
        if(data.length > 2){
          trackEvent('Sign_up', 'Sign_up_instagram_error');
        }
        if (err.error == 500) {
          if (err.errorType == 'Meteor.Error') {
            Actions.login();
          }
        }
      }
    }
  );
}

export class InstagramCustomLoginButton extends Component {
  constructor(props) {
    super(props);
    let screenSize = WIDTH * DPI;
    let small = false;
    if (screenSize <= 480) {
      small = true;
    }
    this.state = {
      small: small,
      token: '',
    }
    this.instagramLogin = this.instagramLogin.bind(this)
  }


  instagramLogin(token){
    console.log('instagramLogin: ', token);
    this.setState({ token: token });
    Meteor.call('findInstagramToken', token, (err, result) => {
      //GoogleAnalytics.trackEvent('Instagram Login ', 'Button Pressed');
      if(!err){
        if(result){
          //GoogleAnalytics.trackEvent('Instagram Login ', 'User already exists');
          loginWithTokens(token, false, false, false, false, false, false);
        }else{
          //GoogleAnalytics.trackEvent('Instagram Login ', 'New user');
          Actions.instagramOnBoarding({ token });
        }
      }else{
        //GoogleAnalytics.trackEvent('Instagram Login ', 'New user');
        Actions.instagramOnBoarding({ token });
      }
    });

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
      <View >
        <TouchableOpacity activeOpacity={0.4} style={[styles.instaloginButton, customButtonSize, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}
          onPress={() => { this.refs.instagramLogin.show(); trackEvent('Login_Instagram_Button', 'click') }}>
          <Icon style={{ backgroundColor: 'transparent' }} name={'instagram'} size={20} color={'#fff'}/>
          <Text style={[{ fontFamily: 'Montserrat-Light', color: 'white', backgroundColor: 'transparent', fontSize: 12, margin:0, marginLeft: 10 }, customFontText]}>
          {I18n.t('app.login.loginPageInstagramButton')}
          </Text>
          <InstagramLogin
            ref='instagramLogin'
            // clientId='fc793d7cbf194b58bcc58fd745b62f58'
            clientId = 'fc793d7cbf194b58bcc58fd745b62f58'
            scopes={['basic']}
            styles={styles}
            onLoginSuccess={this.instagramLogin}
            // onLoginSuccess={(token) => { this.loginWithTokens(token); }}
            redirectUrl='https://app.playfmk.com/signin-instagram'
          />
        </TouchableOpacity>
      </View>
    );
  }
}
