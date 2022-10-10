import React, { Component } from 'react';
import I18n from '../../config/i18n';
import ReactNative, {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  PixelRatio,
  BackAndroid,
} from 'react-native';
import Share from 'react-native-share';
import branch from 'react-native-branch';
import Meteor from '@meteorrn/core';
import styles from '../styles/styles';
import Constants from '../utilities/Constants';
// import GoogleAnalytics from 'react-native-google-analytics-bridge';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GameTagIcon from '../font/customIcon';
import Swiper from 'react-native-swiper';
import NotificationSettings from './SettingsComponents/NotificationSettings';
import UniSettings from './SettingsComponents/UniSettings';
import ChangeGender from './SettingsComponents/ChangeGender';
import ChangeOwnGender from './SettingsComponents/ChangeOwnGender';
import ChangeAge from './SettingsComponents/ChangeAge';
import ChangeLocationRange from './SettingsComponents/ChangeLocationRange';
import SocialSharing from './sharing/SocialSharing';
import Alert from '../utilities/Alert';
import Counter from './SettingsComponents/Counter';
import StatBox from './SettingsComponents/StatBox';
import { InstagramLoginButton } from './login/InstagramLogin';
import ImagePicker from 'react-native-image-picker';
import { trackScreen, trackEvent } from '../utilities/Analytics';

const FBSDK = require('react-native-fbsdk-next');
const { LoginManager } = FBSDK;

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const dpi = PixelRatio.get();

export default class Profile extends Component {
  constructor(props) {
    super(props);
    var screenSize = WIDTH * dpi;
    var small = false;

    if (screenSize <= 480) {
      small = true;
    }

    this.changePicture = this.changePicture.bind(this);
    this.changeAbout = this.changeAbout.bind(this);
    this.editProfilePage = this.editProfilePage.bind(this);
    this.description = I18n.t('app.components.UserProfile.description');
    this.custom_picture_translateY = Meteor.user().profile.custom_picture_translateY;
    var userSchool = null;
    if (
      Meteor.user().profile.school &&
      Meteor.user().profile.school.length === undefined
    ) {
      userSchool = Meteor.user().profile.school;
      // Get user's school rank
      Meteor.call('getUniSingleRank', userSchool.name, (err, result) => {
        if (!err && result && result.rank) {
          this.setState({ schoolRank: result.rank });
        }
      });
    }
    this.state = {
      kills: '-',
      marries: '-',
      fucks: '-',
      renderKill: false,
      isLoading: true,
      count: 3,
      frase: '',
      editavel: false,
      picture: '',
      about: '',
      type: Meteor.user().profile.type,
      isUpdating: false,
      minAgeValue: 18,
      maxAgeValue: 60,
      visible: false,
      small: small,
      hideKill: Platform.OS == 'ios',
      female: Meteor.user().profile.gender == 'female',
      uniraceActive: Meteor.user().profile.unirace,
      userSchool: userSchool,
      schoolRank: null,
      userRank: { fuck: 0, marry: 0, kill: 0 },
      boosted: false,
      boostable: false,
      subscription: false,
      moved: false,
      needsPrompt: false,
      fromInstagram: !Meteor.user().profile.fromInstagram,
      boostedHours: null,
      refresh: false,
      loadingShare: false,
      showChangePassword: false,
    };
    this.activateBoost = this.activateBoost.bind(this);
    this.getHours = this.getHours.bind(this);
    this.refresh = this.refresh.bind(this);
    this.shareUserPic = this.shareUserPic.bind(this);
    this.checkUserChangePasswordButton = this.checkUserChangePasswordButton.bind(
      this,
    );
  }

  checkUserChangePasswordButton() {
    Meteor.call('userRegisteredWithPassword', (err, res) => {
      if (!err) {
        this.setState({ showChangePassword: res });
      }
    });
  }

  refresh() {
    this.setState({ refresh: !this.state.refresh });
  }

  async loadBranch(userPic) {
    branchUniversalObject = await branch.createBranchUniversalObject(
      'content/12345', // canonical identifier
      {
        title: 'Play F*ck Marry Kill',
        contentImageUrl: userPic || 'http://www.playfmk.com/images/preview.png',
        contentDescription: I18n.t(
          'app.components.sharing.SocialSharing.contentDescription',
        ),
        metadata: {
          user_id: Meteor.user()._id,
        },
      },
    );

    let shareOptions = {};

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
    if (userPic) {
      let subject;
      if (Meteor.user() && Meteor.user().profile) {
        subject =
          'FMK status - ' + Meteor.user().profile.first_name ||
          Meteor.user().profile.user_name;
      } else {
        subject = '';
      }
      let shareImageBase64 = {
        title: 'F*ck Marry Kill',
        message: I18n.t(
          'app.components.sharing.SocialSharing.shareImageMessage',
        ),
        url,
        subject: subject,
      };
      Share.open(shareImageBase64).then(() => {
        this.setState({ loadingShare: false });
      });
    } else {
      this.setState({
        shareUrl: url,
        linkProperties,
        controlParams,
        loadingShare: false,
      });
    }
  }

  shareUserPic(userPic) {
    this.setState({ loadingShare: true });
    this.loadBranch(userPic);
  }

