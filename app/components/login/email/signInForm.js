import React, { Component } from 'react';
import I18n from '../../../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import Meteor, { Accounts } from '@meteorrn/core';
import { loginWithTokens } from '../CustomLoginButton';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { trackScreen, trackEvent } from '../../../utilities/Analytics';
import Constants from '../../../utilities/Constants';
const FBSDK = require('react-native-fbsdk-next');
const { LoginManager, AccessToken } = FBSDK;

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
const buttonSizeHeight = height / 12.5;
const AppInstallSource = NativeModules.AppInstallSource;
const USER_TOKEN_KEY = 'user_token';

const instaLoginStyle = StyleSheet.create({
  isGenderButtonNotPressed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
  },
  isGenderButtonPressed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f77235',
  },
  smallMarginRight: {
    marginRight: 5,
  },
  smallMarginLeft: {
    marginRight: 5,
  },

  startPlayButtonAvailable: {
    height: buttonSizeHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f77235',
    marginBottom: 10,
  },
  signUpButton: {
    height: buttonSizeHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  startPlayButtonUnavailable: {
    height: buttonSizeHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aaa',
    marginBottom: 10,
  },

  closeButton: {
    width: 30,
    height: 30,
    top: 30,
    right: 30,
    position: 'absolute',
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});

