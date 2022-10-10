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
import { trackScreen, trackEvent } from '../../utilities/Analytics';


export default class AddSchool extends Component {

  constructor(props) {
    super(props);
    this.state = {
      feedback: '',
      error: false
    }
  }

  componentDidMount(){
    trackScreen('Missing_School');
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
        <TouchableOpacity onPress={() => {
            try{
              Actions.pop();
            }
            catch(err) {

            }
          }
        }>
        <Icon style={{ marginLeft: 15, backgroundColor: 'transparent' }} name={'keyboard-arrow-left'} size={30} color={'#757575'}/>
      </TouchableOpacity>
      <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-around', width:WIDTH-45}}>
        <Text style={{
            fontSize: 17,
            color: '#757575',
            fontFamily: 'Montserrat-Regular',
            backgroundColor: 'transparent',
            marginBottom: 0,
            marginTop: 0 }}>
            {I18n.t('app.components.uniRace.AddSchool.missingSchool')}
          </Text>
        </View>
      </View>
      <View style={{height: 100, width:WIDTH, backgroundColor:'#F2F2F2'}} />
    </View>;
    return header;
  }

  sendFeedback(){
    if(this.state.feedback == ""){
      this.setState({error:true})
    }
    else {
      Meteor.call('sendMissingSchool', Meteor.user()._id, this.state.feedback,(err, result) => {
        if (err) {
          Alert.showAlert('', errorMessage);
          trackEvent('Missing_School', 'Error');
        } else {
          Alert.showAlert('', I18n.t('app.components.uniRace.AddSchool.appreciateFeedback'));
          trackEvent('Missing_School', 'Success');
        }
      }
    )
    try{
      Actions.pop();
    }
    catch(err) {

    }
  }
}

render(){
  var WIDTH = Dimensions.get('window').width;
  var HEIGHT = Dimensions.get('window').height;
  var underlineColor = this.state.error ? '#e74c3c' : '#cccccc';
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
              <Text style={{margin: 20, fontFamily: 'Montserrat-Bold', fontSize:17}}>
              {I18n.t('app.components.uniRace.AddSchool.isMissingSchool')}
              </Text>
              <Text style={{margin: 20, marginBottom:0, fontFamily: 'Montserrat-Light', fontSize:17}}>
              {I18n.t('app.components.uniRace.AddSchool.tellUs')}
              </Text>
              <Text style={{margin: 20, marginTop:0, fontFamily: 'Montserrat-Light', fontSize:17}}>
              {I18n.t('app.components.uniRace.AddSchool.usefulInformation')}
              </Text>
              <TextInput id="inputAbout"
                placeholder={I18n.t('app.components.uniRace.AddSchool.aboutPlaceHolder')} multiLine={true} rows={1} rowsMax={10}
                style={{ margin: 20,
                  fontFamily:'Montserrat-Light', bottom:40 }}
                  onChangeText={(text) => this.setState({feedback: text})}
                  textareaStyle={{ fontSize: 14, color: '#000000' }}
                  underlineColorAndroid= {underlineColor} />
                {this.state.error &&
                  <Text style={{margin:23, marginTop: -60, fontFamily: 'Montserrat-Light', fontSize:10, color: '#e74c3c'}}>
                    {I18n.t('app.components.uniRace.AddSchool.writeSchoolName')}
                  </Text>
                }
              </View>
            </View>

            <View style={{position: 'absolute', backgroundColor:'#333333', bottom:0,
              left:0, width: WIDTH, height:50, alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column' }}>
              <TouchableOpacity onPress={() => {
                  try{
                    Actions.pop();
                  }
                  catch(err) {

                  }
                }
              } style={{
                height:50, position: 'absolute', bottom:0, left:0,
                width:WIDTH/2, justifyContent: 'center', flexDirection: 'column'}}>
                <Text style={{ textAlign:'center', color: '#FFFFFF',
                  fontSize: 12, fontFamily: 'Montserrat-Light'}}>
                  {I18n.t('app.components.uniRace.AddSchool.cancel')}
                </Text>

              </TouchableOpacity>

              <View style={{position: 'absolute', bottom:5, top:5, left:WIDTH*0.5,
                backgroundColor:'#ffffff', width: 1, justifyContent: 'center',
                flexDirection: 'column', height:40}} ></View>

              <TouchableOpacity onPress={() => {
                  this.sendFeedback();}
                } style={{height:50, position: 'absolute', bottom:0,
                  right:0,
                  width:WIDTH/2, justifyContent: 'center',
                  flexDirection: 'column'}}>
                  <Text style={{ textAlign:'center', color: '#FFFFFF',
                    fontSize: 12, fontFamily: 'Montserrat-Light',}}>
                    {I18n.t('app.components.uniRace.AddSchool.send')}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          )

        }

      }
