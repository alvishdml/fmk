import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  DatePickerAndroid,
  AppRegistry,
  TouchableWithoutFeedback,
  StyleSheet,
  Switch,
  Linking
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import styles from '../../styles/styles';
import { loginWithTokens } from './CustomLoginInstagramButton';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const instaLoginStyle = StyleSheet.create({ 

  isGenderButtonNotPressed: {

    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#e5e5e5',
    
    

  },
  isGenderButtonPressed: {
    
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#d34cb9',
    

  },
  smallMarginRight: {
    marginRight: 5
  },
  smallMarginLeft: {
    marginRight: 5
  },

  startPlayButtonAvailable: {
    flex: 0.13,
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#d34cb9", 
    marginVertical: 10
  },

  startPlayButtonUnavailable: {
    flex: 0.13,
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#aaa", 
    marginVertical: 10
  },

  closeButton: {

    width: 30, 
    height: 30, 
    top: 30, 
    right: 30, 
    position: 'absolute', 
    backgroundColor: '#e5e5e5', 
    justifyContent: "center", 
    alignItems: 'center', 
    borderRadius: 100

  }


});

const now = new Date();

export default class InstagramOnBoarding extends Component {

  

  constructor(props) {
    super(props);
    this.state = {
      token: props && props.token ? props.token : '',
      gender: null,
      over18: undefined,
      interestedInMale: false,
      interestedInFemale: false,
      termsAgree: false,
      startPlay: false,
      dateSelected: undefined,
      age: null
    }
    this.femalePress = this.femalePress.bind(this);
    this.malePress = this.malePress.bind(this);
    this.interestedInFemale = this.interestedInFemale.bind(this);
    this.interestedInMale = this.interestedInMale.bind(this);
    this.termsValue = this.termsValue.bind(this);
    this.updatePlay = this.updatePlay.bind(this);
  }

  componentDidMount(){
    trackScreen('Instagram_Onboarding_Screen');
  }
  
  updatePlay(){
    var startplay = this.state.over18 && this.state.gender && ( this.state.interestedInFemale || this.state.interestedInMale ) && this.state.termsAgree;
    this.setState({ startPlay: startplay });
  }

  componentDidUpdate( prevProps,prevState ){
    if ( prevState.interestedInMale != this.state.interestedInMale ||
      prevState.interestedInFemale != this.state.interestedInFemale ||
      prevState.termsAgree != this.state.termsAgree  ){
      this.updatePlay();
    }
  }

  interestedInFemale(){
    var interest = !this.state.interestedInFemale;
    this.setState({ interestedInFemale: interest });
  }

  interestedInMale(){
    var interest = !this.state.interestedInMale;
    this.setState({ interestedInMale: !this.state.interestedInMale });
  }

  malePress(){
    this.setState({ gender: 'male' });
    this.updatePlay();
  }

  femalePress(){
    this.setState({ gender: 'female' });
    this.updatePlay();
  }

