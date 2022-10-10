import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import Meteor from '@meteorrn/core';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Alert from '../../utilities/Alert';
import { Actions } from 'react-native-router-flux';
import { trackScreen, trackEvent } from '../../utilities/Analytics';
const FBSDK = require('react-native-fbsdk-next');
const {
  LoginManager
} = FBSDK;

export default class DeleteAccount extends Component {

  constructor(props) {
    super(props);
    this.state = {
      height: 90
    }
  }

  componentDidMount(){
    trackScreen('Remove_Account_Screen');
  }

  deleteAccount(reason){
    Meteor.call('deactivateAndRemoveUser', Meteor.user()._id,reason, (err, result) => {
      if (!err) {
        Alert.showAlert('', I18n.t('app.components.SettingsComponents.DeleteAccount.removeAlert'), 'delete_account');
        LoginManager.logOut();
        Actions.login();
      }
    });
    trackEvent('Account_deleted', reason);
  }


  renderHeader(){
    var WIDTH = Dimensions.get('window').width;
    var header = <View style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width: WIDTH,
        height: 43
      }}>
      <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'flex-start', height: 43, width:WIDTH,
        backgroundColor: '#ffffff'}}>
        <TouchableOpacity onPress={() => {
            trackEvent('Remove_Account_Screen','Click_back');
            try{
              Actions.pop();
            }
            catch(err) {

            }
          } }>
          <Icon style={{ marginLeft: 15, backgroundColor: 'transparent' }} name={'keyboard-arrow-left'} size={30} color={'#757575'}/>
        </TouchableOpacity>
        <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-around', width: WIDTH-45}}>
          <Text style={{
              fontSize: 17,
              color: '#757575',
              fontFamily: 'Montserrat-Regular',
              backgroundColor: 'transparent',
              marginBottom: 0,
              marginTop: 0 }}>
              {I18n.t('app.components.SettingsComponents.DeleteAccount.deleteAccount')}
            </Text>
          </View>
        </View>
        <View style={{height: 100, width:WIDTH, backgroundColor:'#F2F2F2'}} />
      </View>;
      return header;
    }

    renderButtons(){
      var WIDTH = Dimensions.get('window').width;
      var HEIGHT = Dimensions.get('window').height;
      return(
        <View style={{backgroundColor:'#F2F2F2', width:WIDTH, height:0.7*(HEIGHT-43)-20, flexDirection: 'row', padding:2}}>
          <View style={{width:0.5*WIDTH, flex:0.5, flexDirection: 'column', margin:0, marginRight:1}}>
            <View style={{flex:0.33, flexDirection: 'column',
              justifyContent:'center', alignItems:'center', marginBottom: 2
            }}>
            <TouchableOpacity style={{flex:1, flexDirection: 'column',
              justifyContent:'center', alignItems:'center'
            }} onPress={()=>{this.deleteAccount("didn't understand")}}>
            <LinearGradient
              style={{flex:1, flexDirection: 'row',
                justifyContent:'center', alignItems:'center'
              }} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#F5A884', '#F73D4E']}>
              <View style={{flex:1, flexDirection: 'column'}}>
                <Text style={{fontSize: 30, margin:0,textAlign:'center'}}>😞</Text>
                <Text style={{fontSize: 14, marginTop:0, marginBottom: 0, textAlign:'center',
                  fontFamily:'Montserrat-Bold', color:'#FFFFFF', marginLeft:10,
                  marginRight:15}}>{I18n.t('app.components.SettingsComponents.DeleteAccount.noEnoughMatches')}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={{flex:0.33, flexDirection: 'column',
          justifyContent:'center', alignItems:'center', marginBottom: 2
        }}>
        <TouchableOpacity style={{flex:1, flexDirection: 'column',
          justifyContent:'center', alignItems:'center'
        }} onPress={()=>{this.deleteAccount("no matches")}}>
        <LinearGradient
          style={{flex:1, flexDirection: 'row',
            justifyContent:'center', alignItems:'center'
          }} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#79F0F0', '#137ABF']}>

          <View style={{flex:1, flexDirection: 'column'}}>
            <Text style={{fontSize: 30, margin:0, textAlign:'center'}}>😵</Text>
            <Text style={{fontSize: 14, marginTop:0, marginBottom: 0, textAlign:'center',
              fontFamily:'Montserrat-Bold', color:'#FFFFFF', marginLeft:10,
              marginRight:15}}>{I18n.t('app.components.SettingsComponents.DeleteAccount.dontUnderstandPlay')}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>

    <View style={{flex:0.33, flexDirection: 'column',
      justifyContent:'center', alignItems:'center', marginBottom: 2
    }}>
    <TouchableOpacity style={{flex:1, flexDirection: 'column',
      justifyContent:'center', alignItems:'center'
    }} onPress={()=>{this.deleteAccount("met someone")}}>
    <LinearGradient
      style={{flex:1, flexDirection: 'row',
        justifyContent:'center', alignItems:'center'
      }} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#F7226E', '#FD949E']}>
      <View style={{flex:1, flexDirection: 'column'}}>
        <Text style={{ textAlign:'center', fontSize: 30, margin:0}}>😘</Text>
        <Text style={{fontSize: 14, marginTop:0, marginBottom: 0,
            textAlign:'center', fontFamily:'Montserrat-Bold', color:'#FFFFFF', marginLeft:10,
            marginRight:15}}>{I18n.t('app.components.SettingsComponents.DeleteAccount.metSomeone')}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  </View>
</View>

<View style={{flex:0.5, flexDirection: 'column', margin:0, marginLeft:1}}>
  <View style={{flex:0.33, flexDirection: 'column',
    justifyContent:'center', alignItems:'center', marginBottom: 2
  }}>
  <TouchableOpacity style={{flex:1, flexDirection: 'column',
    justifyContent:'center', alignItems:'center'
  }} onPress={()=>{this.deleteAccount("offensive")}}>
  <LinearGradient
    style={{flex:1, flexDirection: 'row',
      justifyContent:'center', alignItems:'center'
    }} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#00C1C1', '#51F5C9']}>
    <View style={{flex:1, flexDirection: 'column'}}>
      <Text style={{textAlign:'center',fontSize: 30, margin:0, opacity: 1}}>👎</Text>
      <Text style={{textAlign:'center',fontSize: 14, marginTop:0, marginBottom: 0,
        fontFamily:'Montserrat-Bold', color:'#FFFFFF', marginLeft:10,
        marginRight:15}}>{I18n.t('app.components.SettingsComponents.DeleteAccount.offensive')}</Text>
    </View>
  </LinearGradient>
</TouchableOpacity>
</View>
<View style={{flex:0.33, flexDirection: 'column',
  justifyContent:'center', alignItems:'center', marginBottom: 2
}}>
<TouchableOpacity style={{flex:1, flexDirection: 'column',
  justifyContent:'center', alignItems:'center'
}} onPress={()=>{this.deleteAccount("no interesting people")}}>
<LinearGradient
  style={{flex:1, flexDirection: 'row',
    justifyContent:'center', alignItems:'center'
  }} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#B69FEC', '#D01DCD']}>
  <View style={{flex:1, flexDirection: 'column'}}>
    <Text style={{textAlign:'center',fontSize: 30, margin:0}}>🙈</Text>
    <Text style={{textAlign:'center',fontSize: 14, marginTop:0, marginBottom: 0,
      fontFamily:'Montserrat-Bold', color:'#FFFFFF', marginLeft:10,
      marginRight:15}}>{I18n.t('app.components.SettingsComponents.DeleteAccount.noInteresting')}</Text>
  </View>
</LinearGradient>
</TouchableOpacity>
</View>
<View style={{flex:0.33, flexDirection: 'column',
  justifyContent:'center', alignItems:'center', marginBottom: 2
}}>
<TouchableOpacity style={{flex:1, flexDirection: 'column',
  justifyContent:'center', alignItems:'center'
}} onPress={()=>{this.deleteAccount("bugs")}}>
<LinearGradient
  style={{flex:1, flexDirection: 'row',
    justifyContent:'center', alignItems:'center'
  }} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#B4D2E6', '#004BB5']}>
  <View style={{flex:1, flexDirection: 'column'}}>
    <Text style={{textAlign:'center',fontSize: 30, margin:0}}>🐛</Text>
    <Text style={{textAlign:'center',fontSize: 14, marginTop:0, marginBottom: 0,
      fontFamily:'Montserrat-Bold', color:'#FFFFFF', marginLeft:10,
      marginRight:15}}>{I18n.t('app.components.SettingsComponents.DeleteAccount.appBug')}</Text>
  </View>
</LinearGradient>
</TouchableOpacity>
</View>
</View>
</View>)
}

render() {
  var WIDTH = Dimensions.get('window').width;
  var HEIGHT = Dimensions.get('window').height;
  return (
    <View style={{ backgroundColor: '#FFFFFF', flex: 1, flexDirection: 'column' }}>
      {this.renderHeader()}

      <View style={{
          width:WIDTH, height:HEIGHT - 43, backgroundColor: '#fff', flex: 1,
          justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>

          <View style={{backgroundColor:"#ffffff",  height:0.15*(HEIGHT - 43),  margin: 0}}>
            <Text style={{margin: 20, textAlign: 'center',
              fontFamily: 'Montserrat-Bold', fontSize:17}}>
              {I18n.t('app.components.SettingsComponents.DeleteAccount.youSure')}
            </Text>
          </View>
          <View style={{backgroundColor:"#ffffff", height:0.15*(HEIGHT - 43),  margin: 0}}>
            <Text style={{margin: 20, textAlign: 'center',
              fontFamily: 'Montserrat-Light', fontSize:17}}>
              {I18n.t('app.components.SettingsComponents.DeleteAccount.ifSo')}
            </Text>
          </View>

          {this.renderButtons()}

        </View>
      </View>
    );
  }

}
