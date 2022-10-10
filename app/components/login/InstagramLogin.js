import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  AsyncStorage,
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import Meteor from '@meteorrn/core';
import styles from '../../styles/styles';
import InstagramLogin from 'react-native-instagram-login';
import CookieManager from '@react-native-cookies/cookies';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image } from 'react-native-animatable';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
export class InstagramLoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
    };
  }

  componentDidMount() {
    Meteor.call('getInstagramToken', Meteor.user()._id, (err, result) => {
      if (!err) {
        this.setState({
          token: result,
        });
        Meteor.call('accessUserInfo', result, (err2, res) => {
          if (res === -1) {
            this.setState({
              token: null,
            });
            this.logout();
          }
        });
      }
    });
  }

  loginSucess(token) {
    this.setState(
      {
        token: token,
      },
      () => {
        Meteor.call('addInstagramToken', Meteor.user()._id, token);
      }
    );
    trackEvent('Login', 'Login_Instagram');
  }

  logout() {
    CookieManager.clearAll().then(res => {
      this.setState({
        token: null,
      });
      Meteor.call('removeInstagramToken', Meteor.user()._id);
    });
  }

  render() {
    if (!this.state.token) {
      if (this.props.confirmPhoto) {
        return (
          <View>
            <TouchableOpacity
              style={{
                height: (Dimensions.get('window').height - 40) / 11,
                width: Dimensions.get('window').width / 7,
                alignItems: 'center',
              }}
              onPress={() => {
                this.refs.instagramLogin.show();
                trackScreen('Instagram_login_screen_from_edit_profile');
              }}
            >
              {/* <Icon
                style={{ backgroundColor: 'transparent' }}
                name={'instagram'}
                size={45}
                color={'#000'}
              /> */}
              <Image
                source={{ uri: 'https://playfmk.com/images/ins.png' }}
                style={{ width: WIDTH * 0.11, height: HEIGHT * 0.06 }}
              />
              <Text
                style={{
                  color: '#aeb7b7',
                  fontSize: WIDTH * 0.025,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                CONNECT
              </Text>
            </TouchableOpacity>
            <InstagramLogin
              ref="instagramLogin"
              clientId="fc793d7cbf194b58bcc58fd745b62f58"
              scopes={['public_content']}
              styles={styles}
              onLoginSuccess={token => {
                this.loginSucess(token);
              }}
              redirectUrl="https://app.playfmk.com/signin-instagram"
            />
          </View>
        );
      } else {
        return (
          <View>
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: 'white' }]}
              onPress={() => {
                trackEvent('Settings_Profile', 'Click_Connect_Instagram');
                this.refs.instagramLogin.show();
              }}
            >
              <Text
                style={{
                  fontFamily: 'Montserrat-Light',
                  color: '#424949',
                  backgroundColor: 'transparent',
                  fontSize: 14,
                }}
              >
                {I18n.t('app.components.login.InstagramLogin.connectInstagram')}
              </Text>
            </TouchableOpacity>
            <InstagramLogin
              ref="instagramLogin"
              clientId="fc793d7cbf194b58bcc58fd745b62f58"
              scopes={['public_content']}
              styles={styles}
              onLoginSuccess={token => {
                this.loginSucess(token);
              }}
              redirectUrl="https://app.playfmk.com/signin-instagram"
            />
          </View>
        );
      }
    } else {
      if (this.props.confirmPhoto) {
        return null;
        {
          /*  <View  >
            <TouchableOpacity style={{ backgroundColor: 'blue' }} onPress={() =>  { this.logout() }}>
              <Text style={{ fontFamily: 'Montserrat-Light', color: '#424949', backgroundColor: 'transparent', fontSize: 14 }}> {I18n.t('app.components.login.InstagramLogin.logoutInstagram')}</Text>
            </TouchableOpacity>
          </View> */
        }
      } else {
        return (
          <View>
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: 'white' }]}
              onPress={() => {
                this.logout();
              }}
            >
              <Text
                style={{
                  fontFamily: 'Montserrat-Light',
                  color: '#424949',
                  backgroundColor: 'transparent',
                  fontSize: 14,
                }}
              >
                {' '}
                {I18n.t('app.components.login.InstagramLogin.logoutInstagram')}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  }
}
