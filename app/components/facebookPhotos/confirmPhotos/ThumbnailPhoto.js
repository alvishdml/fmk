import React, { Component } from 'react';
import I18n from '../../../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  PanResponder,
  Animated,
  TextInput,
  Keyboard,
  Image,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import styles from '../../../styles/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Meteor from '@meteorrn/core';
import { trackEvent } from '../../../utilities/Analytics';

let key = 0;

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class ThumbnailPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstTime: this.props.firstTime,
      key: 0,
    };
  }

  /**
   * Method that chnages the atual photo displayed in the imageCropper in ConfirmPhoto Render
   */
  _OnPressPhoto() {
    trackEvent('Edit_Profile', 'Change_Main_Photo');
    this.props.changePicture(this.props.atual, this.props.chave);
  }

  /**
   * Method to render the photo thumbnail with the delete icon.
   */
  renderThumbNail() {
    if (!this.props.firstTime && this.props.size > 1) {
      return (
        <View key={key++} style={styles.singlePhotoContainer}>
          <View
            style={
              this.props.chave == this.props.mainPicIndex
                ? styles.photoSlideSinglePicSelected
                : styles.photoSlideSinglePic
            }
          >
            <TouchableOpacity
              onPress={() => {
                this._OnPressPhoto();
              }}
            >
              <Image
                source={{ uri: this.props.atual }}
                style={{
                  height: (Dimensions.get('window').height - 40) / 11,
                  width: Dimensions.get('window').width / 7,
                }}
              />
            </TouchableOpacity>
            {(this.props.chave == this.props.mainPicIndex && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  bottom: -12,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: WIDTH * 0.025,
                  }}
                >
                  {I18n.t(
                    'app.components.facebookPhotos.confirmPhotos.ThumbnailPhoto.profile'
                  ).toUpperCase()}
                </Text>
              </View>
            )) ||
              null}
          </View>

          <View style={styles.singlePhotoContainer}>
            <Icon
              name={'highlight-off'}
              size={30}
              color={'gray'}
              onPress={() => {
                this.props.deletePhoto(this.props.atual, this.props.chave);
              }}
            />
          </View>
        </View>
      );
    } else if (this.props.size == 1) {
      return (
        <View key={key++} style={styles.photoSlideSinglePic}>
          <View style={styles.photoSlideSinglePicSelected}>
            <TouchableOpacity
              onPress={() => {
                this._OnPressPhoto();
              }}
            >
              <Image
                source={{ uri: this.props.atual }}
                style={{
                  height: (Dimensions.get('window').height - 40) / 11,
                  width: Dimensions.get('window').width / 7,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                justifyContent: 'center',
                alignItems: 'center',
                bottom: -12,
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: WIDTH * 0.025,
                }}
              >
                {I18n.t(
                  'app.components.facebookPhotos.confirmPhotos.ThumbnailPhoto.profile'
                ).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      );
    }
  }

  render() {
    let thumbnail = this.renderThumbNail();
    return <View>{thumbnail}</View>;
  }
}
