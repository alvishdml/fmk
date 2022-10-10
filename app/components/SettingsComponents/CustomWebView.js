import React, { Component } from 'react';import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import WebView from 'react-native-webview';

export default class CustomWebView extends Component {

  constructor(props) {
    super(props);
  }

  renderHeader(){
    var WIDTH = Dimensions.get('window').width;
    var header = <View style={{
        position:'absolute',
        top:0, left:0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width: WIDTH,
        height: 43
      }}>
      <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'flex-start', height: 75, width:WIDTH,
        backgroundColor: 'transparent'}}>
        <TouchableOpacity onPress={() => {
            try{
              Actions.pop();
            }
            catch(err) {

            }

          } }>
          <Icon style={{ marginLeft: 15, backgroundColor: 'transparent' }} name={'keyboard-arrow-left'} size={30} color={'#757575'}/>
        </TouchableOpacity>
      </View>
    </View>;
    return header;
  }

  render(){
    var WIDTH = Dimensions.get('window').width;
    var HEIGHT = Dimensions.get('window').height;

    return(
      <View style={{height: HEIGHT, width: WIDTH}}>

        <WebView
          ref={(ref) => { this.webview = ref; }}
          source = {{uri: this.props.address}}
          startInLoadingState = {true}
          renderLoading = {()=>{
            var HEIGHT = Dimensions.get('window').height;
            var WIDTH = Dimensions.get('window').width;
            return(<ActivityIndicator
              animating={true}
              color = {'#757575'}
              style={{ position:'absolute', left:WIDTH/2-50, top:HEIGHT/2-50, width:100, height:100}}
              size="large"
              />);
            }}
            />
          {this.renderHeader()}
        </View>
      )
    }

  }
