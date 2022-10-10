import React, { Component } from 'react';
import I18n from '../../config/i18n';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  Linking,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Meteor from '@meteorrn/core';
import styles from '../styles/styles';
import GameCard from './game/GameCard';
import NotificationCounter from '../utilities/NotificationCounter';
import RNViewShot from 'react-native-view-shot';
import GameTagIcon from '../font/customIcon';
import Share, { ShareSheet, Button } from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../utilities/Constants';
import Alert from '../utilities/Alert';
import Icon from 'react-native-vector-icons/FontAwesome';
import branch from 'react-native-branch';
import NewMatchManager from '../utilities/NewMatchManagement';
import { trackScreen, trackEvent } from '../utilities/Analytics';

const FBSDK = require('react-native-fbsdk-next');
const { AppEventsLogger, AppInviteDialog } = FBSDK;

const BD = require('../utilities/DAAsyncStorage');
const myBD = new BD();
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const DPI = PixelRatio.get();
const MS_IN_MIN = 1000 * 60;
const MS_IN_H = 1000 * 60 * 60;
const STORE_URL =
  Platform.OS == 'ios'
    ? 'itms-apps://itunes.apple.com/us/app/id791578803?mt=8'
    : 'market://details?id=com.builduplabs.fmk';
const i = 0;

export default class GameView extends Component {
  constructor(props) {
    super(props);
    let screenSize = WIDTH * DPI;
    let small = false;
    if (screenSize <= 480) {
      small = true;
    }

    this.state = {
      isLoading: true,
      array: [],
      count: 20,
      numberShuffle: 0,
      db_age: [],
      db_gender: '',
      db_range: null,
      end: false,
      hasFilters: false,
      first: true,
      fetchingUsers: false,
      onBoarding: false,
      small: small,
      showSharePopup: false,
      plays: 0,
      copyString: '',
      canPlay: true,
      checkedUserStatus: false,
      noCoord: false,
      hasRated: false,
      powerVotes: 0,
      type1: '',
      type2: '',
      type3: '',
      power: false,
    };

    this._startOver = this._startOver.bind(this);

    this.ref_gameViewCombination = React.createRef(null);
  }

  UNSAFE_componentWillMount() {
    myBD.buscarItem('shuffle', (item) => {
      this.setState({ numberShuffle: Number(item) });
    });

    Meteor.call('canPlay', Meteor.user()._id, (err, result) => {});
  }

  getUserStatus() {
    Meteor.call('userStatus', Meteor.user()._id, (err, result) => {
      if (!err) {
        this.setState({ checkedUserStatus: true });
        if (result.onBoarding) {
          AppEventsLogger.logEvent('fb_mobile_complete_registration');
          setTimeout(() => {
            this.onBoarding();
          }, 1000);
        } else if (result.resetAccount) {
          //openRestoreAccount(true);
        }

        myBD.buscarItem('app_version', (version) => {
          if (version) {
            var needsUpdate = result.appVersion == version ? false : true;
            if (needsUpdate) {
              Alert.showAlert('', I18n.t('app.components.GameView.newVersion'));
            }
          }
        });
      }
    });
  }

