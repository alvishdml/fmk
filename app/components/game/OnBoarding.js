import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Animated,
  Platform,
  Image
} from 'react-native';
import Meteor from '@meteorrn/core';
import Modal from 'react-native-modal';
import GameTagIcon from '../../font/customIcon';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../utilities/Constants';
import styles from '../../styles/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const CONSTANTS = new Constants();
const TYPES_TEXT = Platform.OS == 'ios' ? 'FUN or MARRY' : 'F*CK, MARRY or KILL';

export default class OnBoarding extends Component {

  constructor(props) {
    super(props);
    let constants = new Constants();
    let cor = constants.colors[1] + 'D9';
    let cor1 = constants.colors1[1] + 'D9';
    this.state = {
      isOpen: false,
      fuckViewFade: new Animated.Value(0),
      marryViewFade: new Animated.Value(0),
      marryViewFade_undo: new Animated.Value(0),
      killViewFade: new Animated.Value(0),
      fuckRippleOpacity: new Animated.Value(0),
      marryRippleOpacity: new Animated.Value(0),
      marryRippleOpacity_undo: new Animated.Value(0),
      killRippleOpacity: new Animated.Value(0),
      firstAnimation: true,
      secondAnimation: false,
      animated: true,
      topFinger: new Animated.Value((HEIGHT-43)/2),
      rightFinger: new Animated.Value(WIDTH/2),
      fingerOpacity: new Animated.Value(0),
      matchOpacity: new Animated.Value(0),
      cor: cor,
      cor1: cor1
    }
  }

