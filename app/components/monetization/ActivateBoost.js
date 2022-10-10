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
import Meteor from '@meteorrn/core';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class ActivateBoost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      boostHours: null,
    };
    this.activateBoost = this.activateBoost.bind(this);
  }

  openPopUp(value) {
    trackScreen('Activate_Boost_Modal');
    this.setState({ isOpen: value});
  }

  activateBoost() {
    this.props.mainPage.activateUserBoost(); 
    this.setState({ isOpen: false });
  }

  render() {
    return (
      <Modal
        modalDidClose={() => { this.setState({ isOpen: false }); } }
        offset={0}
        hideCloseButton={false}
        backdropType= 'blur'
        open={this.state.isOpen}
        modalStyle={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500'}}>
        <View style={styles.mainView}>
          <LinearGradient style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5, width: WIDTH-80, height: HEIGHT * 0.4, position: 'absolute', top: 0, left: 0, alignItems: 'center', justifyContent:'center' }} colors={['#3FCABF', '#075AB5']}>
            <Image
              resizeMode="contain" resizeMethod="resize" source={{uri: 'https://fmk-images.ams3.digitaloceanspaces.com/defaults/full.png'}}
              style={{ height: WIDTH * 0.3, width: WIDTH * 0.7, marginRight: 10, marginLeft: 15 }}
            />
            <Text style={{ fontFamily: 'Montserrat-Light',  color: '#fff', fontSize: 30, marginBottom:20, marginTop:20, textAlign:'center' }}>
              {I18n.t('app.components.monetization.ActivateBoost.boostProfile')}
            </Text>
          </LinearGradient>
          <Text style={{ fontFamily: 'Montserrat-Light',  color: 'black', fontSize: WIDTH < 400 ? 18 :20,  fontWeight:'100', marginTop:HEIGHT * 0.43,  textAlign:'center' }}>
            {I18n.t('app.components.monetization.ActivateBoost.youHave')}
            <Text style={{fontWeight:'900'}}>
              {this.state.boostHours} {I18n.t('app.components.monetization.ActivateBoost.hourBoost')}
            </Text>{I18n.t('app.components.monetization.ActivateBoost.left')}
          </Text>
          <Text style={{ fontFamily: 'Montserrat-Light',  color: 'black', fontSize: WIDTH < 400 ? 18 :20, fontWeight:'100' }}>
            {I18n.t('app.components.monetization.ActivateBoost.activateNow')}
          </Text>
          <TouchableOpacity style={{width: WIDTH-150, height: 50, backgroundColor: '#1270B7', alignItems: 'center', justifyContent:'center', marginTop:40, marginBottom:30 }} onPress={()=>{this.activateBoost(); trackEvent('Boost_Modal','Click_Activate_Boost')}}>
            <Text style={{fontFamily: 'Montserrat-Light', color:'white', fontSize:20, fontWeight:'400' }}>
              {I18n.t('app.components.monetization.ActivateBoost.activateBoost')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.setState({isOpen:false}); trackEvent('Boost_Modal','Click_Maybe_Later')}}>
            <Text style={{fontFamily: 'Montserrat-Light', color:'#353535', textDecorationLine:'underline', fontSize:12, marginBottom: 20 }}>
              {I18n.t('app.components.monetization.ActivateBoost.maybeLater')}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create ({
  mainView:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: HEIGHT * 0.83 ,
    marginRight: 40,
    marginLeft: 40,
    borderRadius: 5,
    position: 'relative',
  },
  activateButton: {
    width: 400,
    height: 100,
  },
});