  UNSAFE_componentWillMount() {
    /*
    experiencia para tentar fazer o swipe down e up. Este codigo foi apenas um teste para a detecção dos swipes.
    De momento já dá para detectar os gestos mas não chegou a haver tratamento dos dados recebidos porque entrava em conflito com
    os controlos já existentes na pagina. Precisa de alguns retoques

    this._panResponder = PanResponder.create({
    // Ask to be the responder:
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,


    onPanResponderMove: (evt, gestureState) => {
    console.log(gestureState.dy);
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => end(gestureState),
    onPanResponderTerminate: (evt, gestureState) => {
    // Another component has become the responder, so this gesture
    // should be cancelled
    },
    });*/
    // console.log(this.state.fromInstagram);
    if (
      typeof Meteor.user().profile.uniPrompt !== 'undefined' &&
      Meteor.user().profile.uniPrompt !== null
    ) {
      this.setState({
        needsPrompt: Meteor.user().profile.uniPrompt.needsPrompt,
      });
    }

    /* Meteor.call("showHowToPlay", Meteor.user()._id, (err, res) => {
      if(!err){
        this.setState({howToPlay: res})
      }
    })
    */
  }

  componentDidMount() {
    this.checkUserChangePasswordButton();
    // this.loadBranch();
    this.props.mainPage.setProfile(this);
    if (Meteor.user().profile.about) {
      this.setState({ about: Meteor.user().profile.about });
    }

    this.setState({
      boosted: Meteor.user().profile.boosted,
      boostable: Meteor.user().profile.boostable,
      subscription: Meteor.user().profile.subscription,
    });
    this.getHours();
    this.updateStats();
    trackScreen('Profile');
    this.showPopup();
  }

  activateBoost(register = true) {
    if (register) {
      Meteor.call('activateBoost', Meteor.user()._id, (err, res) => {
        if (!err) {
          trackEvent('Boost', 'Boost_activated');
          this.setState({ boostable: false, boosted: true });
        }
      });
    } else {
      trackEvent('Boost', 'Boost_activated');
      this.setState({ boostable: false, boosted: true });
    }
  }