  componentDidMount() {
    trackScreen('Game_Screen');
    const userId = Meteor.user()._id; //id utilizador
    Meteor.call('firstLogin', userId, (err, firstLogin) => {
      if (firstLogin) {
        Meteor.call('userStatus', userId, (errStatus, resultStatus) => {
          if (!errStatus && resultStatus.onBoarding) {
            this.props.popUp.onBoarding(true);
          }
        });
      }
    });

    setTimeout(() => {
      myBD.buscarItem('trigger_popup', (popup) => {
        if (popup) {
          this.props.popUp.showPickupLinePopUp(true);
          myBD.apagarItem('trigger_popup', () => {});
        } else if (Meteor.user().profile.showPickupline) {
          this.props.popUp.showPickupLinePopUp(true);
        }
      });
      if (
        Meteor.user().profile.created &&
        Meteor.user().profile.fromInstagram
      ) {
        Meteor.call('userRegistered', userId);
        trackEvent('Sign_up', 'Sign_up_instagram');
      } else if (
        Meteor.user().profile.created &&
        Meteor.user().profile.fromFacebook
      ) {
        Meteor.call('userRegistered', userId);
        AppEventsLogger.logEvent('fb_mobile_complete_registration');
        trackEvent('Sign_up', 'Sign_up_Facebook');
      }
    }, 4000);
    // Receives the initSession's result as soon as it becomes available
    // Subscribe to incoming links (both branch & non-branch)
    if (Meteor.user()) {
      // branch.setIdentity(Meteor.user().profile._id);
      AsyncStorage.getItem('referrerShareChallenge', (err, val) => {
        if (val && Meteor.user()) {
          Meteor.call('setShareChallenge', val, Meteor.userId(), (err, res) => {
            if (!err && res && res.referred) {
              var referringName = I18n.t(
                'app.components.GameView.referringName',
              );
              if (
                res &&
                res.referringUser &&
                res.referringUser.profile &&
                res.referringUser.profile.first_name &&
                res.referringUser.profile.first_name != 'null'
              ) {
                referringName = res.referringUser.profile.first_name;
              }
              Alert.showAlert(
                I18n.t('app.components.GameView.freeGiftsAlert0'),
                I18n.t('app.components.GameView.freeGiftsAlert1') +
                  referringName +
                  I18n.t('app.components.GameView.freeGiftsAlert2'),
                'referral',
                null,
                null,
                this,
              );
            } else {
              this.getUserStatus();
            }
          });
        }
      });
      AsyncStorage.getItem('referrer', (err, val) => {
        // grab deep link data and route appropriately.
        if (val && Meteor.user()) {
          Meteor.call('newReferral', val, Meteor.user()._id, (err, res) => {
            if (!err && res && res.referred) {
              var referringName = I18n.t(
                'app.components.GameView.referringName',
              );
              if (
                res &&
                res.referringUser &&
                res.referringUser.profile &&
                res.referringUser.profile.first_name &&
                res.referringUser.profile.first_name != 'null'
              ) {
                referringName = res.referringUser.profile.first_name;
              }
              Alert.showAlert(
                I18n.t('app.components.GameView.freeGiftsAlert0'),
                I18n.t('app.components.GameView.freeGiftsAlert1') +
                  referringName +
                  I18n.t('app.components.GameView.freeGiftsAlert2'),
                'referral',
                null,
                null,
                this,
              );
            } else {
              this.getUserStatus();
            }
          });
        }
      });
      AsyncStorage.getItem('referrerSkip', (err, val) => {
        // grab deep link data and route appropriately.
        // if(val && Meteor.user() && val !== Meteor.user()) {
        if (val && Meteor.user()) {
          Meteor.call('newReferralSkip', val, Meteor.user()._id);
        }
      });

      this.props.emitter.addListener(
        'shareCombination',
        this._shareCombination,
        this,
      );
      this.props.emitter.addListener(
        'shareInviteLink',
        this._shareInviteLink,
        this,
      );
      Meteor.call('skipsLeft', Meteor.user()._id, (err, res) => {
        if (!err) {
          if (res == -1) {
            // trackEvent('Shuffle', 'Unlimited Skips');
          } else if (Meteor.user().profile.gender == 'male') {
            // trackEvent('Shuffle', 'Male user');
          } else {
            // trackEvent('Shuffle', 'Limited Skips');
          }
          this.setState({
            skipsLeft: res,
          });
        }
      });
    }
    this.updatePowerVotes();
  }

  UNSAFE_componentWillReceiveProps(props) {
    // if(!this.state.checkedUserStatus){
    //   this.getUserStatus()
    // }
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
    clearInterval(this.tutorial);
  }

  _shareCombination() {
    this.takeShot();
    trackScreen('ShareCombination');
  }

  async _shareInviteLink() {
    trackEvent('NewGameOver', 'Click_Invite');
    let shareOptions = {
      messageHeader: I18n.t('app.components.GameView.shareInviteLinkHeader'),
      messageBody: I18n.t('app.components.GameView.shareInviteLinkBody'),
    };

    let linkProperties = {
      feature: 'share',
      channel: 'facebook',
      campaign: 'gameOverCountdown',
    };

    let controlParams = {};

    let {
      channel,
      completed,
      error,
    } = await branchUniversalObject.showShareSheet(
      shareOptions,
      linkProperties,
      controlParams,
    );

    if (completed) {
      trackEvent('Referral', channel);
      this.setState({ canPlay: true });
    } else {
      trackEvent('Referral', 'Canceled');
    }
  }

