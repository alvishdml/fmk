import React, { Component } from 'react';
import I18n from '../config/i18n';
import { View, StatusBar, Platform, AppState , Text, } from 'react-native';
import styles from './styles/styles';
import PreviewLayer from './components/game/PreviewLayer';
import GameView from './components/GameView';
import Location from './utilities/Location';
import NewMatchPage from './components/newMatch/NewMatch';
import UserProfile from './components/UserProfile';
import MatchesPage from './components/MatchesPage';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import MenuTab from './MenuTab';
import InvitePopUp from './components/game/InvitePopUp';
import ChangeLanguagePicker from './components/SettingsComponents/ChangeLanguagePicker';
import ChangePassword from './components/SettingsComponents/ChangePassword';
import ActivateBoost from './components/monetization/ActivateBoost';
import PickupLinePopUp from './components/game/PickupLinePopUp';
import WhoVotedFreePopUp from './components/game/WhoVotedFreePopUp';
import FreeBoostWomanFreePopUp from './components/game/FreeBoostWoman';
import WinkFreePopUp from './components/game/WinkFreePopUp';
import SendWinkModal from './components/monetization/SendWinkModal';
import VipModal from './components/monetization/VipModal';
import PowerVoteModal from './components/monetization/PowerVoteModal';
import InviteFriendModal from './components/monetization/InviteFriendModal';
import BoostModal from './components/monetization/BoostModal';
import WhoVotedModal from './components/monetization/WhoVotedModal';
import AdModal from './components/matchesPage/AdModal';
import LeloAdModal from './components/matchesPage/LeloAdModal';
import StreakPopUp from './components/game/StreakPopUp';
import PrizePopUp from './components/game/PrizePopUp';
import RatePopUp from './components/game/RatePopUp';
import PowerVotePopUp from './components/game/PowerVotePopUp';
import OnBoarding from './components/game/OnBoarding';
import ShareApp from './components/sharing/ShareApp';
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
import Meteor from '@meteorrn/core';
import Alert from './utilities/Alert';
import { Actions, ActionConst } from 'react-native-router-flux';
import MonetizationSlideshowTab from './components/monetization/MonetizationSlideshowTab';
import MonetizationMainMenu from './components/monetization/MonetizationMainMenu';
import { trackScreen, trackEvent } from './utilities/Analytics';
const FBSDK = require('react-native-fbsdk-next');
const { AppEventsLogger } = FBSDK;

const BD = require('./utilities/DAAsyncStorage');
const myBD = new BD();
var firstLogin;