  termsValue(value){
    this.setState({ termsAgree: !this.state.termsAgree })
  }

  
    showPicker = async () => { 
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: this.state.dateSelected ? this.state.dateSelected : now ,
        maxDate: now,
        mode: 'spinner',

      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        var dateborn = new Date(year, month, day);
        var age = now.getFullYear() - year;
        if( (age) == 18 && month <= now.getMonth() ){
          //console.log( now.getFullYear() - year );
          this.setState({ over18: true });
          this.updatePlay();
        } 
        else if ( (now.getFullYear() - year) > 18 ) {
          this.setState({ over18: true });
          this.updatePlay();

        }
        else{
          this.setState({ over18: false });
          this.updatePlay();
         
        }
        this.setState({ 
          dateSelected: dateborn,
          age: age
         }); 
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    } 
  };


  render() {
    const { token } = this.state;
    return <LinearGradient style={{ flex: 1 }} colors={["#fafafa", "#ececec"]}>
        <TouchableOpacity 
          style = { instaLoginStyle.closeButton }
          onPress = { () => { Actions.login({}); } }  >
        <Icon style={{ backgroundColor: 'transparent' }} name={'close'} size={20} color={'#fff'}/> 
          </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 50, marginRight: 50, backgroundColor: "transparent" }}>
          <View style={{ flex: 0.35, justifyContent: "center", alignItems: "center", marginBottom: 0 }}>
            <Icon style={{ backgroundColor: "transparent" }} name={"instagram"} size={50} color={"#000"} />
            <Text style={{ fontWeight: "bold", color: "#000" }}>
            {I18n.t('app.components.login.InstagramOnBoarding.signInInstagram')}
            </Text>
          </View>
          <View style={{ flex: 0.2, flexDirection: "row",marginBottom: -10 }}>
            <Text
              style={{ fontSize: 12, textAlign: "center", color: "#000" }}
            >
            {I18n.t('app.components.login.InstagramOnBoarding.bestMatches')}
            </Text>
          </View>
          <Text style={{ fontWeight: "bold", color: "#5c5c5c" }}>
          {I18n.t('app.components.login.InstagramOnBoarding.date')}
          </Text>
          <View style = {{ flex: 0.25, flexDirection: 'row', justifyContent: "center" }} >
          <TouchableOpacity onPress={this.showPicker} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#e5e5e5", marginHorizontal: 30, marginVertical: 10 }}>
            <Text style={{ fontWeight:"bold" }}>{ this.state.dateSelected ? (this.state.dateSelected.getMonth() + 1 ) + '/' + this.state.dateSelected.getFullYear() : 'MM/YYY' }</Text>
          </TouchableOpacity>
          {  !this.state.over18 && this.state.over18 != undefined &&
          <Icon style={{ marginVertical: 22, backgroundColor: 'transparent' }} name={'close'} size={25} color={'#ff0000'}/>}
          { this.state.over18 &&  
          <Icon style={{ marginVertical: 22, backgroundColor: 'transparent' }} name={'check'} size={25} color={'#00d85b'}/>}


          </View>
          
          { !this.state.over18 && this.state.over18 != undefined &&
           <Text
              style={{ fontSize: 14, color: "#7a7a7a", marginBottom: 5 }}
            >
              {I18n.t('app.components.login.InstagramOnBoarding.atLeast18')}
            </Text>}
          <Text
            style={{
              fontWeight: "bold",
              color: "#5c5c5c",
              marginBottom: 10
            }}
          >
            {I18n.t('app.components.login.InstagramOnBoarding.myGender')}
          </Text>

          <View style={{ flex: 0.2, flexDirection: "row" }}>
            <TouchableOpacity activeOpacity={1} onPress={this.malePress} style={[instaLoginStyle.smallMarginRight, this.state.gender == "male" ? instaLoginStyle.isGenderButtonPressed : instaLoginStyle.isGenderButtonNotPressed]}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: this.state.gender == "male" ? "#fff" : "#5c5c5c"
                }}
              >
               {I18n.t('app.components.login.InstagramOnBoarding.male')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.femalePress} style={[instaLoginStyle.smallMarginLeft, this.state.gender == "female" ? instaLoginStyle.isGenderButtonPressed : instaLoginStyle.isGenderButtonNotPressed]}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: this.state.gender == "female" ? "#fff" : "#5c5c5c"
                }}
              >
                {I18n.t('app.components.login.InstagramOnBoarding.female')}
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontWeight: "bold",
              color: "#5c5c5c",
              marginBottom: 10,
              marginTop: 10
            }}
          >
            {I18n.t('app.components.login.InstagramOnBoarding.interested')}
          </Text>

          <View style={{ flex: 0.2, flexDirection: "row" }}>
            <TouchableOpacity activeOpacity={1} onPress={this.interestedInMale} style={[instaLoginStyle.smallMarginRight, this.state.interestedInMale ? instaLoginStyle.isGenderButtonPressed : instaLoginStyle.isGenderButtonNotPressed]}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: this.state.interestedInMale ? "#fff" : "#5c5c5c"
                }}
              >
                {I18n.t('app.components.login.InstagramOnBoarding.male')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.interestedInFemale} style={[instaLoginStyle.smallMarginLeft, this.state.interestedInFemale ? instaLoginStyle.isGenderButtonPressed : instaLoginStyle.isGenderButtonNotPressed]}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: this.state.interestedInFemale ? "#fff" : "#5c5c5c"
                }}
              >
                {I18n.t('app.components.login.InstagramOnBoarding.female')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 0.1, flexDirection: "row", marginTop: 20 }}>
            <Switch style={{ marginVertical: 3 }} onValueChange={value => this.termsValue(value)} value={this.state.termsAgree} />
            <Text style={{ fontSize: 12, marginVertical: 5 }}>
            {I18n.t('app.components.login.InstagramOnBoarding.iAgree0')} <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }} onPress={() => {Linking.openURL("https://playfmk.com/terms.html"); trackEvent('Instagram_Screen', 'Click_Terms')}}>
            {I18n.t('app.components.login.InstagramOnBoarding.iAgree1')}
              </Text>
            </Text>
          </View>

          

          <TouchableOpacity 
            onPress={() => { loginWithTokens(token, this.state.gender, this.state.dateSelected, this.state.age, this.state.interestedInMale, this.state.interestedInFemale, null );
              trackEvent('Instagram_on_boarding', 'Choose_data_age', this.state.age);
              trackEvent('Instagram_on_boarding', 'Choose_gender', this.state.gender);
              trackEvent('Instagram_on_boarding', 'Choose_interested', this.state.interestedInMale && this.state.interestedInFemale ? 'Male & Female' : this.state.interestedInMale ? 'Male' : 'Female' );
              trackEvent('Instagram_on_boarding', 'Click_startplaying')
             }} 
            style={ this.state.startPlay ? instaLoginStyle.startPlayButtonAvailable : instaLoginStyle.startPlayButtonUnavailable }
            disabled={ !this.state.startPlay }
            >
            <Text style={{ fontWeight: "bold", color: "#fff" }}>
            {I18n.t('app.components.login.InstagramOnBoarding.startPlaying')}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>;
  }
}