  async takeShot() {
    trackEvent('Share', 'Share_Combination');
    RNViewShot.takeSnapshot(this.ref_gameViewCombination.current, {
      width: 360,
      height: 890,
      format: 'jpeg',
      quality: 0.5,
      result: 'base64',
    }).then((uri) => {
      Meteor.call(
        'saveSharePic',
        Meteor.user()._id,
        uri,
        async (err, result) => {
          let imgUrl =
            'https://fmk-images.ams3.digitaloceanspaces.com/share/' +
            result.name;
          branchUniversalObject = await branch.createBranchUniversalObject(
            'content/12345', // canonical identifier
            {
              title: 'Play F*ck Marry Kill',
              contentImageUrl:
                imgUrl || 'http://www.playfmk.com/images/preview.png',
              contentDescription: I18n.t(
                'app.components.GameView.shareCombinationText',
              ),
              metadata: { user_id: Meteor.user()._id },
            },
          );

          let linkProperties = {
            feature: 'share',
            channel: 'facebook',
            campaign: 'ShareChallenge',
          };
          let controlParams = {};
          let { url } = await branchUniversalObject.generateShortUrl(
            linkProperties,
            controlParams,
          );
          let shareImageBase64 = {
            title: 'F*ck Marry Kill',
            message: I18n.t('app.components.GameView.shareCombinationText'),
            url,
            subject: '',
          };
          // console.log(url);
          Share.open(shareImageBase64).then(() => {
            this.props.emitter.emit('stopSharingCombination');
          });
          this.setState({ image: imgUrl });
        },
      );
    });
  }

  updatePowerVotes() {
    Meteor.call('availablePowerVotes', Meteor.user()._id, (err, result) => {
      if (result && !err) {
        this.setState({
          powerVotes: result.available,
        });
      }
    });

  }

  shuffle() {
    this.props.popUp.activatePopUp(true);
  }

  rateApp() {
    // Makes sure the rateApp won't open again for the same session
    Meteor.call('stop_rate_app', Meteor.user()._id);
    this.setState({ hasRated: true });
    this.props.popUp.showRatePopUp(true);
  }

  notifyReport() {
    trackScreen('Notify_Report_Alert');
    this.state.notifyReport = false;
    if (Meteor.user().profile.blocked == false) {
      Alert.showAlert(
        '',
        I18n.t('app.components.GameView.notifyReportPicture0'),
        'notify_report',
      );
    } else {
      Alert.showAlert(
        '',
        I18n.t('app.components.GameView.notifyReportPicture1'),
        'notify_report',
      );
    }
  }

  onBoarding() {
    this.props.popUp.onBoarding(true);
  }

  voted() {
    myBD.buscarItem('rangeCache', (range) => {
      if (range) {
        if (range != 300000) {
          if (parseInt(range) <= 10000) {
            trackEvent('New Combination', 'feed_close');
          } else if (parseInt(range) > 10000 && parseInt(range) <= 20000) {
            trackEvent('New Combination', 'feed_near');
          } else {
            trackEvent('New Combination', 'feed_far');
          }
        } else {
          trackEvent('New Combination', 'feed_worldwide');
        }
      }
    });
    AppEventsLogger.logEvent('fb_mobile_content_view');
  }

  reset() {
    this.setState({
      isLoading: true,
      array: [],
      count: 20,
      db_age: [],
      db_gender: '',
      db_range: null,
      end: false,
      hasFilters: false,
      fetchingUsers: false,
      first: false,
      type1: '',
      type2: '',
      type3: '',
    });
  }

  _skip(type) {
    var usersSkipped = [];
    for (let i = 0; i < this.state.array.length; i++) {
      usersSkipped.push(this.state.array[i]._id);
    }

    if (type) {
      trackEvent('Power_Vote_Screen', 'Click_' + type + '_all');
      Meteor.call(
        'powerVote',
        Meteor.user()._id,
        usersSkipped,
        type,
        (err, result) => {
          if (!err) {
            if (result) {
              this.setState({ power: true }, () =>
                this.setState({ power: false }),
              );
              trackEvent(
                'Power_Vote_Screen',
                'Successful_power_Vote_given_' + type,
              );
              this.setState(
                {
                  type1: type,
                },
                () => {
                  setTimeout(() => {
                    this.setState(
                      {
                        type2: type,
                      },
                      () => {
                        setTimeout(() => {
                          this.setState(
                            {
                              type3: type,
                            },
                            () => {
                              setTimeout(() => {
                                this.reset();
                                this.props.mainPage.downloadPowerVoteCount();
                                this.updatePowerVotes();
                                // Matches
                                if (result.matches) {
                                  let newMatchManager = new NewMatchManager(
                                    this.props.mainPage,
                                  );
                                  var matchCounter = 0;
                                  result.matches.forEach((match) => {
                                    if (match.id) {
                                      newMatchManager.addUser(
                                        match.userid,
                                        result.type,
                                        match.id,
                                      );
                                      matchCounter++;
                                    }
                                  });
                                  newMatchManager.nextUser();
                                }
                                //setTimeout(()=>{ this.reset(); }, 500);
                              }, 1000);
                            },
                          );
                        }, 500);
                      },
                    );
                  }, 500);
                },
              );
            } else {
              Alert.showAlert(
                '',
                I18n.t('app.components.GameView.ranOutofPowerVotes'),
                'noMorePowerVote',
              );
            }
          }
        },
      );
    } else {
      trackEvent('Shuffle', 'feed');
      Meteor.call(
        'incrementNumberShuffles',
        Meteor.user()._id,
        usersSkipped,
        (err, result) => {
          if (!err) {
            if (result) {
              trackEvent('Shuffle', 'Successful_Skip');
              this.reset();
              Meteor.call(
                'skipsLeft',
                Meteor.user()._id,
                function(err, result) {
                  if (!err) {
                    this.setState({
                      skipsLeft: result,
                    });
                  }
                }.bind(this),
              );
            } else {
              trackEvent('Shuffle', 'Max_number_of_skips reached');
              // Alert.showAlert('', 'You have used all your skips for today, try again tomorrow! \nIn the meantime you can still vote for some of these beautiful people 😍');
              trackEvent('Shuffle', 'frog_prince_open');
              Alert.showAlert(
                '',
                I18n.t('app.components.GameView.skipText'),
                'skip',
              );
            }
          }
        },
      );
    }
  }