export default class MainPage extends Component {
  constructor(props) {
    super(props);

    if (Meteor.user()) {
      var pos = Meteor.user().profile.pos.coordinates;
      if (pos[0] != 0 && pos[1] != 0) {
        // this.getUserCountryCode(pos[0]+'|'+pos[1])
      } else {
        this.getUserLocationFromApi();
      }
    }

    this.state = {
      estadoModel: false,
      imagemPreview: '',
      id: '',
      lock: false,
      pulse: false,
      page: 'feed',
      sharedCombination: false,
      editProfile: this.props.editProfile ? true : false,
      userCountry: null,
      triggerOffer: props.triggerOffer || null,
      profileTab: false,
      languageChanged: false,
      firstLogin: false,
    };

    if (props.triggerOffer) {
      setTimeout(() => {
        this.ref_nav.current.goToPage(3);
        
        if (props.triggerOffer === 'winks') {
          this.showWinkModal(true);
        } else if (this.props.triggerOffer === 'profiles') {
          this.showWhoVotedModal(true);
        }
      }, 500);
    }

    this.triggerOffer = this.triggerOffer.bind(this);
    this.languageChanged = this.languageChanged.bind(this);
    this.showAdModal = this.showAdModal.bind(this);
    /*     this.showLeloAdModal = this.showLeloAdModal.bind(this); */
    this.showWinkModal = this.showWinkModal.bind(this);
    this.showInviteFriendModal = this.showInviteFriendModal.bind(this);
    this.showPowerVoteModal = this.showPowerVoteModal.bind(this);
    this.showWhoVotedModal = this.showWhoVotedModal.bind(this);
    this.activateUserBoost = this.activateUserBoost.bind(this);
    this.checkRedirect = this.checkRedirect.bind(this);

    this.ref_nav = React.createRef(null);
    this.ref_ActivateBoost = React.createRef(null);
    this.ref_ChangeLanguagePicker = React.createRef(null);
    this.ref_ChangePassword = React.createRef(null);
    this.ref_invitePopUp = React.createRef(null);
    this.ref_pickupLinePopUp = React.createRef(null);
    this.ref_streakPopUp = React.createRef(null);
    this.ref_WhoVotedFree = React.createRef(null);
    this.ref_FreeBoostWomanFree = React.createRef(null);
    this.ref_WinkFree = React.createRef(null);
    this.ref_SendWinkModal = React.createRef(null);
    this.ref_VipModal = React.createRef(null);
    this.ref_PowerVoteModal = React.createRef(null);
    this.ref_InviteFriendModal = React.createRef(null);
    this.ref_BoostModal = React.createRef(null);
    this.ref_WhoVotedModal = React.createRef(null);
    this.ref_AdModal = React.createRef(null);
    this.ref_LeloAdModal = React.createRef(null);
    this.ref_OnBoarding = React.createRef(null);
    this.ref_shareApp = React.createRef(null);
    this.ref_ratePopUp = React.createRef(null);
    this.ref_powerVotePopUp = React.createRef(null);
    this.ref_gameView = React.createRef(null);
    this.ref_previewLayer = React.createRef(null);
    this.ref_newMatchPage = React.createRef(null);
    this.ref_monetizationSlideshowTab = React.createRef(null);
    this.ref_userProfile = React.createRef(null);
    this.ref_prizePopUp = React.createRef(null);
  }

