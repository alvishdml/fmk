import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default (styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  pageStyle: {
    alignItems: 'center',
    padding: 20,
  },

  viewPager: {
    flex: 1,
  },
  //---------INSTAGRAM ----//
  modalWarp: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  keyboardStyle: {
    flex: 1,
    paddingTop: -20,
  },
  webView: {
    flex: 1,
  },
  btnStyle: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 5,
    left: 5,
  },
  closeStyle: {
    width: 30,
    height: 30,
  },
  //----------LOGIN-----------//

  swipePageContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  swipePageTextContainer: {
    marginBottom: 20,
    top: 0,
    left: 0,
  },

  swipePageButtonContainer: {
    flex: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  swipePageText: {
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 11,
    marginLeft: 10,
    marginRight: 10,
  },

  rowStat: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsDisclaimer: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },

  statusText: {
    fontSize: 38,
    color: '#E5E7E9',
    marginTop: 10,
    fontFamily: 'Selima',
  },

  //-----------CHAT-----------//

  headerChat: {
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  //---------PROFILE----------//

  userProfileAndroid: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT - 48,
    flexDirection: 'column',
    alignItems: 'center',
  },

  userProfileAndroid2: {
    flex: 1,
    width: WIDTH,
    flexDirection: 'column',
    alignItems: 'center',
  },

  userProfile: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  userPhoto: {
    width: 85,
    height: 85,
    borderRadius: 43,
    marginTop: 5,
  },

  legendas: {
    fontSize: 21,
    marginTop: 15,
    marginBottom: 5,
    color: '#E5E7E9',
    fontFamily: 'Montserrat-Regular',
  },

  userAboutTextinput: {
    color: '#ffffff',
    fontSize: 11,
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: 'Montserrat-Regular',
  },

  userAboutTextinputNew: {
    color: 'rgb(63,66,67)',
    fontSize: 12,
    marginLeft: 10,
    marginRight: 10,
    top: -10,
    fontFamily: 'Montserrat-Regular',
    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1.3,
    borderStyle: 'solid',
  },

  userAboutTextinputNewTitle: {
    alignSelf: 'center',
    color: '#aeb7b7',
    paddingTop: 0,
    marginTop: 0,
    fontSize: 14,
    fontFamily: 'Montserrat-Light',
  },

  userAboutTextinputEdit: {
    color: 'rgb(63,66,67)',
    fontSize: 12,
    marginLeft: 10,
    marginRight: 10,
    top: 5,
    fontFamily: 'Montserrat-Regular',
  },

  userAboutText: {
    color: '#ffffff',
    fontSize: 11,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },

  statsContainer: {
    width: 100,
    height: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  legendasNumber: {
    fontSize: 35,
    color: '#E5E7E9',
    fontFamily: 'Montserrat-Light',
  },

  killStatsHidden: {
    alignItems: 'center',
  },

  killEmoticon: {
    fontSize: 18,
    color: '#E5E7E9',
    fontFamily: 'Montserrat-Light',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  killEmoticonText: {
    color: '#E5E7E9',
    fontFamily: 'Montserrat-Light',
    fontSize: 8,
    marginTop: -10,
    marginBottom: 10,
  },

  statsContainerMaster: {
    width: 120,
    height: 120,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //---------SETTINGS----------//

  settingsContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },

  tituloSettings: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 2,
    color: '#E5E7E9',
    fontFamily: 'Montserrat-bold',
  },

  subtituloSettings: {
    fontSize: 17,
    marginTop: 2,
    marginBottom: 2,
    color: '#E5E7E9',
    fontFamily: 'Montserrat-light',
  },

  settingsButton: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },

  //-------------------------//

  textOnboardingPlaceholder: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },

  containerIndex: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },

  logo: {
    width: 300,
    height: 300,
    justifyContent: 'space-around',
    marginBottom: 50,
  },

  buttonBackNav: {
    marginLeft: 10,
    width: 32,
    height: 32,
  },

  instaloginButton: {
    width: 280,
    height: 50,
    borderWidth: 1,
    backgroundColor: '#d34cb9',
    borderStyle: 'solid',
    borderColor: '#d34cb9',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 4,
  },
  inviteButton: {
    width: 280,
    height: 50,
    backgroundColor: '#3b5998',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 4,
  },
  loginButton: {
    width: 280,
    height: 50,
    backgroundColor: '#3b5998',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: 4,
  },
  emailButton: {
    width: 280,
    height: 50,
    backgroundColor: '#f77235',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: 4,
  },

  popUpButton: {
    width: 280,
    height: 50,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderColor: 'transparent',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },

  rowLegenda: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  container: {
    justifyContent: 'center',
  },
  container2: {
    justifyContent: 'space-around',
    flexGrow: 1,
    backgroundColor: '#424949',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#424949',
  },

  headerConfirm: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#424949',
  },

  headerConfirmiOS: {
    height: 65,
    flexDirection: 'row',
    paddingTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#424949',
  },

  headerBackNav: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#424949',
  },

  headerBackNaviOS: {
    height: 65,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#424949',
  },

  headeriOS: {
    height: 70,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#424949',
  },

  imageButton: {
    width: 32,
    height: 32,
  },

  button: {
    marginRight: 10,
    width: 32,
    height: 32,
  },

  headerDrawer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 30,
    paddingBottom: 10,
    marginLeft: 10,
    alignItems: 'center',
    backgroundColor: '#424949',
  },

  footerDrawer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#424949',
  },

  userProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userStatContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  userOptionsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },

  tagNotificationContainer: {
    width: 16,
    height: 16,
    marginLeft: 15,
    marginTop: 15,
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  tagStatusContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#875F9A',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  nomePreview: {
    fontFamily: 'Montserrat-Bold',
    color: '#585858',
    fontSize: 14,
  },

  tagStatus: {
    width: 30,
    height: 30,
  },

  legendaContainer: {
    width: 80,
    height: 20,
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
  },

  loadingPage: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgb(204,204,204)',
  },

  loadingPageFix: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    backgroundColor: 'rgb(204,204,204)',
  },

  containerHistory: {
    flex: 1,
    backgroundColor: '#9E9D9B',
  },

  profileUserHistory: {
    flex: 1,
    width: 80,
    justifyContent: 'center',
    margin: 5,
    alignItems: 'center',
  },

  photoHistory: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  dateText: {
    fontSize: 11,
    color: '#ffffff',
    marginRight: 15,
  },
  dateContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 7,
    alignItems: 'center',
  },
  labelStyle: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 10,
    marginRight: 5,
  },
  checkboxStyle: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    height: 35,
  },

  profilePage: {
    flex: 1,
  },

  photoProfilePageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nomeProfilePageContainer: {
    height: 75,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nomeSize: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
  },

  infoProfilePageContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },

  centerInfoContainer: {
    flex: 1,
  },

  photoProfilePage: {
    width: 225,
    height: 225,
    borderRadius: 50,
  },

  photoMatchPage: {
    width: 125,
    height: 125,
    borderRadius: 65,
  },

  linhaProfile: {
    flexDirection: 'row',
    margin: 5,
  },

  topicoProfile: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  infoProfile: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'normal',
  },

  sliderSettings: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7,
    marginBottom: 7,
  },

  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  item: {
    margin: 10,
    width: 150,
    height: 150,
  },
  swipeout: {
    backgroundColor: '#424949',
  },
  simboloNotify: {
    width: 40,
    height: 40,
  },
  backgroundColorSimbolo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rateStars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  skipButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: WIDTH / 2 - WIDTH / 4 / 2,
    width: WIDTH / 4,
    height: 40,
    paddingTop: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },

  skipButtonText: {
    color: 'rgba(204,204,204,0.8)',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    textAlign: 'center',
  },

  photoSlide: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    width: Dimensions.get('window').width - 50,
    height: 60,
  },

  photoSlideSinglePic: {
    height: (Dimensions.get('window').height - 40) / 11,
    width: Dimensions.get('window').width / 7,
    // margin: 5,
    marginLeft: 10,
    marginRight: 10,
  },

  singlePhotoProfile: {
    height: (Dimensions.get('window').height - 40) / 11,
    width: Dimensions.get('window').width / 7,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  photoSlideSinglePicSelected: {
    height: (Dimensions.get('window').height - 40) / 11,
    width: Dimensions.get('window').width / 7,
    // marginLeft: 5,
    // marginRight: 5,
    borderColor: '#FF7085',
    borderWidth: 0,
    borderBottomWidth: 12,
    borderStyle: 'solid',
  },

  photoSlideAddPhoto: {
    height: (Dimensions.get('window').height - 40) / 11,
    width: Dimensions.get('window').width / 6,
    margin: 5,
  },

  bioWithInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'rgba(181,83,83,0.5)'
  },

  singlePhotoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },

  photoSlideSAddStyle: {
    height: (Dimensions.get('window').height - 40) / 11,
    width: Dimensions.get('window').width / 7,
    marginTop: 5,
  },

  photoSlideSAddStyleFirstTime: {
    height: (Dimensions.get('window').height - 40) / 9,
    width: Dimensions.get('window').width * 0.8,
    marginTop: 5,
    backgroundColor: 'rgba(231,202,202,0.7)',
    borderRadius: 10,
    paddingLeft: Dimensions.get('window').width * 0.07,
    paddingRight: Dimensions.get('window').width * 0.07,
  },

  flagUnselected: {
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
  },

  flagSelected: {
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#206cd8',
    borderRadius: 2,
  },
}));
