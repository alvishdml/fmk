import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Constants from '../../utilities/Constants';
import styles from '../../styles/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class FBPhotoHeader extends Component {

  render() {
    let width = Dimensions.get('window').width;
    let constants = new Constants();
    return (
      <View style={[styles.headerChat, { height: 60 }]}>
        <StatusBar barStyle='light-content'/>
        <View style={{ flex: 0.19, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', height: 60}}>
          <TouchableOpacity style={{height: 60, width: 100, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
              this.setState({ unmounted: true });
              try{
                Actions.pop();
              }
              catch(err) {

              }
            } }>
            <Icon style={{ backgroundColor: 'transparent'}} name={'keyboard-arrow-left'} size={35} color={'#AEB7B7'}/>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 60 }}>
          <Text style={{ fontFamily: 'Montserrat-Light', backgroundColor: 'transparent', color: '#aeb7b7', textAlign: 'center', marginRight: 30 }}>
            {this.props.titulo}
          </Text>
        </View>
      </View>
    );
  }
}
