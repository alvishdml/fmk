import React, { Component } from 'react';
import I18n from '../../config/i18n';
import {
  View,
  Image,
  ImageBackground,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import Meteor, { createContainer } from "@meteorrn/core";
import LinearGradient from 'react-native-linear-gradient';
import OneSignal from 'react-native-onesignal';
import NetInfo from "@react-native-community/netinfo";
import { loginWithTokens } from './login/CustomLoginButton';
import styles from '../styles/styles';
import GameTagIcon from '../font/customIcon';
import Constants from '../utilities/Constants';
import {
  setupAnalytics,
} from '../utilities/Analytics';
const BD = require('../utilities/DAAsyncStorage');
const myBD = new BD();

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const DPI = PixelRatio.get();
const MARGIN_BOTTOM = Platform.OS == 'ios' ? 10 : -20;
const CONSTANTS = new Constants();

export default class Loading extends Component {
  constructor(props) {
    super(props);
    var screenSize = WIDTH * DPI;
    var small = false;
    if (screenSize <= 480) {
      small = true;
    }
    this.state = {
      isOffline: false,
      small: small,
    };
  }

  checkConnection() {
    setTimeout(() => {
      NetInfo.fetch().then(state => {
        this.setState({
          isOffline: !state.isConnected
        });

        if (state.isConnected && !Meteor.loggingIn()) {

          console.log("===================== 111111");
          console.log(Meteor.user(), 'userrrrrrrrrrr');
          if (Meteor.user()) {
            // OneSignal.sendTags({
            //   name: Meteor.user().profile.name,
            //   lang: I18n.currentLocale(),
            //   first_name: Meteor.user().profile.first_name,
            //   last_name: Meteor.user().profile.last_name,
            //   picture: Meteor.user().profile.custom_picture ? Meteor.user().profile.custom_picture : Meteor.user().profile.picture,
            //   birthday: Meteor.user().profile.birthday,
            //   gender: Meteor.user().profile.gender,
            //   interested_in: Meteor.user().profile.interested_in,
            //   age: Meteor.user().profile.age,
            //   school_name: Meteor.user().profile.school && Meteor.user().profile.school.name,
            //   school_country: Meteor.user().profile.school && Meteor.user().profile.school.country,
            //   school_students: Meteor.user().profile.school && Meteor.user().profile.school.students,
            //   followers: Meteor.user().profile.followers || -1,
            //   purchased: Meteor.user().profile.purchased,
            // });
            setupAnalytics(Meteor.user()._id);
            myBD.buscarItem('onesignal_id', (onesignal_id) => {
              if (onesignal_id) {
                Meteor.call('registerOneSignalId', Meteor.user()._id, onesignal_id);
              }
            });
            Actions.mainPage({
              idUser: Meteor.user()._id,
              initialPage: 1,
              type: ActionConst.RESET
            });
          } else {

            console.log("===================== 122222");

            loginWithTokens();
          }
        } else {
          setTimeout(() => {
            this.checkConnection();
          }, 500);
        }
      });
    }, 1000);
  }

  componentDidMount() {
    // initAnalytics();
    // first screen being tracked
    // trackScreen('Loading_Screen');
    this.checkConnection();
  }

  renderWarning() {
    if (this.state.isOffline) {
      return (
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: 'Montserrat-Light',
              backgroundColor: 'transparent',
              color: '#e3e6e8',
              textAlign: 'center',
              margin: 15,
            }}
          >
            {I18n.t('app.components.Loading.noInternetConnection')}
          </Text>
          <TouchableOpacity
            style={[styles.loginButton]}
            onPress={() => {
              this.checkConnection();
            }}
          >
            <Text
              style={{
                fontFamily: 'Montserrat-Light',
                color: 'white',
                backgroundColor: 'transparent',
                fontSize: 14,
              }}
            >
              {I18n.t('app.components.Loading.tryAgain')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <ActivityIndicator
          animating={true}
          color={'#aeb7b7'}
          style={{ transform: [{ scale: 1.8 }], marginTop: 50 }}
          size="small"
        />
      );
    }
  }

  render() {
    let customMarginTop = {};

    if (this.state.small) {
      customMarginTop.marginTop = 0;
    }

    return (
      <ImageBackground
      source={require("../../images/Group11.png")}
        style={{
          width: WIDTH,
          height: HEIGHT,
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <LinearGradient
          style={styles.swipePageContainer}
          colors={[
            CONSTANTS.colors1[0] + 'CC',
            CONSTANTS.colors[0] + 'CC',
            CONSTANTS.colors1[1] + 'CC',
            CONSTANTS.colors[1] + 'CC',
            CONSTANTS.colors1[2] + 'CC',
            '#0009',
          ]}
        >
          <StatusBar
            backgroundColor={'transparent'}
            translucent={true}
            barStyle="light-content"
          />
          <View style={styles.swipePageContainer}>
            <View
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 60,
                },
                customMarginTop,
              ]}
            >
              <GameTagIcon
                name="fuck"
                color="#fff"
                style={{ fontSize: 90, marginBottom: MARGIN_BOTTOM }}
              />
              <GameTagIcon name="marry" color="#fff" style={{ fontSize: 90 }} />
              <GameTagIcon name="kill" color="#fff" style={{ fontSize: 90 }} />
              <Text
                style={[
                  styles.swipePageText,
                  { fontFamily: 'Montserrat-Light', margin: 14, fontSize: 10 },
                ]}
              >
                {I18n.t('app.components.Loading.socialExperimentGame')}
              </Text>
              {this.renderWarning()}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }
}