  getHours() {
    if (Meteor.user().profile.boostable) {
      if (Meteor.user().profile.boostable == true) {
        Meteor.call('getUserBoostHours', Meteor.user()._id, (err, result) => {
          if (!err) {
            this.setState({ boostedHours: result });
          }
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Meteor.user()) {
      this.setState({
        uniraceActive: Meteor.user().profile.unirace,
        userSchool: Meteor.user().profile.school,
      });
    }
  }

  editProfilePage() {
    this.setState({ editProfile: true });
  }

  backgroundColor() {
    if (this.state.type == 'fuck') {
      return (
        <View>
          <LinearGradient
            style={{
              width: WIDTH,
              height: HEIGHT,
              flex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            colors={['rgba(247,71,134,0.8)', 'rgba(248,137,86,1.0)']}
          />
        </View>
      );
    } else if (this.state.type == 'marry') {
      return (
        <View>
          <LinearGradient
            style={{
              width: WIDTH,
              height: HEIGHT,
              flex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            colors={['rgba(142,68,173,0.9)', 'rgba(52,73,94,1.0)']}
          />
        </View>
      );
    } else if (this.state.type == 'kill') {
      return (
        <View>
          <LinearGradient
            style={{
              width: WIDTH,
              height: HEIGHT,
              flex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            colors={['rgba(0,203,179,0.8)', 'rgba(0,75,181,1.0)']}
          />
        </View>
      );
    } else {
      return (
        <View>
          <LinearGradient
            style={{
              width: WIDTH,
              height: HEIGHT,
              flex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            colors={['rgba(66,66,73,0.8)', 'rgba(13,13,13,1.0)']}
          />
        </View>
      );
    }
  }

  tagText(fontSizeBigger) {
    let customStatusText = {};
    customStatusText.marginTop = -(WIDTH * 0.01);
    if (this.state.type == 'marry') {
      customStatusText.fontSize = WIDTH * 0.114;
    }
    if (this.state.small) {
      customStatusText.fontSize = 35;
      customStatusText.marginTop = 5;
    }
    if (fontSizeBigger) {
      customStatusText.fontSize = 65;
      customStatusText.marginTop = 0;
    }
    let constants = new Constants();
    if (this.state.type == 'fuck') {
      return (
        <Text style={[styles.statusText, customStatusText]}>
          {constants.profileText(Meteor.user().profile.gender, 'fuck')}
        </Text>
      );
    } else if (this.state.type == 'marry') {
      return (
        <Text style={[styles.statusText, customStatusText]}>
          {constants.profileText(Meteor.user().profile.gender, 'marry')}
        </Text>
      );
    } else if (this.state.type == 'kill') {
      return (
        <Text style={[styles.statusText, customStatusText]}>
          {constants.profileText(Meteor.user().profile.gender, 'kill')}
        </Text>
      );
    } else {
      return (
        <Text style={[styles.statusText, customStatusText]}>
          {constants.profileText(Meteor.user().profile.gender)}
        </Text>
      );
    }
  }

  updateStats() {
    if (!this.state.isUpdating) {
      this.setState({ isUpdating: true });
      Meteor.call('userStats', Meteor.user()._id, true, (err, result) => {
        if (!err) {
          let stats;
          if (result.stats) {
            stats = result.stats;
          } else {
            stats = result;
          }
          let fuckDiff = 0;
          let marryDiff = 0;
          let killDiff = 0;
          if (
            stats.fuck != this.state.fucks ||
            stats.marry != this.state.marries ||
            stats.kill != this.state.kills
          ) {
            if (result.previousStats) {
              fuckDiff = stats.fuck - result.previousStats.fuck;
              marryDiff = stats.marry - result.previousStats.marry;
              killDiff = stats.kill - result.previousStats.kill;
            }
            this.setState({
              fucks: stats.fuck,
              marries: stats.marry,
              kills: stats.kill,
              fuckDiff: fuckDiff,
              marryDiff: marryDiff,
              killDiff: killDiff,
            });

            if (this.refs['counterF'] && fuckDiff > 0) {
              this.refs['counterF'].startAnimation();
            } else if (this.refs['counterF']) {
              this.refs['counterF'].skipAnimation();
            }
            if (this.refs['counterM'] && marryDiff > 0) {
              this.refs['counterM'].startAnimation();
            } else if (this.refs['counterM']) {
              this.refs['counterM'].skipAnimation();
            }
          }
        }
        this.setState({ isUpdating: false });
      });

      Meteor.call(
        'userRank',
        Meteor.user()._id,
        Meteor.user().profile.gender,
        (err, result) => {
          this.setState({ userRank: result });
        },
      );
    }
  }

  statistics() {
    const MAX_DURATION = 10000;
    let customContainerMaster = {},
      statsContainerResponsive = {},
      customContainer = {},
      customIconMaster = {},
      customIcon = {},
      customLegendasNumber = {},
      customRowStat = {};

    if (this.state.small) {
      customContainerMaster.width = 110;
      customContainerMaster.height = 110;
      customContainer.width = 90;
      customContainer.height = 90;
      customIconMaster.fontSize = 30;
      customIcon.fontSize = 25;
      customLegendasNumber.fontSize = 25;
      customRowStat.marginTop = 10;
      customRowStat.marginBottom = 10;
    }
    customContainerMaster.width = WIDTH * 0.35;
    customContainerMaster.height = WIDTH * 0.3;
    statsContainerResponsive.width = WIDTH * 0.3;
    statsContainerResponsive.height = WIDTH * 0.25;

    var showStats = this.state.marries + this.state.fucks >= 80 ? true : false;

    if (this.state.type == 'fuck') {
      return (
        <View>
          <View style={[styles.rowStat, customRowStat]}>
            <StatBox
              type={'fuck'}
              value={this.state.fucks}
              diff={this.state.fuckDiff}
              rank={this.state.userRank.fuck}
              rankDiff={this.state.userRank.fuckDiff}
              style={[styles.statsContainerMaster, customContainerMaster]}
              numberStyle={[styles.legendasNumber, customLegendasNumber]}
              iconStyle={[{ fontSize: 40 }, customIconMaster]}
              ref="counterF"
              mainPage={this}
              userCountry={this.props.mainPage.state.userCountry}
              showStats={showStats}
            />
            <StatBox
              type={'marry'}
              value={this.state.marries}
              diff={this.state.marryDiff}
              rank={this.state.userRank.marry}
              rankDiff={this.state.userRank.marryDiff}
              style={[
                styles.statsContainer,
                customContainer,
                statsContainerResponsive,
              ]}
              numberStyle={[styles.legendasNumber, customLegendasNumber]}
              iconStyle={[{ fontSize: 30 }, customIcon]}
              ref="counterM"
              mainPage={this}
              userCountry={this.props.mainPage.state.userCountry}
              showStats={showStats}
            />
            {!this.state.hideKill && (
              <StatBox
                type={'kill'}
                value={this.state.kills}
                diff={this.state.killDiff}
                rank={this.state.userRank.kill}
                rankDiff={this.state.userRank.killDiff}
                style={[
                  styles.statsContainer,
                  customContainer,
                  statsContainerResponsive,
                ]}
                numberStyle={[styles.legendasNumber, customLegendasNumber]}
                iconStyle={[{ fontSize: 30 }, customIcon]}
                ref="counterK"
                mainPage={this}
                userCountry={this.props.mainPage.state.userCountry}
                showStats={showStats}
              />
            )}
          </View>
          {this.state.female && (
            <View style={{ alignItems: 'center', marginTop: 5 }}>
              <Text
                style={[
                  styles.statsDisclaimer,
                  { width: WIDTH - 60, fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.femalesDisclaimer')}
              </Text>
            </View>
          )}
          {!this.state.female && (
            <View style={{ alignItems: 'center', marginTop: 5 }}>
              <Text
                style={[
                  styles.statsDisclaimer,
                  { width: WIDTH - 60, fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.malesDisclaimer')}
              </Text>
            </View>
          )}
        </View>
      );
    } else if (this.state.type == 'marry') {
      return (
        <View>
          <View style={[styles.rowStat, customRowStat]}>
            <StatBox
              type={'fuck'}
              value={this.state.fucks}
              diff={this.state.fuckDiff}
              rank={this.state.userRank.fuck}
              rankDiff={this.state.userRank.fuckDiff}
              style={[
                styles.statsContainer,
                customContainer,
                statsContainerResponsive,
              ]}
              numberStyle={[styles.legendasNumber, customLegendasNumber]}
              iconStyle={[{ fontSize: 30 }, customIcon]}
              ref="counterF"
              mainPage={this}
              userCountry={this.props.mainPage.state.userCountry}
              showStats={showStats}
            />
            <StatBox
              type={'marry'}
              value={this.state.marries}
              diff={this.state.marryDiff}
              rank={this.state.userRank.marry}
              rankDiff={this.state.userRank.marryDiff}
              style={[styles.statsContainerMaster, customContainerMaster]}
              numberStyle={[styles.legendasNumber, customLegendasNumber]}
              iconStyle={[{ fontSize: 40 }, customIconMaster]}
              ref="counterM"
              mainPage={this}
              userCountry={this.props.mainPage.state.userCountry}
              showStats={showStats}
            />
            {!this.state.hideKill && (
              <StatBox
                type={'kill'}
                value={this.state.kills}
                diff={this.state.killDiff}
                rank={this.state.userRank.kill}
                rankDiff={this.state.userRank.killDiff}
                style={[
                  styles.statsContainer,
                  customContainer,
                  statsContainerResponsive,
                ]}
                numberStyle={[styles.legendasNumber, customLegendasNumber]}
                iconStyle={[{ fontSize: 30 }, customIcon]}
                ref="counterK"
                mainPage={this}
                userCountry={this.props.mainPage.state.userCountry}
                showStats={showStats}
              />
            )}
          </View>
          {this.state.female && (
            <View style={{ alignItems: 'center', marginTop: 5 }}>
              <Text
                style={[
                  styles.statsDisclaimer,
                  { width: WIDTH - 60, fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.femalesDisclaimer')}
              </Text>
            </View>
          )}
          {!this.state.female && (
            <View style={{ alignItems: 'center', marginTop: 5 }}>
              <Text
                style={[
                  styles.statsDisclaimer,
                  { width: WIDTH - 60, fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.malesDisclaimer')}
              </Text>
            </View>
          )}
        </View>
      );
    } else if (this.state.type == 'kill') {
      return (
        <View>
          <View style={[styles.rowStat, customRowStat]}>
            <StatBox
              type={'fuck'}
              value={this.state.fucks}
              diff={this.state.fuckDiff}
              rank={this.state.userRank.fuck}
              rankDiff={this.state.userRank.fuckDiff}
              style={[
                styles.statsContainer,
                customContainer,
                statsContainerResponsive,
              ]}
              numberStyle={[styles.legendasNumber, customLegendasNumber]}
              iconStyle={[{ fontSize: 30 }, customIcon]}
              ref="counterF"
              mainPage={this}
              userCountry={this.props.mainPage.state.userCountry}
              showStats={showStats}
            />
            <StatBox
              type={'marry'}
              value={this.state.marries}
              diff={this.state.marryDiff}
              rank={this.state.userRank.marry}
              rankDiff={this.state.userRank.marryDiff}
              style={[
                styles.statsContainer,
                customContainer,
                statsContainerResponsive,
              ]}
              numberStyle={[styles.legendasNumber, customLegendasNumber]}
              iconStyle={[{ fontSize: 30 }, customIcon]}
              ref="counterM"
              mainPage={this}
              userCountry={this.props.mainPage.state.userCountry}
              showStats={showStats}
            />
            {!this.state.hideKill && (
              <StatBox
                type={'kill'}
                value={this.state.kills}
                diff={this.state.killDiff}
                rank={this.state.userRank.kill}
                rankDiff={this.state.userRank.killDiff}
                style={[styles.statsContainerMaster, customContainerMaster]}
                numberStyle={[styles.legendasNumber, customLegendasNumber]}
                iconStyle={[{ fontSize: 30 }, customIconMaster]}
                ref="counterK"
                mainPage={this}
                userCountry={this.props.mainPage.state.userCountry}
                showStats={showStats}
              />
            )}
          </View>
          {this.state.female && (
            <View style={{ alignItems: 'center', marginTop: 5 }}>
              <Text
                style={[
                  styles.statsDisclaimer,
                  { width: WIDTH - 60, fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.femalesDisclaimer')}
              </Text>
            </View>
          )}
          {!this.state.female && (
            <View style={{ alignItems: 'center', marginTop: 5 }}>
              <Text
                style={[
                  styles.statsDisclaimer,
                  { width: WIDTH - 60, fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.malesDisclaimer')}
              </Text>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View>
          <View style={[styles.rowStat, customRowStat]}>
            <StatBox
              type={'fuck'}
              value={this.state.fucks}
              diff={this.state.fuckDiff}
              rank={this.state.userRank.fuck}
              rankDiff={this.state.userRank.fuckDiff}
              style={[
                styles.statsContainer,
                customContainer,
                statsContainerResponsive,
              ]}
              numberStyle={[styles.legendasNumber, customLegendasNumber]}
              iconStyle={[{ fontSize: 30 }, customIcon]}
              ref="counterF"
              mainPage={this}
              userCountry={this.props.mainPage.state.userCountry}
              showStats={showStats}
            />
            <StatBox
              type={'marry'}
              value={this.state.marries}
              diff={this.state.marryDiff}
              rank={this.state.userRank.marry}
              rankDiff={this.state.userRank.marryDiff}
              style={[
                styles.statsContainer,
                customContainer,
                statsContainerResponsive,
              ]}
              numberStyle={[styles.legendasNumber, customLegendasNumber]}
              iconStyle={[{ fontSize: 30 }, customIcon]}
              ref="counterM"
              mainPage={this}
              userCountry={this.props.mainPage.state.userCountry}
              showStats={showStats}
            />

            {!this.state.hideKill && (
              <StatBox
                type={'kill'}
                value={this.state.kills}
                diff={this.state.killDiff}
                rankDiff={this.state.userRank.killDiff}
                rank={this.state.userRank.kill}
                style={[
                  styles.statsContainer,
                  customContainer,
                  statsContainerResponsive,
                ]}
                numberStyle={[styles.legendasNumber, customLegendasNumber]}
                iconStyle={[{ fontSize: 30 }, customIcon]}
                ref="counterK"
                mainPage={this}
                userCountry={this.props.mainPage.state.userCountry}
                showStats={showStats}
              />
            )}
          </View>
          {this.state.female && (
            <View style={{ alignItems: 'center', marginTop: 5 }}>
              <Text
                style={[
                  styles.statsDisclaimer,
                  { width: WIDTH - 60, fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.femalesDisclaimer')}
              </Text>
            </View>
          )}
          {!this.state.female && (
            <View style={{ alignItems: 'center', marginTop: 5 }}>
              <Text
                style={[
                  styles.statsDisclaimer,
                  { width: WIDTH - 60, fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.malesDisclaimer')}
              </Text>
            </View>
          )}
        </View>
      );
    }
  }

  renderAge() {
    let birthday = Meteor.user().profile.birthday;
    if (!birthday || birthday == 'null') {
      return null;
    } else {
      let age = getAge(birthday);
      return <Text style={{ fontSize: 17, color: '#ffffff' }}>, {age}</Text>;
    }
  }

  removeEmptySpace(str) {
    return str.replace(new RegExp(' ', 'g'), '');
  }

  changeAbout(newBio) {
    this.setState({ about: newBio });
  }

  renderAbout() {
    if (this.state.about) {
      return (
        <View style={{ width: WIDTH }}>
          <Text style={[styles.userAboutText]}>{this.state.about}</Text>
        </View>
      );
    }
    // let textoLet = '';
    // if (this.state.about) {
    //     textoLet = this.state.about
    // }
    // var textoAux = this.removeEmptySpace(textoLet);
    // var placeholder = '';
    // if (this.state.editavel) {
    //     if (textoAux.length == 0) {
    //         placeholder = 'Write something about you';
    //     }
    //     return (
    //         <View style={{ flexDirection: 'row' }}>
    //             <TextInput style={[styles.userAboutTextinput, { width: WIDTH - 70, height: 40 }]}
    //                 ref='aboutTextBox'
    //                 returnKeyType="search"
    //                 autoCapitalize="sentences"
    //                 autoFocus={true}
    //                 maxLength={140}
    //                 multiline={true}
    //                 placeholder={placeholder}
    //                 onChangeText={(text) => {textoLet = text}}
    //                 defaultValue={textoLet} />
    //             <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => {
    //                 let aux = textoLet;
    //                 Meteor.call('changeUserAbout', Meteor.user()._id, textoLet, (err, result) => {
    //                     if (result) {
    //                         this.setState({ about: aux, editavel: false })
    //                     }
    //                 });
    //             } }>
    //                 <Icon style={{ marginRight: 20, backgroundColor: 'transparent' }} name={'check-circle'} size={30} color={'#E5E7E9'} />
    //             </TouchableOpacity>
    //         </View>
    //     );
    // } else if (textoAux.length == 0) {
    //     return (
    //         <View style={{ width: WIDTH }} >
    //             <Text style={[styles.userAboutText]} onPress={() => { this.setState({ editavel: true }) } }>Write something about you!</Text>
    //             <View style={{ position: 'absolute', right: 20, top: 0 }} >
    //                 <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={() => { this.setState({ editavel: true }) } }>
    //                     <View style={{ backgroundColor: 'white', width: 25, height: 25, borderRadius: 14.5, justifyContent: 'center', alignItems: 'center' }} >
    //                         <Icon name={'mode-edit'} size={15} color={'#424249'} />
    //                     </View>
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //     );
    // } else {
    //     return (
    //         <View style={{ width: WIDTH }} >
    //             <Text style={[styles.userAboutText]} onPress={() => { this.setState({ editavel: true }) } }>{this.state.about}</Text>
    //             <View style={{ position: 'absolute', right: 20, top: 0 }} >
    //                 <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={() => { this.setState({ editavel: true }) } }>
    //                     <View style={{ backgroundColor: 'white', width: 25, height: 25, borderRadius: 14.5, justifyContent: 'center', alignItems: 'center' }} >
    //                         <Icon name={'mode-edit'} size={15} color={'#424249'} />
    //                     </View>
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //     );
    // }
  }

  handleScroll(e) {
    if (e.nativeEvent.contentOffset.y <= 0) {
      this.setState({ moved: false });
    } else {
      this.setState({ moved: true });
    }
    if (e.nativeEvent.contentOffset.y > 325) {
      this.props.mainPage.lockSwipeTabs();
    } else {
      this.props.mainPage.unlockSwipeTabs();
    }
  }

  showPopup() {
    if (this.state.needsPrompt) {
      Meteor.call(
        'alertMessages',
        'uniChallengePopUp',
        Meteor.user()._id,
        (error, res) => {
          if (!error) {
            //GoogleAnalytics.trackEvent('unichallenge', 'opensPopup', {label: 'uniChallengePopUp'});
            Alert.showAlert('', res, 'uniChallengePopUp');
          }
        },
      );
    }
  }

  changePicture(url) {
    this.setState({ picture: url });
  }

  facebookAlbumList(picture) {
    trackEvent('Change Photo', 'Open');
    trackScreen('ChangePhoto');
    Actions.confirmPhoto({
      urlPhoto: picture,
      profile: this,
      about: this.state.about,
      new_photo: false,
    });
  }

  renderProfilePage(about, school, picture, mainPage) {
    let customLegenda = {},
      customRowStat = {};
    if (this.state.small) {
      customLegenda.fontSize = 12;
      customLegenda.marginTop = 5;
      customLegenda.marginBottom = 0;
    }

    // Calculate badge image and spacing
    let badgeUrl;
    let badgeHeight;
    let badgeWidth;
    let marginText;

    if (this.state.schoolRank != -1 && this.state.schoolRank != null) {
      badgeUrl =
        'https://app.playfmk.com/images/uni' +
        Math.min(this.state.schoolRank, 4) +
        '.png';
      if (this.state.schoolRank == 1) {
        badgeHeight = 30;
        badgeWidth = 20;
        marginText = 0;
      } else if (this.state.schoolRank == 2) {
        badgeHeight = 30;
        badgeWidth = 24;
        marginText = 4;
      } else if (this.state.schoolRank == 3) {
        badgeHeight = 24;
        badgeWidth = 24;
        marginText = 3;
      } else {
        badgeHeight = 24;
        badgeWidth = 24;
        marginText = 4;
      }
    }

    var schoolName = null;
    if (school) {
      schoolName = school.name;
    }

    return (
      <View style={[styles.userProfileAndroid]}>
        {this.state.boosted && (
          <View
            style={{
              position: 'absolute',
              right: WIDTH * (1 / 10),
              width: WIDTH * (1 / 4),
              top: 15,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}
          >
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 20,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: 0,
                zIndex: 2,
              }}
            >
              <Icon
                style={{ backgroundColor: 'transparent' }}
                name={'done'}
                size={30}
                color={'#1270B7'}
              />
            </View>
            <LinearGradient
              style={{
                borderRadius: 35,
                width: 73,
                height: 73,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              colors={['#3FCABF', '#075AB5']}
            >
              <Image
                resizeMode={'contain'}
                source={{
                  uri:
                    'data:image/png;base64,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',
                }}
                style={{ height: 50, width: 50, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  fontFamily: 'Montserrat-Light',
                  color: '#fff',
                  fontSize: 8,
                  textAlign: 'center',
                  fontWeight: '100',
                }}
              >
                Boosted
              </Text>
            </LinearGradient>
          </View>
        )}
        {!this.state.boosted && this.state.boostable && (
          <TouchableOpacity
            onPress={() => {
              this.props.popUp.activateBoostPopup(
                true,
                this.state.boostedHours,
              );
            }}
            style={{
              position: 'absolute',
              right: WIDTH * (1 / 10),
              width: WIDTH * (1 / 4),
              top: 15,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}
          >
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 20,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: 0,
                zIndex: 2,
              }}
            >
              <Text style={{ fontSize: 13, color: 'black' }}>
                {this.state.boostedHours}h
              </Text>
            </View>
            <LinearGradient
              style={{
                borderRadius: 35,
                width: 73,
                height: 73,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              colors={['#3FCABF', '#075AB5']}
            >
              <Image
                resizeMode={'contain'}
                source={{
                  uri:
                    'data:image/png;base64,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',
                }}
                style={{ height: 50, width: 50, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  fontFamily: 'Montserrat-Light',
                  color: '#fff',
                  fontSize: 8,
                  textAlign: 'center',
                  fontWeight: '100',
                }}
              >
                Boost
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {/* this.state.howToPlay && <TouchableOpacity style={{ position: 'absolute',  left: WIDTH * (1 / 5) - 10, top: 35, alignItems: 'center', justifyContent: 'center' }}
          onPress={()=>{
            GoogleAnalytics.trackEvent('User Profile', 'How to play');
            if(this.props.mainPage){
              this.props.mainPage.onBoarding(true)
            }
            }}>
          <Icon name={'help'} size={15} color={'#ffffff'} style={{width:15, height:15}}/>
          <Text style={{ textDecorationLine:"underline", fontFamily: 'Montserrat-Light', width:60, color: '#fff', fontSize: 11, textAlign: 'center', marginTop: 3 }}>
          {I18n.t('app.components.UserProfile.howtoplay')}
          </Text>
          </TouchableOpacity> */}
        <TouchableOpacity onPress={this.facebookAlbumList.bind(this, picture)}>
          <Image
            style={[styles.userPhoto, { borderRadius: 43 }]}
            source={{ uri: picture }}
          />
          <View
            style={{
              backgroundColor: 'white',
              width: 25,
              height: 25,
              borderRadius: 14.5,
              marginTop: -25,
              marginLeft: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name={'mode-edit'} size={15} color={'#424249'} />
          </View>
        </TouchableOpacity>
        <Text
          style={[styles.legendas, { marginTop: WIDTH * 0.01 }]}
          onPress={this.facebookAlbumList.bind(this, picture)}
        >
          {Meteor.user().profile.first_name || Meteor.user().profile.user_name}
          {this.renderAge()}
        </Text>
        <View style={{ width: WIDTH, marginTop: -(HEIGHT * 0.01) }}>
          <Text
            key={about}
            style={[styles.userAboutText]}
            onPress={this.facebookAlbumList.bind(this, picture)}
          >
            {about}
          </Text>
        </View>
        {this.state.uniraceActive && schoolName != null && (
          <TouchableOpacity
            style={{
              width: WIDTH - 40,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              Actions.uniRace();
              trackEvent('UniRace', 'Open Page', {
                label: 'Already selected',
              });
            }}
          >
            <Text
              key={school}
              style={{
                textDecorationLine: 'underline',
                textAlign: 'center',
                margin: 0,
                marginTop: 10,
                color: '#ffffff',
                fontSize: 15,
                maxWidth: WIDTH - 70,
              }}
            >
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 11 }}>
                {schoolName}
              </Text>
            </Text>
            <View
              style={{
                marginTop: 10,
                marginLeft: 5,
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Montserrat-light',
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: 10,
                  marginLeft: marginText,
                  marginBottom: 5,
                }}
              >
                {this.state.schoolRank}
              </Text>
              <Image
                source={{ uri: badgeUrl }}
                style={{
                  position: 'absolute',
                  left: 5,
                  top: 1,
                  height: badgeHeight,
                  width: badgeWidth,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </TouchableOpacity>
        )}
        {!this.state.uniraceActive && (
          <TouchableOpacity
            style={{
              width: WIDTH,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              Actions.uniRace({ mainPage: this.props.mainPage });
              trackEvent('Profile', 'Click_Join_University');
            }}
          >
            <Text
              key={school}
              style={{
                textDecorationLine: 'underline',
                textAlign: 'center',
                marginTop: 10,
                color: '#ffffff',
                fontSize: 11,
                fontFamily: 'Montserrat-Light',
              }}
            >
              {I18n.t('app.components.UserProfile.joinUniversityChallenge')}
            </Text>
            <View
              style={{
                marginTop: 10,
                marginLeft: 5,
                backgroundColor: '#424249',
                width: 20,
                height: 20,
                borderRadius: 14.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={{
                  uri:
                    'data:image/png;base64,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',
                }}
                style={{ height: 20, width: 20, resizeMode: 'contain' }}
              />
            </View>
          </TouchableOpacity>
        )}
        {this.statistics()}
        <View style={{ alignItems: 'center', marginTop: -(WIDTH * 0.04) }}>
          <Text
            style={{
              fontSize: WIDTH * 0.05,
              color: '#E5E7E9',
              fontFamily: 'Montserrat-Light',
              marginTop: 20,
              width: this.state.type == 'marry' ? WIDTH * 0.95 : WIDTH * 0.8,
              textAlign: 'center',
            }}
          >
            {I18n.t('app.components.UserProfile.areYou')}
          </Text>
          <Text
            style={{
              fontSize: 38,
              color: '#E5E7E9',
              marginTop: 0,
              fontFamily: 'Selima',
            }}
          >
            {this.tagText()}
          </Text>
          <Text
            style={{
              marginBottom: WIDTH * 0.045,
              fontSize: WIDTH * 0.05,
              color: '#E5E7E9',
              fontFamily: 'Montserrat-Light',
              width: this.state.type == 'marry' ? WIDTH * 0.95 : WIDTH * 0.8,
              textAlign: 'center',
            }}
          >
            {I18n.t('app.components.UserProfile.amongstFriends')}
          </Text>
          <SocialSharing
            shareChallenge={true}
            shareUrl={this.state.shareUrl}
            picture={picture}
            fuck={this.state.fucks}
            marry={this.state.marries}
            kill={this.state.kills}
            type={this.state.type}
            renderKill={this.state.renderKill}
            hideKill={this.state.hideKill}
            shareUserPic={this.shareUserPic}
            loadingShare={this.state.loadingShare}
          />
        </View>
        {this.renderArrowDown()}
      </View>
    );
  }

  renderArrowDown() {
    if (!this.state.moved) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'center',
            marginBottom: 25,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS == 'android') {
                this.refs['scroll'].scrollTo({
                  y: HEIGHT - 40,
                  animated: true,
                });
                trackScreen('Settings');
              } else {
                this.refs['swiper'].scrollBy(1);
                trackScreen('Settings');
              }
            }}
          >
            <Icon name={'keyboard-arrow-down'} size={40} color={'#e3e6e8'} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return <View style={{ height: 40 }} />;
    }
  }

  renderSettingsPage(picture, mainPage) {
    return (
      <View style={styles.userProfileAndroid2}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginLeft: 25,
            marginRight: 25,
          }}
        >
          <View style={{ flexDirection: 'column', marginTop: 10 }}>
            <View
              style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}
            >
              <Text
                style={[
                  styles.subtituloSettings,
                  { fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.myGender')}
              </Text>
            </View>
            <ChangeOwnGender mainPage={mainPage} />
          </View>
          <View style={{ flexDirection: 'column', marginTop: 10 }}>
            <View
              style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}
            >
              <Text
                style={[
                  styles.subtituloSettings,
                  { fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.genderSearch')}
              </Text>
            </View>
            <ChangeGender mainPage={mainPage} />
          </View>
          <View style={{ flexDirection: 'column', marginTop: 10 }}>
            <View
              style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}
            >
              <Text
                style={[
                  styles.subtituloSettings,
                  { fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.filters')}
              </Text>
            </View>
            <ChangeLocationRange mainPage={mainPage} />
            <ChangeAge mainPage={mainPage} />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View
              style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}
            >
              <Text
                style={[
                  styles.subtituloSettings,
                  { fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.school')}
              </Text>
            </View>
            <UniSettings container={this} />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View
              style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}
            >
              <Text
                style={[
                  styles.subtituloSettings,
                  { fontFamily: 'Montserrat-Light' },
                ]}
              >
                {I18n.t('app.components.UserProfile.notifications')}
              </Text>
            </View>
            <NotificationSettings mainPage={mainPage} />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}
          >
            {this.state.fromInstagram && <InstagramLoginButton />}
            <TouchableOpacity
              style={[
                styles.inviteButton,
                {
                  backgroundColor: 'white',
                  marginTop: 10,
                  flexDirection: 'column',
                  alignContent: 'center'
                },
              ]}
              onPress={this.props.mainPage.showShare.bind(
                this.props.mainPage,
                true,
              )}
            >
              <Text
                style={{
                  fontFamily: 'Montserrat-Light',
                  color: '#424949',
                  backgroundColor: 'transparent',
                  fontSize: 14,
                }}
              >
                {I18n.t('app.components.UserProfile.inviteFriends')}
              </Text>
              <Text
                style={{
                  fontFamily: 'Montserrat-Light',
                  color: '#424949',
                  backgroundColor: 'transparent',
                  fontSize: 8.5,
                  marginTop: -18,
                }}
              >
                {I18n.t('app.components.UserProfile.getFreeMatches')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: 'white', marginTop: 10 },
              ]}
              onPress={() => {
                trackEvent('Settings_Profile', 'Click_Send_Us_Feedback');
                Actions.feedback();
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
                {I18n.t('app.components.UserProfile.sendUsFeedBack')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: 'white', marginTop: 10 },
              ]}
              onPress={() => {
                trackEvent('Settings_Profile', 'Click_How_To_Play');
                this.props.mainPage.onBoarding(true);
              }}
            >
              <Image
                style={{
                  width: 25,
                  height: 25,
                  marginLeft: -20,
                  marginRight: 5,
                }}
                source={require('../../images/question.png')}
              />
              <Text
                style={{
                  fontFamily: 'Montserrat-Light',
                  color: '#424949',
                  backgroundColor: 'transparent',
                  fontSize: 14,
                }}
              >
                {I18n.t('app.components.UserProfile.howtoplay')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: 'white', marginTop: 10 },
              ]}
              onPress={() => {
                trackEvent('Settings_Profile', 'Click_Change_Lang');
                this.props.popUp.activateLanguagePicker(true);
              }}
            >
              <Image
                style={{
                  width: 37,
                  height: 31,
                  marginLeft: -25,
                  marginRight: 9,
                }}
                source={require('../../images/flags_color.png')}
              />
              <Text
                style={{
                  fontFamily: 'Montserrat-Light',
                  color: '#424949',
                  backgroundColor: 'transparent',
                  fontSize: 12,
                }}
              >
                {I18n.t('app.components.UserProfile.changeLanguage')}
              </Text>
            </TouchableOpacity>
            {this.state.showChangePassword && (
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: 'white', marginTop: 10 },
                ]}
                onPress={() => {
                  trackEvent('Settings_Profile', 'Change Password');
                  this.props.popUp.activatePasswordChange(true);
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Montserrat-Light',
                    color: '#424949',
                    backgroundColor: 'transparent',
                    fontSize: 12,
                  }}
                >
                  {I18n.t('app.components.UserProfile.changePassword')}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor: '#BDBDBD',
                  borderColor: '#BDBDBD',
                  marginTop: 30,
                },
              ]}
              onPress={() => {
                Alert.showAlert(
                  '',
                  'Are you sure you want to logout?\nIf you do, you will not appear for the other players.',
                  'logout'
                );
                trackEvent('Settings_Profile', 'Click_Logout');
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
                {I18n.t('app.components.UserProfile.logout')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  width: 280,
                  height: 50,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  marginTop: 0,
                },
              ]}
              onPress={() => {
                Alert.showAlert(
                  '',
                  "Are you sure you want to delete your account?\nYou can always logout so your profile won't appear in the game.",
                  'remove',
                );
                trackEvent('Settings_Profile', 'Click_Remove_Account');
              }}
            >
              <Text
                style={{
                  fontFamily: 'Montserrat-Light',
                  color: 'white',
                  backgroundColor: 'transparent',
                  fontSize: 12,
                }}
              >
                {I18n.t('app.components.UserProfile.removeAccount')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  width: 280,
                  height: 50,
                  marginBottom: 50,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  marginTop: 0,
                },
              ]}
              onPress={() => {
                Actions.customWebView({
                  address: 'http://playfmk.com/terms.html',
                });
                trackEvent('Settings_Profile', 'Click_TermsConditions');
              }}
            >
              <Text
                style={{
                  fontFamily: 'Montserrat-Light',
                  color: 'white',
                  backgroundColor: 'transparent',
                  fontSize: 12,
                }}
              >
                {I18n.t('app.components.UserProfile.termsConditions')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  scrollViewOS(about, school, picture, mainPage) {
    if (Platform.OS == 'android') {
      return (
        <ScrollView
          ref="scroll"
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          onScroll={(e) => {
            this.handleScroll(e);
          }}
        >
          {this.renderProfilePage(about, school, picture, mainPage)}
          {this.renderSettingsPage(picture, mainPage)}
        </ScrollView>
      );
    } else {
      return (
        <Swiper
          ref="swiper"
          height={HEIGHT - 60}
          horizontal={false}
          loop={false}
          bounce={true}
          dot={
            <View
              style={{
                backgroundColor: 'transparent',
                width: 13,
                height: 13,
                borderRadius: 7,
                marginLeft: 7,
                marginRight: 7,
              }}
            />
          }
          activeDot={
            <View
              style={{
                backgroundColor: 'transparent',
                width: 13,
                height: 13,
                borderRadius: 7,
                marginLeft: 7,
                marginRight: 7,
              }}
            />
          }
        >
          {this.renderProfilePage(about, school, picture, mainPage)}
          {this.renderSettingsPage(picture, mainPage)}
        </Swiper>
      );
    }
  }

  render() {
    if (Meteor.user()) {
      let picture = Meteor.user().profile.picture;
      let about = Meteor.user().profile.about;
      if (this.state.picture) {
        picture = this.state.picture;
      } else if (Meteor.user().profile.custom_picture) {
        picture = Meteor.user().profile.custom_picture;
      }

      if (this.state.newBio) {
        about = this.state.newBio;
      } else if (about == '') {
        about = I18n.t('app.components.UserProfile.about');
      }
      // commented code is part of the experiment for swipe
      // {...this._panResponder.panHandlers}
      return (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View>
            <Image
              style={{
                width: WIDTH,
                height: HEIGHT,
                flex: 1,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              source={{ uri: picture }}
            />
          </View>
          {this.backgroundColor()}

          <View style={{ flex: 1 }}>
            {this.scrollViewOS(
              about,
              this.state.userSchool,
              picture,
              this.props.mainPage,
            )}
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

function getAge(dateString) {
  let today = new Date();
  let birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
