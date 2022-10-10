import React, { Component } from 'react';
import I18n from '../../../../config/i18n';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import styles from '../../../styles/styles';
import FBPhotoHeader from '../FBPhotoHeader';
import PhotoComponent from '../PhotoComponent';
import Meteor from '@meteorrn/core';
import ListView from 'deprecated-react-native-listview';
const FBSDK = require('react-native-fbsdk-next');
const {
  GraphRequest,
  GraphRequestManager,
  AccessToken
} = FBSDK;

let width = Dimensions.get('window').width;
let key = 0;

export default class InstagramAlbumPhotoPage extends Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      fetching: false,
      isLoading: true,
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
      hasPhotos: false,
      nextUrl: '',
      data: null,
    }
    this.morePics = this.morePics.bind(this);
    this.fetchMorePics = this.fetchMorePics.bind(this);
  }

  componentDidMount() {
    this.getPhotos(this.props.idAlbum);
  }

  getPhotos() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    Meteor.call('getInstagramToken', Meteor.user()._id, (err, result) => {
     Meteor.call('getInstagramPhotos', result, (err2, result2) => {

        if (result2.data.data.length > 0) {
          this.setState({
            isLoading: false,
            dataSource: ds.cloneWithRows(result2.data.data),
            hasPhotos: true,
            nextUrl: result2.data.pagination.next_url,
            data: result2.data.data,
          });
        } else {
          this.setState({
            isLoading: false,
          });
        }
      });
    });
  }

  renderRow(rowData) {
    return (
      <View style={[styles.item, { alignItems: 'center' }]}>
      <PhotoComponent instagram={true} idPhoto={rowData.id} name={rowData.name} url={rowData.images.standard_resolution.url} profile={this.props.profile} addPhoto={this.props.addPhoto.bind(this)} />
      </View>
    );
  }

  morePics(){
    Meteor.call('getNext20', this.state.nextUrl, (err, result) => {
      let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
      let current = [];
      current = this.state.data;

      for(var i = 0; i < result.data.data.length; i++){
        current.push(result.data.data[i]);
      }

      this.setState({
        isLoading: false,
        dataSource: ds.cloneWithRows(current),
        hasPhotos: true,
        nextUrl: result.data.pagination.next_url,
        data: current,
        fetching: false,
      });
    });
  }

  fetchMorePics() {
    if(this.state.nextUrl && !this.state.fetching){
      this.setState({ fetching: true }, this.morePics);
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
        <FBPhotoHeader titulo={'Photos'} />
        <View style={[styles.loadingPageFix, { height: 480, backgroundColor: '#fff' }]}>
        <ActivityIndicator
        animating={true}
        color={'#aeb7b7'}
        style={{ transform: [{ scale: 1.8 }] }}
        size="large"
        />
        </View>
        </View>
      );
    } else {
      if (this.state.hasPhotos) {
        return (
          <View style={[styles.container2, { backgroundColor: '#fff' }]}>
          <FBPhotoHeader titulo={'Photos'} />
          <ListView
          contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          onEndReached={this.fetchMorePics}
          />
          {/*

          */}
          </View>
        );
      } else {
        return (
          <View style={{ flex: 1 }}>
          <FBPhotoHeader titulo={'Photos'} />
          <View style={[styles.loadingPageFix, { flex: 1, backgroundColor: '#fff' }]}>
          <Text style={{ color: '#aeb7b7', fontSize: 25, fontFamily: 'Montserrat-Bold' }}>
          {I18n.t('app.components.facebookPhotos.InstagramPhotos.InstagramAlbumPhotoPage.noPhotos')}
          </Text>
          <Text style={{ color: '#aeb7b7', fontSize: 25, fontFamily: 'Montserrat-Bold' }}>
          {I18n.t('app.components.facebookPhotos.InstagramPhotos.InstagramAlbumPhotoPage.onInstagram')}
          </Text>
          </View>
          </View>
        );
      }
    }
  }
}