export default class EmailSignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // email: "test@playfmk.com",
      // password: "test",
      email: null,
      password: null,
      loggingIn: false,
      userNotFound: false,
      errors: {
        email: false,
        user: false,
        password: false,
      },
      recovering: false,
      isFocused: false,
    };

    this.isValidEmail = this.isValidEmail.bind(this);
    this.signIn = this.signIn.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  componentDidMount() {
    trackScreen('Email_SignIn_Screen');
  }

  isValidEmail() {
    const { email } = this.state;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(
      String(email)
        .toLowerCase()
        .trim(),
    );
  }

  resetPassword() {
    const { email, recovering } = this.state;
    if (!recovering) {
      this.setState({ recovering: true }, () => {
        Accounts.forgotPassword(
          { email: email.toLowerCase().trim() },
          (err) => {
            if (!err) {
              console.log('resetPassword YES!');
              trackEvent('Reset_Password', 'Success');
              this.setState({
                recovering: false,
                recovered: true,
              });
            } else {
              trackEvent('Reset_Password', 'Error');
              this.setState({
                recovering: false,
                recovered: true,
                errorRecovering: true,
              });
            }
          },
        );
      });
    }
  }

  signIn() {
    trackEvent('Email_SignIn', 'Try');
    if (!this.state.loggingIn) {
      this.setState(
        {
          loggingIn: true,
        },
        () => {
          const { email, password } = this.state;
          Meteor.loginWithPassword(
            email.toLowerCase().trim(),
            password,
            (err) => {
              if (err) {
                if (err.reason === 'User not found') {
                  trackEvent('Email_SignIn', 'Error User');
                  this.setState({
                    loggingIn: false,
                    userNotFound: true,
                  });
                } else if (err.reason === 'Incorrect password') {
                  trackEvent('Email_SignIn', 'Error Password');
                  this.setState({
                    loggingIn: false,
                    passwordIncorrect: true,
                  });
                } else if (err.reason === 'User has no password set') {
                  trackEvent('Email_SignIn', 'Error Account FB');
                  this.setState(
                    {
                      loggingIn: false,
                      passwordMissing: true,
                    },
                    () => {
                      LoginManager.logInWithReadPermissions([
                        'public_profile',
                        'email',
                        'user_photos',
                        'user_birthday',
                        'user_gender',
                        'user_age_range',
                      ]).then(async (result) => {
                        if (!result.isCancelled) {
                          const installSource = null //await AppInstallSource.installSource();
                          AccessToken.getCurrentAccessToken().then((res) => {
                            Meteor.call(
                              'login',
                              { facebook: res, origin: installSource },
                              (err, result) => {
                                if (!err) {
                                  AsyncStorage.setItem(
                                    USER_TOKEN_KEY,
                                    result.token,
                                  );
                                  Meteor.getData()._tokenIdSaved = result.token;
                                  Meteor._userIdSaved = result.id;
                                  const emailMatches = Meteor.user().emails.find(
                                    (email) =>
                                      email.address ===
                                      this.state.email.toLowerCase().trim(),
                                  );
                                  if (emailMatches) {
                                    trackEvent(
                                      'Email_SignIn',
                                      'Login Account FB',
                                    );
                                    loginWithTokens();
                                  } else {
                                    trackEvent(
                                      'Email_SignIn',
                                      'Error Login Account FB',
                                    );
                                    this.setState({ errorLoginSocial: true });
                                  }
                                }
                              },
                            );
                          });
                        }
                      });
                    },
                  );
                }
              } else {
                trackEvent('Email_SignIn', 'Success');
                Actions.mainPage({
                  idUser: Meteor.user()._id,
                  initialPage: 1,
                  type: ActionConst.RESET,
                });
              }
            },
          );
        },
      );
    }
  }

  render() {
    const CONSTANTS = new Constants();
    return (
      <LinearGradient style={{ flex: 1 }} colors={['#fafafa', '#ececec']}>
        <TouchableOpacity
          style={instaLoginStyle.closeButton}
          onPress={() => {
            Actions.login();
          }}
        >
          <Icon
            style={{ backgroundColor: 'transparent' }}
            name={'close'}
            size={20}
            color={'#fff'}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginLeft: 50,
            marginRight: 50,
            backgroundColor: 'transparent',
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexGrow: 1,
                justifyContent: 'flex-end',
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <FontAwesomeIcon
                  style={{ backgroundColor: 'transparent' }}
                  name={'envelope'}
                  size={50}
                  color={'#f77235'}
                />
                <Text style={{ color: '#3f3f3f', marginTop: 10 }}>
                  {/* {I18n.t(
                    "app.components.login.InstagramOnBoarding.signInInstagram"
                  )} */}
                  Sign in with Email
                </Text>
              </View>
              <Text
                style={{
                  color: '#5c5c5c',
                  marginTop: 5,
                  fontSize: 12,
                }}
              >
                EMAIL:
              </Text>
              <TextInput
                style={{ height: buttonSizeHeight / 1.4, borderBottomWidth:1}}
                autoComplete="email"
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
              />
              <Text
                style={{
                  color: '#5c5c5c',
                  marginTop: 5,
                  fontSize: 12,
                }}
              >
                PASSWORD:
              </Text>
              <TextInput
                secureTextEntry
                style={{ height: buttonSizeHeight / 1.4, borderBottomWidth:1, borderBottomColor:'#3f3f3f' }}
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
              />
            </View>
            {this.state.passwordIncorrect && (
              <Text
                style={{
                  color: 'red',
                  marginTop: 5,
                  fontSize: 12,
                  textAlign: 'right',
                  alignSelf: 'flex-end',
                }}
              >
                You have entered an invalid username or password
              </Text>
            )}
            {this.state.errorLoginSocial && (
              <Text
                style={{
                  color: 'red',
                  marginTop: 5,
                  fontSize: 12,
                  textAlign: 'right',
                  alignSelf: 'flex-end',
                }}
              >
                You already have a Facebook account connected to this email
                address. Please sign in with Facebook
              </Text>
            )}
            {this.state.passwordIncorrect && !this.state.recovered && (
              <TouchableOpacity
                onPress={this.resetPassword}
                style={instaLoginStyle.signUpButton}
              >
                {this.state.recovering ? (
                  <ActivityIndicator size="small" color="#3f3f3f" />
                ) : (
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#3f3f3f',
                      textDecorationLine: 'underline',
                    }}
                  >
                    I FORGOT MY PASSWORD
                  </Text>
                )}
              </TouchableOpacity>
            )}
            {this.state.recovered && this.state.errorRecovering && (
              <View style={instaLoginStyle.signUpButton}>
                <Text
                  style={{
                    fontWeight: 'normal',
                    color: '#3f3f3f',
                    textAlign: 'center',
                  }}
                >
                  There was a problem recovering your password, please contact
                  us
                </Text>
              </View>
            )}
            {this.state.recovered && !this.state.errorRecovering && (
              <View style={instaLoginStyle.signUpButton}>
                <Text
                  style={{
                    fontWeight: 'normal',
                    color: '#3f3f3f',
                    textAlign: 'center',
                  }}
                >
                  An email was sent for you to recover your password
                </Text>
              </View>
            )}
            <View
              style={{
                flexGrow: 0.5,
                justifyContent: 'flex-end',
              }}
            >
              <TouchableOpacity
                onPress={this.signIn}
                style={
                  this.isValidEmail() && this.state.password
                    ? instaLoginStyle.startPlayButtonAvailable
                    : instaLoginStyle.startPlayButtonUnavailable
                }
                disabled={!this.isValidEmail() || !this.state.password}
              >
                {this.state.loggingIn ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                    SIGN IN
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Actions.emailSignUpForm();
                }}
                style={instaLoginStyle.signUpButton}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#3f3f3f',
                    textDecorationLine: 'underline',
                  }}
                >
                  I DON'T HAVE AN ACCOUNT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Modal
          onDismiss={() => {
            this.setState({ userNotFound: false });
          }}
          offset={0}
          hideCloseButton={false}
          backdropType="blur"
          isVisible={this.state.userNotFound}
          containerStyle={{
            alignItems: 'center',
          }}
          modalStyle={{
            padding: 0,
            width: width / 1.25,
            backgroundColor: '#3f3f3f',
          }}
        >
          <LinearGradient
            style={{
              flexGrow: 1,
              padding: 20,
              borderRadius: 5,
            }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={[
              CONSTANTS.colors1[0],
              CONSTANTS.colors[0],
              CONSTANTS.colors1[1],
              CONSTANTS.colors[1],
              CONSTANTS.colors1[2],
            ]}
          >
            <View
              style={{
                flexGrow: 1,
                justifyContent: 'space-around',
              }}
            >
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: '600',
                  marginBottom: 30,
                }}
              >
                NO USER FOUND
              </Text>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 15,
                  marginBottom: 40,
                  lineHeight: 25,
                }}
              >
                {`We couldn't find any user with email ${this.state.email}. Do you wish to setup your account?`}
              </Text>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    Actions.emailSignUpForm({
                      email: this.state.email,
                      password: this.state.password,
                    });
                  }}
                  style={{
                    justifyContent: 'center',
                    paddingLeft: 30,
                    paddingRight: 30,
                    paddingTop: 10,
                    paddingBottom: 10,
                    marginBottom: 15,
                    backgroundColor: '#fafafa',
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: '#151515',
                    }}
                  >
                    CREATE ACCOUNT
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ userNotFound: false });
                  }}
                  style={{
                    justifyContent: 'center',
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: 'center',
                      color: '#fff',
                    }}
                  >
                    CLOSE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Modal>
      </LinearGradient>
    );
  }
}
