import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackAndroid,
  Platform,
  Linking,
  StatusBar
} from 'react-native';
import Meteor from '@meteorrn/core'
import Modal from 'react-native-modal';
import GameTagIcon from '../../font/customIcon';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../utilities/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles/styles';
import { trackScreen, trackEvent } from '../../utilities/Analytics';
const FBSDK = require('react-native-fbsdk-next');
const {
  AppEventsLogger
} = FBSDK;

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height-StatusBar.currentHeight;
const CONSTANTS = new Constants();
const STORE_URL = Platform.OS == 'ios' ? 'itms-apps://itunes.apple.com/us/app/id791578803?mt=8' : 'market://details?id=com.builduplabs.fmk';

export default class RatePopUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      stars: 0,
      voted: false
    }
    this._giveStars = this._giveStars.bind(this);
  }

  openPopUp(value) {
    this.setState({isOpen: value});
    trackScreen('Rate_us_screen');
  }

  _giveStars(value) {
    this.setState({stars: value, voted: true});
  }

  rateOnStore() {
    trackEvent
    if(Meteor.user() && Meteor.user()._id){
      Meteor.call('userAppRating', Meteor.user()._id, this.state.voted, this.state.stars, true);
    }
    Linking.canOpenURL(STORE_URL)
    .then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + STORE_URL);
      } else {
        return Linking.openURL(STORE_URL);
      }
    })
    .catch(
      err => console.error('An error occurred', err)
    );
    trackEvent('Rate_Us_Screen', 'Click Rate on Store');
    trackEvent('Rate_Us_Screen', 'Submit', { label: 'stars', value: this.state.stars });
    AppEventsLogger.logEvent('fb_mobile_rate');
    this.setState({ isOpen: false });
  }

  giveFeedback() {
    if(Meteor.user() && Meteor.user()._id){
      Meteor.call('userAppRating', Meteor.user()._id, this.state.voted, this.state.stars, true);
    }
    Linking.canOpenURL('mailto:hello@playfmk.com')
    .then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + 'mailto:hello@playfmk.com');
      } else {
        return Linking.openURL('mailto:hello@playfmk.com');
      }
    })
    .catch(
      err => console.error('An error occurred', err)
    );
    trackEvent('Rate_Us_Screen', 'Feedback');
    trackEvent('Rate', 'Submit', { label: 'stars', value: this.state.stars });
    this.setState({ isOpen: false });
  }

  closeModal() {
    if(Meteor.user() && Meteor.user()._id){
      Meteor.call('userAppRating', Meteor.user()._id, this.state.voted, this.state.stars, false);
    }
    trackEvent('Rate', 'Close');
    trackEvent('Rate', 'Submit', { label: 'stars', value: this.state.stars });
    this.setState({ isOpen: false });
  }

  render() {
    let stars = [];
    if (this.state.stars) {
      let i = 1;
      while(stars.length < 5) {
        if (i <= this.state.stars) {
          stars.push(
            <TouchableOpacity key={i} onPress={this._giveStars.bind(this, i)}>
              <Icon style={{ backgroundColor: 'transparent' }} name={'star'} size={50} color={'#E5E7E9'}/>
            </TouchableOpacity>
          );
        } else {
          stars.push(
            <TouchableOpacity key={i} onPress={this._giveStars.bind(this, i)}>
              <Icon style={{ backgroundColor: 'transparent' }} name={'star-border'} size={50} color={'#E5E7E9'}/>
            </TouchableOpacity>
          );
        }
        i++;
      }
    } else {
      for (var i = 1; i <= 5; i++) {
        stars.push(
          <TouchableOpacity key={i} onPress={this._giveStars.bind(this, i)}>
            <Icon style={{ backgroundColor: 'transparent' }} name={'star-border'} size={50} color={'#E5E7E9'}/>
          </TouchableOpacity>
        );
      }
    }
    if (this.state.voted) {
      return (
        <TouchableWithoutFeedback style={{top: 0, left: 0, position: 'absolute', width: WIDTH, height: HEIGHT }}>
          <Modal
            modalDidClose={() => { this.setState({ isOpen: false }); } }
            offset={0}
            hideCloseButton={false}
            backdropType= 'blur'
            open={this.state.isOpen}
            modalStyle={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}>
            <LinearGradient
              style={[styles.swipePageContainer, {width: WIDTH, height: HEIGHT}]}
              colors={[CONSTANTS.colors1[0] + 'CC', CONSTANTS.colors[0] + 'CC', CONSTANTS.colors1[1] + 'CC', CONSTANTS.colors[1] + 'CC', CONSTANTS.colors1[2] + 'CC', '#0009']}>
              <View style={{ flex: 1, alignItems:'center', justifyContent:'center' }}>
                <View style={{ marginTop: 50, marginLeft:20, marginRight:20, alignItems:'center', justifyContent:'center'}}>
                  <GameTagIcon name='selection' color="#ffffff" style={{ fontSize: 70, marginBottom:60 }} />
                  <View style={{ marginBottom:10, alignItems:'center', justifyContent:'center' }} >
                    <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 20, textAlign: 'center' }}>{I18n.t('app.components.game.RatePopUp.rateUs')}</Text>
                  </View>
                  <View style={styles.rateStars}>
                    {stars}
                  </View>
                  {this.state.stars > 3 &&
                    <View style={{ marginTop: 50, marginBottom:10, alignItems:'center', justifyContent:'center'}} >
                      <Text style={{ marginBottom:20, color:'#ffffff', fontFamily:'Montserrat-Light', fontSize:14, marginLeft:25, marginRight:25 }}>{I18n.t('app.components.game.RatePopUp.unfairReviews')}</Text>
                      <TouchableOpacity style={[styles.loginButton, { backgroundColor: 'white'}]} onPress={() => { this.rateOnStore(); }} >
                        <Text style={{ fontFamily: 'Montserrat-Light', color: '#424949', backgroundColor: 'transparent', fontSize: 14 }}>{I18n.t('app.components.game.RatePopUp.rateUs')}</Text>
                      </TouchableOpacity>
                    </View>
                  }
                  {this.state.stars <= 3 &&
                    <View style={{ marginTop: 50, marginBottom:10, alignItems:'center', justifyContent:'center' }} >
                      <TouchableOpacity style={[styles.loginButton, { backgroundColor: 'white'}]} onPress={() => { this.giveFeedback(); }} >
                        <Text style={{ fontFamily: 'Montserrat-Light', color: '#424949', backgroundColor: 'transparent', fontSize: 14 }}>{I18n.t('app.components.game.RatePopUp.giveUsFeedback')}</Text>
                      </TouchableOpacity>
                    </View>
                  }
                  {this.state.stars > 3 &&
                    <TouchableOpacity style={[styles.loginButton, {marginTop: 50, borderColor: 'transparent', alignItems:'center', justifyContent:'center'}]} onPress={() => { this.closeModal(); trackEvent('Rate_Us_Screen', 'Do not want to help');}} >
                      <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 14 }}>{I18n.t('app.components.game.RatePopUp.dontWantHelp')}</Text>
                    </TouchableOpacity>
                  }
                  {this.state.stars <= 3 &&
                    <TouchableOpacity style={[styles.loginButton, {marginTop: 50, borderColor: 'transparent', alignItems:'center', justifyContent:'center'}]} onPress={() => { this.closeModal(); }} >
                      <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 14 }}>{I18n.t('app.components.game.RatePopUp.notNow')}</Text>
                    </TouchableOpacity>
                  }
                </View>
              </View>
            </LinearGradient>
          </Modal>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback style={{top: 0, left: 0, position: 'absolute', width: WIDTH, height: HEIGHT }}>
          <Modal
            modalDidClose={() => { this.setState({ isOpen: false }); } }
            offset={0}
            hideCloseButton={false}
            backdropType= 'blur'
            open={this.state.isOpen}
            modalStyle={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}>
            <LinearGradient
              style={[styles.swipePageContainer, {width: WIDTH, height: HEIGHT}]}
              colors={[CONSTANTS.colors1[0] + 'CC', CONSTANTS.colors[0] + 'CC', CONSTANTS.colors1[1] + 'CC', CONSTANTS.colors[1] + 'CC', CONSTANTS.colors1[2] + 'CC', '#0009']}>
              <View style={{ flex: 1, alignItems:'center', justifyContent:'center' }}>
                <View style={{ marginTop: 50, marginLeft:20, marginRight:20, alignItems:'center', justifyContent:'center'}}>
                  <GameTagIcon name='selection' color="#ffffff" style={{ fontSize: 70, marginBottom:60 }} />
                  <View style={{ marginBottom:10, alignItems:'center', justifyContent:'center' }} >
                    <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 20, textAlign: 'center' }}>{I18n.t('app.components.game.RatePopUp.rateUs')}</Text>
                  </View>
                  <View style={styles.rateStars}>
                    {stars}
                  </View>
                  <TouchableOpacity style={[styles.loginButton, {marginTop: 50, borderColor: 'transparent', alignItems:'center', justifyContent:'center'}]} onPress={() => {this.closeModal()}} >
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 14 }}>{I18n.t('app.components.game.RatePopUp.notNow')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </Modal>
        </TouchableWithoutFeedback>
      );
    }
  }
}
