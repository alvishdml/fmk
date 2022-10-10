import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Keyboard,
  ImageBackground
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../utilities/Constants'
import Meteor from '@meteorrn/core';
import styles from '../../styles/styles';
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Alert from '../../utilities/Alert';
import { trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const CONSTANTS = new Constants();



export default class ChatHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      height: 90
    }

    
  }

  unMatch(value) {
    Meteor.call('unMatch', this.props.matchId, (err, result) => {
      Actions.pop({ refresh: { refreshPage: true }});
      if (!err) {
        trackEvent('New_Conversation_Screen', 'Click_unmatch', result.type);
        try{
          //Actions.pop({ refresh: { refreshPage: true }});
        }
        catch(err) {

        }
      }
    });
  }

  report(value) {
    Alert.showAlert('REPORT USER', I18n.t('app.components.chat.ChatHeader.whatHappened'), 'report', this.props.idUserProfile, this.props.matchId);
  }

  // setState-->unmounted: True

      
  menuOptions(value) {
    switch (value) {
      case 1:
      this.props.chatWindow.openProfile(true, this.props.idUserProfile);
      break;
      case 2:
      this.unMatch(value);
      break;
      case 3:
      this.report(value);
      break;
      default:
      //console.log(value);
    }
  }

  render() {
    let name = this.props.name;

    return (
      <View style={[styles.headerChat, { height: this.state.height }]}>
        <StatusBar barStyle='light-content'/>
        <ImageBackground source= {this.props.image} style={[styles.headerChat, { width: WIDTH, height: this.state.height }]}>
          
          <LinearGradient style={[styles.headerChat, { width: WIDTH, height: this.state.height }]} start={{x:0, y:1}} end={{x:1, y:0}} colors={[CONSTANTS.colors[this.props.cor] + 'E6', CONSTANTS.colors1[this.props.cor] + 'E6']}>
          
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
              <TouchableOpacity onPress={() => {
                  Keyboard.dismiss();
                  try{
                    // If a message was sent then we prompt the user to leave a rating
                    if (this.props.sentMessage) {
                      this.props.chatWindow.triggerRate();  
                    }            
                    if(this.props.notification){
                      Actions.mainPage({ refresh: { refreshPage: true }});
                    }else{
                      Actions.pop({ refresh: { refreshPage: true }});
                    }        
                    
                  }
                  catch(err) {

                  }
                  this.setState({ unmounted: true })
                } }>

                <Icon style={{ marginLeft: 15, backgroundColor: 'transparent' }} name={'keyboard-arrow-left'} size={30} color={'#E5E7E9'}/>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }} onPress={() => { Keyboard.dismiss(); this.props.chatWindow.openProfile(true, this.props.idUserProfile); trackEvent('New_Conversation_Screen','Click_Profile') } }>
                <Image source= {this.props.image} style={{ height: 50, width: 50, borderRadius: 25, marginLeft: 10, backgroundColor: 'transparent' }}/>
                <Text style={{ fontSize: 17, color: '#E5E7E9', fontFamily: 'Montserrat-Regular', backgroundColor: 'transparent', marginLeft: 10 }}>{name}</Text>
              </TouchableOpacity>
            </View>
            { this.props.matchType == 'wink' && <Image style={{ height: 25, width: 25, left: 40  }} source={require('../../../images/wink.png')}/>}
            <Menu onSelect={this.menuOptions.bind(this) }>
              <MenuTrigger>
                <Icon style={{ marginRight: 10, backgroundColor: 'transparent' }} name={'more-vert'} size={30} color={'#E5E7E9'}/>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption value={1}>
                  <Text style={{ fontFamily: 'Montserrat-Regular', }}>{I18n.t('app.components.chat.ChatHeader.profile')}</Text>
                </MenuOption>
                <MenuOption value={2}>
                  <Text style={{ fontFamily: 'Montserrat-Regular', }}>{I18n.t('app.components.chat.ChatHeader.unmatch')}</Text>
                </MenuOption>
                <MenuOption value={3}>
                  <Text style={{ fontFamily: 'Montserrat-Regular', }}>{I18n.t('app.components.chat.ChatHeader.reportAbuse')}</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }
}
