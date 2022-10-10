import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Meteor from '@meteorrn/core';
import Modal from 'react-native-modal';
import GameTagIcon from '../../font/customIcon';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../utilities/Constants';
import styles from '../../styles/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const CONSTANTS = new Constants();

export default class Prize extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  componentWillMount() {
  }

  openPopUp(value, type, quantity, logins) {
    this.setState({ isOpen: value, type: type, quantity: quantity, logins: logins });
  }

  render() {

    let copy1;
    let copy2;
    let image;
    let colors = ['#ffffff', '#ffffff'];
    let colorAccent = '#ffffff'

    if(this.state.type == "winks"){
      copy1 = I18n.t('app.components.game.PrizePopUp.winksCopy1');
      copy2 = I18n.t('app.components.game.PrizePopUp.winksCopy2');
      image = require('../../../images/wink.png')
      colors = ['rgba(248,138,8,1.0)', 'rgba(247,91,104,0.8)']
      colorAccent = 'rgba(52,73,94,1.0)'
    }
    if(this.state.type == "profiles"){
      copy1 = I18n.t('app.components.game.PrizePopUp.profilesCopy1');
      copy2 = I18n.t('app.components.game.PrizePopUp.profilesCopy2');
      image = {uri: 'https://playfmk.com/images/zoom.png'}
      colors = ['rgba(52,73,94,1.0)', 'rgba(142,68,173,0.9)']
      colorAccent = '#1a1a1a'

    }
    if(this.state.type == "boost"){
      var plural= this.state.quantity > 1 ? "s" : ""
      copy1 = I18n.t('app.components.game.PrizePopUp.boostCopy1');
      copy2 = I18n.t('app.components.game.PrizePopUp.boostCopy2'); + this.state.quantity + I18n.t('app.components.game.PrizePopUp.boostCopy3'); + plural  +  " 🐰";
      image = {uri: 'https://playfmk.com/images/boost.png'}
      colors = ['rgba(0,75,181,1.0)', 'rgba(0,203,179,0.8)']
      colorAccent = 'rgba(0,75,181,1.0)'
    }

    let logins;
    if(this.state.logins > 1){
      logins = I18n.t('app.components.game.PrizePopUp.login0'); + this.state.logins + I18n.t('app.components.game.PrizePopUp.login1');
    } else {
      logins = I18n.t('app.components.game.PrizePopUp.login2');
    }


    return (
      <TouchableWithoutFeedback style={{top: 0, left: 0, position: 'absolute', width: WIDTH, height: HEIGHT }}>
        <Modal
          modalDidClose={() => { this.setState({ isOpen: false }); } }
          offset={0}
          hideCloseButton={false}
          backdropType= 'blur'
          open={this.state.isOpen}
          modalStyle={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}>
          <LinearGradient
            style={[styles.swipePageContainer, {width: WIDTH, height: HEIGHT}]}
            colors={colors}>
            <View style={{ flex: 1, alignItems:'center', justifyContent:'center' }}>
              <View style={{ marginTop: 0, marginLeft:20, marginRight:20, alignItems:'center', justifyContent:'center'}}>
                <Image source={image}  style={{height: 100, width:200, resizeMode:'contain', marginBottom:30, marginTop:0}}></Image>
                <View style={{ marginBottom:0, alignItems:'center', justifyContent:'center' }} >
                  <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 15, textAlign: 'center', marginBottom:12 }}>{logins}</Text>
                  <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding :20, borderColor:'#fff', borderStyle: 'solid', borderWidth:2}}>
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 15, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.earned')}</Text>
                    <Text style={{ fontFamily: 'Montserrat-Regular',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 35, textAlign: 'center', marginBottom:0 }}>{copy1}</Text>
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 15, textAlign: 'center' }}>{copy2}</Text>
                  </View>
                </View>
                <View style={{flexDirection:"row", marginTop:15, marginBottom:10}}>
                  <View style={{flexDirection:"column", marginRight:5, alignItems:'center', justifyContent:'center'}}>
                    {this.state.logins >= 1 && <Icon name='check-box' color={colorAccent} style={{marginTop:5, marginBottom:5, textAlign:'center', fontSize: 20, }} />}
                    {this.state.logins < 1 && <Image source={{uri: 'https://playfmk.com/images/boost.png'}}  style={{height: 30, width:30, resizeMode:'contain', marginBottom:0, marginTop:0}}></Image>}
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 1 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.day')} 1</Text>
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 1 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.boost')}</Text>
                  </View>
                  <View style={{flexDirection:"column", marginRight:5, alignItems:'center', justifyContent:'center'}}>
                    {this.state.logins >= 2 && <Icon name='check-box' color={colorAccent} style={{marginTop:5, marginBottom:5, textAlign:'center', fontSize: 20, }} />}
                    {this.state.logins < 2 && <Image source={{uri: 'https://playfmk.com/images/zoom.png'}}  style={{height: 20, width:30, resizeMode:'contain', marginBottom:5, marginTop:5}}></Image>}
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 2 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.day')} 2</Text>
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 2 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.profiles')}</Text>
                  </View>
                  <View style={{flexDirection:"column", marginRight:5, alignItems:'center', justifyContent:'center'}}>
                    {this.state.logins >= 3 && <Icon name='check-box' color={colorAccent} style={{marginTop:5, marginBottom:5, textAlign:'center', fontSize: 20, }} />}
                    {this.state.logins < 3 && <Image source={require('../../../images/wink.png')}  style={{height: 20, width:30, resizeMode:'contain', marginBottom:5, marginTop:5}}></Image>}
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 3 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.day')} 3</Text>
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 3 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.winks')}</Text>
                  </View>
                </View>
                <View style={{flexDirection:"row", marginTop:0, marginBottom:15}}>
                  <View style={{flexDirection:"column", marginRight:5, alignItems:'center', justifyContent:'center'}}>
                    {this.state.logins >= 4 && <Icon name='check-box' color={colorAccent} style={{marginTop:5, marginBottom:5, textAlign:'center', fontSize: 20, }} />}
                    {this.state.logins < 4 && <Image source={{uri: 'https://playfmk.com/images/boost.png'}}  style={{height: 30, width:30, resizeMode:'contain', marginBottom:0, marginTop:0}}></Image>}
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 4 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.day')} 4</Text>
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 4 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.boost')}</Text>
                  </View>
                  <View style={{flexDirection:"column", marginRight:5, alignItems:'center', justifyContent:'center'}}>
                    {this.state.logins >= 5 && <Icon name='check-box' color={colorAccent} style={{marginTop:5, marginBottom:5, textAlign:'center', fontSize: 20, }} />}
                    {this.state.logins < 5 && <Image source={{uri: 'https://playfmk.com/images/zoom.png'}}  style={{height: 20, width:30, resizeMode:'contain', marginBottom:5, marginTop:5}}></Image>}
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 5 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.day')} 5</Text>
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 5 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.profiles')}</Text>
                  </View>
                  <View style={{flexDirection:"column", marginRight:5, alignItems:'center', justifyContent:'center'}}>
                    {this.state.logins >= 6 && <Icon name='check-box' color={colorAccent} style={{marginTop:5, marginBottom:5, textAlign:'center', fontSize: 20, }} />}
                    {this.state.logins < 6 && <Image source={{uri: 'https://playfmk.com/images/zoom.png'}}  style={{height: 20, width:30, resizeMode:'contain', marginBottom:5, marginTop:5}}></Image>}
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 6 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.day')} 6</Text>
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 6 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.profiles')}</Text>
                  </View>
                  <View style={{flexDirection:"column", marginRight:5, alignItems:'center', justifyContent:'center'}}>
                    {this.state.logins >= 7 && <Icon name='check-box' color={colorAccent} style={{marginTop:5, marginBottom:5, textAlign:'center', fontSize: 20, }} />}
                    {this.state.logins < 7 && <Image source={require('../../../images/wink.png')}  style={{height: 20, width:30, resizeMode:'contain', marginBottom:5, marginTop:5}}></Image>}
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 7 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.day')} 7</Text>
                    <Text style={{ fontFamily: 'Montserrat-Light',  color: this.state.logins >= 7 ? colorAccent : '#FFFFFF', backgroundColor: 'transparent', fontSize: 10, textAlign: 'center' }}>{I18n.t('app.components.game.PrizePopUp.winks')}</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 12, textAlign: 'center', marginBottom: 7 }}>{I18n.t('app.components.game.PrizePopUp.keepComing')}</Text>
                  <TouchableOpacity style={[styles.popUpButton, { backgroundColor: 'white'}]} onPress={() => {this.setState({isOpen: false})}}>
                    <Text style={{ fontFamily: 'Montserrat-Light', color: '#424949', backgroundColor: 'transparent', fontSize: 14 }}>
                    {I18n.t('app.components.game.PrizePopUp.letsPlay')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}
