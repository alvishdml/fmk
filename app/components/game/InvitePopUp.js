import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Meteor from '@meteorrn/core';
import Modal from 'react-native-modal';
import GameTagIcon from '../../font/customIcon';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../utilities/Constants';
import styles from '../../styles/styles';
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
import branch from 'react-native-branch';
import Share, { ShareSheet, Button } from 'react-native-share';
import { trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const CONSTANTS = new Constants();

export default class InvitePopUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
    this._loadBranch = this._loadBranch.bind(this);
  }

  componentWillMount() {
    this.emitter = new EventEmitter();
    Meteor.call('inviteFriends', Meteor.user()._id);
  }

  componentDidMount() {
    this.emitter.addListener('shareInviteLink', this._loadBranch, this);
  }

  openPopUp(value) {
    this.setState({ isOpen: value });
  }

  async _loadBranch() {
    branchUniversalObject = await branch.createBranchUniversalObject(
      'content/12345', // canonical identifier
      {
        title: I18n.t('app.components.game.InvitePopUp.loadBranchTitle'),
        contentImageUrl: 'http://www.playfmk.com/images/preview.png',
        contentDescription: I18n.t('app.components.game.InvitePopUp.loadBranchDesc'),
        metadata: {
          user_id: Meteor.user()._id,
        }
      }
    )

    let linkProperties = {
      feature: 'share',
      channel: 'uniChallenge',
      campaign: 'InviteFriendsApp'
    }

    let controlParams = {
    }

    let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
    this.setState({shareUrl: url});

    let urlObject ={
      title: 'F*ck Marry Kill',
      message: I18n.t('app.components.game.InvitePopUp.urlObejctMessage'),
      subject: I18n.t('app.components.game.InvitePopUp.urlObejectSubject'),
      url: url,
    }

    //let {channel, completed, error} = await branchUniversalObject.showShareSheet(branchUniversalObject, linkProperties, controlParams)
    Share.open(urlObject);
  }


  _shareLink() {
    //this.refs['shareApp'].onOpen(true);
    this.emitter.emit('shareInviteLink');
    trackEvent('Invit_Popup', 'Invite_Friends')
  }

  render() {
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
                <View style={{ marginBottom:60, alignItems:'center', justifyContent:'center' }} >
                  <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 20, textAlign: 'center', marginBottom:15 }}>{I18n.t('app.components.game.InvitePopUp.havingFun')}</Text>
                  <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 15, textAlign: 'center' }}>{I18n.t('app.components.game.InvitePopUp.whyNotInvite')}</Text>
                  <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 15, textAlign: 'center' }}>{I18n.t('app.components.game.InvitePopUp.freeMatches')}</Text>
                </View>
                <TouchableOpacity style={[styles.popUpButton, { backgroundColor: 'white'}]} onPress={ ()=> { this._shareLink() }}>
                  <Text style={{ fontFamily: 'Montserrat-Light', color: '#424949', backgroundColor: 'transparent', fontSize: 14 }}>
                  {I18n.t('app.components.game.InvitePopUp.inviteFriends')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.popUpButton, {marginTop:10, borderColor: 'transparent'}]} onPress={() => {this.setState({isOpen: false})}} >
                  <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 14 }}>{I18n.t('app.components.game.InvitePopUp.close')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}