  _nav() {
    NotificationCounter.goToPage(0);
  }

  _startOver() {
    trackEvent('Power_Vote_Screen');
    myBD.buscarItem('COORDS', (coords) => {
      if (coords) {
        var bd_coords = coords.split('|');
        if (bd_coords[0] != 0 || bd_coords[1] != 0) {
          this.reset();
          //myBD.criarItem('updateRangeCache', 'true', () => { });
          //myBD.criarItem('rangeCache', '6000000', () => { });
          myBD.criarItem('COORDS', 0 + '|' + 0, () => {});
        } else {
          Meteor.call('startOver', Meteor.user()._id, (err, result) => {
            if (!err) {
              this.reset();
            }
          });
        }
      } else {
        Meteor.call('startOver', Meteor.user()._id, (err, result) => {
          if (!err) {
            this.reset();
          }
        });
      }
    });
  }

  shareLink() {
    var tmp = this;
    AppInviteDialog.canShow({ applinkUrl: 'https://fb.me/1966692026875514' })
      .then(function(canShow) {
        if (canShow) {
          trackEvent('CountDown', 'Invite');
          return AppInviteDialog.show({
            applinkUrl: 'https://fb.me/1966692026875514',
          });
        }
      })
      .then(
        function(result) {
          if (result.data.didComplete) {
            trackEvent('CountDown', 'InviteCompleted');
            Meteor.call(
              'setCanPlay',
              Meteor.user()._id,
              true,
              (err, result) => {
                clearInterval(tmp.countdown);
                tmp.setState({ canPlay: true });
              },
            );
          } else {
            trackEvent('CountDown', 'InviteCanceled');
          }
        },
        function(error) {
          trackEvent('CountDown', 'InviteError', { label: error });
        },
      );
  }

  _startOverRange() {
    this.reset();
    myBD.criarItem('updateRangeCache', 'true', () => {});
    myBD.criarItem('rangeCache', '600000', () => {});
  }

  updateTimer(date) {
    const now = new Date();
    var diff = MS_IN_H - (now - date);
    var min = Math.floor(diff / MS_IN_MIN);
    var sec = Math.floor((diff / MS_IN_MIN - min) * 60);
    if (min <= 0 && sec <= 0) {
      clearInterval(this.countdown);
      this.setState({ canPlay: true });
      trackEvent('CountDown', 'TimePassed');
      return null;
    } else {
      if (sec < 10) {
        sec = '0' + sec;
      }
      var time = min + ':' + sec;
      return time;
    }
  }

