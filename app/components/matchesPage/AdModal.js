import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class AdModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: '',
      gender: '',
    };
  }

  openPopUp(value, country, gender) {
    this.setState({ isOpen: value, country: country, gender });
    if (country == 'de') {
      if (gender === 'male') {
        trackScreen('Emma_AD_Modal');
      } else {
        trackScreen('Parship_AD_Modal');
      }
      // trackScreen('Adidas_AD_Modal')
    } else {
      trackScreen('Booking_AD_Modal');
    }
  }

  render() {
    const { country, gender } = this.state;
    // ADIDAS CAMPAIGN
    // IMG: https://playfmk.com/images/adidasStatic.png
    // REDIRECT: http://njump.youmobistein.com/?jp=5bee8c58b088d&linkref=4601_1_1
    // TAG: adidas
    let IMG_URL = 'https://playfmk.com/images/fmk_booking.png';
    let REDIRECT_URL = 'https://www.booking.com/?aid=1637050';
    let TAG = 'booking';
    let CLOSE_COLOR = '#FFF';
    let LATER_COLOR = '#FFF';
    let HIDE_MAYBE_LATER = false;
    let BACKGROUND_COLOR = '#FFF';
    if (country === 'de') {
      if (gender === 'male') {
        IMG_URL = 'https://playfmk.com/images/ads/emma_modal.png';
        REDIRECT_URL =
          'https://ge.grngstrck.com/track/Njc5LjYzODguNjQ0Ljg0Ni4xLjAuMC4wLjAuMC4wLjA';
        TAG = 'emma';
      } else {
        IMG_URL = 'https://playfmk.com/images/ads/parship_modal.gif';
        REDIRECT_URL = 'http://www.zanox-affiliate.de/ppc/?45656540C158184109T';
        TAG = 'parship';
        BACKGROUND_COLOR = '#9D765D';
        HIDE_MAYBE_LATER = true;
      }
    }
    return (
      /* <Modal
            modalDidClose={() => { this.setState({ isOpen: false }); } }
            offset={0}
            hideCloseButton={false}
            backdropType= 'blur'
            open={this.state.isOpen}
            modalStyle={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500'}}>
            <View style={{height: HEIGHT, width: WIDTH}}>
              <Image style={{height: HEIGHT, width: WIDTH, justifyContent: 'center'}}  source={{ uri: this.state.country == 'pt' ? 'https://playfmk.com/images/kms_ad.png' : 'https://playfmk.com/images/kmsGermanAd.png' }}>
              <TouchableOpacity onPress={() => {this.setState({ isOpen: false }); GoogleAnalytics.trackEvent('Advertising', 'close top button', { label: "KissMyScore"}) }} style={{height: HEIGHT * 0.08, width: WIDTH * 0.1, position: 'absolute',
                top: 0, left: 0}} />
                <TouchableOpacity onPress={()=> {Linking.openURL('https://kissmyscore.app.link/5niU0SEBmQ');  GoogleAnalytics.trackEvent('Advertising', 'Click', { label: "KissMyScore"})}} style={{ height: HEIGHT * 0.8, width: WIDTH, position: 'absolute',
                bottom: HEIGHT * 0.1}} />
                <TouchableOpacity onPress={() => {this.setState({ isOpen: false }); GoogleAnalytics.trackEvent('Advertising', 'close top button', { label: "KissMyScore"}) }} style={{height: HEIGHT * 0.08, width: WIDTH, position: 'absolute',
                bottom: 0}} />
              </Image>
            </View>
            </Modal> */

      <Modal
        modalDidClose={() => {
          this.setState({ isOpen: false });
        }}
        offset={0}
        hideCloseButton={false}
        backdropType="blur"
        open={this.state.isOpen}
        modalStyle={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}
      >
        <View
          style={{
            height: HEIGHT,
            width: WIDTH,
            backgroundColor: BACKGROUND_COLOR,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({ isOpen: false });
              trackEvent('Ad_Screen', 'Click_close', {
                label: TAG,
              });
            }}
            style={{
              height: HEIGHT * 0.09,
              width: WIDTH * 0.2,
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 10,
            }}
          >
            <Icon style={{}} name={'close'} size={30} color={CLOSE_COLOR} />
          </TouchableOpacity>
          <Image
            style={{
              height: this.state.country == 'de' ? HEIGHT : HEIGHT * 0.5,
              width: WIDTH,
              justifyContent: 'center',
            }}
            resizeMode="contain"
            source={{ uri: IMG_URL }}
          />
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(REDIRECT_URL);
              trackEvent('Ad_Screen', 'Click_AD', {
                label: TAG,
              });
            }}
            style={{
              height: HEIGHT * 0.8,
              width: WIDTH,
              position: 'absolute',
              bottom: HEIGHT * 0.1,
              marginTop: HEIGHT * 0.8,
            }}
          />
          {!HIDE_MAYBE_LATER && (
            <TouchableOpacity
              onPress={() => {
                this.setState({ isOpen: false });
                trackEvent('Ad_Screen', 'Click_maybe_later', {
                  label: TAG,
                });
              }}
              style={{
                height: HEIGHT * 0.08,
                width: WIDTH,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                bottom: 0,
              }}
            >
              <Text
                style={{ textDecorationLine: 'underline', color: LATER_COLOR }}
              >
                Maybe later
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    );
  }
}