  componentDidMount() {
   this.interval =  setTimeout(this._onBoardingAnimation.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.setState({ animated: false, secondAnimation: false });
  }

  _onBoardingAnimation() {
    let timing = Animated.timing;
    let sequence = Animated.sequence;
    let delay = Animated.delay;
    let parallel = Animated.parallel;
    sequence([
      sequence([
        timing(this.state.fingerOpacity, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true
        }),
        parallel([
          timing(this.state.topFinger, {
            toValue: 90,
            duration: 250,
            useNativeDriver: true

          }),
          timing(this.state.rightFinger, {
            toValue: 10,
            duration: 250,
            useNativeDriver: true
          })
        ]),
        timing(this.state.fuckRippleOpacity, {
          toValue: 0.5,
          duration: 250,
          useNativeDriver: true
        }),
        timing(this.state.fuckViewFade, {
          toValue: 1,
          duration: 275,
          useNativeDriver: true
        }),
        timing(this.state.fuckRippleOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
      ]),
      delay(250),
      sequence([
        parallel([
          timing(this.state.topFinger, {
            toValue: (HEIGHT-43)*2/3+25,
            duration: 250,
            useNativeDriver: true
          }),
          timing(this.state.rightFinger, {
            toValue: WIDTH-WIDTH/5-50-5,
            duration: 250,
            useNativeDriver: true
          })
        ]),
        timing(this.state.marryRippleOpacity_undo, {
          toValue: 0.5,
          duration: 250,
          useNativeDriver: true
        }),
        timing(this.state.marryViewFade_undo, {
          toValue: 1,
          duration: 275,
          useNativeDriver: true
        }),
        timing(this.state.marryRippleOpacity_undo, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
        parallel([
          timing(this.state.topFinger, {
            toValue: 250,
            duration: 250,
            useNativeDriver: true
          }),
          timing(this.state.rightFinger, {
            toValue: 210,
            duration: 250,
            useNativeDriver: true
          })
        ]),
        delay(100),
        parallel([
          timing(this.state.topFinger, {
            toValue: (HEIGHT-43)*2/3+25,
            duration: 250,
            useNativeDriver: true
          }),
          timing(this.state.rightFinger, {
            toValue: WIDTH-WIDTH/5-50-5,
            duration: 250,
            useNativeDriver: true
          })
        ]),
        timing(this.state.marryRippleOpacity_undo, {
          toValue: 0.5,
          duration: 250,
          useNativeDriver: true
        }),
        timing(this.state.marryViewFade_undo, {
          toValue: 0,
          duration: 275,
          useNativeDriver: true
        }),
        timing(this.state.marryRippleOpacity_undo, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
      ]),
      delay(250),
      sequence([
        parallel([
          timing(this.state.topFinger, {
            toValue: (HEIGHT-43)/3+20,
            duration: 250,
            useNativeDriver: true
          }),
          timing(this.state.rightFinger, {
            toValue: WIDTH-80,
            duration: 250,
            useNativeDriver: true
          })
        ]),
        timing(this.state.marryRippleOpacity, {
          toValue: 0.5,
          duration: 250,
          useNativeDriver: true
        }),
        timing(this.state.marryViewFade, {
          toValue: 1,
          duration: 275,
          useNativeDriver: true
        }),
        timing(this.state.marryRippleOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
      ]),
      delay(250),
      sequence([
        parallel([
          timing(this.state.topFinger, {
            toValue: (HEIGHT-43)*2/3+25,
            duration: 250,
            useNativeDriver: true
          }),
          timing(this.state.rightFinger, {
            toValue: WIDTH-WIDTH/5-50-5,
            duration: 250,
            useNativeDriver: true
          })
        ]),
        timing(this.state.killRippleOpacity, {
          toValue: 0.5,
          duration: 250,
          useNativeDriver: true
        }),
        timing(this.state.killViewFade, {
          toValue: 1,
          duration: 275,
          useNativeDriver: true
        }),
        timing(this.state.killRippleOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
      ]),
      delay(250),
      parallel([
        timing(this.state.fuckViewFade, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true
        }),
        timing(this.state.marryViewFade, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true
        }),
        timing(this.state.killViewFade, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true
        }),
        timing(this.state.fingerOpacity, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true
        }),
      ])
    ]).start(event => {
      if (event.finished) {
        //if (this.state.firstAnimation) {
          //this.setState({ firstAnimation: false, secondAnimation: true });
        //} else {
          this.setState({ animated: false, secondAnimation: false, firstAnimation: false });
        //}
        //if (this.state.animated) {
          //this._secondOnBoardingAnimation();
        //}
      }
    });
  }

  /*  _secondOnBoardingAnimation() {
    let timing = Animated.timing;
    let sequence = Animated.sequence;
    let delay = Animated.delay;
    let parallel = Animated.parallel;
    sequence([
      sequence([
        timing(this.state.fingerOpacity, {
          toValue: 1,
          duration: 50
        }),
        parallel([
          timing(this.state.topFinger, {
            toValue: (HEIGHT-43)/3+70,
            duration: 250
          }),
          timing(this.state.rightFinger, {
            toValue: 10,
            duration: 250
          })
        ]),
        timing(this.state.fuckRippleOpacity, {
          toValue: 0.5,
          duration: 250
        }),
        timing(this.state.fuckViewFade, {
          toValue: 1,
          duration: 275
        }),
        timing(this.state.fuckRippleOpacity, {
          toValue: 0,
          duration: 250
        }),
      ]),
      delay(250),
      sequence([
        parallel([
          timing(this.state.topFinger, {
            toValue: (HEIGHT-43)*2/3+10,
            duration: 250
          }),
          timing(this.state.rightFinger, {
            toValue: WIDTH-40-50-5,
            duration: 250
          })
        ]),
        timing(this.state.marryRippleOpacity, {
          toValue: 0.5,
          duration: 250
        }),
        timing(this.state.marryViewFade, {
          toValue: 1,
          duration: 275
        }),
        timing(this.state.marryRippleOpacity, {
          toValue: 0,
          duration: 250
        }),
      ]),
      delay(250),
      sequence([
        parallel([
          timing(this.state.topFinger, {
            toValue: 30,
            duration: 250
          }),
          timing(this.state.rightFinger, {
            toValue: 40,
            duration: 250
          })
        ]),
        timing(this.state.killRippleOpacity, {
          toValue: 0.5,
          duration: 250
        }),
        timing(this.state.killViewFade, {
          toValue: 1,
          duration: 275
        }),
        timing(this.state.killRippleOpacity, {
          toValue: 0,
          duration: 250
        }),
      ]),
      parallel([
        timing(this.state.fuckViewFade, {
          toValue: 0,
          duration: 50
        }),
        timing(this.state.marryViewFade, {
          toValue: 0,
          duration: 50
        }),
        timing(this.state.killViewFade, {
          toValue: 0,
          duration: 50
        }),
        timing(this.state.fingerOpacity, {
          toValue: 0,
          duration: 50
        })
      ])
    ]).start(event => {
      if (event.finished) {
        if (this.state.firstAnimation) {
          this.setState({ firstAnimation: false, secondAnimation: true });
        } else {
          this.setState({ animated: false, secondAnimation: false });
        }
        if (this.state.animated) {
          this._onBoardingAnimation();
        }
      }
    });
  }  */

  statusBariOS() {
    if (Platform.OS == 'ios') {
      return (
        <View style={{ marginTop: 15 }}></View>
      );
    }
  }

  openPopUp(value){
    trackScreen('Onboarding_Video');
    this.setState({ isOpen: value, firstAnimation: true });
    this._onBoardingAnimation();
  }

  render() {
    let cor_fuck = CONSTANTS.colors1[0] += 'CC';
    let cor1_fuck = CONSTANTS.colors[0] += 'CC';
    let cor_marry = CONSTANTS.colors1[1] += 'CC';
    let cor1_marry = CONSTANTS.colors[1] += 'CC';
    let cor_kill = CONSTANTS.colors1[2] += 'CC';
    let cor1_kill = CONSTANTS.colors[2] += 'CC';
    return (
      <TouchableWithoutFeedback style={{top: 0, left: 0, position: 'absolute', width: WIDTH, height: HEIGHT }}>
        <Modal
          onDismiss={() => { this.setState({ isOpen: false }); } }
          offset={0}
          hideCloseButton={false}
          backdropType= 'blur'
          isVisible={this.state.isOpen}
          style={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}>
          <StatusBar backgroundColor={'grey'} translucent={false} barStyle="default"/>
          {this.statusBariOS() }
          <View style={{ flexGrow: 1, alignItems:'center', justifyContent:'center', height: 48, paddingTop: 20, flexDirection: 'row'}}>
            <Icon onPress={()=> { this.setState({isOpen: false}); trackEvent('Onboarding_Video', 'Click_Close');}} style={{marginTop: -20, position: 'absolute', left: 9, top: 23}} name={'cancel'} size={36} color={'white'}/>
            <Text style={{ fontFamily: 'Montserrat-Light', color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 28, textAlign: 'center', marginBottom:20 }}>{I18n.t('app.components.game.OnBoarding.howToPlay')}</Text>
          </View>
          {this.state.firstAnimation &&
            <View style={{ height: HEIGHT - 86, flexGrow: 1, alignItems:'center', justifyContent:'center' }}>
              <Animated.View style={{position: 'absolute', transform: [{ translateY: this.state.topFinger,translateX: this.state.rightFinger }], zIndex: 10, opacity: this.state.fingerOpacity}}>
                <Text style={{fontSize:50}}>👆</Text>
              </Animated.View>
              <Animated.View style={{ opacity: this.state.fuckViewFade, flex: 1, alignItems:'center', justifyContent:'center' }}>
                <LinearGradient style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }} start={{x:0, y:1}} end={{x:1, y:0}} colors={[cor_fuck, cor1_fuck]}>
                  <Animated.View style={{ opacity: this.state.fuckViewFade, flex: 1, width: WIDTH, alignItems: 'center', justifyContent: 'center' }}>
                    <GameTagIcon name='fuck' color="#ffffff" style={{ fontSize: 90, backgroundColor: 'transparent' }} />
                  </Animated.View>
                  <Animated.View style={{borderRadius: 40, opacity: this.state.fuckRippleOpacity, backgroundColor: 'white', height: 40, width: 40, position:'absolute', top: 80, right: 20 }}></Animated.View>
                </LinearGradient>
              </Animated.View>
              <Animated.View style={{ opacity: this.state.marryViewFade, flex: 1, alignItems:'center', justifyContent:'center' }}>
                <LinearGradient style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }} start={{x:0, y:1}} end={{x:1, y:0}} colors={[cor_marry, cor1_marry]}>
                  <Animated.View style={{ opacity: this.state.marryViewFade, flex: 1, width: WIDTH, alignItems: 'center', justifyContent: 'center' }}>
                    <GameTagIcon name='marry' color="#ffffff" style={{ fontSize: 90, backgroundColor: 'transparent' }} />
                  </Animated.View>
                  <Animated.View style={{borderRadius: 40, opacity: this.state.marryRippleOpacity, backgroundColor: 'white', height: 40, width: 40, position:'absolute', top: 20, left: 20 }}></Animated.View>
                </LinearGradient>
              </Animated.View>
              <Animated.View style={{ opacity: this.state.killViewFade, flex: 1, alignItems:'center', justifyContent:'center' }}>
                <LinearGradient style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }} start={{x:0, y:1}} end={{x:1, y:0}} colors={[cor_kill, cor1_kill]}>
                  <Animated.View style={{ opacity: this.state.killViewFade, flex: 1, width: WIDTH, alignItems: 'center', justifyContent: 'center' }}>
                    <GameTagIcon name='kill' color="#ffffff" style={{ fontSize: 86, backgroundColor: 'transparent' }} />
                  </Animated.View>
                  <Animated.View style={{borderRadius: 40, opacity: this.state.killRippleOpacity, backgroundColor: 'white', height: 40, width: 40, position:'absolute', top: 40, left: WIDTH/5 }}></Animated.View>
                </LinearGradient>
              </Animated.View>
              <Animated.View style={{ position:'absolute', top:(HEIGHT-86)*2/3, left:0, height:(HEIGHT-43)/3, opacity: this.state.marryViewFade_undo, flex: 1, alignItems:'center', justifyContent:'center' }}>
                <LinearGradient style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }} start={{x:0, y:1}} end={{x:1, y:0}} colors={[cor_marry, cor1_marry]}>
                  <Animated.View style={{ opacity: this.state.marryViewFade_undo, flex: 1, width: WIDTH, alignItems: 'center', justifyContent: 'center' }}>
                    <GameTagIcon name='marry' color="#ffffff" style={{ fontSize: 86, backgroundColor: 'transparent' }} />
                  </Animated.View>
                  <Animated.View style={{borderRadius: 40, opacity: this.state.marryRippleOpacity_undo, backgroundColor: 'white', height: 40, width: 40, position:'absolute', top: 40, left: WIDTH/5 }}></Animated.View>
                </LinearGradient>
              </Animated.View>
            </View>
          }
          {this.state.secondAnimation &&
            <View style={{ height: HEIGHT - 86, flexGrow: 1, alignItems:'center', justifyContent:'center' }}>
              <Animated.View style={{position: 'absolute', top:-48, left:0, opacity: this.state.matchOpacity, zIndex: 11}}>
                {this.renderMatch()}
              </Animated.View>
              <Animated.View style={{position: 'absolute', transform: [{ translateY: this.state.topFinger, translateX: this.state.rightFinger },], zIndex: 10, opacity: this.state.fingerOpacity}}>
                <Text style={{fontSize:50}}>👆</Text>
              </Animated.View>
              <Animated.View style={{ opacity: this.state.killViewFade, flex: 1, alignItems:'center', justifyContent:'center' }}>
                <LinearGradient style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }} start={{x:0, y:1}} end={{x:1, y:0}} colors={[cor_kill, cor1_kill]}>
                  <Animated.View style={{ opacity: this.state.killViewFade, flex: 1, width: WIDTH, alignItems: 'center', justifyContent: 'center' }}>
                    <GameTagIcon name='kill' color="#ffffff" style={{ fontSize: 90, backgroundColor: 'transparent' }} />
                    <Animated.View style={{borderRadius: 40, opacity: this.state.killRippleOpacity, backgroundColor: 'white', height: 40, width: 40, position:'absolute', top: 20, right: 50 }}></Animated.View>
                  </Animated.View>
                </LinearGradient>
              </Animated.View>
              <Animated.View style={{ opacity: this.state.fuckViewFade, flex: 1, alignItems:'center', justifyContent:'center' }}>
                <LinearGradient style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }} start={{x:0, y:1}} end={{x:1, y:0}} colors={[cor_fuck, cor1_fuck]}>
                  <Animated.View style={{ opacity: this.state.fuckViewFade, flex: 1, width: WIDTH, alignItems: 'center', justifyContent: 'center' }}>
                    <GameTagIcon name='fuck' color="#ffffff" style={{ fontSize: 90, backgroundColor: 'transparent' }} />
                    <Animated.View style={{borderRadius: 40, opacity: this.state.fuckRippleOpacity, backgroundColor: 'white', height: 40, width: 40, position:'absolute', top: 80, right: 20 }}></Animated.View>
                  </Animated.View>
                </LinearGradient>
              </Animated.View>
              <Animated.View style={{ opacity: this.state.marryViewFade, flex: 1, alignItems:'center', justifyContent:'center' }}>
                <LinearGradient style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }} start={{x:0, y:1}} end={{x:1, y:0}} colors={[cor_marry, cor1_marry]}>
                  <Animated.View style={{ opacity: this.state.marryViewFade, flex: 1, width: WIDTH, alignItems: 'center', justifyContent: 'center' }}>
                    <GameTagIcon name='marry' color="#ffffff" style={{ fontSize: 90, backgroundColor: 'transparent' }} />
                    <Animated.View style={{borderRadius: 40, opacity: this.state.marryRippleOpacity, backgroundColor: 'white', height: 40, width: 40, position:'absolute', top: 20, left: 40 }}></Animated.View>
                  </Animated.View>
                </LinearGradient>
              </Animated.View>
            </View>
          }
          {!this.state.animated &&
            <TouchableWithoutFeedback onPress={() => {trackEvent('Onboarding_Video', 'Click_Close_Overlay'); this.setState({isOpen: false});}}>
              <View style={{ height: HEIGHT - 86, flexGrow: 1, alignItems:'center', justifyContent:'center' }}>
                <View style={{ flex: 4, alignItems:'center', justifyContent:'center', marginRight: 20, marginLeft: 20 }} >
                  <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 28, textAlign: 'center', marginBottom: 15 }}>{I18n.t('app.components.game.OnBoarding.firstTap')}<GameTagIcon name='fuck' color="#ffffff" style={{ fontSize: 40, backgroundColor: 'transparent' }} /></Text>
                  <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 28, textAlign: 'center', marginBottom: 15 }}>{I18n.t('app.components.game.OnBoarding.secondTap')}<GameTagIcon name='marry' color="#ffffff" style={{ fontSize: 40, backgroundColor: 'transparent' }} /></Text>
                  <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 28, textAlign: 'center', marginBottom: 30 }}>{I18n.t('app.components.game.OnBoarding.thirdTap')}<GameTagIcon name='kill' color="#ffffff" style={{ fontSize: 40, backgroundColor: 'transparent' }} /></Text>
                </View>
                <View style={{ flex: 2, alignItems:'center', justifyContent:'flex-end', marginBottom: 40, marginRight: 20, marginLeft: 20 }} >
                  <Text style={{ fontFamily: 'Montserrat-Light',  color: '#FFFFFF', backgroundColor: 'transparent', fontSize: 16, textAlign: 'center', marginBottom: 80 }}>{I18n.t('app.components.game.OnBoarding.ifAnyone0')}{TYPES_TEXT} {I18n.t('app.components.game.OnBoarding.ifAnyone1')}</Text>
                  <TouchableOpacity style={[styles.loginButton, { backgroundColor: 'white'}]} onPress={() => {trackEvent('Onboarding_Video', 'Click_Got_It'); this.setState({isOpen: false});}} >
                    <Text style={{ fontFamily: 'Montserrat-Light', color: '#424949', backgroundColor: 'transparent', fontSize: 20 }}>{I18n.t('app.components.game.OnBoarding.gotIt')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          }
        </Modal>
      </TouchableWithoutFeedback>
    );
  }

  renderMatch() {
    return (
      <TouchableWithoutFeedback style={{top: 0, left: 0, position: 'absolute', width: WIDTH, height: HEIGHT}}>
        <LinearGradient style={{width: WIDTH, height: HEIGHT}} start={{x:0, y:1}} end={{x:1, y:0}} colors={[this.state.cor, this.state.cor1]}>
          <View style={{flex:1, justifyContent:'center', alignItems: 'center', margin: 20, marginBottom:0}}>
            <View style={{ justifyContent:'center', alignItems: 'center', margin: 10}}>
              <Text style={{fontFamily: 'Montserrat-Light', color: '#ffffff', fontSize: 17, marginBottom:10}}>
              {I18n.t('app.components.game.OnBoarding.youHave')}
              </Text>
              <GameTagIcon name={'marry'} color="#fff" style={{fontSize:90}} />
              <Text style={{fontFamily: 'Montserrat-Light', color: '#ffffff', fontSize: 17}}>
              {I18n.t('app.components.game.OnBoarding.match')}
              </Text>
            </View>
            {this.loadUserPictures()}
            <View style={{justifyContent:'center', alignItems: 'center'}}>
              <Text style={{fontFamily: 'Montserrat-Bold', color: '#ffffff', fontSize: 14, textAlign: 'center', lineHeight:20}}>
                {this.state.phrase1}
              </Text>
            </View>
            <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
              <TouchableOpacity style={[styles.loginButton, {marginBottom: 5}]} onPress={() =>{}}>
                <Text style={{fontFamily: 'Montserrat-Light', color: 'white', fontSize: 13}}>
                {I18n.t('app.components.game.OnBoarding.startChat')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.loginButton, {borderWidth:0}]} onPress={() =>{ this.setState({ animated: false, secondAnimation: false }); }}>
                <Text style={{fontFamily: 'Montserrat-Light', color: 'white', fontSize: 13}}>
                {I18n.t('app.components.game.OnBoarding.continuePlaying')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }

  loadUserPictures() {
    // TODO select proper image
    const imgUrl = "image.jpg"
    if(Meteor.user()){
      let urlPictureUser = {uri: Meteor.user().profile.picture};
      if (Meteor.user().profile.custom_picture) {
        urlPictureUser = {uri: Meteor.user().profile.custom_picture};
      }
      return(
        <View style={{flex:1,  justifyContent:'center', alignItems: 'center', flexDirection:'row'}}>
          <Image style={[styles.photoMatchPage, {marginRight: -10}]}/>
          <Image style={[styles.photoMatchPage, {marginLeft: -10}]}/>
        </View>
      );
    }
  }
}
