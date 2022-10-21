import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
  InteractionManager,
  TouchableOpacity,
  BackAndroid,
} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import Meteor from '@meteorrn/core';
import Modal from 'react-native-modal';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Location from '../../utilities/Location';
import Alert from '../../utilities/Alert';
import InAppBilling from 'react-native-billing';
import Swiper from 'react-native-swiper';
import firebase from '../../utilities/Firebase';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const FBSDK = require('react-native-fbsdk-next');
const {
  GraphRequest,
  GraphRequestManager,
  AccessToken
} = FBSDK;
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BD = require('../../utilities/DAAsyncStorage');
const myBD = new BD();

export default class PreviewLayer extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      isOpen: false,
      isLoading: true,
      renderPlaceholderOnly: true,
      image: '',
      name: '',
      age: '',
      id: '',
      mutualFriends: [],
      mutualFriendsPhoto: [],
      about: '',
      mainPage: '',
      schoolRank: 1,
      photoArray: [],
      index: 0,
    }
    this.loadUser = this.loadUser.bind(this);
    this.sendWink = this.sendWink.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
    });
  }

  toggleModal(willOpen, id, mainPage, user) {
    var fromWhere = mainPage.props.name;
    if (willOpen) {
      this.getPhotos(id);
      Meteor.call('purchasedItems', Meteor.user()._id, (err, result) => {
        if (!err) {
          this.setState({ purchased: result })
        }
      })
      trackScreen('Profile_Details_Screen');
      if (user) {
        let urlPicture = user.profile.picture;
        if (user.profile.custom_picture) {
          urlPicture = user.profile.custom_picture;
        }
        this.setState({
          isOpen: true,
          isLoading: false,
          id: id,
          mainPage: mainPage,
          image: {uri: urlPicture},
          name: user.profile.first_name || user.profile.user_name,
          age: user.profile.birthday,
          mutualFriends: [],
          about: user.profile.about,
          mutualFriendsPhoto: [],
          school: user.profile.school,
          fromWhere: fromWhere,
          vip: user.profile.vip,
        });

        let newUser = user;
        Meteor.call('getFacebookID', id, (err, result) => {
          if (!err) {
            getFriends(this, result, newUser.profile);
          }
        });

        if (this.state.school && this.state.school.length === undefined) {
          Meteor.call('getUniSingleRank', this.state.school.name, (err, res) => {
            if (!err && res && res.rank) {
              this.setState({ schoolRank: res.rank })
            }

          })
        }

      } else {
        Meteor.call('userProfile', id, (err, result) => {
          if (result) {
            let urlPicture = result.picture;

            if (result.custom_picture) {
              urlPicture = result.custom_picture;
            }

            var distanceString = "";
            if (result.pos) {
              distanceString = getDistance(result.pos)
            }

            this.setState({
              isOpen: true,
              isLoading: false,
              id: id,
              mainPage: mainPage,
              image: { uri: urlPicture },
              name: result.first_name,
              age: result.birthday,
              mutualFriends: [],
              about: result.about,
              mutualFriendsPhoto: [],
              distance: distanceString,
              school: result.school,
              fromWhere: fromWhere,
              vip: result.vip
            });

            let newUser = result;
            Meteor.call('getFacebookID', id, (err, result) => {
              if (!err) {
                getFriends(this, result, newUser);
              }
            });


            if (this.state.school && this.state.school.length === undefined) {
              Meteor.call('getUniSingleRank', this.state.school.name, (err, res) => {
                if (!err && res.rank) {
                  this.setState({ schoolRank: res.rank })
                }
              })
            }
          }
        });
      }
    } else {
      this.setState({ isOpen: false, id: id, mainPage: mainPage });
    }
  }

  closeModal() {
    this.setState({ isOpen: false });
  }


  renderAge() {
    if (!this.state.age || this.state.age == 'null') {
      return null;
    } else {
      let idade = getAge(this.state.age);
      return (
        <Text>
          {" - " + idade}
        </Text>
      );
    }
  }

  renderLoading() {
    return (
      <View style={[styles.loadingPage, { flex: 1, height: (HEIGHT - 150), backgroundColor: '#fff' }]}>
        <ActivityIndicator
          animating={true}
          color={'#424949'}
          style={{ transform: [{ scale: 1.8 }] }}
          size="large"
          />
      </View>
    );
  }

  report() {
    Alert.showAlert('REPORT USER', I18n.t('app.components.game.PreviewLayer.reportUser'), 'reportPic', this.state.id, null, this.state.mainPage.refs['gameView']);
  }

  async sendWink() {
    await InAppBilling.close();
    try {
      await InAppBilling.open();
      var ownedProducts = await InAppBilling.listOwnedProducts();
    } catch (err) {
      console.log(err);
    } finally {
      await InAppBilling.close();

      if (
        this.state.purchased &&
        this.state.purchased['winks']
      ) {

        Meteor.call('sendWink', Meteor.user()._id, this.state.id, async (err, result) => {
          if (!err) {
            trackEvent('User_Profile_Detail', 'Click_Send_Wink');
            this.closeModal();

            var updatedPurchased = this.state.purchased;
            updatedPurchased['winks'].quantity = result.quantity

            if (this.state.fromWhere == "mainPage") {
              Alert.showAlert('', I18n.t('app.components.game.PreviewLayer.wink0') + this.state.name + I18n.t('app.components.game.PreviewLayer.wink1'), 'newWinkMain', null, null, this.state.mainPage);
              if (this.state.mainPage.refs['gameView']) {
                this.state.mainPage.refs['gameView'].reset()
              }
            } else {
              Alert.showAlert('', I18n.t('app.components.game.PreviewLayer.wink0') + this.state.name + I18n.t('app.components.game.PreviewLayer.wink1'), 'newWinkWhoVoted');
            }
            this.setState({ purchased: updatedPurchased })
            if (result.quantity == 0) {
              // The user ran out of credits, delete the product from his account on the store
              await InAppBilling.close();
              try {
                await InAppBilling.open();
                await InAppBilling.consumePurchase(result.productid);
              } catch (err) {
                console.log(err);
              } finally {
                await InAppBilling.close();
              }
            }
          } else {
            if (err.error == 8002) {
              if (this.state.fromWhere == "mainPage") {
                Alert.showAlert('', err.details, 'noMoreWinks', null, null, this.state.mainPage);
              } else {
                Alert.showAlert('', err.details, 'noMoreWinks')
              }
            } else if (err.error == 8003) {
              trackEvent('User_Profile_Detail', 'Wink_Already_Sent');
              Alert.showAlert('', err.details);
            }
          }
        })
      } else {
        if (this.state.purchased) {
          if (this.state.purchased['winks']) {
            if (this.state.fromWhere == "mainPage") {
              Alert.showAlert('', I18n.t('app.components.game.PreviewLayer.runOutWinks'), 'noMoreWinks', null, null, this.state.mainPage);
            } else {
              Alert.showAlert('', I18n.t('app.components.game.PreviewLayer.runOutWinks'), 'noMoreWinks')
            }
          } else {
            trackEvent('User_Profile_Detail', 'First_Time_Winks');
            if (this.state.fromWhere == "mainPage") {
              Alert.showAlert(I18n.t('app.components.game.PreviewLayer.firstTimeWink0'), I18n.t('app.components.game.PreviewLayer.firstTimeWink1'), 'firstTimeWinks', null, null, this.state.mainPage);
            } else {
              Alert.showAlert(I18n.t('app.components.game.PreviewLayer.firstTimeWink0'), I18n.t('app.components.game.PreviewLayer.firstTimeWink1'), 'firstTimeWinks');
            }
          }
        } else {
          trackEvent('User_Profile_Detail', 'First_Time_Winks');
          if (this.state.fromWhere == "mainPage") {
            Alert.showAlert(I18n.t('app.components.game.PreviewLayer.firstTimeWink0'), I18n.t('app.components.game.PreviewLayer.firstTimeWink1'), 'firstTimeWinks', null, null, this.state.mainPage);
          } else {
            Alert.showAlert(I18n.t('app.components.game.PreviewLayer.firstTimeWink0'), I18n.t('app.components.game.PreviewLayer.firstTimeWink1'), 'firstTimeWinks');
          }
        }

      }
    }
  }


  loadUser() {
    // Calculate badge image and spacing
    let badgeUrl;
    let badgeHeight;
    let badgeWidth;
    let offset;
    let offsetT = 0;
    if (this.state.school) {
      badgeUrl = 'https://app.playfmk.com/images/uni' + Math.min(this.state.schoolRank, 4) + '.png'

      if (this.state.schoolRank == 1) {
        badgeHeight = 30
        badgeWidth = 20
        offsetR = -25
        offsetT = -6
      } else if (this.state.schoolRank == 2) {
        badgeHeight = 30
        badgeWidth = 24
        offsetR = -27
        offsetT = -6
      } else if (this.state.schoolRank == 3) {
        badgeHeight = 27
        badgeWidth = 23
        offsetR = -27
      } else {
        badgeHeight = 27
        badgeWidth = 25
        offsetR = -27
        // offsetT = -6
      }
    }


    var credits = 0
    if (this.state.purchased && this.state.purchased['winks']) {
      credits = this.state.purchased['winks'].quantity
    }

    if (!this.state.isLoading) {
      let name = this.state.name;
      try {
        name = name.toUpperCase();
      } catch (e) {
        firebase.crash().isCrashCollectionEnabled()
          .then((enabled) => {
            if (enabled) {
              firebase.crash().log(`
              PreviewLayer.js:loadUser()
              Couldn\'t parse name to Upper Case
              name => ${name}
              name.UserID => ${this.state.id}
              requester ID => ${Meteor.user()._id}
              `);
              firebase.crash().report(e);
            }
          });
      }
      return (
        <View style={{ height: (HEIGHT - 150), backgroundColor: '#fff', borderRadius: 10}}>
          {this.renderSwiper()}
          <View style={{ flex: 1 }}>
            <View style={{ padding: 20, paddingTop: 30 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Text style={[styles.nomePreview]}>
                  {name}{this.renderAge()}
                </Text>
                {this.state.vip && <Icon style={{marginLeft: 5, marginBottom: 2}} name={'verified-user'} size={15} color={'#F76371'}/>}
                <Text style={{ fontSize: 11, fontFamily: 'Montserrat-Light', color: '#999999', marginLeft: 5, marginTop: 3, lineHeight: 2 }}>
                  {this.state.distance}
                </Text>

              </View>

                {/* <TouchableOpacity onPress={()=>{this.sendWink(); trackEvent('Profile_Details_Screen','Click_Get_a_Match')}}
                  style={{
                    position: "absolute", top: -30, bottom: 0, right: -2,
                    zIndex: 10, height: 80, width: 60
                  }}>
                  <Image source={require('../../../images/wink2.png')} style={{ height: 60, width: 60 }}></Image>
                  <View style={{ height: 11, width: 11, backgroundColor: '#ffffff', position: 'absolute', bottom: 27.5, right: 4.5}}>
                    <Text style={{ fontFamily: 'Montserrat-Light', fontSize: 6, color: '#C50658', textAlign: 'center', marginTop: 2 }}>{credits}</Text>
                  </View>
                  <Text style={{ fontFamily: 'Montserrat-Light', fontSize: 6, color: '#333333', textAlign: 'center' }}>{I18n.t('app.components.game.PreviewLayer.getMatch')}</Text>
                </TouchableOpacity> */}

              <Text style={{ fontSize: 11, fontFamily: 'Montserrat-Regular', color: '#585858', marginTop: 10 }}>
                {this.state.about}
              </Text>
              {this.state.school &&
                <TouchableOpacity style={{ margin: 10, marginLeft: 0, marginTop: 0, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                  onPress={() => Actions.uniRace()}>
                  <Text style={{ textDecorationLine: 'underline', fontSize: 11, fontFamily: 'Montserrat-Regular', color: '#585858', marginTop: 0, flexGrow: 1 }}>
                    {this.state.school.name}
                  </Text>
                  <Text style={{ fontSize: 11, marginRight: offsetR, marginBottom: offsetT*(-1) ,fontFamily: 'Montserrat-Regular', color: '#585858',  textAlign: 'center', width: 30, alignSelf: 'center' }}>
                    {this.state.schoolRank}
                  </Text>
                  <Image source={{ uri: badgeUrl }} style={{
                      height: badgeHeight, 
                      width: badgeWidth, resizeMode: 'contain'
                    }} />
                  </TouchableOpacity>
                }
                {/* <View style={{ paddingTop: 10 }}>
                  <Text style={{ fontFamily: 'Montserrat-Light', color: '#C7BFBF', fontSize: 12 }}>F R I E N D S  I N  C O M M O N ({this.state.mutualFriends}) </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <MutualFriendsList data={this} />
                </View> */}

              </View>
            </View>
            <TouchableOpacity onPress={() => {
                this.closeModal(); this.report(); trackEvent('Profile_Details_Screen','Click_Close');
              }}
              style={{ position: "absolute", bottom: 20, left: 0, right: 0, width: WIDTH - 60, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={'report'} color={'rgba(0, 0, 0, 0.25)'} style={{ height: 15, width: 15, margin: 0, }} />
              <Text style={{ fontSize: 10, fontFamily: 'Montserrat-light', margin: 0, color: 'rgba(0, 0, 0, 0.25)', textAlign: 'center', }}>{I18n.t('app.components.game.PreviewLayer.report')}</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (this.state.renderPlaceholderOnly) {
        return this.renderLoading();
      } else {
        getUser(this);
        return this.renderLoading();
      }
    }

    renderSwiper() {
      if (this.state.photoArray != null && this.state.photoArray != [] && this.state.photoArray.length > 1) {
        return (
          <Swiper
            style={styles.wrapper}
            ref={"swiper"}
            loop={false}
            height={HEIGHT / 1.9}
            width={WIDTH * 0.855}
            onMomentumScrollEnd = {(state, context)=> {
              var currentPage = context.index
              trackEvent('User_Profile_Detail', 'Photo_swiped')
            }}
            dot={
              <View style={{ backgroundColor: 'rgba(0,0,0,.3)', width: 10, height: 10, borderRadius: 5, marginLeft: 3, marginRight: 3, borderColor: 'white', borderStyle: 'solid', borderWidth: 1}} />
            }
            activeDot={
              <View style={{ backgroundColor: '#ffffff', width: 10, height: 10, borderRadius: 5, marginLeft: 3, marginRight: 3}} />
            }>
            {this.renderPic()}
          </Swiper>
        )
      } else {
        return (
          <Swiper style={styles.wrapper} 
              // showsButtons={true}
              loop={false}
              height={HEIGHT / 1.9}
              width={WIDTH * 0.855}
              dot={
                <View style={{ backgroundColor: 'rgba(0,0,0,.2)', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3}} />
              }
              activeDot={
                <View style={{ backgroundColor: '#ffffff', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3}} />
              }
          >
            <Image style={{ flex: 1}} borderTopLeftRadius={10} borderTopRightRadius={10} resizeMode="cover" source={this.state.image} />
          </Swiper>
        )
      }
    }

    getPhotos(id) {
      Meteor.call('getUserPhotos', id, (err, result) => {
        if (!err && result) {
          this.setState({
            photoArray: result.array,
            index: result.index,
          });
          if(result.array.length == 1){
            trackEvent('User_Profile_Detail', 'Only_1_photo')
          }else{
            trackEvent('User_Profile_Detail', 'Multiple photos: ' + result.array.length)
          }
        }
      });
    }

    renderPic() {
      let photos = [];
      let length = this.state.photoArray.length;
      photos.push(
          <Image style={{ flex: 1 }} borderTopLeftRadius={10} borderTopRightRadius={10} resizeMode="cover" source={{uri: this.state.image.uri}} key={6} />
        )//Key is 6 because max is only 5 photos. Like this there wont be 2 elements with the same key
      for (var i = 0; i < length; i++) {
        if (i  == this.state.index) {
        console.log(this.state.photoArray[i], 'imageee')
          console.log('true')
          continue;
        }
        photos.push(
          <Image key={i} style={{ flex: 1 }} borderTopLeftRadius={10} borderTopRightRadius={10} resizeMode="cover" source={{ uri: this.state.photoArray[i] }} />
          );
      }

      return photos;
    }

    render() {
      return (
        <Modal
          onDismiss={() => {
            this.setState({ isOpen: false, photoArray: [], isLoading: true, name: '', image: '', age: '', id: '', vip: false });
           }}
          offset={0}
          hideCloseButton={false}
          backdropType='blur'
          isVisible={this.state.isOpen}
          style={{ margin: 30, padding: 0, backgroundColor: 'transparent', marginTop: 0}}>
          <TouchableOpacity
            onPress={() => { trackEvent('Profile_Details_Screen','Click_Close'); this.setState({ isOpen: false, isLoading: true, name: '', image: '', age: '', id: '' }); }}
            style={{ backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Icon name={'close'} size={30} color={'#fff'} style={{ marginTop: 0, height: 30, width: 30 }} />
          </TouchableOpacity>
          {this.loadUser()}
        </Modal>
      );
    }
  }

  class MutualFriendsList extends Component {

    constructor(props) {
      super(props);
      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
      this.state = {
        dataSource: ds.cloneWithRows(this.props.data.state.mutualFriendsPhoto),
      }
    }

    render() {
      if (this.props.data.state.mutualFriends > 0) {
        return (
          <ListView
            dataSource={this.state.dataSource}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderRow={(rowData) => <Image style={{ borderRadius: 23, width: 45, height: 45, margin: 5, marginTop: 10 }} source={{ uri: rowData.picture.data.url }} />}
            renderFooter={() => {
              if (this.props.data.state.mutualFriends > 4) {
                return (
                  <Icon2 name='ios-more' color="#C7BFBF" style={{ fontSize: 30, margin: 5, marginTop: 20, marginLeft: 10 }} />
                );
              } else {
                return (
                  null
                );
              }
            }
          }
          />
      );
    } else {
      return (
        null
      );
    }
  }
}

function getUser(page) {
  let id = page.state.id;
  if (id != undefined && page.state.isOpen) {
    Meteor.call('userProfile', id, (err, result) => {

      if (result) {
        let user = result;
        Meteor.call('getFacebookID', id, (err, result) => {

          if (!err) {
            getFriends(page, result, user);
          }
        });
        let urlPicture = user.picture;
        let birthday = '';
        if (user.custom_picture) {
          urlPicture = user.custom_picture;
        }
        if (user.birthday) {
          birthday = user.birthday;
        }
      }
    });
  }
}

function getFriends(page, idFace, user) {
  AccessToken.getCurrentAccessToken().then(
    (res) => {

      if (res) {
        token = res;
        const responseCallback = ((error, result) => {
          if (error) {
            let urlPicture = user.picture;
            let birthday = '';
            if (user.custom_picture) {
              urlPicture = user.custom_picture;
            }
            if (user.birthday) {
              birthday = user.birthday;
            }
            page.setState({
              image: { uri: urlPicture },
              name: user.first_name,
              age: birthday,
              about: user.about,
              isLoading: false,
              mutualFriends: 0,
              mutualFriendsPhoto: [],
            });
          } else {
            let urlPicture = user.picture;
            let birthday = '';
            if (user.custom_picture) {
              urlPicture = user.custom_picture;
            }
            if (user.birthday) {
              birthday = user.birthday;
            }
            if (result.context.mutual_friends != undefined) {
              page.setState({
                image: { uri: urlPicture },
                name: user.first_name,
                age: birthday,
                about: user.about,
                isLoading: false,
                mutualFriends: result.context.mutual_friends.summary.total_count,
                mutualFriendsPhoto: result.context.mutual_friends.data,
              });
            } else {
              page.setState({
                image: { uri: urlPicture },
                name: user.first_name,
                age: birthday,
                about: user.about,
                isLoading: false,
                mutualFriends: 0,
                mutualFriendsPhoto: [],
              });
            }
          }
        });

        const profileRequest = new GraphRequest(
          `/${idFace}?fields=context.fields(mutual_friends.fields(picture.width(100).height(100)).limit(4))`,
          null,
          responseCallback,
        )

        new GraphRequestManager().addRequest(profileRequest).start();
      }
    }
  );
}

function getDistance(position) {
  let distanceString;
  if (Meteor.user().profile) {
    if (Meteor.user().profile.pos) {
      var pos = Meteor.user().profile.pos.coordinates

      var lon = pos[0];
      var lat = pos[1];
      if ((position.coordinates[1] == 0 && position.coordinates[0] == 0) || (lon == 0 && lat == 0)) {
        // return "In this universe";
      }
      var distance = Location.getDistanceFromLatLonInKm(position.coordinates[1], position.coordinates[0], lat, lon)

      if (distance < 5) {
        distanceString = "< 5km";
      } else if (distance < 10) {
        distanceString = "< 10km";
      } else if (distance < 50) {
        distanceString = "< 50km";
      } else if (distance < 100) {
        distanceString = "< 100km";
      } else {
        distanceString = I18n.t('app.components.game.PreviewLayer.report') 
      }
      //return distanceString;

      // TODO Hide distance string until we have a user base big enough to get more closer matches
      return "";
    }
  }
  //return  "In this universe";
  return "";

}

function getAge(dateString) {
  let today = new Date();
  let birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
