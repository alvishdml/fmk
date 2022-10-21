import React, { Component } from 'react';
import I18n from '../../config/i18n';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  BackAndroid,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Meteor from '@meteorrn/core'
import Modal from 'react-native-modal';
import { Actions, ActionConst } from 'react-native-router-flux';
import IconM from 'react-native-vector-icons/MaterialIcons';
import Share from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';
import GameTagIcon from '../font/customIcon'
import Constants from '../utilities/Constants';
import Alert from '../utilities/Alert';
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
const FBSDK = require('react-native-fbsdk-next');
const {
  LoginManager
} = FBSDK;
const BD = require('../utilities/DAAsyncStorage');
const myBD = new BD();
import branch from 'react-native-branch';
import { trackScreen, trackEvent } from '../utilities/Analytics';

// reference to native module for opening Location Settings
// Android only
let LinkToSettings = NativeModules.LinkToSettings;

const WIDTH = Dimensions.get('window').width;

export default class CustomAlert extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false, // the modal is open?
      titulo: '', // alert title (only used for report view)
      conteudo: '', // alert body
      tipo: '', // alert type (logout, exit, report...)
      param: '', // opcional parameter that can be passed for the modal
      matchId: '', // match id (only used for report)
      referralType: '', //only for the referral related buttons
      refresh: false
    }
  }

  UNSAFE_componentWillMount() {
    this.emitter = new EventEmitter();
    Alert.setAlert(this);
  }

  componentDidMount(){
    this.emitter.addListener('shareInviteLink', this._shareInviteLink, this);
    this.emitter.addListener('shareInviteLinkSkip', this._shareInviteLinkSkip, this);
  }

  showModal(titulo, conteudo, tipo, param, matchId, gameView, referralType) {
    this.setState({ isOpen: true, titulo: titulo, conteudo: conteudo, tipo: tipo, param: param, matchId: matchId, gameView: gameView, referralType: tipo });
  }

  closeModal(category, action, label) {
    console.log(category, action, label, 'close modal')
    this.setState({ isOpen: false, titulo: '', conteudo: '', tipo: '', param: '', matchId: '' });
    if(action == 'Logout' && label == 'Click_Yes'){
      Meteor.call('deactivateUser', Meteor.user()._id, (err, result) => {
        if (!err) {
          LoginManager.logOut();
          Meteor.logout();
          branch.logout()
          AsyncStorage.removeItem('referrer')
          //myBD.apagarTudo(function(keys) {});
          Actions.login();
        }
      });
    }else if(action == 'Remove_account' && label == 'Click_Yes'){
      Actions.deleteAccount();
    }else if(action == 'Learn_More_Winks'){
      if(this.state.gameView){
        this.state.gameView.showWinkModal();
      } else {
        try {
          Actions.pop();
        } catch (error) {
          console.log(error);
        }
        Actions.mainPage({ triggerOffer: 'winks' });
      }
    }

    if(category && action && label){
      trackEvent(category, action, label);
    }else if(category && action){
      trackEvent(category, action)
    }
  }

  exitApp(category, action, label) {
    if(category && action && label){
      trackEvent(category, action, label)
    }
    BackAndroid.exitApp()
  }

  renderSkipButtons() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={
            () => {
              this.closeModal();
              trackEvent('Shuffle', 'frog_prince_close');
              Alert.showAlert('', I18n.t('app.components.CustomAlert.alertMsg'));
            }
          }
        >
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            🐸
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => {
            this.closeModal();
            trackEvent('Shuffle', 'frog_prince_share');
            this.emitter.emit('shareInviteLinkSkip');
          } }>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            🤴👑
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderGpsButtons() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={()=>{ this.closeModal.bind(this, 'Alerts','GPS','Click_Not_now'); }}>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.notNow')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => {
            this.closeModal.bind(this, 'Alerts', 'GPS','Click_Activate');
            LinkToSettings.openGpsSettings();
          } }>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.activate')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderWeakGpsButtons() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={()=>{ this.closeModal.bind(this, 'Alerts', 'weakGPS', 'Click_NotNow');}}>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.notNow')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => {
            this.closeModal.bind(this, 'Alerts', 'weakGPS', 'click_increase_GPS_signal');
            LinkToSettings.openGpsSettings();
          } }>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          Increase Gps signal
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderExitAppButtons() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.closeModal.bind(this, 'Alerts', 'exit_app', 'click_No') }>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.no')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 20 }} onPress={this.exitApp.bind(this, 'Alerts', 'exit_app', 'click_Yes') }>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.yes')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderLogoutButtons() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => this.closeModal('Alerts', 'Logout', 'Click_No')}>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.no')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 20 }} onPress={ () => this.closeModal('Alerts', 'Logout', 'Click_Yes') }>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.yes')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderRemoveButtons() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.closeModal.bind(this, 'Alerts', 'Remove_account', 'Click_No') }>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.no')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 20 }} 
        onPress={this.closeModal.bind(this, 'Alerts', 'Remove_account', 'Click_Yes')}>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.yes')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderProfilePictureButtons() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.closeModal.bind(this) }>
          <Text style={{ fontFamily: 'Montserrat-Regular', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.inactive')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => {
            this.closeModal.bind(this);
            Actions.confirmPhoto({ urlPhoto: { uri: Meteor.user().profile.picture }, profile: this.state.profile, about: Meteor.user().profile.about, new_photo: false, firstTime: true, locked: true });
          } }>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.choosePicture')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  reportUser(reason, where) {
    trackEvent('Report_User_Screen', "click_"+reason, where);
    let matchId = this.state.matchId;
    Meteor.call('reportUser', Meteor.user()._id, this.state.param, where, reason, (err, result) => {
      if (!err) {
        if(where == 'chat'){
          Meteor.call('unMatch', matchId, (err, result) => {
            if (!err) {
              trackEvent('Unmatch', result.type);
              try{
                Actions.pop({refresh: {refresh: true} });
              }
              catch(err) {

              }
            }
          });
        } else {
          if(this.state.gameView){
            this.state.gameView.reset()
          }
        }
        this.closeModal.bind(this);
      } else {
        if(err.error == 8000){
          Alert.showAlert('', '⚠️ ' + err.details, 'tooManyReports');
        } else {
          this.closeModal.bind(this);
        }
      }
    });
  }

  renderReportList(onlyPic=false) {
    if(onlyPic){
      return (
        <View style={{ width: WIDTH - 80, margin: 20, marginTop: 0 }}>
          <TouchableOpacity style={{ margin: 5, flexDirection: 'row', borderTopColor: '#FFFFFF64', borderTopWidth: 1, paddingTop: 10, paddingLeft: 5 }}
          onPress={()=>{this.reportUser('irrelevant_picture', 'game'); trackEvent('Report_User_Modal','Click_Irrelevant_Picture') }}>
            <IconM name='photo' color="#FFF" style={{ fontSize: 20, marginRight: 10 }} />
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF' }}>
            {I18n.t('app.components.CustomAlert.irrelevantPicture')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 5, flexDirection: 'row', borderTopColor: '#FFFFFF64', borderTopWidth: 1, paddingTop: 10, paddingLeft: 5 }}
          onPress={()=>{this.reportUser('offensive_picture', 'game'); trackEvent('Report_User_Modal','Click_Offensive_Picture') }}>
            <IconM name='report-problem' color="#FFF" style={{ fontSize: 20, marginRight: 10 }} />
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF' }}>
            {I18n.t('app.components.CustomAlert.offensivePicture')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ width: WIDTH - 80, margin: 20, marginTop: 0 }}>
          <TouchableOpacity style={{ margin: 5, flexDirection: 'row', borderTopColor: '#FFFFFF64', borderTopWidth: 1, paddingTop: 10, paddingLeft: 5 }}
          onPress={()=>{this.reportUser('messages', 'chat'); trackEvent('Report_User_Modal','Inappropiate_Messages')}}>
            <IconM name='chat' color="#FFF" style={{ fontSize: 20, marginRight: 10 }} />
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF' }}>
            {I18n.t('app.components.CustomAlert.inappropiateMessages')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 5, flexDirection: 'row', borderTopColor: '#FFFFFF64', borderTopWidth: 1, paddingTop: 10, paddingLeft: 5 }}
          onPress={()=>{this.reportUser('photos', 'chat'); trackEvent('Report_User_Modal','Inappropiate_Photo')}}>
            <IconM name='photo' color="#FFF" style={{ fontSize: 20, marginRight: 10 }} />
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF' }}>
            {I18n.t('app.components.CustomAlert.inappropiatePhoto')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 5, flexDirection: 'row', borderTopColor: '#FFFFFF64', borderTopWidth: 1, paddingTop: 10, paddingLeft: 5 }}
          onPress={()=>{this.reportUser('spam', 'chat'); trackEvent('Report_User_Modal','Spam')}}>
            <IconM name='report-problem' color="#FFF" style={{ fontSize: 20, marginRight: 10 }} />
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF' }}>
            {I18n.t('app.components.CustomAlert.spam')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderList() {
    switch (this.state.tipo) {
      case 'report':
      return this.renderReportList();
      case 'reportPic':
      return this.renderReportList(onlyPic = true);
      default:
      return null;
    }
  }

  renderButtons() {
    switch (this.state.tipo) {
      case 'exitApp':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          {this.renderExitAppButtons() }
        </View>
      );
      case 'skip':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          {this.renderSkipButtons() }
        </View>
      );
      case 'logout':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          {this.renderLogoutButtons() }
        </View>
      );
      case 'remove':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          {this.renderRemoveButtons() }
        </View>
      );
      case 'gps':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          {this.renderGpsButtons() }
        </View>
      );
      case 'weakGps':
      return(
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          {this.renderWeakGpsButtons() }
        </View>
      );
      case 'report':
      return null;
      case 'reportPic':
      return null;
      case 'tooManyReports':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          <TouchableOpacity onPress={this.closeModal.bind(this) }>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.understand')}
            </Text>
          </TouchableOpacity>
        </View>
      );
      case 'firstTimeWinks':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          <TouchableOpacity onPress={() => {
              if(this.state.gameView){
                this.closeModal.bind(this, 'User_Profile_Detail', 'Learn_More_Winks');
              } else {
                this.closeModal.bind(this, 'Who_Voted', 'Learn_More_Winks');
              }
              
            }}>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.learnMore')}
            </Text>
          </TouchableOpacity>
        </View>
      )
      case 'noMoreWinks':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          <TouchableOpacity onPress={() => {
              if(this.state.gameView){
                this.setState({ isOpen: false, titulo: '', conteudo: '', tipo: '', param: '', matchId: '' });
                this.state.gameView.refs['nav'].goToPage(3);
                this.state.gameView.showWinkModal(true);
                trackEvent('User_Profile_Detail', 'Get More Winks');
              } else {
                this.setState({ isOpen: false, titulo: '', conteudo: '', tipo: '', param: '', matchId: '' });
                try {
                  Actions.pop();
                } catch (error) {
                  console.log(error);
                }
                Actions.mainPage({ triggerOffer: 'winks' });
                trackEvent('Who_Voted', 'Get More Winks');
              }
            }}>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.getMore')}
            </Text>
          </TouchableOpacity>
        </View>
      )

      case 'noMorePowerVote':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          <TouchableOpacity onPress={() => {
                this.closeModal.bind(this, 'Power_Vote', 'No_more_votes');
                this.state.gameView.showPowerVoteModal(true);
              }
            }>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.getMore')}
            </Text>
          </TouchableOpacity>
        </View>
      )

      case 'newWinkMain':
      return (
        <View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
          <TouchableOpacity onPress={ ()=>{
              this.state.gameView.refs['nav'].goToPage(2)
              this.closeModal.bind(this);
            } }>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.goMatchList')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 20 }} onPress={this.closeModal.bind(this) }>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.continue')}
            </Text>
          </TouchableOpacity>
        </View>
      );

      case 'newWinkWhoVoted':
      return (
        <View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
          <TouchableOpacity onPress={ ()=>{
              try{
                Actions.pop( {refresh: {refreshGameView: true, goToPage:2} });
              }
              catch(err) {

              } finally {
                this.closeModal.bind(this);
              }
            } }>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.goMatchList')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 20 }} onPress={this.closeModal.bind(this) }>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.continue')}
            </Text>
          </TouchableOpacity>
        </View>
      );

      case 'firstTimeProfiles':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          <TouchableOpacity onPress={() => {
              this.closeModal.bind(this, 'Who_Voted', 'Learn_More_Unlocks');
              try {
                Actions.pop();
                this.setState({ isOpen: false, titulo: '', conteudo: '', tipo: '', param: '', matchId: '' });
              } catch (error) {
                console.log(error);
              }
              Actions.mainPage({ triggerOffer: 'profile' });
              // Actions.monetizationSlideshow({initialPage: 0})
            }}>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.learnMore')}
            </Text>
          </TouchableOpacity>
        </View>
      )

      case 'noMoreProfiles':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          <TouchableOpacity onPress={() => {
              if(this.state.gameView){
                this.setState({ isOpen: false, titulo: '', conteudo: '', tipo: '', param: '', matchId: '' });
                this.state.gameView.refs['nav'].goToPage(3);
                this.state.gameView.showWhoVotedModal(true);
                trackEvent('User_Profile_Detail', 'Get More Profiles');
              } else {
                this.setState({ isOpen: false, titulo: '', conteudo: '', tipo: '', param: '', matchId: '' });
                try {
                  Actions.pop();
                } catch (error) {
                  console.log(error);
                }
                Actions.mainPage({ triggerOffer: 'profiles' });
                trackEvent('Who_Voted', 'Get More Profiles');
              }

              // this.closeModal.bind(this, 'Who_Voted', 'Get_More_Unlocks');
              // try {
              //   Actions.pop();
              // } catch (error) {
              //   console.log(error);
              // }
              // Actions.mainPage({initialPage: 3, triggerOffer: 'profiles'});
            }}>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.getMore')}
            </Text>
          </TouchableOpacity>
        </View>
      )

      case 'profile_picture':
      return (
        <View style={{ flex: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          {this.renderProfilePictureButtons() }
        </View>
      );
      case 'delete_account':
        console.log('delete_account popup')
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          <TouchableOpacity onPress={() => {
              this.setState({ isOpen: false, titulo: '', conteudo: '', tipo: '', param: '', matchId: '' });
              branch.logout()
              AsyncStorage.removeItem('referrer')
              myBD.apagarTudo(function(keys) {
              });
              // LoginManager.logOut();
              Meteor.logout();
              // Actions.login();
            }}>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.ok')}
            </Text>
          </TouchableOpacity>
        </View>
      );
      case 'referral':
      return(
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          <TouchableOpacity onPress={() => {
              this.closeModal.bind(this);
              if(this.state.gameView){
                this.state.gameView.getUserStatus();
              }
            }}>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.ok')}
            </Text>
          </TouchableOpacity>
        </View>
      )
      case 'notify_report':
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          <TouchableOpacity onPress={() => {
              this.closeModal.bind(this);
              var picture = Meteor.user().profile.picture
              if(Meteor.user().profile.custom_picture){
                picture = Meteor.user().profile.custom_picture
              }
              Actions.confirmPhoto({ urlPhoto: picture, about: Meteor.user().profile.about, new_photo: true, firstTime: false, locked: true });
            }}>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.ok')}
            </Text>
          </TouchableOpacity>
        </View>
      )
      case 'referralThreeDays':
      return(
        this.renderReferalButtons('referralThreeDays')
      )
      case 'referralNoMatchs':
      return(
        this.renderReferalButtons('referralNoMatchs')
      )

      case 'uniChallengePopUp':
      trackEvent('UniChallengePopup', 'Open');
      return(
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
          <TouchableOpacity onPress={ () => { Actions.uniRace(); this.closeModal.bind(this, 'UniChallengePopup', 'Joined'); }}>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.imIn')}
            </Text>
          </TouchableOpacity>
        </View>
      )

      default:
      return (
        <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
          <TouchableOpacity onPress={this.closeModal.bind(this) }>
            <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
            {I18n.t('app.components.CustomAlert.ok')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderReferalButtons(){
    return(
      <View style={{ flexGrow: 1, margin: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15, flexDirection: 'row' }}>
        <TouchableOpacity style={{marginRight: 20}} onPress={() =>{
            this.closeModal.bind(this);
            this.emitter.emit('shareInviteLink');
          }}>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.invite')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 20}} onPress={() =>{
            this.closeModal.bind(this, 'Referral', 'KnowMore');
            Actions.monetizationSlideshow({initialPage: 4});
          }}>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', color: '#FFF', margin: 5 }}>
          {I18n.t('app.components.CustomAlert.knowMore')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderTitle() {
    if (
      this.state.tipo == 'report' ||
      this.state.tipo == 'reportPic' ||
      this.state.tipo == 'firstTimeWinks' ||
      this.state.tipo == 'purchaseCompleted' ||
      this.state.tipo == 'referral'
    ) {
      return (
        <View style={{ flexGrow: 0.5, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Montserrat-Bold', backgroundColor: 'transparent', fontSize: 16, color: '#FFF' }}>
            {this.state.titulo}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{ flexGrow: 0.5, marginLeft: 20, marginTop: 20, justifyContent: 'flex-start' }}>
          <GameTagIcon name='selection' color="#FFF" style={{ fontSize: 20 }} />
        </View>
      );
    }
  }

  async _shareInviteLink(){
    let shareOptions = {
      messageHeader: I18n.t('app.components.CustomAlert.shareInviteLinkHeader'),
      messageBody: I18n.t('app.components.CustomAlert.shareInviteLinkBody')
    }

    let linkProperties = {
      feature: 'share',
      channel: 'facebook',
      campaign: this.state.referralType,
    }

    let controlParams = {}

    let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)

    if(completed){
      trackEvent('Referral', channel, {label: this.state.referralType})
    } else {
      trackEvent('Referral', "Canceled", {label: this.state.referralType})
    }
  }

  async _shareInviteLinkSkip(){
    branchUniversalObject = await branch.createBranchUniversalObject(
      'content/12345', // canonical identifier
      {
        title: 'Play F*ck Marry Kill',
        contentImageUrl: 'http://www.playfmk.com/images/preview.png',
        contentDescription: I18n.t('app.components.CustomAlert.contentDescription'),
        metadata: {
          user_id: Meteor.user()._id,
        }
      }
    )

    let linkProperties = {
      feature: 'share',
      channel: 'skip',
      campaign: 'frog_prince'
    }

    let controlParams = {
    }

    let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
    this.setState({shareUrl: url});

    let urlObject ={
      title: I18n.t('app.components.CustomAlert.urlObjectTitleSubject'),
      message: I18n.t('app.components.CustomAlert.urlObjectMessage'),
      subject: I18n.t('app.components.CustomAlert.urlObjectTitleSubject'),
      url: url,
    }

    //let {channel, completed, error} = await branchUniversalObject.showShareSheet(branchUniversalObject, linkProperties, controlParams)
    Share.open(urlObject);
  }

  loadContent() {
    let CONSTANTS = new Constants();
    return (
      <LinearGradient
        style={{ width: WIDTH - 40, borderRadius: 6 }}
        start={{x:0, y:1}} end={{x:1, y:0}}
        colors={[CONSTANTS.colors1[0], CONSTANTS.colors[0], CONSTANTS.colors1[1], CONSTANTS.colors[1], CONSTANTS.colors1[2]]}>
        {this.renderTitle() }
        <View style={{ flexGrow: 1, margin: 20 }}>
          <Text style={{ fontFamily: 'Montserrat-Regular', backgroundColor: 'transparent', fontSize: 16, color: '#FFF' }}>
            {this.state.conteudo}
          </Text>
        </View>
        {this.renderList() }
        {this.renderButtons() }
      </LinearGradient>
    );
  }

  render() {
    return (
      <Modal
        onDismiss={() => { this.setState({ isOpen: false }); } }
        offset={0}
        hideCloseButton={false}
        backdropType= 'blur'
        isVisible={this.state.isOpen}
        style={{ margin: 20, backgroundColor: '#fff0', justifyContent: 'center', alignItems: 'center' }}>
        {this.loadContent() }
      </Modal>
    );
  }
}
