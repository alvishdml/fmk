import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import Alert from '../../utilities/Alert';
import Meteor from '@meteorrn/core';
// import GoogleAnalytics from 'react-native-google-analytics-bridge';
import {
  trackScreen,
  trackEvent,
  trackRevenue,
} from '../../utilities/Analytics';

export default class UniRaceTemp extends Component {


  componentDidMount(){
    //GoogleAnalytics.trackScreenView('UniRace');
  }

  renderHeader(){
    var WIDTH = Dimensions.get('window').width;
    var HEIGHT = Dimensions.get('window').height;
    var header = <View style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width: WIDTH,
        height: 43
      }}>
      <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'flex-start', height: 43, width:WIDTH,
        backgroundColor: '#ffffff'}}>
        <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-around', width:WIDTH}}>
          <Text style={{
              fontSize: 17,
              color: '#757575',
              fontFamily: 'Montserrat-Regular',
              backgroundColor: 'transparent',
              marginBottom: 0,
              marginTop: 0 }}>
              {I18n.t('app.components.uniRace.UniRaceTemp.breakingNews')}
            </Text>
          </View>
        </View>
        <View style={{height: 100, width:WIDTH, backgroundColor:'#F2F2F2'}} />
      </View>;
      return header;
    }

    render(){
      var WIDTH = Dimensions.get('window').width;
      var HEIGHT = Dimensions.get('window').height;
      return (
        <View
          style={{
            width:WIDTH, height:HEIGHT,
            backgroundColor: '#fff', flex: 1,
            justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>

            {this.renderHeader()}

            <View style={{
                width:WIDTH, height:HEIGHT - 43,
                backgroundColor: '#fff', flex: 1,
                justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column'}}>
                <View style={{ flexDirection: 'column',
                  margin: 0, justifyContent: 'flex-start'}}>
                  <Text style={{margin: 20, marginBottom:0, fontFamily: 'Montserrat-Bold', fontSize:26, textAlign:'center'}}>
                  {I18n.t('app.components.uniRace.UniRaceTemp.the')} </Text>
                  <Text style={{margin: 20, marginTop:0, marginBottom:0, fontFamily: 'Montserrat-Bold', fontSize:26, textAlign:'center', color:'#f74786'}}>
                  {I18n.t('app.components.uniRace.UniRaceTemp.universityChallenge')}</Text>
                  <Text style={{margin: 20, marginTop:0, fontFamily: 'Montserrat-Bold', fontSize:26, textAlign:'center'}}>
                  {I18n.t('app.components.uniRace.UniRaceTemp.isComing')}
                    </Text>
                    <Text style={{margin: 20, fontFamily: 'Montserrat-Bold', fontSize:50, textAlign:'center'}}>
                      🏆
                    </Text>
                    <Text style={{margin: 20, fontFamily: 'Montserrat-Light', fontSize:17, textAlign:'left'}}>
                    {I18n.t('app.components.uniRace.UniRaceTemp.compete')}
                    </Text>
                  </View>
                </View>

                <View style={{position: 'absolute', backgroundColor:'#333333', bottom:0,
                  left:0, width: WIDTH, height:50, alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column' }}>
                  <TouchableOpacity onPress={() => {
                      GoogleAnalytics.trackEvent('UniRace', 'Boring');
                      Actions.mainPage();
                    }}
                    style={{
                      height:50, position: 'absolute', bottom:0, left:0,
                      width:WIDTH/2, justifyContent: 'center', flexDirection: 'column'}}>
                      <Text style={{ textAlign:'center', color: '#FFFFFF',
                        fontSize: 12, fontFamily: 'Montserrat-Light'}}>
                        {I18n.t('app.components.uniRace.UniRaceTemp.boring')}
                      </Text>

                    </TouchableOpacity>

                    <View style={{position: 'absolute', bottom:5, top:5, left:WIDTH*0.5,
                      backgroundColor:'#ffffff', width: 1, justifyContent: 'center',
                      flexDirection: 'column', height:40}} ></View>

                    <TouchableOpacity onPress={() => {
                        GoogleAnalytics.trackEvent('UniRace', 'Cool');
                        Actions.mainPage();
                      }}
                      style={{height:50, position: 'absolute', bottom:0,
                        right:0,
                        width:WIDTH/2, justifyContent: 'center',
                        flexDirection: 'column'}}>
                        <Text style={{ textAlign:'center', color: '#FFFFFF',
                          fontSize: 12, fontFamily: 'Montserrat-Light',}}>
                          {I18n.t('app.components.uniRace.UniRaceTemp.cool')}
                        </Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                )

              }

            }