  UNSAFE_componentWillMount() {
    if (this.state.editProfile) {
      this.setState({ profileTab: true });
    } else {
      this.setState({ profileTab: false });
    }
    

    console.log('userId() = ', Meteor.userId())
    console.log('user() = ', Meteor.user())

    const userLang = Meteor.user().profile && Meteor.user().profile?.lang;
    if (userLang && userLang != I18n.currentLocale()) {
      I18n.locale = userLang;
    }
    //  AppState.addEventListener('change', this._handleAppStateChange);
    this.emitter = new EventEmitter();
    this.emitter.addListener('vote', this._removePulse, this);
    this.pulseAnim = setInterval(() => {
      if (
        !this.state.pulse &&
        this.state.page == 'feed' &&
        !this.state.sharedCombination
      ) {
        this.emitter.emit('pulseShareCombination');
        this.setState({ pulse: true });
      }
    }, 5000);

    Location.getCurrentLocationSilent();
  }
  languageChanged(value) {
    this.setState({ languageChanged: value });
  }
  checkRedirect() {
    myBD.buscarItem('trigger_tab', (tab) => {
      if (tab) {
        switch (tab) {
          case 'inappPurchases':
            this.ref_nav.current.goToPage(3);
            myBD.buscarItem('trigger_offer', (offer) => {
              if (offer) {
                switch (offer) {
                  case 'winks':
                    this.showWinkModal(true);
                    trackEvent('Deep_link', 'Inapp Winks');
                    break;
                  case 'profiles':
                    this.showWhoVotedModal(true);
                    trackEvent('Deep_link', 'Inapp Profiles');
                    break;
                  case 'boost':
                    this.showBoostModal(true);
                    trackEvent('Deep_link', 'Inapp Boost');
                    break;
                  case 'vip':
                    this.showVipModal(true);
                    trackEvent('Deep_link', 'Inapp VIP');
                    break;
                  case 'powervotes':
                    this.showPowerVoteModal(true);
                    trackEvent('Deep_link', 'Inapp Power Votes');
                    break;
                  case 'invite':
                    this.showInviteFriendModal(true);
                    trackEvent('Deep_link', 'Inapp Invite');
                    break;
                  default:
                    break;
                }
                myBD.apagarItem('trigger_offer');
              }
            });
            break;
          case 'chat':
            this.ref_nav.current.goToPage(2);
            break;
          case 'profile':
            this.ref_nav.current.goToPage(0);
            break;
          default:
            break;
        }
        myBD.apagarItem('trigger_tab');
      }
    });
  }
  componentDidMount() {

    setTimeout(() => {
      this.checkRedirect();
      if (Meteor.user().profile.gender === 'female') {
        var todayDate = new Date();
        if (
          todayDate.getFullYear() === 2019 &&
          (todayDate.getMonth() + 1 === 5 || todayDate.getMonth() + 1 === 6) &&
          (todayDate.getDate() === 31 ||
            todayDate.getDate() === 1 ||
            todayDate.getDate() === 2)
        ) {
          this.showFreeBoostWomanFreePopUp(true);
          Meteor.call('giveFreeBoosWomanWeekend', Meteor.user()._id, () => {
            this.props.mainPage.activateUserBoost(false);
          });
        }
      }
    }, 3000);
    this.ref_nav.current.goToPage(1);
    /* setTimeout(() => {
      if (!this.props.initialPage || (this.props.initialPage == 1 && this.state.editProfile == false)) {
        this.ref_nav.current.goToPage(1);
      }
    }, 10); */
    Meteor.call('userStatus', Meteor.user()._id, (err, result) => {
      if (!err) {
        if (result.firstLogin == true) {
          this.setState({ firstLogin: true });
        }
      }
    });

    this.emitter.addListener('shareCombination', this._sharedCombination, this);
    this.emitter.addListener('newCombination', this._newCombination, this);
    if (!this.state.editProfile && Meteor.user().profile.picture_silhouette) {
      this.timer = setTimeout(() => {
        Alert.showAlert(
          '',
          'Your profile is currently inactive. You need to choose a profile picture to be active and be seen by other users',
          'profile_picture',
        );
      }, 3000);
    }

    if (this.props.newBio && this.state.profile) {
      this.state.profile.changeAbout(this.props.newBio);
    }

    // Check if user invited someone
    Meteor.call('notifyReferrer', Meteor.user()._id, (err, res) => {
      if (!err && res) {
        Alert.showAlert('Congratulations 🎉', res, 'referral');
      }
    });

    this.showPopup();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async getUserLocationFromApi() {
    myBD.buscarItem('COORDS', async (coords) => {
      if (coords && coords != '0|0') {
        // this.getUserCountryCode(coords)
      } else {
        await Location.getCurrentLocationSilent();

        myBD.buscarItem('COORDS', (coords) => {
          if (coords) {
            // this.getUserCountryCode(coords)
          }
        });
      }
    });
  }

  getUserCountryCode(coords) {
    const apiKey = 'AIzaSyCK8ZJtgtSiiRG5sGtlsBHjOOLDS1xsl0I';
    var bd_coords = coords.split('|');
    var query =
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
      bd_coords[1] +
      ',' +
      bd_coords[0] +
      '&key=' +
      apiKey;

    fetch(query)
      .then((response) => response.json())
      .then((responseJson) => {
        for (var i = 0; i < responseJson.results.length; j++) {
          for (
            var j = 0;
            j < responseJson.results[i].address_components.length;
            j++
          ) {
            var component = responseJson.results[i].address_components[j];
            if (component.types && component.types.indexOf('country') != -1) {
              this.setState({ userCountry: component.short_name });
              Meteor.call(
                'storeUserLocationCode',
                Meteor.user()._id,
                component.short_name,
              );
              Meteor.user().userLocation = component.short_name;
              return true;
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _sharedCombination() {
    this.setState({ sharedCombination: true });
    this._removePulse();
  }

  _newCombination() {
    this.setState({ sharedCombination: false });
  }

  _removePulse() {
    this.emitter.emit('stopPulseShareCombination');
    this.setState({ pulse: false });
  }

  _handleAppStateChange(currentAppState) {
    if (currentAppState == 'active') {
      Location.getCurrentLocationSilent();
    }
  }

  activateBoostPopup(estado, boostedHours) {
    if (this.ref_ActivateBoost?.current)
      this.ref_ActivateBoost?.current.openPopUp(estado, boostedHours);
  }
  activateLanguagePicker(estado) {
    if (this.ref_ChangeLanguagePicker?.current)
      this.ref_ChangeLanguagePicker?.current.openPopUp(estado);
  }
  activatePasswordChange(estado) {
    if (this.ref_ChangePassword?.current)
      this.ref_ChangePassword?.current.openPopUp(estado);
  }

  activatePopUp(estado) {
    trackScreen('Invite_Friends_PopUp');
    if (this.ref_invitePopUp?.current) this.ref_invitePopUp?.current.openPopUp(estado);
  }

  showPickupLinePopUp(estado) {
    trackScreen('PickupLine_PopUp');
    if (this.ref_pickupLinePopUp?.current) {
      this.ref_pickupLinePopUp?.current.openPopUp(estado);
    }
  }

  showStreakPopUp(estado) {
    trackScreen('StreakPopUp_PopUp');
    if (this.ref_streakPopUp?.current) {
      this.ref_streakPopUp?.current.openPopUp(estado);
    }
  }

  showWhoVotedFreePopUp(estado) {
    trackScreen('WhoVotedFree_PopUp');
    if (this.ref_WhoVotedFree?.current) {
      this.ref_WhoVotedFree?.current.openPopUp(estado);
    }
  }

  showFreeBoostWomanFreePopUp(estado) {
    trackScreen('FreeBoostWomanFree_PopUp');
    if (this.ref_FreeBoostWomanFree?.current) {
      this.ref_FreeBoostWomanFree?.current.openPopUp(estado);
    }
  }

  showWinkFreePopUp(estado) {
    trackScreen('WinkFree_PopUp');
    if (this.ref_WinkFree?.current) {
      this.ref_WinkFree?.current.openPopUp(estado);
    }
  }

  showWinkModal(estado) {
    if (this.ref_SendWinkModal?.current) {
      this.ref_SendWinkModal?.current.openPopUp(estado);
    }
  }
  showVipModal(estado) {
    if (this.ref_VipModal?.current) {
      this.ref_VipModal?.current.openPopUp(estado);
    }
  }
  showPowerVoteModal(estado) {
    if (this.ref_PowerVoteModal?.current) {
      this.ref_PowerVoteModal?.current.openPopUp(estado);
    }
  }
  showInviteFriendModal(estado) {
    if (this.ref_InviteFriendModal?.current) {
      this.ref_InviteFriendModal?.current.openPopUp(estado);
    }
  }
  showBoostModal(estado) {
    if (this.ref_BoostModal?.current) {
      this.ref_BoostModal?.current.openPopUp(estado);
    }
  }
  showWhoVotedModal(estado) {
    if (this.ref_WhoVotedModal?.current) {
      this.ref_WhoVotedModal?.current.openPopUp(estado);
    }
  }
  showAdModal(estado, genre) {
    if (this.ref_AdModal?.current) {
      this.ref_AdModal?.current.openPopUp(estado, genre);
    }
  }
  /* showLeloAdModal(estado){
    if(this.ref_LeloAdModal?.current){
      this.ref_LeloAdModal?.current.openPopUp(estado);
    }
  }   */
  onBoarding(estado) {
    if (this.ref_OnBoarding?.current) {
      this.ref_OnBoarding?.current.openPopUp(estado);
    }
  }

  showShare(estado) {
    if (this.ref_shareApp?.current) {
      this.ref_shareApp?.current.onOpen(estado);
    }
    AppEventsLogger.logEvent('Invite');
    trackEvent('Click_PlayAgain', 'Click_InviteFriends');
  }

  showRatePopUp(estado) {
    trackScreen('Rate_PopUp');
    if (this.ref_ratePopUp?.current) {
      this.ref_ratePopUp?.current.openPopUp(estado);
    }
  }

  showPowerVotePopUp(estado) {
    if (this.ref_powerVotePopUp?.current) {
      this.ref_powerVotePopUp?.current.openPopUp(estado);
    }
  }

  updatePowerVoteCount(type, count) {
    if (this.ref_powerVotePopUp?.current) {
      if (type == 'fuck') {
        this.ref_powerVotePopUp?.current.setState({ fuckLeft: count });
      } else if (type == 'marry') {
        this.ref_powerVotePopUp?.current.setState({ marryLeft: count });
      } else if (type == 'kill') {
        this.ref_powerVotePopUp?.current.setState({ killLeft: count });
      }
    }
  }

  downloadPowerVoteCount() {
    if (this.ref_powerVotePopUp?.current) {
      this.ref_powerVotePopUp?.current.downloadPowerVoteCount();
    }
    if (this.ref_gameView?.current) {
      this.ref_gameView?.current.updatePowerVotes();
    }
  }

  triggerOffer(offer) {
    setTimeout(() => {
      this.setState({ triggerOffer: offer });
    }, 1000);
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.refreshGameView) {
      if (this.ref_gameView?.current) {
        this.ref_gameView?.current.reset();
      }
    }

    if (props.initialPage != this.props.initialPage) {
      this.setState({ initialPage: props.initialPage });
    }

    if (props.goToPage) {
      this.ref_nav.current.goToPage(2);
    }
  }

  componentDidUpdate() {
    setTimeout(() => {
      myBD.buscarItem('ratePopUp', (item) => {
        if (item === 'true') {
          this.showRatePopUp(true);
          myBD.criarItem('ratePopUp', 'false', () => {});
        }
      });
    }, 2000);
  }

  lockSwipeTabs() {
    this.setState({ lock: true });
  }
  unlockSwipeTabs() {
    this.setState({ lock: false });
  }

  previewPhoto(estado, id, user) {
    this.setState({ estadoModel: estado, id: id });
    this.ref_previewLayer?.current.toggleModal(
      this.state.estadoModel,
      id,
      this,
      user,
    );
    this.setState({ lock: true });
  }

  close() {
    this.ref_previewLayer?.current.closeModal();
    this.setState({ lock: false });
  }

  newMatch(matchType, idOtherUser, idMatch, manager) {
    if (this.ref_newMatchPage?.current) {
      this.ref_newMatchPage?.current.showModal(
        matchType,
        idOtherUser,
        idMatch,
        manager,
      );
    }
  }

  newNotification() {}

  changeGender() {
    if (this.ref_gameView?.current) {
      this.ref_gameView?.current.reset();
    }
  }

  statusBariOS() {
    if (Platform.OS == 'ios') {
      return <View style={{ marginTop: 20 }} />;
    }
  }

  bought(product) {
    if (
      product.indexOf('profiles') !== -1 &&
      this.state.triggerOffer === 'profile'
    ) {
      this.setState({
        triggerOffer: false,
      });
    }
    if (
      product.indexOf('winks') !== -1 &&
      this.state.triggerOffer === 'winks'
    ) {
      this.setState({
        triggerOffer: false,
      });
    }
  }

  onChangeTab(object) {
    // if((object.from == 3 && object.i != 2) || (object.from == 2 && object.i != 3)){
    //   this.unlockSwipeTabs()
    // }
    if (object.i != 0) {
      this.setState({ profileTab: false });
    }
    if (object.from == 3 && object.i !== 3) {
      if (this.state.triggerOffer) {
        let trigger = this.state.triggerOffer;
        this.setState(
          {
            triggerOffer: false,
          },
          () => {
            if (trigger === 'profile') {
              this.showWhoVotedFreePopUp(true);
            } else if (trigger === 'winks') {
              this.showWinkFreePopUp(true);
            }
          },
        );
      }
    }

    if (object.i == 0 || object.i == 1 || this.unlockSwipeTabs()) {
      this.unlockSwipeTabs();
    }

    if (object.from == 1 && object.i == 3) {
      this.close();
    }

    if (object.i == 0) {
      if (
        Meteor.user().profile.notify_streak === 'fuck' ||
        Meteor.user().profile.notify_streak === 'marry'
      ) {
        this.showStreakPopUp(true);
      }
      this.setState({ page: 'settings' });
      //this.refs.userProfile.updateStats()
      if (Meteor.user()) this.state.profile.updateStats();

      this.setState({ pulse: false });
      this._removePulse();
      clearInterval(this.pulseAnim);

      if (
        Meteor.user().profile.custom_picture == null &&
        !this.state.firstLogin
      ) {
        Actions.confirmPhoto({
          urlPhoto: Meteor.user().profile.picture,
          profile: this.state.profile,
          about: Meteor.user().profile.about,
          new_photo: true,
          firstTime: false,
        });
      }
    } else if (object.i == 2) {
      this.setState({ page: 'matches' });

      if (this.state.matches) {
        this.state.matches._updateNewMatches();
        this.state.matches._updateMatchesList();
      }

      this.lockSwipeTabs();
      this.setState({ pulse: false });
      this._removePulse();
      clearInterval(this.pulseAnim);
    } else if (object.i == 1) {
      this.setState({ page: 'feed' });
      this.pulseAnim = setInterval(() => {
        if (!this.state.sharedCombination) {
          if (!this.state.pulse && this.state.page == 'feed') {
            this.emitter.emit('pulseShareCombination');
            this.setState({ pulse: true });
          }
        } else {
          this.emitter.emit('stopPulseShareCombination');
          this.setState({ pulse: false });
        }
      }, 5000);
    } else if (object.i == 3) {
      trackScreen('Purchases_Screen');
      this.setState({ page: 'monetization', pulse: false });
      //this.lockSwipeTabs()

      /* if(this.state.initialSwiperPage){
        this.ref_monetizationSlideshowTab?.current.refs["swiper"].scrollBy(this.state.initialSwiperPage, true)
      } */
      this._removePulse();
      clearInterval(this.pulseAnim);
    }
  }

  setProfile(profile) {
    this.setState({ profile: profile });
  }

  setMatches(component) {
    this.setState({ matches: component });
  }

  scroll() {
    this.ref_nav.current.scrollTo();
  }
  getHours() {
    if (this.ref_userProfile?.current) {
      this.ref_userProfile?.current.getHours();
    }
  }
  userBoosted() {
    if (this.ref_userProfile?.current) {
      this.ref_userProfile?.current.setState({ boostable: true });
    }
  }

  activateUserBoost(register = true) {
    if (this.ref_userProfile?.current) {
      this.ref_userProfile?.current.activateBoost(register);
    }
  }

  showPopup() {
    // Check if it's needed to show a popup to invite user to refer, temporary disabled

    // if(Meteor.user().profile.loggedThreeTimes){
    //   Meteor.call('alertMessages', 'referralThreeDays', Meteor.user()._id, (error, res) => {
    //     if(!error) {
    //       trackEvent('Referral', 'opensPopup', {label: 'referralThreeDays'});
    //       Alert.showAlert('', res, 'referralThreeDays');
    //     }
    //   });
    // }
    //
    // if(Meteor.user().profile.needsMatch) {
    //   Meteor.call('alertMessages', 'referralNoMatchs', Meteor.user()._id, (error, res) =>{
    //     if(!error) {
    //       trackEvent('Referral', 'opensPopup', {label: 'referralNoMatchs'});
    //       Alert.showAlert('', res, 'referralNoMatchs');
    //     }
    //   });
    // }
    Meteor.call('dailyReward', Meteor.user()._id, 'androidApp', (err, res) => {
      if (!err && res && res.newVersion) {
        trackScreen('PrizePopUp');
        this.ref_prizePopUp?.current.openPopUp(
          true,
          res.prize,
          res.quantity,
          res.numberLogins,
        );
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <StatusBar
            backgroundColor={'grey'}
            translucent={false}
            barStyle="default"
          />
          {this.statusBariOS()}
          <ScrollableTabView
            ref={this.ref_nav}
            locked={this.state.lock}
            style={{ marginTop: 10 }}
            initialPage={this.props.initialPage}
            renderTabBar={() => (
              <MenuTab
                ref={this.ref_menuTab}
                emitter={this.emitter}
                profileTab={this.state.profileTab}
              />
            )}
            tabBarUnderlineStyle={{ backgroundColor: '#424249' }}
            onChangeTab={this.onChangeTab.bind(this)}
            tabBarActiveTextColor="#859393"
            tabBarInactiveTextColor="#aeb7b7"
            prerenderingSiblingsNumber={Infinity}
            tabBarBackgroundColor="#fff"
          >
            <UserProfile
              ref={this.ref_userProfile}
              mainPage={this}
              tabLabel="profile"
              isLoading={true}
              count={3}
              popUp={this}
            />
            <GameView
              ref={this.ref_gameView}
              mainPage={this}
              tabLabel="selection"
              idUser={this.props.idUser}
              gameScene={this}
              popUp={this}
              emitter={this.emitter}
            />
            <MatchesPage
              ref={this.ref_matchesPage}
              tabLabel="chat"
              mainPage={this}
              popUp={this}
            />
            <MonetizationMainMenu
              ref={this.ref_MonetizationMainMenu}
              tabLabel="monetization"
              mainPage={this}
            />
          </ScrollableTabView>
          <PreviewLayer ref={this.ref_previewLayer} id={this.state.id} />
        </View>
        <NewMatchPage ref={this.ref_newMatchPage} />
        <PrizePopUp mainPage={this} ref={this.ref_prizePopUp} />
        <InvitePopUp mainPage={this} ref={this.ref_invitePopUp} />
        <ChangeLanguagePicker mainPage={this} ref={this.ref_ChangeLanguagePicker} />
        <ChangePassword mainPage={this} ref={this.ref_ChangePassword} />
        <ActivateBoost mainPage={this} ref={this.ref_ActivateBoost} />
        <PickupLinePopUp mainPage={this} ref={this.ref_pickupLinePopUp} />
        <StreakPopUp mainPage={this} ref={this.ref_streakPopUp} />
        <WhoVotedFreePopUp mainPage={this} ref={this.ref_WhoVotedFree} />
        <FreeBoostWomanFreePopUp mainPage={this} ref={this.ref_FreeBoostWomanFree} />
        <WinkFreePopUp mainPage={this} ref={this.ref_WinkFree} />
        <SendWinkModal mainPage={this} ref={this.ref_SendWinkModal} />
        <VipModal mainPage={this} ref={this.ref_VipModal} />
        <PowerVoteModal mainPage={this} ref={this.ref_PowerVoteModal} />
        <InviteFriendModal mainPage={this} ref={this.ref_InviteFriendModal} />
        <BoostModal mainPage={this} ref={this.ref_BoostModal} />
        <WhoVotedModal mainPage={this} ref={this.ref_WhoVotedModal} />
        <LeloAdModal mainPage={this} ref={this.ref_LeloAdModal} />
        <AdModal mainPage={this} ref={this.ref_AdModal} />
        <RatePopUp mainPage={this} ref={this.ref_ratePopUp} />
        <OnBoarding mainPage={this} ref={this.ref_OnBoarding} />
        <PowerVotePopUp mainPage={this} ref={this.ref_powerVotePopUp} />
        <ShareApp ref={this.ref_shareApp} />
      </View>
    );
  }
}