  render() {
    let constants = new Constants();
    let customFontText = {};
    let customButtonSize = {};
    if (this.state.small) {
      customFontText.fontSize = 12;
      customButtonSize.width = 230;
      customButtonSize.height = 45;
    }
    if (this.state.isLoading) {
      if (!this.state.fetchingUsers) {
        this.props.emitter.emit('stopPulseShareCombination');
        this.props.emitter.emit('newCombination');
        fetchUsers(this, Meteor.user()._id, this.state.array);
      }
      return (
        <View style={[styles.loadingPage, { backgroundColor: '#fff' }]}>
          <ActivityIndicator
            animating={true}
            color="#859393"
            style={{ transform: [{ scale: 1.8 }] }}
            size="large"
          />
        </View>
      );
    }
    var userVoted = true;
    if (
      Meteor.user().profile.actions &&
      Meteor.user().profile.actions.rate &&
      !Meteor.user().profile.actions.rate.voted
    ) {
      userVoted = false;
    }

    if (
      Meteor.user().profile &&
      Meteor.user().profile.rate_app &&
      !this.state.hasRated &&
      !userVoted &&
      this.state.plays > 30
    ) {
      this.rateApp();
    }
    if (
      Meteor.user().profile.notifyReport &&
      this.state.notifyReport != false
    ) {
      this.notifyReport();
    }
    //if(!this.state.canPlay){
    if (false) {
      trackScreen('CountDown');
      trackEvent('CountDown', 'view');
      return (
        <View
          style={[
            styles.loadingPage,
            {
              backgroundColor: '#fff',
              margin: 30,
              marginRight: 30,
              marginLeft: 30,
              flex: 1,
              flexDirection: 'column',
            },
          ]}
        >
          <Text
            style={{
              color: '#aeb7b7',
              fontSize: 17,
              fontFamily: 'Montserrat-Bold',
              textAlign: 'center',
              marginTop: 30,
            }}
          >
            {I18n.t('app.components.GameView.noMoreUsers')}
          </Text>

          <View
            style={[
              styles.loadingPage,
              {
                backgroundColor: '#fff',
                marginRight: 10,
                marginLeft: 10,
                flex: 1,
                flexDirection: 'column',
              },
            ]}
          >
            <Text
              style={{
                color: '#aeb7b7',
                fontSize: 17,
                fontFamily: 'Montserrat-Regular',
                textAlign: 'center',
              }}
            >
              {I18n.t('app.components.GameView.shareFMK')}
            </Text>
            <TouchableOpacity
              style={[
                styles.loginButton,
                customButtonSize,
                {
                  backgroundColor: '#3b5998',
                  borderRadius: 10,
                  height: 90,
                  marginTop: 15,
                  elevation: 3,
                },
              ]}
              onPress={() => {
                this.props.emitter.emit('shareInviteLink');
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    {
                      fontFamily: 'Montserrat-Regular',
                      color: '#ffffff',
                      backgroundColor: 'transparent',
                      fontSize: 22,
                      textAlign: 'center',
                    },
                    customFontText,
                  ]}
                >
                  {I18n.t('app.components.GameView.inviteFriends')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: '#aeb7b7',
              fontSize: 17,
              fontFamily: 'Montserrat-Light',
              backgroundColor: 'transparent',
              marginRight: 10,
              marginLeft: 10,
              textAlign: 'center',
            }}
          >
            {I18n.t('app.components.GameView.wait')}
          </Text>
          <Text
            style={{
              color: '#aeb7b7',
              fontSize: 17,
              fontFamily: 'Montserrat-Light',
              backgroundColor: 'transparent',
              marginRight: 10,
              marginLeft: 10,
              textAlign: 'center',
            }}
          >
            <Text
              style={{
                color: '#aeb7b7',
                fontSize: 22,
                fontFamily: 'monospaced',
                fontWeight: 'bold',
                backgroundColor: 'transparent',
              }}
            >
              {this.state.time}
            </Text>
            {I18n.t('app.components.GameView.minutes')}
          </Text>
        </View>
      );
    }
    if (this.state.end && this.state.noCoord) {
      trackScreen('Game_Over_Screen');
      return (
        <View
          style={[
            styles.loadingPage,
            { backgroundColor: '#fff', flex: 1, flexDirection: 'column' },
          ]}
        >
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}
            style={{
              alignSelf: 'stretch',
              padding: 15,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 0,
            }}
            colors={[
              constants.colors1[0] + 'CC',
              constants.colors[0] + 'CC',
              constants.colors1[1] + 'CC',
              constants.colors[1] + 'CC',
              constants.colors1[2] + 'CC',
            ]}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Montserrat-Light',
                textAlign: 'center',
              }}
            >
              {I18n.t('app.components.GameView.noMoreUsers')}
            </Text>

            <Text
              style={{
                color: '#fff',
                fontSize: 30,
                fontFamily: 'Montserrat-Bold',
                backgroundColor: 'transparent',
                marginTop: 5,
                textAlign: 'center',
              }}
            >
              {I18n.t('app.components.GameView.want')}
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: 30,
                fontFamily: 'Montserrat-Bold',
                backgroundColor: 'transparent',
                marginTop: 0,
                textAlign: 'center',
              }}
            >
              {I18n.t('app.components.GameView.moreUsers')}
            </Text>

            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Montserrat-Light',
                backgroundColor: 'transparent',
                marginTop: 40,
                textAlign: 'center',
              }}
            >
              {I18n.t('app.components.GameView.rating')}
            </Text>

            <TouchableOpacity
              style={{
                marginTop: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                borderStyle: 'solid',
                borderColor: '#ffffff',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
              onPress={() => {
                trackEvent('Click_PlayAgain', 'Click_InviteFriends');
                Linking.canOpenURL(STORE_URL)
                  .then((supported) => {
                    if (!supported) {
                      console.log("Can't handle url: " + STORE_URL);
                    } else {
                      return Linking.openURL(STORE_URL);
                    }
                  })
                  .catch((err) => console.error('An error occurred', err));
              }}
            >
              <View
                style={{
                  alignSelf: 'stretch',
                  backgroundColor: 'transparent',
                  width: 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  paddingTop: 15,
                  paddingBottom: 15,
                }}
              >
                <Text
                  style={[
                    {
                      fontFamily: 'Montserrat-Bold',
                      color: '#fff',
                      backgroundColor: 'transparent',
                      fontSize: 12,
                      textAlign: 'center',
                    },
                    customFontText,
                  ]}
                >
                  {I18n.t('app.components.GameView.rateUs')}
                </Text>
              </View>
            </TouchableOpacity>

            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Montserrat-Light',
                backgroundColor: 'transparent',
                marginTop: 25,
                textAlign: 'center',
              }}
            >
              {I18n.t('app.components.GameView.spreadTheWord')}
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 10,
                borderWidth: 1,
                backgroundColor: 'transparent',
                borderStyle: 'solid',
                borderColor: '#ffffff',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this._shareInviteLink();
              }}
            >
              <View
                style={{
                  padding: 10,
                  width: 200,
                  flexDirection: 'row',
                  marginTop: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GameTagIcon
                  style={{ marginTop: 0 }}
                  name={'share'}
                  size={25}
                  color={'#fff'}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 12,
                    color: '#fff',
                    fontFamily: 'Montserrat-Bold',
                    textAlign: 'left',
                  }}
                >
                  {I18n.t('app.components.GameView.inviteFriends1')}
                </Text>
              </View>
            </TouchableOpacity>

            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Montserrat-Light',
                textAlign: 'center',
                margin: 5,
                marginTop: 50,
                backgroundColor: 'transparent',
              }}
            >
              {I18n.t('app.components.GameView.playWithSameUsers')}
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: 'transparent',
                borderStyle: 'solid',
                borderColor: '#ffffff',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: 5,
              }}
              onPress={() => {
                trackEvent('Game_Over_Screen', 'Click_PlayAgain');
                this._startOver();
              }}
            >
              <Text
                style={[
                  {
                    textDecorationLine: 'underline',
                    fontFamily: 'Montserrat',
                    color: '#fff',
                    backgroundColor: 'transparent',
                    fontSize: 12,
                    textAlign: 'center',
                  },
                  customFontText,
                ]}
              >
                {I18n.t('app.components.GameView.playAgain0')}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      );
    } else if (this.state.end && !this.state.noCoord) {
      trackScreen('Game_Over_Screen');

      return (
        <View
          style={[
            styles.loadingPage,
            {
              backgroundColor: '#fff',
              marginRight: 4,
              marginLeft: 4,
              flex: 1,
              flexDirection: 'column',
            },
          ]}
        >
          <Text
            style={{
              color: '#aeb7b7',
              fontSize: 17,
              fontFamily: 'Montserrat-Bold',
              textAlign: 'center',
            }}
          >
            {I18n.t('app.components.GameView.noMoreUsers')}
          </Text>
          <TouchableOpacity
            style={[
              styles.loginButton,
              customButtonSize,
              { elevation: 3, height: 90, marginTop: 15, borderRadius: 10 },
            ]}
            onPress={() => {
              this._startOver();
              trackEvent('Click_PlayAgain', 'Click_PlayAgain');
            }}
          >
            <LinearGradient
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 1.0 }}
              style={{
                alignSelf: 'stretch',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}
              colors={[
                constants.colors1[0] + 'CC',
                constants.colors[0] + 'CC',
                constants.colors1[1] + 'CC',
                constants.colors[1] + 'CC',
                constants.colors1[2] + 'CC',
              ]}
            >
              <Text
                style={[
                  {
                    fontFamily: 'Selima',
                    color: '#ffffff',
                    backgroundColor: 'transparent',
                    fontSize: 40,
                    textAlign: 'center',
                    width: 200,
                  },
                  customFontText,
                ]}
              >
                {I18n.t('app.components.GameView.playAgain1')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text
            style={{
              color: '#aeb7b7',
              fontSize: 14,
              fontFamily: 'Montserrat-Light',
              backgroundColor: 'transparent',
              marginTop: 5,
            }}
          >
            {this.state.copyString}
          </Text>
          <TouchableOpacity
            style={[
              styles.loginButton,
              customButtonSize,
              {
                marginBottom: 20,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                marginTop: HEIGHT * 0.15,
              },
            ]}
            onPress={this.props.mainPage.showShare.bind(
              this.props.mainPage,
              true,
            )}
          >
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
              <GameTagIcon
                style={{ marginTop: -3 }}
                name={'share'}
                size={25}
                color={'#F76371'}
              />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 13,
                  color: '#aeb7b7',
                  fontFamily: 'Montserrat-Bold',
                  textAlign: 'left',
                }}
              >
                {I18n.t('app.components.GameView.inviteFriends')}
              </Text>
            </View>
          </TouchableOpacity>

          <Text
            style={{
              color: '#aeb7b7',
              fontSize: 12,
              fontFamily: 'Montserrat-Light',
              textAlign: 'center',
              margin: 10,
              backgroundColor: 'transparent',
            }}
          >
            {I18n.t('app.components.GameView.playersJoining')}
          </Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <GameCard
          powerVote={this.state.power}
          type={this.state.type1}
          emitter={this.props.emitter}
          idCard={this.state.array[0]._id}
          user={this.state.array[0]}
          indexCard={0}
          gameView={this}
          idUser={this.props.idUser}
          share={false}
          style={{ flex: 1 }}
        />
        <GameCard
          powerVote={this.state.power}
          type={this.state.type2}
          emitter={this.props.emitter}
          idCard={this.state.array[1]._id}
          user={this.state.array[1]}
          indexCard={1}
          gameView={this}
          idUser={this.props.idUser}
          share={false}
          style={{ flex: 1 }}
        />
        <GameCard
          powerVote={this.state.power}
          type={this.state.type3}
          emitter={this.props.emitter}
          idCard={this.state.array[2]._id}
          user={this.state.array[2]}
          indexCard={2}
          gameView={this}
          idUser={this.props.idUser}
          share={false}
          style={{ flex: 1 }}
        />

        <TouchableOpacity
          onPress={() => {
            // this._skip.bind(this)
            trackEvent('Game_Screen', 'Click_PowerVote');
            this.props.popUp.downloadPowerVoteCount();
            this.props.popUp.showPowerVotePopUp(true);
          }}
          style={[
            styles.skipButton,
            {
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 5,
            },
          ]}
        >
          {this.state.powerVotes > 0 && (
            <Text style={styles.skipButtonText}>{this.state.powerVotes}</Text>
          )}
          <Text style={styles.skipButtonText}>
            {I18n.t('app.components.GameView.powerVote')}
          </Text>
        </TouchableOpacity>

        <View
          ref={this.ref_gameViewCombination}
          collapsable={false}
          style={{
            position: 'absolute',
            left: -10000,
            height: 890,
            width: 360,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              height: 890,
              width: 360,
            }}
          >
            <View
              style={{
                height: 100,
                width: 360,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0,
                padding: 0,
              }}
            >
              <GameTagIcon
                name="selection"
                color="#fff"
                style={{ fontSize: 40, marginBottom: 10 }}
              />
              <Text
                style={{
                  fontSize: 22,
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Bold',
                  color: '#fff',
                }}
              >
                {I18n.t('app.components.GameView.whoChouse')}
              </Text>
            </View>
            <GameCard
              idCard={this.state.array[0]._id}
              user={this.state.array[0]}
              indexCard={0}
              gameView={this}
              idUser={this.props.idUser}
              share={true}
              style={{ height: 250, width: 360 }}
            />
            <GameCard
              idCard={this.state.array[1]._id}
              user={this.state.array[1]}
              indexCard={1}
              gameView={this}
              idUser={this.props.idUser}
              share={true}
              style={{ height: 250, width: 360 }}
            />
            <GameCard
              idCard={this.state.array[2]._id}
              user={this.state.array[2]}
              indexCard={2}
              gameView={this}
              idUser={this.props.idUser}
              share={true}
              style={{ height: 250, width: 360 }}
            />
            <View
              style={{
                height: 40,
                width: 360,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Light',
                  color: '#fff',
                }}
              >
                {/* {I18n.t('app.components.GameView.goPlayFMK')} */}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

