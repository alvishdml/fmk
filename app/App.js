/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  I18nManager,  
} from 'react-native';

import { Scene, Router, ActionConst, Actions } from 'react-native-router-flux';
import Menu, { MenuContext } from 'react-native-menu';
import AlertC from './utilities/Alert';
import codePush from 'react-native-code-push';
import Meteor from '@meteorrn/core';
import OneSignal from 'react-native-onesignal';
import branch from 'react-native-branch';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loading from './components/Loading';
import Login from './login';
import emailSignInForm from './components/login/email/signInForm.js';
import emailSignUpForm from './components/login/email/signUpForm.js';
import InstagramOnBoarding from './components/login/InstagramOnBoarding.js';
import MainPage from './mainPage';
import NewMatchPage from './components/newMatch/NewMatch';
import ChatWindow from './components/ChatWindow';
import FacebookPhotos from './components/facebookPhotos/FacebookAlbumList';
import PhotoMenu from './components/facebookPhotos/PhotoMenu';
import AlbumPhotosPage from './components/facebookPhotos/AlbumPhotosPage';
import ConfirmPhoto from './components/facebookPhotos/confirmPhoto';
import CustomAlert from './components/CustomAlert';

import OneSignalPush from './utilities/OneSignalPush';
import DeleteAccount from './components/SettingsComponents/DeleteAccount';
import Feedback from './components/SettingsComponents/Feedback';
import UniRaceTemp from './components/uniRace/UniRaceTemp';
import UniRace from './components/uniRace/UniRace';
import UniRank from './components/uniRace/UniRank';
import AddSchool from './components/uniRace/AddSchool';
import MonetizationMainMenu from './components/monetization/MonetizationMainMenu';
import WhoVoted from './components/monetization/WhoVoted';
import CustomWebView from './components/SettingsComponents/CustomWebView';
import InstagramAlbumPhotoPage from './components/facebookPhotos/InstagramPhotos/InstagramAlbumPhotoPage';




// Production server
const url = 'wss://app.playfmk.com/websocket';
// const url = 'wss://dmk-back.foobar.in/websocket';
// Staging server
// const url = 'ws://40.85.94.160/websocket';
// // Local server
// const url = 'ws://ebada6e1.ngrok.io/websocket';

Meteor.connect(url);

I18nManager.allowRTL(false);

const App = () => {

  useEffect(() => {

    
    //OneSignal.inFocusDisplaying(0);    

    branch.subscribe(bundle => {
      if (
        bundle.params['+clicked_branch_link'] &&
        bundle.params &&
        bundle.params.user_id
      ) {
        if (bundle.params['~campaign'] == 'shareChallenge') {
          AsyncStorage.setItem('referrerShareChallenge', bundle.params.user_id);
        } else {
          if (bundle.params['~channel'] !== 'skip') {
            AsyncStorage.setItem('referrer', bundle.params.user_id);
            if (bundle.params.uniChallengeId) {
              Meteor.call(
                'setUni',
                bundle.params.user_id,
                bundle.params.uniChallengeId
              );
            }
          } else if (bundle.params['~channel'] === 'skip') {
            AsyncStorage.setItem('referrerSkip', bundle.params.user_id);
          }
        }
      }
    });

  }, []);

  const onExitApp = () => {
    AlertC.showAlert('Teste', 'Do you really want to quit?', 'exitApp');
    return true;
  };

  return (
    <View style={{ flex: 1 }}>
    <MenuContext style={{ flex: 1 }}>
      <Router onExitApp={ onExitApp}>
        <Scene
          key="root"
          initial={true}
          style={{ backgroundColor: '#424949' }}
          type={ActionConst.REPLACE}
          >
          <Scene
            key="landing"
            component={Loading}
            hideNavBar={true}
            panHandlers={null}
            animation="fade"
          />
          <Scene
            key="login"
            component={Login}
            hideNavBar={true}
            panHandlers={null}
            animation="fade"
            type={ActionConst.REPLACE}
          />
          <Scene
            key="emailSignInForm"
            component={emailSignInForm}
            hideNavBar={true}
            panHandlers={null}
            animation="fade"
          />
          <Scene
            key="emailSignUpForm"
            component={emailSignUpForm}
            hideNavBar={true}
            panHandlers={null}
            animation="fade"
          />
          <Scene
            key="instagramOnBoarding"
            component={InstagramOnBoarding}
            hideNavBar={true}
            panHandlers={null}
            animation="fade"
          />
          <Scene
            key="mainPage"
            ref="mainPage"
            component={MainPage}
            index={this}
            idUser="..."
            hideNavBar={true}
            type={ActionConst.RESET}
            panHandlers={null}
            animation="fade"
            initialPage={1}
          />
          <Scene
            key="facebookPhotos"
            component={FacebookPhotos}
            hideNavBar={true}
            animation="fade"
          />
          <Scene
            key="photoMenu"
            component={PhotoMenu}
            hideNavBar={true}
            animation="fade"
          />
          <Scene
            key="albumPage"
            component={AlbumPhotosPage}
            idAlbum="..."
            hideNavBar={true}
            animation="fade"
          />
          <Scene
            key="confirmPhoto"
            type={ActionConst.RESET}
            component={ConfirmPhoto}
            urlPhoto="..."
            hideNavBar={true}
            animation="fade"
          />
          <Scene
            key="newMatchPage"
            component={NewMatchPage}
            matchType="..."
            idMatch="..."
            idOtherUser="..."
            animation="fade"
            hideNavBar={true}
          />
          <Scene
            key="chatWindow"
            idMatch="..."
            first="..."
            second="..."
            matchType="..."
            numPaginasPop="0"
            unmounted={false}
            component={ChatWindow}
            duration={200}
            animation="fade"
            hideNavBar={true}
          />
          <Scene
            key="deleteAccount"
            component={DeleteAccount}
            animation="fade"
          />
          <Scene key="feedback" component={Feedback} animation="fade" />
          <Scene key="uniRace" component={UniRace} animation="fade" />
          <Scene key="uniRank" component={UniRank} animation="fade" />
          <Scene
            key="uniRaceTemp"
            component={UniRaceTemp}
            animation="fade"
          />
          <Scene key="addSchool" component={AddSchool} animation="fade" />
          <Scene
            key="MonetizationMainMenu"
            component={MonetizationMainMenu}
            animation="fade"
          />
          <Scene key="whoVoted" component={WhoVoted} animation="fade" />
          <Scene
            key="customWebView"
            component={CustomWebView}
            animation="fade"
          />
          <Scene
            key="instagramAlbumPhotoPage"
            component={InstagramAlbumPhotoPage}
            animation="fade"
          />
        </Scene>
      </Router>
    </MenuContext>
    <CustomAlert />
    {/* <OneSignalPush /> */}
  </View>
  );
};


export default App 
// export default (App = codePush({
//   checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
//   installMode: codePush.InstallMode.ON_NEXT_RESUME,
// })(App));