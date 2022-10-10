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
import RNViewShot from 'react-native-view-shot';
import { trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const CONSTANTS = new Constants();

export default class PickUpLinePopUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      pickupline: 'Are you made of copper and tellerium? Because you\'re CuTe.',
      image: null,
    }
    this._loadBranch = this._loadBranch.bind(this);
    this._getPickpLine = this._getPickpLine.bind(this);
  }

  componentWillMount() {
    this.emitter = new EventEmitter();
  }

  componentDidMount() {
    this.emitter.addListener('shareInviteLinkPickup', this._loadBranch, this);
  }

  openPopUp(value) {
    this._getPickpLine(value);
    // this.setState({ isOpen: value });
  }

  _getPickpLine(value) {
    Meteor.call('pickupLineWeek', (err, res) => {
      if (!err, res) {
        this.setState({
          pickupline: res.text,
          isOpen: value,
        });
      }
    });
  }

  async _loadBranch() {
    branchUniversalObject = await branch.createBranchUniversalObject(
      'content/12345', // canonical identifier
      {
        title: I18n.t('app.components.game.PickupLinePopUp.loadBranchTitle'),
        contentImageUrl: 'http://www.playfmk.com/images/preview.png',
        contentDescription: I18n.t('app.components.game.PickupLinePopUp.loadBranchDesc'),
        metadata: {
          user_id: Meteor.user()._id,
        }
      }
    )

    let urlObject ={
      title: I18n.t('app.components.game.PickupLinePopUp.urlObject'),
      message: I18n.t('app.components.game.PickupLinePopUp.urlObject'),
      subject: I18n.t('app.components.game.PickupLinePopUp.urlObject'),
      url: this.state.image,
    }

    //let {channel, completed, error} = await branchUniversalObject.showShareSheet(branchUniversalObject, linkProperties, controlParams)
    Share.open(urlObject);
  }


  _shareLink() {
    //this.refs['shareApp'].onOpen(true);
    trackEvent('Pickupline', 'Click_Share');
    RNViewShot.takeSnapshot(this.refs['pickuplineShare'], {
      width: 350,
      height: 550,
      format: "jpeg",
      quality: 0.5,
      result: "base64",
    }).then(
      uri => { this.setState({ image: 'data:image/jpeg;base64,' + uri }, () => { this.emitter.emit('shareInviteLinkPickup'); }) },
      error => { alert(error); }
    );
  }

  render() {
    const shareWidth = 350;
    const shareHeight = 550;
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
            colors={['rgba(0,75,181,0.8)', 'rgba(0,203,179,1)']}>
            <View style={{ flex: 1, alignItems:'center', justifyContent:'center' }}>
              <View style={{ marginTop: 50, marginLeft:20, marginRight:20, alignItems:'center', justifyContent:'center'}}>
                <Text style={{ width: WIDTH - 100, fontFamily: 'Selima', fontSize: 60, textAlign: 'center', color: '#fff' }}>{I18n.t('app.components.game.PickupLinePopUp.pickUpLine')}</Text>
                <View style={{ marginTop: 30, marginBottom: 30, width: WIDTH / 2, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.65)' }}/>
                <View style={{ marginBottom: 20, alignItems:'center', justifyContent:'center' }} >
                  <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 20, textAlign: 'center', marginBottom: 60 }}>{`"${this.state.pickupline}"`}</Text>
                  <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 15, textAlign: 'center' }}>{I18n.t('app.components.game.PickupLinePopUp.shareIfYouSmiled')}</Text>
                </View>
                <TouchableOpacity style={[styles.popUpButton, { width: WIDTH / 2, backgroundColor: '#0D47A1', borderRadius: 50, borderColor: 'transparent' }]} onPress={ ()=> { this._shareLink() }}>
                  <Text style={{ fontFamily: 'Selima', color: '#fff', backgroundColor: 'transparent', fontSize: 45 }}>
                  {I18n.t('app.components.game.PickupLinePopUp.share')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.popUpButton, {marginTop:10, borderColor: 'transparent'}]} onPress={() => {this.setState({isOpen: false}); trackEvent('Pickupline', 'Click_Close');}} >
                  <Text style={{ fontFamily: 'Montserrat-Light', color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 14, textDecorationLine: 'underline' }}>{I18n.t('app.components.game.PickupLinePopUp.laugh')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View ref={'pickuplineShare'} collapsable={false} style={{position:'absolute', left:-10000, height: shareHeight, width: shareWidth }} >
            {/* <View ref={'pickuplineShare'} collapsable={false} style={{height: shareHeight, width: shareWidth }} > */}
              <LinearGradient
                style={[styles.swipePageContainer, {width: shareWidth, height: shareHeight}]}
                colors={['rgba(0,75,181,0.8)', 'rgba(0,203,179,1)']}>
                <View style={{ alignItems:'center', justifyContent:'center' }}>
                  <View style={{ flex: 1, marginTop: 50, marginLeft:20, marginRight:20, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{ width: shareWidth - 100, fontFamily: 'Selima', fontSize: 60, textAlign: 'center', color: '#fff' }}>{I18n.t('app.components.game.PickupLinePopUp.pickUpLine')}</Text>
                    <View style={{ marginTop: 20, marginBottom: 20, width: shareWidth / 2, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.65)' }}/>
                    <View style={{ marginBottom: 20, alignItems:'center', justifyContent:'center' }} >
                      <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 20, textAlign: 'center', marginBottom: 60 }}>{`"${this.state.pickupline}"`}</Text>
                    </View>
                    <View style={{ backgroundColor: '#fff', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', width: WIDTH, paddingBottom: 20, paddingTop: 20 }}>
                      <View style={{ alignItems: 'center' }}>
                        <GameTagIcon name='fuck' color="#3e3e3e" style={{ fontSize: 25, backgroundColor: 'transparent' }} />
                        <GameTagIcon name='marry' color="#3e3e3e" style={{ fontSize: 25, backgroundColor: 'transparent' }} />
                        <GameTagIcon name='kill' color="#3e3e3e" style={{ fontSize: 25, backgroundColor: 'transparent' }} />
                      </View>
                      <View>
                        <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#3e3e3e', backgroundColor: 'transparent', fontSize: 14, textAlign: 'center', marginBottom: 5 }}>{I18n.t('app.components.game.PickupLinePopUp.playOn')}</Text>
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
