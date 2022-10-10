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

export default class FreeBoostWoman extends Component {
  constructor(props) {
    super(props);
    const type = Meteor.user().profile.notify_streak || 'fuck';
    this.state = {
      isOpen: false,
      image: null,
      type: type,
    };
  }

  openPopUp(value) {
    this.setState({ isOpen: value });
  }

  freeBoost() {
    trackEvent('FreeBoostWomanPopUp', 'Get');
  }

  render() {
    const colors = ['#5797c2', '#004bb5'];
    const buttonColor = '#1270B7';
    return (
      <TouchableWithoutFeedback
        style={{ top: 0, left: 0, position: 'absolute' }}
      >
        <Modal
          onModalHide={() => {
            this.setState({ isOpen: false });
          }}
          offset={0}
          hideCloseButton={false}
          backdropType="blur"
          isVisible={this.state.isOpen}
          style={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}
        >
          <LinearGradient
            style={[
              styles.swipePageContainer,
              { width: WIDTH, height: HEIGHT },
            ]}
            colors={colors}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  // backgroundColor: 'red',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    marginBottom: 20,
                    fontFamily: 'Selima',
                    fontSize: 60,
                    textAlign: 'center',
                    color: '#fff',
                  }}
                >
                  Free Boost
                </Text>
                <View
                  style={{
                    marginBottom: 50,
                    marginTop: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={{
                      uri:
                        'https://fmk-images.ams3.digitaloceanspaces.com/defaults/boost_woman_5.png',
                    }}
                    style={{ height: 150, width: 150, borderRadius: 150 }}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Light',
                    color: 'white',
                    fontSize: 18,
                    textAlign: 'center',
                    width: WIDTH * 0.7,
                    marginBottom: 40,
                  }}
                >
                  {I18n.t('app.components.game.WhoVotedFreePopUp.boostDescription')}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    {
                      width: WIDTH / 1.5,
                      height: 75,
                      backgroundColor: 'white',
                      borderRadius: 50,
                      borderColor: 'transparent',
                      elevation: 6,
                    },
                  ]}
                  onPress={() => {
                    this.setState({ isOpen: false });
                    this.freeBoost();
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Selima',
                      color: buttonColor,
                      backgroundColor: 'transparent',
                      fontSize: 50,
                    }}
                  >
                    {I18n.t('app.components.game.WhoVotedFreePopUp.getIt')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}
