import React, { Component } from 'react';
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
import ThumbnailPhoto from './ThumbnailPhoto';
import { InstagramLoginButton } from '../../login/InstagramLogin';
import { trackEvent } from '../../../utilities/Analytics';
import I18n from '../../../../config/i18n';

const WIDTH = Dimensions.get('window').width;

let key = 200;

export default class PhotoSlide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photosUri: [],
      firstTime: this.props.firstTime,
    };
  }

  /**
   * Method to get an array of photos from the server
   */
  getPhotos() {
    Meteor.call('getUserPhotos', Meteor.user()._id, (err, result) => {
      if (!err) {
        this.setState({
          photosUri: result.array,
        });
      }
    });
  }

  /**
   * Method used to make the slider update the pictures on mounting.
   */
  componentDidMount() {
    this.getPhotos();
  }

  /**
   * Method to add a photo to the array of photos that it will be display in the slider.
   * This Method is send to FaceBookAlbumList, then AlbumPhotosPage e finaly reaches PhotoComponent that will use the method.
   * @param {*} photo
   */
  addPhoto(photo) {
    Meteor.call('addPhotoToArray', Meteor.user()._id, photo, (err, res) => {
      if (!err) {
        trackEvent('Edit_Profile', 'Add_photo_sucess');
        this.getPhotos();
      }
    });
  }

  /**
   * Method to delete a photo from the array of photos.
   * @param {*Photo we want to delete} photo
   */
  deletePhoto(photo, photoIndex) {
    //This will be used to get the index of the current picture we want to delete
    //After we have the index we will check if its the profile pic, in case the pic to delete its the profile we are going to
    //change to show another picture in the array....
    if (photoIndex == this.props.mainPicIndex) {
      let newIndex;
      if (photoIndex > 0) {
        newIndex = photoIndex - 1;
        this.props.changePicture(this.state.photosUri[newIndex], newIndex);
        Meteor.call('deletePhotoFromArray', Meteor.user()._id, photo, newIndex);
      } else {
        newIndex = photoIndex + 1;
        this.props.changePicture(this.state.photosUri[newIndex], photoIndex);
        Meteor.call(
          'deletePhotoFromArray',
          Meteor.user()._id,
          photo,
          photoIndex
        );
      }
    } else if (photoIndex < this.props.mainPicIndex) {
      this.props.changePicture(
        this.state.photosUri[this.props.mainPicIndex],
        this.props.mainPicIndex - 1
      );
      Meteor.call(
        'deletePhotoFromArray',
        Meteor.user()._id,
        photo,
        this.props.mainPicIndex - 1
      );
    } else {
      Meteor.call(
        'deletePhotoFromArray',
        Meteor.user()._id,
        photo,
        this.props.mainPicIndex
      );
    }

    trackEvent('Edit_Profile', 'Remove_Photo');
    this.getPhotos(); //Get the new actual pictures in the array
  }

  /**
   * Method to render all the photos
   */
  renderPhotos() {
    let photos = [];
    var photosLength = this.state.photosUri.length;

    //This for will go throught the array of photos and add them to the the slider
    for (var i = 0; i < photosLength; i++) {
      let atual = this.state.photosUri[i];

      if (i === 0 && photosLength < 4) {
        photos.push(
          <View
            key={key++}
            style={
              this.state.firstTime
                ? styles.photoSlideSAddStyleFirstTime
                : styles.photoSlideSAddStyle
            }
          >
            <TouchableOpacity
              style={{
                borderWidth: 0,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                borderColor: '#aeb7b7',
                height: (Dimensions.get('window').height - 40) / 14,
                width: Dimensions.get('window').width / 7,
                borderRadius: (Dimensions.get('window').height - 40) / 11,
              }}
              onPress={() => {
                trackEvent('Edit_Profile', 'click_add_photo');
                Keyboard.dismiss();
                Actions.facebookPhotos({
                  profile: this.props.profile,
                  photoList: this.addPhoto.bind(this),
                });
              }}
            >
              <View
                style={{
                  borderWidth: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  borderColor: 'transparent',
                  borderBottomWidth: 12,
                  height: (Dimensions.get('window').height - 40) / 11,
                  width: Dimensions.get('window').width / 7,
                }}
              >
                {/* {this.state.firstTime && (
                  <Text>Click to add your first profile picture!</Text>
                )} */}
                <Icon
                  style={{
                    margin: 0,
                    padding: 0,
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 12,
                  }}
                  name={'add'}
                  size={40}
                  color={'gray'}
                />
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
                      color: '#aeb7b7',
                      fontWeight: 'bold',
                      fontSize: WIDTH * 0.025,
                    }}
                  >
                    {I18n.t(
                      'app.components.facebookPhotos.confirmPhotos.ThumbnailPhoto.add'
                    ).toUpperCase()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.singlePhotoContainer} />
          </View>
        );
      }

      if (!this.state.firstTime) {
        photos.push(
          <ThumbnailPhoto
            mainPicIndex={this.props.mainPicIndex}
            firstTime={this.state.firstTime}
            size={photosLength}
            key={i}
            chave={i}
            deletePhoto={this.deletePhoto.bind(this)}
            atual={atual}
            changePicture={this.props.changePicture.bind(this)}
          />
        );
      }

      // if (photosLength < 4 && i == photosLength - 1) {
      //   //i == photosLength -1 because then the add icon will always be the last
      //   photos.push(
      //     <View
      //       key={key++}
      //       style={
      //         this.state.firstTime
      //           ? styles.photoSlideSAddStyleFirstTime
      //           : styles.photoSlideSAddStyle
      //       }
      //     >
      //       <TouchableOpacity
      //         onPress={() => {
      //           trackEvent('Edit_Profile', 'click_add_photo');
      //           Keyboard.dismiss();
      //           Actions.facebookPhotos({
      //             profile: this.props.profile,
      //             photoList: this.addPhoto.bind(this),
      //           });
      //         }}
      //       >
      //         {this.state.firstTime && (
      //           <Text>Click to add your first profile picture!</Text>
      //         )}
      //         <Icon name={'add'} size={55} color={'#aeb7b7'} />
      //       </TouchableOpacity>
      //       <View style={styles.singlePhotoContainer} />
      //     </View>
      //   );
      // }
      if (i == photosLength - 1) {
        photos.push(
          <View
            style={{
              marginLeft: 10,
              marginTop: -80,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <InstagramLoginButton confirmPhoto={true} />
          </View>
        );
      }
    }

    return photos;
  }

  render() {
    let photosCollection = this.renderPhotos();
    return <View style={styles.photoSlide}>{photosCollection}</View>;
  }
}