function fetchUsers(component, user_id) {
  trackScreen('GamePage');
  AppEventsLogger.logEvent('fb_mobile_content_view');
  let hotOrNot = false;
  component.setState({
    fetchingUsers: true,
    plays: component.state.plays + 1,
  });
  myBD.criarItem('shuffle', component.state.numberShuffle.toString(), () => {});
  if (component.state.numberShuffle == 10) {
    component.setState({
      numberShuffle: component.state.numberShuffle + 1,
    });
    component.shuffle();
  }
  if (
    component.state.plays == 0 ||
    (component.state.onBoarding && component.state.plays <= 3)
  ) {
    hotOrNot = true;
  }

  myBD.buscarItem('gender_search_option', (gender) => {
    myBD.buscarItem('age3', (age) => {
      myBD.buscarItem('COORDS', (coords) => {
        myBD.buscarItem('rangeCache', (range) => {
          let db_gender = gender;
          if (gender == 'both') {
            db_gender = null;
          }
          if (gender == null) {
            let interestedIn = Meteor.user().profile.interested_in;
            if (interestedIn == 'male' || interestedIn == 'female') {
              db_gender = interestedIn;
            } else {
              db_gender = null;
            }
          }
          let db_age = null;
          if (age) {
            db_age = age.split(',');
          } else {
            db_age = [18, 60];
          }
          let db_coords = null;
          if (coords) {
            db_coords = coords.split('|');
          } else {
            db_coords = [0, 0];
          }
          let db_range = null;
          if (range) {
            db_range = range;
            component.setState({
              db_range: range,
            });
          }
          if (
            (db_age[0] !== '18' || db_age[0] !== 18) &&
            (db_age[1] !== 60 || db_age[1] !== '60') &&
            db_range == null
          ) {
            component.setState({
              hasFilters: true,
            });
          } else {
            component.setState({
              hasFilters: false,
            });
          }
          //this method was getting called twice, this if garantees it runs only once
          if (component.state.db_age.length == 0) {
            component.setState({
              db_age: db_age,
              db_gender: db_gender,
            });
            if (component.state.db_age.length > 0) {
              Meteor.call(
                'fetchUsers',
                user_id,
                hotOrNot,
                db_gender,
                Number(db_age[0]),
                Number(db_age[1]),
                Number(db_coords[0]),
                Number(db_coords[1]),
                Number(db_range),
                (err, result) => {
                  if (result) {
                    if (result == 'end') {
                      console.log('end block')
                      /* if (component.state.first) {
                            component._startOver(); // FIXME: prevenir reset automatico
                            component.setState({ first: false });
                          } else { */
                      // Copy depends on rangeLocation settings
                      myBD.buscarItem('COORDS', (coords) => {
                        console.log(coords, 'coords')
                        let copyString = '';
                        if (coords) {
                          console.log('coords block')
                          var bd_coords = coords.split('|');
                          if (bd_coords[0] != 0 || bd_coords[1] != 0) {
                            copyString = '*With users from all over the world';
                            component.setState({
                              isLoading: false,
                              end: true,
                              voted: true,
                              copyString: copyString,
                              canPlay: true,
                              noCoord: false,
                            });
                          } else {
                            // Meteor.call('canPlay', Meteor.user()._id, (err, result) => {
                            //   let canPlay;
                            //   let date = null;
                            //   if(result.canPlay){
                            //     copyString=  "*Trying different combinations";
                            //   } else {
                            //     date = result.date
                            //     component.countdown = setInterval((date = result.date) => {
                            //       var time = component.updateTimer(date)
                            //
                            //       if(time != null){
                            //         component.setState({time: time})
                            //       }
                            //     }, 1000);
                            //     var time = component.updateTimer(result.date)
                            //   }
                            //   component.setState({ isLoading: false, end: true, voted: true, copyString: copyString, canPlay: result.canPlay, date: date, time: time });
                            // })
                            copyString = I18n.t(
                              'app.components.GameView.differentCombinations',
                            );
                            component.setState({
                              isLoading: false,
                              end: true,
                              voted: true,
                              copyString: copyString,
                              canPlay: true,
                              noCoord: true,
                            });
                          }
                        }
                      });

                      /* } */
                    } else {
                      if (component.state.isLoading) {
                        component.setState({
                          array: result,
                          isLoading: false,
                          end: false,
                          first: false,
                          voted: false,
                        });
                      }
                    }
                  } else {
                    // Copy depends on rangeLocation settings
                    myBD.buscarItem('COORDS', (coords) => {
                      let copyString = '';
                      if (coords) {
                        var bd_coords = coords.split('|');
                        if (bd_coords[0] != 0 || bd_coords[1] != 0) {
                          copyString = I18n.t(
                            'app.components.GameView.usersWorld',
                          );
                        } else {
                          copyString = I18n.t(
                            'app.components.GameView.differentCombinations',
                          );
                        }
                      }
                      component.setState({
                        isLoading: false,
                        db_age: [],
                        end: true,
                        first: false,
                        voted: false,
                        copyString: copyString,
                      });
                    });
                  }
                },
              );
            }
          }
        });
      });
    });
  });
}
