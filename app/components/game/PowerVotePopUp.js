import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import Meteor from '@meteorrn/core';
import Modal from 'react-native-modal';
import GameTagIcon from '../../font/customIcon';
import LinearGradient from 'react-native-linear-gradient';
import { Actions, ActionConst } from 'react-native-router-flux';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height - StatusBar.currentHeight;

export default class PowerVotePopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      renderSkip: Meteor.user().profile.gender == 'female',
      fuckAvailable: false,
      marryAvailable: false,
      killAvailable: false,
      fuckLeft: -1,
      marryLeft: -1,
      killLeft: -1,
      available: 0,
    };
  }

  openPopUp(value) {
    this.setState({ isOpen: value });
    trackScreen('Power_Vote_Screen');
  }

  componentWillMount() {
    this.downloadPowerVoteCount();
  }

  downloadPowerVoteCount() {
    Meteor.call('availablePowerVotes', Meteor.user()._id, (err, result) => {
      if (result && !err) {
        // this.setState({
        //   fuckAvailable: result.fuckAvailable,
        //   marryAvailable: result.marryAvailable,
        //   killAvailable: result.killAvailable,
        //   fuckLeft: result.fuckLeft,
        //   marryLeft: result.marryLeft,
        //   killLeft: result.killLeft
        // })
        this.setState({
          available: result.available,
        });
      }
    });
  }

  closeModal() {
    trackEvent('PowerVotePopUp', 'Close');
    this.setState({ isOpen: false });
  }

  render() {
    var alpha = [
      this.state.available > 0 ? 'FF' : '33',
      this.state.available > 0 ? 'FF' : '33',
      this.state.available > 0 ? 'FF' : '33',
      'FF',
    ];
    let skipsLeft;
    if (this.props.mainPage && this.props.mainPage.refs['gameView']) {
      skipsLeft = this.props.mainPage.refs['gameView'].state.skipsLeft;
    } else {
      skipsLeft = -1;
    }

    return (
      <TouchableWithoutFeedback
        style={{
          top: 0,
          left: 0,
          position: 'absolute',
          width: WIDTH,
          height: HEIGHT,
        }}
      >
        <Modal
          onDismiss={() => {
            this.setState({ isOpen: false });
          }}
          offset={0}
          hideCloseButton={false}
          backdropType="blur"
          isVisible={this.state.isOpen}
          style={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}
        >
          <View
            style={{
              left: WIDTH * 0.1,
              width: WIDTH * 0.8,
              height: 80 * 4,
              backgroundColor: 'transparent',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LinearGradient
              style={{ marginBottom: 10 }}
              colors={['#f74786' + alpha[0], '#f88956' + alpha[0]]}
              start={{ x: 0.0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (!this.state.available) {
                    setTimeout(() => {
                      this.props.mainPage.showPowerVoteModal(true);
                    }, 500);
                    this.setState({ isOpen: false });
                  } else {
                    this.props.mainPage.ref_gameView.current._skip('fuck');
                    this.setState({ isOpen: false });
                  }
                }}
                style={{
                  width: WIDTH * 0.8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 70,
                  paddingTop: 5,
                  paddingBottom: 5,
                  backgroundColor: 'transparent',
                }}
              >
                <Text
                  style={{
                    color: '#eee',
                    fontSize: 30,
                    backgroundColor: 'transparent',
                  }}
                >
                  <Text style={{ fontFamily: 'Montserrat-Bold' }}>
                    {I18n.t('app.components.game.PowerVotePopUp.fck')}{' '}
                  </Text>
                  <Text
                    style={{ fontSize: 16, fontFamily: 'Montserrat-Light' }}
                  >
                    {I18n.t('app.components.game.PowerVotePopUp.all')}
                  </Text>
                </Text>
                {/* {(this.state.fuckAvailable && this.state.fuckLeft != -1) && <Text style={{ color:"#eee", fontSize: 12, marginLeft: 10, backgroundColor: 'transparent', fontFamily: 'Montserrat-Light' }}>LEFT: {this.state.fuckLeft}</Text>} */}
                {!this.state.available && (
                  <Text
                    style={{
                      color: '#eee',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: 'transparent',
                      fontFamily: 'Montserrat-Light',
                    }}
                  >
                    {I18n.t('app.components.game.PowerVotePopUp.tap')}
                  </Text>
                )}
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
              style={{ marginBottom: 10 }}
              colors={['#5797c2' + alpha[1], '#be29bc' + alpha[1]]}
              start={{ x: 0.0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (!this.state.available) {
                    setTimeout(() => {
                      this.props.mainPage.showPowerVoteModal(true);
                    }, 500);
                    this.setState({ isOpen: false });
                  } else {
                    this.props.mainPage.ref_gameView.current._skip('marry');
                    this.setState({ isOpen: false });
                  }
                }}
                style={{
                  width: WIDTH * 0.8,
                  height: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 5,
                  paddingBottom: 5,
                  backgroundColor: 'transparent',
                }}
              >
                <Text
                  style={{
                    color: '#eee',
                    fontSize: 30,
                    backgroundColor: 'transparent',
                  }}
                >
                  <Text style={{ fontFamily: 'Montserrat-Bold' }}>
                    {I18n.t('app.components.game.PowerVotePopUp.marry')}{' '}
                  </Text>
                  <Text
                    style={{ fontSize: 16, fontFamily: 'Montserrat-Light' }}
                  >
                    {I18n.t('app.components.game.PowerVotePopUp.all')}
                  </Text>
                </Text>
                {/* {(this.state.marryAvailable && this.state.marryLeft != -1) && <Text style={{ color:"#eee", fontSize: 12, marginLeft: 10, backgroundColor: 'transparent', fontFamily: 'Montserrat-Light' }}>LEFT: {this.state.marryLeft}</Text>} */}
                {!this.state.available && (
                  <TouchableOpacity>
                    <Text
                      style={{
                        color: '#eee',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: 'transparent',
                        fontFamily: 'Montserrat-Light',
                      }}
                    >
                      {I18n.t('app.components.game.PowerVotePopUp.tap')}
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
              style={{ marginBottom: 10 }}
              colors={['#00cbb3' + alpha[2], '#004bb5' + alpha[2]]}
              start={{ x: 0.0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (!this.state.available) {
                    setTimeout(() => {
                      this.props.mainPage.showPowerVoteModal(true);
                    }, 500);
                    this.setState({ isOpen: false });
                  } else {
                    this.props.mainPage.ref_gameView.current._skip('kill');
                    this.setState({ isOpen: false });
                  }
                }}
                style={{
                  width: WIDTH * 0.8,
                  height: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 5,
                  paddingBottom: 5,
                  backgroundColor: 'transparent',
                }}
              >
                <Text
                  style={{
                    color: '#eee',
                    fontSize: 30,
                    backgroundColor: 'transparent',
                  }}
                >
                  <Text style={{ fontFamily: 'Montserrat-Bold' }}>
                    {I18n.t('app.components.game.PowerVotePopUp.kill')}{' '}
                  </Text>
                  <Text
                    style={{ fontSize: 16, fontFamily: 'Montserrat-Light' }}
                  >
                    {I18n.t('app.components.game.PowerVotePopUp.all')}
                  </Text>
                </Text>
                {/* {(this.state.killAvailable && this.state.killLeft != -1) && <Text style={{ color:"#eee", fontSize: 12, marginLeft: 10, backgroundColor: 'transparent', fontFamily: 'Montserrat-Light' }}>LEFT: {this.state.killLeft}</Text>} */}
                {!this.state.available && (
                  <TouchableOpacity>
                    <Text
                      style={{
                        color: '#eee',
                        fontSize: 12,
                        marginLeft: 10,
                        backgroundColor: 'transparent',
                        fontFamily: 'Montserrat-Light',
                      }}
                    >
                      {I18n.t('app.components.game.PowerVotePopUp.tap')}
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </LinearGradient>

            {this.state.renderSkip && (
              <TouchableOpacity
                onPress={() => {
                  this.props.mainPage.ref_gameView.current._skip();
                  this.setState({ isOpen: false });
                }}
                style={{
                  width: WIDTH * 0.8,
                  height: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 5,
                  paddingBottom: 5,
                  backgroundColor: '#777777' + alpha[3],
                }}
              >
                <Text
                  style={{
                    color: '#eee',
                    fontSize: 30,
                    backgroundColor: 'transparent',
                  }}
                >
                  <Text style={{ fontFamily: 'Montserrat-Bold' }}>
                    {I18n.t('app.components.game.PowerVotePopUp.skip')}{' '}
                  </Text>
                  <Text
                    style={{ fontSize: 16, fontFamily: 'Montserrat-Light' }}
                  >
                    {I18n.t('app.components.game.PowerVotePopUp.all')}
                  </Text>
                </Text>
                {skipsLeft != -1 && (
                  <Text
                    style={{
                      color: '#eee',
                      fontSize: 12,
                      marginLeft: 10,
                      backgroundColor: 'transparent',
                      fontFamily: 'Montserrat-Light',
                    }}
                  >
                    {I18n.t('app.components.game.PowerVotePopUp.left')}{' '}
                    {skipsLeft}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}
