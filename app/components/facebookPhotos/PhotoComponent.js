import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Image,
  TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Meteor from '@meteorrn/core';
import styles from '../../styles/styles';
import Alert from '../../utilities/Alert';

const FBSDK = require('react-native-fbsdk-next');
const {
  GraphRequest,
  GraphRequestManager,
  AccessToken
} = FBSDK;

export default class PhotoComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      photo: { uri: 'https://heatherchristenaschmidt.files.wordpress.com/2011/09/facebook_no_profile_pic2-jpg.gif' },
    }
  }

  componentDidMount() {
    this.getPhotos(this.props.idPhoto);
  }

  getPhotos(idPhoto) {
    if(this.props.instagram){
      this.setState({
        photo: {uri: this.props.url}
      });
    } else {
      AccessToken.getCurrentAccessToken().then(
        (res) => {
          if (res) {
            token = res;
            const responseCallback = ((error, result) => {
              if (error) {
                //console.log(error);
              } else {
                this.setState({
                  photo: { uri: result.data.url },
                  is_silhouette: result.data.is_silhouette
                });
              }
            });

            const profileRequest = new GraphRequest(
              `/${idPhoto}/picture?width=9999&redirect=false`,
              null,
              responseCallback,
            );

            // Start the graph request.
            new GraphRequestManager().addRequest(profileRequest).start();
          }
        }
      );
    }
  }

  facebookPhoto() {
    if (this.state.is_silhouette) {
      Alert.showAlert('', I18n.t('app.components.facebookPhotos.PhotoComponent.defaultPicture'), '');
    } else {
      this.props.addPhoto(this.state.photo);
      Actions.confirmPhoto({urlPhoto: this.state.photo.uri, profile: this.props.profile, toPop: 3, new_photo: true });
    }
  }

  render() {
    let name = I18n.t('app.components.facebookPhotos.PhotoComponent.name');
    if (this.props.name) {
      name = this.props.name;
    }
    return (
      <TouchableOpacity style={[styles.item]} onPress={this.facebookPhoto.bind(this) }>
      <Image source={this.state.photo} resizeMode="contain" style={{ flex: 1 }}/>
      </TouchableOpacity>


    );
  }
}
