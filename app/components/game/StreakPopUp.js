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
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
import branch from 'react-native-branch';
import Share, { ShareSheet, Button } from 'react-native-share';
import RNViewShot from 'react-native-view-shot';
import { trackEvent } from '../../utilities/Analytics';

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
      typeText: type === 'fuck' ? 'F*ck' : 'Marry',
      record: Meteor.user().profile.record_streak ? Meteor.user().profile.record_streak[type] : 10,
    }
    this._loadBranch = this._loadBranch.bind(this);
  }

  componentWillMount() {
    this.emitter = new EventEmitter();
  }

  componentDidMount() {
    this.emitter.addListener('shareInviteStreak', this._loadBranch, this);
  }

  openPopUp(value) {
    this.setState({ isOpen: value });
  }

  async _loadBranch() {
    branchUniversalObject = await branch.createBranchUniversalObject(
      'content/12345', // canonical identifier
      {
        title: I18n.t('app.components.game.StreakPopUp.loadBranchTitle'),
        contentImageUrl: 'http://www.playfmk.com/images/preview.png',
        contentDescription: I18n.t('app.components.game.StreakPopUp.loadBranchDesc'),
        metadata: {
          user_id: Meteor.user()._id,
        }
      }
    )

    let urlObject ={
      title: I18n.t('app.components.game.StreakPopUp.urlObject'),
      message: I18n.t('app.components.game.StreakPopUp.urlObject'),
      subject: I18n.t('app.components.game.StreakPopUp.urlObject'),
      url: this.state.image,
    }

    //let {channel, completed, error} = await branchUniversalObject.showShareSheet(branchUniversalObject, linkProperties, controlParams)
    Share.open(urlObject);
  }


  _shareLink() {
    //this.refs['shareApp'].onOpen(true);
    trackEvent('StreakPopUp', 'Share');
    RNViewShot.takeSnapshot(this.refs['streakShare'], {
      width: 360,
      height: 550,
      format: "jpeg",
      quality: 0.5,
      result: "base64",
    }).then(
      uri => { this.setState({ image: 'data:image/jpeg;base64,' + uri }, () => { this.emitter.emit('shareInviteStreak'); }) },
      error => { alert(error); }
    );
  }

  render() {
    const shareWidth = 360;
    const shareHeight = 550;
    const colors = this.state.type === 'fuck' ? ['rgba(248,137,86,0.8)', 'rgba(247,71,134,1)'] : ['rgba(52,73,94,0.9)', 'rgba(142,68,173,1.0)'];
    const buttonColor = this.state.type === 'fuck' ? '#FFB74D' : '#E040FB';
    let picture = `https://fmk-images.ams3.digitaloceanspaces.com/defaults/${this.state.type}.jpg`;
    if (this.state.type === 'marry') {
      picture = `https://fmk-images.ams3.digitaloceanspaces.com/defaults/${this.state.type}.jpg`;
    }
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
                <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 18, textAlign: 'center' }}>{I18n.t('app.components.game.StreakPopUp.newRecord')}</Text>
                <Text style={{ marginTop: 20, marginBottom: 20, fontFamily: 'Selima', fontSize: 60, textAlign: 'center', color: '#fff' }}>{`${this.state.record} ${this.state.typeText} votes streak`}</Text>
                <View style={{ marginBottom: 40, marginTop: 20, alignItems:'center', justifyContent:'center' }} >
                  <Image source={{ uri: picture }} style={{ height: 250, width: 250, borderRadius: 175}}/>
                </View>
                <TouchableOpacity style={[styles.popUpButton, { width: WIDTH / 2, backgroundColor: buttonColor, borderRadius: 50, borderColor: 'transparent' }]} onPress={ ()=> { this._shareLink(); Meteor.call('resetStreakNotify', Meteor.user()._id); this.setState({isOpen: false}); }}>
                  <Text style={{ fontFamily: 'Selima', color: '#fff', backgroundColor: 'transparent', fontSize: 45 }}>
                  {I18n.t('app.components.game.StreakPopUp.showOff')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.popUpButton, {marginTop:10, borderColor: 'transparent'}]} onPress={() => {this.setState({isOpen: false}); trackEvent('StreakPopUp', 'Close'); Meteor.call('resetStreakNotify', Meteor.user()._id); }} >
                  <Text style={{ fontFamily: 'Montserrat-Light', color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 14, textDecorationLine: 'underline' }}>{I18n.t('app.components.game.StreakPopUp.mySelf')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View ref={'streakShare'} collapsable={false} style={{position:'absolute', left:-10000, height: shareHeight, width: shareWidth }} >
            {/* <View ref={'streakShare'} collapsable={false} style={{height: shareHeight, width: shareWidth }} > */}
              <LinearGradient
                style={[styles.swipePageContainer, {width: shareWidth, height: shareHeight}]}
                colors={colors}>
                <View style={{ alignItems:'center', justifyContent:'center' }}>
                  <View style={{ flex: 1, marginTop: 50, marginLeft:20, marginRight:20, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 18, textAlign: 'center' }}>{I18n.t('app.components.game.StreakPopUp.newRecord')}</Text>
                    <Text style={{ marginTop: 20, marginBottom: 20, fontFamily: 'Selima', fontSize: 60, textAlign: 'center', color: '#fff' }}>{`${this.state.record} ${this.state.typeText} votes streak`}</Text>
                    <View style={{ marginBottom: 40, marginTop: 20, alignItems:'center', justifyContent:'center' }} >
                      <Image source={{ uri: picture }} style={{ height: 250, width: 250, borderRadius: 175}}/>
                    </View>
                    <View style={{ backgroundColor: '#fff', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', width: WIDTH, paddingBottom: 20, paddingTop: 20 }}>
                      <View style={{ alignItems: 'center' }}>
                        <GameTagIcon name='fuck' color="#3e3e3e" style={{ fontSize: 25, backgroundColor: 'transparent' }} />
                        <GameTagIcon name='marry' color="#3e3e3e" style={{ fontSize: 25, backgroundColor: 'transparent' }} />
                        <GameTagIcon name='kill' color="#3e3e3e" style={{ fontSize: 25, backgroundColor: 'transparent' }} />
                      </View>
                      <View>
                        <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#3e3e3e', backgroundColor: 'transparent', fontSize: 14, textAlign: 'center', marginBottom: 5 }}>{I18n.t('app.components.game.StreakPopUp.playOn')}</Text>
                        <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#3e3e3e', backgroundColor: 'transparent', fontSize: 18, textAlign: 'center', textDecorationLine: 'underline' }}>playfmk.com</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </LinearGradient>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}
