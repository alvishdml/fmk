import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class MonetizationMainMenu extends Component {

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={ ()=> {
              trackEvent('Purchases_Screen', 'Click_See_Who_Voted');
              this.props.mainPage.showWhoVotedModal(true);
            }}
            style={{backgroundColor:'transparent'}}
          >
            <LinearGradient style={styles.buttonsGradient} colors={['#8C55AA', '#394861']}>
              <Image
                resizeMode="contain" resizeMethod="resize" source={{uri: 'https://fmk-images.ams3.digitaloceanspaces.com/defaults/zoom.png'}}
                style={{ height: WIDTH * 0.16, width: WIDTH * 0.5, marginTop: -50}} >
              </Image>
              <Text style={styles.buttonsText}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.monetizationElementTitle')}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ ()=> {
              trackEvent('Purchases_Screen', 'Click_Send_a_Wink');
              this.props.mainPage.showWinkModal(true);
            }}
            style={styles.buttons}
          >
            <LinearGradient style={styles.buttonsGradient} colors={['#F97C7F', '#F78814']}>
              <Image
                resizeMode="contain" resizeMethod="resize" source={{uri: 'https://fmk-images.ams3.digitaloceanspaces.com/defaults/wink.png'}}
                style={{ height: WIDTH * 0.2, width: WIDTH * 0.6, marginTop: -40}} >
              </Image>
              <Text style={styles.buttonsText}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.winkTitle')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={ ()=> {
              trackEvent('Purchases_Screen', 'Click_Boost_your_profile');
              this.props.mainPage.showBoostModal(true);
            }}
            style={styles.buttons}
          >
            <LinearGradient style={styles.buttonsGradient} colors={['#41CEC0', '#0454B5']}>
              <Image
                resizeMode="contain" resizeMethod="resize" source={{uri: 'https://fmk-images.ams3.digitaloceanspaces.com/defaults/boost.png'}}
                style={{ height: WIDTH * 0.16, width: WIDTH * 0.6, marginTop: -50}} >
              </Image>
              <Text style={styles.buttonsText}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.boostProfile')}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ ()=> {
              trackEvent('Purchases_Screen', 'Click_Vip_Membership');
              this.props.mainPage.showVipModal(true);
            }}
            style={styles.buttons}
          >
            <LinearGradient style={styles.buttonsGradient} colors={['#595959', '#020202']}>
              <Image
                resizeMode="contain" resizeMethod="resize" source={{uri: 'https://fmk-images.ams3.digitaloceanspaces.com/defaults/full.png'}}
                style={{ height: WIDTH * 0.15, width: WIDTH * 0.33, marginTop: -40 }} >
              </Image>
              <Text style={styles.buttonsText}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.subscriptionTitle')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={ ()=> {
              trackEvent('Purchases_Screen', 'Click_Get_Power_Vote');
              this.props.mainPage.showPowerVoteModal(true);
            }}
            style={styles.buttons}
          >
            <LinearGradient style={styles.buttonsGradient} colors={['#00DBB9', '#106B63']}>
              <Image
                resizeMode="contain" resizeMethod="resize" source={{uri: 'https://fmk-images.ams3.digitaloceanspaces.com/defaults/three-stars.png'}}
                style={{ height: WIDTH * 0.2, width: WIDTH * 0.33, marginTop: -60 }} >
              </Image>
              <Text style={styles.buttonsText}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.powervoteTitle')}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ ()=> {
              trackEvent('Purchases_Screen', 'Click_Get_Free_Features');
              this.props.mainPage.showInviteFriendModal(true);
            }}
            style={styles.buttons}
          >
            <LinearGradient style={styles.buttonsGradient} colors={['#32B261', '#98D85E']}>
              <Text style={styles.buttonsTextFree}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.freeFeatures')}</Text>
              <Image
                resizeMode="contain" resizeMethod="resize" source={{uri: 'https://fmk-images.ams3.digitaloceanspaces.com/defaults/full.png'}}
                style={{ height: WIDTH * 0.15, width: WIDTH * 0.33, marginBottom: -60 }} >
              </Image>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  mainView: {
    width: WIDTH,
    height: HEIGHT,
  },
  buttonsRow:{
    marginTop:20,
    backgroundColor: 'white',
    height: HEIGHT * 0.26,
    width: WIDTH,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  buttons: {
    width: WIDTH * 0.4,
    height: HEIGHT * 0.25,
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  buttonsGradient: {
    borderRadius: 20,
    width: WIDTH * 0.4,
    height: HEIGHT * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsText: {
    fontFamily: 'Montserrat-Light',
    color:'white',
    fontSize: 20,
    position: 'absolute',
    bottom: 15,
    textAlign:'center',
    width: WIDTH * 0.4,
    paddingLeft: 5,
    paddingRight: 5,
  },
  buttonsTextPower: {
    fontFamily: 'Montserrat-Light',
    color: 'white',
    fontSize: 20,
    position: 'absolute',
    bottom: 40,
    textAlign: 'center',
    width: WIDTH * 0.4,
    paddingLeft: 5,
    paddingRight: 5,
  },
  buttonsTextFree: {
    fontFamily: 'Montserrat-Light',
    color:'white',
    fontSize: 20,
    position: 'absolute',
    top: 30,
    width: WIDTH * 0.4,
    textAlign:'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
});
