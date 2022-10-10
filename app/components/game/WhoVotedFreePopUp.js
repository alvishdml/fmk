import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Meteor from '@meteorrn/core';
import Modal from 'react-native-modal';
import GameTagIcon from '../../font/customIcon';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../utilities/Constants';
import styles from '../../styles/styles';
import branch from 'react-native-branch';
import Share, { ShareSheet, Button } from 'react-native-share';
import RNViewShot from 'react-native-view-shot';
import { trackEvent } from '../../utilities/Analytics.js';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const CONSTANTS = new Constants();

export default class PickUpLinePopUp extends Component {

  constructor(props) {
    super(props);
    const type = Meteor.user().profile.notify_streak || 'fuck';
    this.state = {
      isOpen: false,
      image: null,
      type: type,
    }
  }

  openPopUp(value) {
    this.setState({ isOpen: value });
  }

  freeProfiles() {
    trackEvent('WhoVotedFreePopUp', 'Get');
    this.props.mainPage.showInviteFriendModal(true);
  }

  render() {
    const colors = ['rgba(56, 142, 60, 1.0)', 'rgba(100, 221, 23, 1)'];
    const buttonColor = '#1B5E20';
    return (
      <TouchableWithoutFeedback style={{top: 0, left: 0, position: 'absolute' }}>
        <Modal
          modalDidClose={() => { this.setState({ isOpen: false }); } }
          offset={0}
          hideCloseButton={false}
          backdropType= 'blur'
          open={this.state.isOpen}
          modalStyle={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}>
          <LinearGradient
            style={[styles.swipePageContainer, {width: WIDTH, height: HEIGHT}]}
            colors={colors}>
            <View style={{ flex: 1, alignItems:'center', justifyContent:'center' }}>
              <View style={{ marginTop: 50, marginLeft:20, marginRight:20, alignItems:'center', justifyContent:'center'}}>
                <Text style={{ marginTop: 20, marginBottom: 20, fontFamily: 'Selima', fontSize: 60, textAlign: 'center', color: '#fff' }}>Free Profiles</Text>
                <View style={{ marginBottom: 50, marginTop: 30, alignItems:'center', justifyContent:'center' }} >
                  <Image source={{ uri: 'https://fmk-images.ams3.digitaloceanspaces.com/defaults/money_face.png' }} style={{ height: 100, width: 100, borderRadius: 100, }}/>
                </View>
                <TouchableOpacity style={[styles.loginButton, { width: WIDTH / 2, backgroundColor: buttonColor, borderRadius: 50, borderColor: 'transparent' }]} onPress={ ()=> { this.setState({isOpen: false}); this.freeProfiles(); }}>
                  <Text style={{ fontFamily: 'Selima', color: '#fff', backgroundColor: 'transparent', fontSize: 45 }}>
                  {I18n.t('app.components.game.WhoVotedFreePopUp.getIt')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.popUpButton, {marginTop:10, borderColor: 'transparent'}]} onPress={() => {this.setState({isOpen: false}); trackEvent('WhoVotedFreePopUp', 'Close'); }} >
                  <Text style={{ fontFamily: 'Montserrat-Light', color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 14, textDecorationLine: 'underline' }}>{I18n.t('app.components.game.WhoVotedFreePopUp.dontWant')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}
