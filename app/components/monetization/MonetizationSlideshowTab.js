import React, { Component } from 'react';
import {AppEventsLogger} from 'react-native-fbsdk';
import I18n from '../../../config/i18n';
import Meteor from '@meteorrn/core';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import GoogleAnalytics from 'react-native-google-analytics-bridge';
import {
  trackScreen,
  trackEvent,
  trackRevenue,
} from '../../utilities/Analytics';
import Alert from '../../utilities/Alert';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';
import InAppBilling from 'react-native-billing';
import branch from 'react-native-branch'
import firebase from '../../utilities/Firebase';

const purchaseId = [
  ['com.playfmk.50profiles','com.playfmk.30profile', 'com.playfmk.15profiles'],
  ['com.playfmk.30winks','com.playfmk.20winks', 'com.playfmk.10winks'],
  ['com.playfmk.72hboost', 'com.playfmk.48hboost', 'com.playfmk.24hboost'],
  ['com.playfmk.subscription1', 'com.playfmk.subscription3', 'com.playfmk.subscription6'], // not available now
  ['fmk.powervote.f','fmk.powervote.m','fmk.powervote.k'],
  ['com.playfmk.subs.1week', 'com.playfmk.subs.1month', 'com.playfmk.subs.3month'],
  ['com.playfmk.powervotes50', 'com.playfmk.powervotes30', 'com.playfmk.powervotes10'],
]

const purchaseIdDisc = [
  ['com.playfmk.50profilesdisc','com.playfmk.30profiledisc', 'com.playfmk.15profilesdisc'],
  ['com.playfmk.30winksdisc','com.playfmk.20winksdisc', 'com.playfmk.10winksdisc'],
  ['com.playfmk.72hboostdisc', 'com.playfmk.48hboostdisc', 'com.playfmk.24hboostdisc'],
  ['com.playfmk.subscription1', 'com.playfmk.subscription3', 'com.playfmk.subscription6'], // not available now
  ['fmk.powervote.f','fmk.powervote.m','fmk.powervote.k'],
  ['com.playfmk.subs.1week', 'com.playfmk.subs.1month', 'com.playfmk.subs.3month'],
  ['com.playfmk.powervotes50disc', 'com.playfmk.powervotes30disc', 'com.playfmk.powervotes10disc'],
]

const showPricePerWeek = true;
const showPricePerMonth = false;

let advert;
let AdRequest;
let request;
let buildRequest;

let branchUniversalObject;

export default class MonetizationSlideshow extends Component {
  constructor(props) {

    super(props);
    this.state = {
      shouldSlide: false,
      activePage: 0,
      adError: true,
      adLoaded: false,
      blockVideo: true,
      reason: "",
      masgTitle: "",
      msgCopy: "",
      msgPercentage: "",
      prices: [
        ['','', ''],
        ['','', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ]
    }
    advert = firebase.admob().rewarded('ca-app-pub-9082813645111838/4091413868');
    AdRequest = firebase.admob.AdRequest;
  }

  componentWillMount(){
    this.updatePurchased()
    this.loadPrices()
  }

  componentDidMount(){
    trackScreenView('Monetization');

    // Stop giving free features for ads for now
    // To restore, set also state.blockVideo and state.adError to false in the beginning
    // this.loadAdRequest();
  }

  loadAdRequest() {
    // request = new AdRequest();
    // request.setGender(Meteor.user().profile.gender)
    // builtRequest = request.build();

    // advert.loadAd(builtRequest);
    // advert.on('onAdLoaded', () => {
    //   GoogleAnalytics.trackEvent('Advertisement', "loaded")
    //   this.setState({adLoaded: true})
    // });

    // advert.on('onAdFailedToLoad', (err) => {
    //   GoogleAnalytics.trackEvent('Advertisement', "failed to load")
    //   this.setState({adError: true})
    // })

    // advert.on('onAdClosed', () => {
    //   GoogleAnalytics.trackEvent('Advertisement', "closed")
    //   this.loadAdRequest();
    // })

    // advert.on('onAdOpened', () => {
    //   GoogleAnalytics.trackEvent('Advertisement', "opened")
    // })

    // advert.on('onRewarded', (event) => {
    //   GoogleAnalytics.trackEvent('Advertisement', "rewarded")
    //   var qty = 0;
    //   var message = I18n.t('app.components.monetization.MonetizationSlideShowTab.rewardMessage0');
    //   if(this.state.adType == "profiles"){
    //     qty = 1
    //     message = I18n.t('app.components.monetization.MonetizationSlideShowTab.rewardMessage1')
    //   } else if(this.state.adType == "boost"){
    //     qty = 1
    //     message = I18n.t('app.components.monetization.MonetizationSlideShowTab.rewardMessage2')
    //   }
    //   Meteor.call("videoReward", Meteor.user()._id, this.state.adType, qty, (err, res) => {
    //   })
    //   Alert.showAlert('', message, '')

    // });
  }

  loadPrices(){
    Meteor.call("showDiscount", Meteor.user()._id, async (err, val)=>{
      if(!err && val){
        // Show discounted prices
        this.setState({showDiscount: true, reason: val.reason, msgTitle: val.msgTitle, msgCopy: val.msgCopy, msgPercentage: val.msgPercentage})
        await InAppBilling.close();
        try {
          await InAppBilling.open();
          var prices = [];
          // console.log('first');
          for(var i = 0; i < 7; i++){
            var pricesLine = []
            var selectedIds = purchaseIdDisc[i]
            if(i !== 3 || i !== 5) {
              var products = await InAppBilling.getProductDetailsArray(selectedIds)
            } else {
              var products = await InAppBilling.getSubscriptionDetailsArray(selectedIds)
              products.sort(this.compareProductsDesc);
            }
            for(var j in products){
              pricesLine.push(products[j].introductoryPriceText || products[j].priceText)
            }
            // console.log(pricesLine);
            prices.push(pricesLine)
          }
          this.setState({prices: prices});
        } catch (err) {
        } finally {
          await InAppBilling.close();
        }

      } else if((!err && val == false) || (err && err.error == 404)){
        this.setState({showDiscount: false})
        await InAppBilling.close();
        try {
          await InAppBilling.open();
          var prices = [];
          // console.log('second');
          for(var i = 0; i < 7; i++){
            var pricesLine = []
            var selectedIds = purchaseId[i]
            if(i === 3 || i === 5) {
              // console.log(`subscriptions ${selectedIds}`);
              var products = await InAppBilling.getSubscriptionDetailsArray(selectedIds)
              console.log(products);
              products.sort(this.compareProductsDesc);
            } else {
              // console.log(`consumables ${selectedIds}`);
              var products = await InAppBilling.getProductDetailsArray(selectedIds)
            }
            for(var j in products){
              // console.log(products[j]);
              pricesLine.push(products[j].introductoryPriceText || products[j].priceText)
            }
            // console.log(pricesLine);
            // console.log(`line ${i} has prices: ${pricesLine}`);
            prices.push(pricesLine)
          }
          // console.log('ALL:');
          // console.log(prices);
          this.setState({prices: prices});
        } catch (err) {
          firebase.crash().isCrashCollectionEnabled()
          .then((enabled) => {
            if (enabled) {
              firebase.crash().log(`
                MonetizationSlideShowTab.js:loadPrices()
                Something went wrong getting prices
                userID => ${Meteor.user()._id}
                `);
                firebase.crash().report(err);
              }
            })
          } finally {
            await InAppBilling.close();
          }
        }
      })
    }


    compareProductsDesc(a,b) {
      if (a.priceValue < b.priceValue)
      return 1;
      if (a.priceValue > b.priceValue)
      return -1;
      return 0;
    }

    updatePurchased() {
      Meteor.call('purchasedItems', Meteor.user()._id, (err, result) => {
        if(!err){
          this.setState({purchased: result, downloadPurchased:true})
        }
      })
    }


/*     renderHeader(){
      var WIDTH = Dimensions.get('window').width;
      var header = <View style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          width: WIDTH,
          height: 45,
          position:'absolute',
          top:0,
          zIndex:10
        }}>
        <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'flex-start', height: 43, width:WIDTH,
          backgroundColor: 'transparent'}}>
          <TouchableOpacity onPress={() => { Actions.mainPage();} }>
            <Icon style={{ marginLeft: 15, backgroundColor: 'transparent' }} name={'keyboard-arrow-left'} size={30} color={'#fff'}/>
          </TouchableOpacity>
          <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-around', width:WIDTH-45}}>
            <Text style={{
                fontSize: 17,
                color: '#ffffff',
                fontFamily: 'Montserrat-Regular',
                backgroundColor: 'transparent',
                marginBottom: 0,
                marginTop: 0
              }}>
              {I18n.t('app.components.monetization.MonetizationSlideShowTab.moreFun')}
            </Text>
          </View>
        </View>
        <View style={{ height: 1, width:WIDTH*0.8, backgroundColor:'rgba(255,255,255,0.4)', zIndex:10}} ></View>
      </View>;
      return header;
    } */

    shuffle(a) {
      for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
      }
    }

    createSliderElements(){
      var elements = [];
      var WIDTH = Dimensions.get('window').width;
      var HEIGHT = Dimensions.get('window').height - 60;

      // Who voted for you
      elements.push(<View key="profiles" style={{
        height:HEIGHT, width:WIDTH,
      }} className="sliderContainer">
      <MonetizationElement
        title={I18n.t('app.components.monetization.MonetizationSlideShowTab.monetizationElementTitle')}
        icon='/images/zoom.png'
        desc={
          <View>
            <TouchableOpacity onPress={()=>{
                Actions.whoVoted({typeSelected: 'fuck', showStats: true});
              }}>
              <Text style={{ fontFamily: 'Montserrat-Light', textAlign:'center', margin:0, marginLeft:10, marginRight:10, marginBottom:0, fontSize: 15, color: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              {I18n.t('app.components.monetization.MonetizationSlideShowTab.desc0')}<Text style={{ fontFamily: 'Montserrat-Light', textDecorationLine: 'underline', textAlign:'center', margin:0, marginLeft:10, marginRight:10, marginBottom:0, fontSize: 15, color: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              {I18n.t('app.components.monetization.MonetizationSlideShowTab.desc1')}</Text> {I18n.t('app.components.monetization.MonetizationSlideShowTab.desc2')}
              </Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Montserrat-Light', textAlign:'center', margin:0, marginLeft:10, marginRight:10, marginBottom:10, fontSize: 15, color: '#fff', justifyContent: 'center', alignItems: 'center' }}>
            {I18n.t('app.components.monetization.MonetizationSlideShowTab.learnMore')}
            </Text>
          </View>}
          unit1={I18n.t('app.components.monetization.MonetizationSlideShowTab.profiles')}
          unit2={I18n.t('app.components.monetization.MonetizationSlideShowTab.profiles')}
          unit3={I18n.t('app.components.monetization.MonetizationSlideShowTab.profiles')}
          qty1='50'
          qty2='30'
          qty3='15'
          price1={this.state.prices[0][2]}
          price2={this.state.prices[0][1]}
          price3={this.state.prices[0][0]}
          cta={I18n.t('app.components.monetization.MonetizationSlideShowTab.seeWhoVoted')}
          freecta={I18n.t('app.components.monetization.MonetizationSlideShowTab.freeCredits')}
          color='rgb(52,73,94)'
          type='profiles'
          grad1='rgba(142,68,173,0.9)'
          grad2='rgba(52,73,94,1.0)'
          container = {this}
          />
      </View>)

      // Winks
      elements.push(<View key="winks" style={{ height:HEIGHT, width:WIDTH
    }} className="sliderContainer">
    <MonetizationElement
      title={I18n.t('app.components.monetization.MonetizationSlideShowTab.winkTitle')}
      icon='/images/wink.png'
      desc={I18n.t('app.components.monetization.MonetizationSlideShowTab.winksDesc')}
      unit1={I18n.t('app.components.monetization.MonetizationSlideShowTab.winks')}
      unit2={I18n.t('app.components.monetization.MonetizationSlideShowTab.winks')}
      unit3={I18n.t('app.components.monetization.MonetizationSlideShowTab.winks')}
      qty1='30'
      qty2='20'
      qty3='10'
      price1={this.state.prices[1][2]}
      price2={this.state.prices[1][1]}
      price3={this.state.prices[1][0]}
      cta={I18n.t('app.components.monetization.MonetizationSlideShowTab.winkStart')}
      color='rgb(248,138,8)'
      type='winks'
      grad1='rgba(247,91,104,0.8)'
      grad2='rgba(248,138,8,1.0)'
      container = {this}
      />
  </View>)

  // Boost
  elements.push(<View key="boost" style={{
    height:HEIGHT, width:WIDTH,
  }} className="sliderContainer">
  <MonetizationElement
    title={I18n.t('app.components.monetization.MonetizationSlideShowTab.boostProfile')}
    icon='/images/boost.png'
    desc={I18n.t('app.components.monetization.MonetizationSlideShowTab.boostDesc')}
    unit1={I18n.t('app.components.monetization.MonetizationSlideShowTab.boost')}
    unit2={I18n.t('app.components.monetization.MonetizationSlideShowTab.boost')}
    unit3={I18n.t('app.components.monetization.MonetizationSlideShowTab.boost')}
    qty1='72'
    qty2='48'
    qty3='24'
    price1={this.state.prices[2][2]}
    price2={this.state.prices[2][1]}
    price3={this.state.prices[2][0]}
    cta={I18n.t('app.components.monetization.MonetizationSlideShowTab.boostProfile')}
    freecta={I18n.t('app.components.monetization.MonetizationSlideShowTab.boostCTA')}
    color='rgb(0,75,181)'
    type='boost'
    grad1='rgba(0,203,179,0.8)'
    grad2='rgba(0,75,181,1.0)'
    container = {this}
    />
</View>)

// Subscription OLD
// elements.push(<View key="subscription" style={{
//   height:HEIGHT, width:WIDTH,
// }} className="sliderContainer">
// <MonetizationElement
//   title="Golden Subscription"
//   icon='/images/full.png'
//   desc={"See all the people that voted for you\nAppear first with a 6 hours boost everyday\nGet 60 winks (2 per day)"}
//   unit1='Months'
//   unit2='Months'
//   unit3='Months'
//   qty1='1'
//   qty2='3'
//   qty3='6'
//   price1={this.state.prices[3][2]}
//   price2={this.state.prices[3][1]}
//   price3={this.state.prices[3][0]}
//   cta='S U B S C R I B E &nbsp; N O W'
//   color='#1a1a1a'
//   type='subscription'
//   grad1='#1a1a1a'
//   grad2='#1a1a1a'
//   container = {this}
//   />
// </View>)

// Subscription
elements.push(<View key="subscription" style={{
  height:HEIGHT, width:WIDTH,
}} className="sliderContainer">
<MonetizationElement
  title={I18n.t('app.components.monetization.MonetizationSlideShowTab.subscriptionTitle')}
  icon='/images/full.png'
  desc={I18n.t('app.components.monetization.MonetizationSlideShowTab.subscriptionDesc')}
  unit1={I18n.t('app.components.monetization.MonetizationSlideShowTab.week')}
  unit2={I18n.t('app.components.monetization.MonetizationSlideShowTab.month')}
  unit3={I18n.t('app.components.monetization.MonetizationSlideShowTab.month')}
  qty1='1'
  qty2='1'
  qty3='3'
  qtyCalc1='1'
  qtyCalc2='4'
  qtyCalc3='12'
  popular
  price1={this.state.prices[5][2]}
  price2={this.state.prices[5][1]}
  price3={this.state.prices[5][0]}
  cta={I18n.t('app.components.monetization.MonetizationSlideShowTab.subscriptionCTA')}
  color='#1a1a1a'
  type='subscription'
  grad1='#1a1a1a'
  grad2='#1a1a1a'
  container = {this}
  />
</View>)

// Test
elements.push(<View key="referral" style={{
  height:HEIGHT, width:WIDTH,
}} className="sliderContainer">
<MonetizationElement
  title={I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteTitle')}
  secondtitle = {I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteSecondTitle')}
  thirdtitle = {I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteThirdTitle')}
  icon='/images/refer.png'
  desc={I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteDesc0')}
  desc2={I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteDesc1')}
  unit1=''
  unit2=''
  unit3=''
  // qty1='5'
  // qty2='1'
  // qty3='5'
  price1={-1}
  price2={-1}
  price3={-1}
  cta={I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteCTA')}
  color='#9cda5f'
  type='referral'
  grad1='#2fb161'
  grad2='#9cda5f'
  container = {this}
  />
</View>)

// Power Vote OLD
// elements.push(<View key="powerVote" style={{
//   height:HEIGHT, width:WIDTH,
// }} className="sliderContainer">
// <MonetizationElement
//   title="Power Vote"
//   icon='/images/three-stars.png'
//   desc="Give F*ck, Marry or Kill to all the three users. Why choosing when you can give all the same vote?"
//   unit1='All - 20 Times'
//   unit2='All - 20 Times'
//   unit3='All - 20 Times'
//   qty1='Fuck'
//   qty2='Marry'
//   qty3='Kill'
//   price1="€2.99"
//   price2="€2.99"
//   price3="€2.99"
//   cta='P O W E R   V O T E   N O W'
//   color='#0B635C'
//   type='powerVote'
//   grad1='#11998e'
//   grad2='#0B635C'
//   container = {this}
//   />
// </View>)

// Power Vote
elements.push(<View key="powerVote" style={{
  height:HEIGHT, width:WIDTH,
}} className="sliderContainer">
<MonetizationElement
  title={I18n.t('app.components.monetization.MonetizationSlideShowTab.powervoteTitle')}
  icon='/images/three-stars.png'
  desc={I18n.t('app.components.monetization.MonetizationSlideShowTab.powervoteDesc')}
  unit1={I18n.t('app.components.monetization.MonetizationSlideShowTab.powervoteUnit')}
  unit2={I18n.t('app.components.monetization.MonetizationSlideShowTab.powervoteUnit')}
  unit3={I18n.t('app.components.monetization.MonetizationSlideShowTab.powervoteUnit')}
  qty1='50'
  qty2='30'
  qty3='10'
  price1={this.state.prices[6][2]}
  price2={this.state.prices[6][1]}
  price3={this.state.prices[6][0]}
  cta={I18n.t('app.components.monetization.MonetizationSlideShowTab.powervoteCTA')}
  color='#0B635C'
  type='powerVoteAll'
  grad1='#11998e'
  grad2='#0B635C'
  container = {this}
  />
</View>)



/*Old color on the referral element from the swiper*/
{/*  color='rgb(52,73,94)'
  type='referral'
  grad1='#1d2e47ee'
  grad2='#411744ee'*/}



  // Power Vote
  // elements.push(<View key="boost" style={{
  //   height:HEIGHT, width:WIDTH,
  // }} className="sliderContainer">
  // <MonetizationElement
  //   title="Power vote"
  //   icon='/images/star.png'
  //   desc='Unlock a new button to whether F*ck or Kill all three profiles'
  //   unit='Votes'
  //   qty1='30'
  //   qty2='20'
  //   qty3='10'
  //   price1='2,55€'
  //   price2='1,90€'
  //   price3='0,95€'
  //   cta='G E T &nbsp; T H E &nbsp; P O W E R &nbsp; V O T E'
  //   color='rgb(133, 89, 133)'
  //   type='power'
  //   grad1='rgba(103, 114, 139,0.8)'
  //   grad2='rgba(133, 89, 133,1.0)'
  //   container = {this}
  //   />
  // </View>)

  // Complete
  // elements.push(<View key="boost" style={{
  //   height:HEIGHT, width:WIDTH,
  // }} className="sliderContainer">
  // <MonetizationElement
  //   title="Full package"
  //   icon='/images/full.png'
  //   desc={'Collect 2 winks per day\nUnlock 5 profiles who voted for you per day\nEnjoy a 6hrs boost everyday\nUnlimited power vote'}
  //   unit='Months'
  //   qty1='6'
  //   qty2='3'
  //   qty3='1'
  //   price1='11,95€'
  //   price2='13,95€'
  //   price3='15,95€'
  //   cta='S U B S C R I B E &nbsp; N O W'
  //   color='rgb(182, 56, 161)'
  //   type='complete'
  //   grad1='rgba(248,138,8,1.0)'
  //   grad2='rgba(182, 56, 161,1.0)'
  //   container = {this}
  //   />
  // </View>)

  // this.shuffle(elements);
  this.state.sliderElements = elements
  return elements;
}

render(){
  var WIDTH = Dimensions.get('window').width;
  var HEIGHT = Dimensions.get('window').height - 60;

  if(this.state.shouldSlide){
    trackEvent('Monetization', 'SlideViewed', {"label": this.state.sliderElements[0].key})
  }

  var dotColor =  '#fff';

  return(
    <View id={"mainContainer"} style={{
        width:WIDTH, height: HEIGHT, backgroundColor: '#fff', flex: 1,
        justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column'}}>
        <View style={{width:WIDTH, height:HEIGHT, top:0, left:0 }}>

          <Swiper
            ref='swiper'
            height={HEIGHT}
            loop={true}
            autoplay={this.state.shouldSlide}
            autoplayTimeout={3}
            onMomentumScrollEnd ={(state, context)=> {
              var currentPage = context.index
              // if(state.nativeEvent.position == 3 || state.nativeEvent.position == 4){
              //   currentPage = state.nativeEvent.position - 1
              // } else {
              //   currentPage = 0;
              // }
              trackEvent('Monetization', 'SlideViewed', {"label":this.state.sliderElements[currentPage].key})
              if(currentPage == this.state.sliderElements.length-1){
                this.setState({shouldSlide:false, activePage: currentPage})
              } else {
                this.setState({
                  activePage: currentPage,
                })
              }
            }}
            dot={
              <View style={{backgroundColor:'rgba(0,0,0,.2)', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />
            }
            activeDot={
              <View style={{ backgroundColor: dotColor, width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop:3, marginBottom: 3 }} />
            }>

            {this.createSliderElements()}

          </Swiper>
        </View>
      </View>)
    }
  }

  class MonetizationElement extends Component {

    constructor(props) {
      super(props);
      this.state = {
        selected: props.type === 'subscription' ? 1 : 0
      }
    }

    componentWillMount() {
      if(this.props.type == "referral"){
        this.loadBranch()
      }
    }

    async loadBranch(){ //free cenas
      branchUniversalObject = await branch.createBranchUniversalObject(
        'content/12345', // canonical identifier
        {
          title: I18n.t('app.components.monetization.MonetizationSlideShowTab.loadBranchTitle'),
          contentImageUrl: 'http://www.playfmk.com/images/preview.png',
          contentDescription: I18n.t('app.components.monetization.MonetizationSlideShowTab.loadBranchDesc'),
          metadata: {
            user_id: Meteor.user()._id
          }
        }
      )
    }

    // To be sure the service is close before opening it
    async pay(product, category, qty, price) {
      await InAppBilling.close();
      try {
        await InAppBilling.open();
        const own = await InAppBilling.listOwnedProducts()

        if(category != "subscription" && own.indexOf(product) != -1){
          await InAppBilling.consumePurchase(product);
        } else if (category == "subscription"){
          var result1 = await InAppBilling.isSubscribed(purchaseId[5][0])
          var result2 = await InAppBilling.isSubscribed(purchaseId[5][1])
          var result3 = await InAppBilling.isSubscribed(purchaseId[5][2])

          var isSubscribed = result1 || result2 || result3
          if(isSubscribed){
            Alert.showAlert('', I18n.t('app.components.monetization.MonetizationSlideShowTab.payAlert'));
          }
        }



        if (!await InAppBilling.isPurchased(product) || (category == "subscription" && !isSubscribed)) {
          let details;
          if(category == "subscription"){
            details = await InAppBilling.subscribe(product);
          } else {
            details = await InAppBilling.purchase(product);
          }
          var receipt = {data: details.receiptData, signature: details.receiptSignature}
          Meteor.call('purchaseItem', Meteor.user()._id, product, category, qty, 'androidApp', receipt, (err, res)=>{
            if(!err){
              trackEvent('Monetization', 'BuyCompleted', product)

              if(isNaN(qty)){
                category = category + " - " + qty;
                qty = 5;
              }

              trackRevenue({ product, category, price, quantity: qty, id: details.orderId });
              // GoogleAnalytics.trackPurchaseEvent({
              //   id: product,
              //   name: category,
              //   price: price/10000,
              //   quantity: parseInt(qty)
              // }, {
              //   id: details.orderId
              // }, 'Monetization', 'Purchase');
              // AppEventsLogger.logPurchase(price/10000, 'EUR', { product, category, quantity: parseInt(qty) });
              Alert.showAlert(I18n.t('app.components.monetization.MonetizationSlideShowTab.purchaseAlert0'), I18n.t('app.components.monetization.MonetizationSlideShowTab.purchaseAlert1'), 'purchaseCompleted');
              if(category == "boost"){
                this.props.container.props.mainPage.userBoosted();
              }
              this.props.container.props.mainPage.bought(product);
              this.props.container.props.mainPage.downloadPowerVoteCount();
            } else {
              console.log(err);
              trackEvent('Monetization', 'BuyVerificationFailed', {"label": product, "value": price})
              Alert.showAlert('', I18n.t('app.components.monetization.MonetizationSlideShowTab.purchaseAlertError'));
            }
          })

        }
      } catch (err) {

        firebase.crash().isCrashCollectionEnabled()
        .then((enabled) => {
          firebase.crash().log(`
            MonetizationSlideshowTab.js:pay()
            userID => ${Meteor.user()._id}
            product => ${product}
            category => ${category}
            quantity => ${qty}
            price => ${price}
            `);
            firebase.crash().report(err);
          })

          if(err.message == "Purchase or subscribe failed with error: 110"){
            trackEvent('Monetization', 'BuyFailed', {"label": product, "value": price})
            Alert.showAlert('', I18n.t('app.components.monetization.MonetizationSlideShowTab.purchaseOperationError'));
          }

        } finally {
          await InAppBilling.close();
          this.props.container.updatePurchased()
        }
      }

      render(){
        var WIDTH = Dimensions.get('window').width;
        var HEIGHT = Dimensions.get('window').height - 60;
        let isSubscribed = false;
        if (Meteor.user().profile.subscription != undefined){
          isSubscribed = Meteor.user().profile.subscription
        }
        var refColor = '#fff';
        var titleColor = this.props.type == "subscription" ? '#C5B358' :'#fff';

        var promotionTitle = I18n.t('app.components.monetization.MonetizationSlideShowTab.promotionTitle')
        if(this.props.type != "subscription" && this.props.container.state.msgTitle){
          promotionTitle = this.props.container.state.msgTitle
        }

        var promotionCopy = this.props.type == "subscription" ? I18n.t('app.components.monetization.MonetizationSlideShowTab.promotionCopy0') : I18n.t('app.components.monetization.MonetizationSlideShowTab.promotionCopy1')
        if(this.props.type != "subscription" && this.props.container.state.msgCopy){
          promotionCopy = this.props.container.state.msgCopy
        }

        var promotionPercentage = '30%'
        if(this.props.type != "subscription" && this.props.container.state.msgPercentage){
          promotionPercentage = this.props.container.state.msgPercentage
        }

        return(
          <View style={{ flex: 1,
              flexDirection: 'column', justifyContent: 'flex-start', marginTop: 0,
              alignItems: 'center'}}>
              <LinearGradient style={{ width: WIDTH, height: HEIGHT, flex: 1, position: 'absolute', top: 0, left: 0 }} colors={[this.props.grad1, this.props.grad2]}>
              </LinearGradient>
              <View>
                <Text style={{ fontFamily: 'Selima', width:WIDTH-20, textAlign:'center',  fontSize: 43, color: titleColor, justifyContent: 'center', alignItems: 'center', margin: 0 }}>{this.props.title}</Text>
                <Text style={{ fontFamily: 'Selima', width:WIDTH-20, textAlign:'center',  fontSize: 60, color: titleColor, justifyContent: 'center', alignItems: 'center', margin: 0 }}>{this.props.secondtitle}</Text>
                <Text style={{ fontFamily: 'Selima', width:WIDTH-20, textAlign:'center',  fontSize: 43, color: titleColor, justifyContent: 'center', alignItems: 'center', margin: 0 }}>{this.props.thirdtitle}</Text>
              </View>
              {(this.props.type == "subscription" || (this.props.container.state.showDiscount == true && this.props.type != "referral" && this.props.type != "powerVote")) && <View style={{width:WIDTH-40, padding:10, borderWidth:2, borderColor: '#fff', alignItems:'center', justifyContent:'center', marginTop: 0}}>
              <Text style={{ fontFamily: 'Montserrat-Light', width:WIDTH-60, textAlign:'center',  fontSize: 20, color: "#fff", justifyContent: 'center', alignItems: 'center', margin: 0 }}>
                {promotionTitle}
              </Text>
              <Text style={{ fontFamily: 'Montserrat-Light', width:WIDTH-20, textAlign:'center',  fontSize: 12, color: "#fff", justifyContent: 'center', alignItems: 'center', margin: 0 }}>
                <Text  style={{fontFamily: 'Montserrat-Bold', color:titleColor, textDecorationLine: 'underline'}}>{promotionPercentage}</Text> {promotionCopy}
                </Text>
              </View>}
              <View style={{
                  position: 'absolute',width:WIDTH, height:HEIGHT,
                  top: 0, left: 0
                }}>
              </View>
              <View style={{flexGrow:1, justifyContent: 'center',
                alignItems: 'center'}}>
                { this.props.type != "referral" && <Image style={{ maxHeight: 120, minHeight:90, width:250, resizeMode:'contain'}} source={{uri: 'https://app.playfmk.com'+this.props.icon}} />}
                { this.props.type == "referral" && <Image style={{ maxHeight: 140, minHeight:110, width:250, resizeMode:'contain', margin:10, marginTop: 100, }} source={require('../../../images/refer.png')} />}

              </View>
              <View style={{marginBottom:this.props.type == "referral" ? -39 : 0}}>
                {this.props.type != "profiles" && <Text style={{ fontFamily: 'Montserrat-Light', textAlign:'center',  marginLeft:12, marginRight:12, marginTop: this.props.type == "referral" ? -70 : 0,marginBottom:this.props.type == "referral" ? 0 : 20, fontSize: this.props.type == "referral" ? 18 : 13, color: refColor, justifyContent: 'center', alignItems: 'center' }}>
                {this.props.desc}
              </Text>}
              {this.props.type != "profiles" && <Text style={{  fontFamily: 'Montserrat-Light', textAlign:'center', marginTop:-5, marginLeft:12, marginRight:12,  fontSize: this.props.type == "referral" ? 18 : 13, color: refColor, justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                {this.props.desc2}

              </Text>}
              {this.props.type == "profiles" && this.props.desc }
              {((this.props.type != "referral" && this.props.type != "subscription" && this.props.type != "winks") && (!this.props.container.state.adError)) &&
                <View>
                  {(!this.props.container.state.adLoaded) &&
                    <View
                      style={{flexDirection: 'row', alignItems:'center', height:37, justifyContent:'center'}}
                      >
                      <ActivityIndicator
                        animating={true}
                        color = {'#fff'}
                        style={{width:20, transform: [{ scale: 1 }] }}
                        />
                    </View>}



                    {(this.props.container.state.adLoaded) && <TouchableOpacity
                      style={{flexDirection: 'row', alignItems:'center', justifyContent:'center'}}
                      onPress={()=>{
                        this.props.container.setState({adType: this.props.type})
                        if(advert){
                          advert.show();
                        }
                      }} >
                      <View style={{borderWidth:2, borderColor: '#fff', flexDirection:'column', padding:8}}>
                        <Text className="loginButton" style={{
                            fontSize: 9, color: "#fff", textAlign:'center',
                          }} >{I18n.t('app.components.monetization.MonetizationSlideShowTab.watchVideo')}</Text>
                          <Text  className="loginButton" style={{
                              fontSize: 12, color: "#fff", textAlign:'center',
                            }} >{this.props.freecta}</Text>
                          </View>
                        </TouchableOpacity>}
                      </View>}
                      {(this.props.container.state.adError && !this.props.container.state.blockVideo) && <View style={{flexDirection: 'column'}}><Text className="loginButton" style={{
                        fontSize: 12, color: "#fff", textAlign:'center',
                      }} >{I18n.t('app.components.monetization.MonetizationSlideShowTab.noVideosAvaialable')}</Text>
                      <Text className="loginButton" style={{
                          fontSize: 9, color: "#fff", textAlign:'center',
                        }} >{I18n.t('app.components.monetization.MonetizationSlideShowTab.tryAgain')}</Text>
                      </View>}
                    </View>
                    {this.props.type != "referral" &&
                      <View style={{flexDirection:'row', width:WIDTH, justifyContent: 'center', alignItems: 'center'}}>

                        <PriceBox type={this.props.type} qtyCalc={this.props.qtyCalc1} qty={this.props.qty1} price={this.props.price1} unit={this.props.unit1 != "" ? (this.props.unit1 == "Months" ? "Month" : this.props.unit1) : "credits to see who voted for you"} color={this.props.color} selected={this.state.selected} container={this} num={0}/>
                        <PriceBox popular={this.props.popular} type={this.props.type} qtyCalc={this.props.qtyCalc2} qty={this.props.qty2} price={this.props.price2} unit={this.props.unit2 != "" ? this.props.unit2 : "Wink to get an instant match"} color={this.props.color} selected={this.state.selected} container={this} num={1}/>
                        <PriceBox type={this.props.type} qtyCalc={this.props.qtyCalc3} qty={this.props.qty3} price={this.props.price3} unit={this.props.unit3 != "" ? this.props.unit3 : "of boost on your profile"} color={this.props.color} selected={this.state.selected} container={this} num={2}/>

                        </View> }

                    {(this.props.type != "subscription" || !isSubscribed) && <TouchableOpacity id="loginButton" style={{
                      marginTop:20, marginBottom:50, width:WIDTH*0.96,  borderWidth:2,
                      borderColor: refColor, padding:15,
                      borderStyle: 'solid'
                    }} onPress={async function(){

                      if(this.props.type == "referral"){
                        let shareOptions = {
                          messageHeader: I18n.t('app.components.monetization.MonetizationSlideShowTab.shareOptionsHeader'),
                          messageBody: I18n.t('app.components.monetization.MonetizationSlideShowTab.shareOptionsBody')
                        }

                        let linkProperties = {
                          feature: 'share',
                          channel: 'facebook',
                          campaign: 'referralApp'
                        }

                        let controlParams = {}

                        let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)

                        if(completed){
                          trackEvent('Referral', channel)
                        } else {
                          trackEvent('Referral', "Canceled")
                        }

                        return true;
                      }

                      let qty;
                      let price;

                      if(this.state.selected == 0){
                        qty = this.props.qty1
                        price = Number(this.props.price1.replace(/[^0-9\.-]+/g,"")) * 100
                      } else if(this.state.selected == 1){
                        qty = this.props.qty2
                        price = Number(this.props.price2.replace(/[^0-9\.-]+/g,"")) * 100
                      } else {
                        qty = this.props.qty3
                        price = Number(this.props.price3.replace(/[^0-9\.-]+/g,"")) * 100
                      }
                      price = Math.ceil(price)



                      // if(this.props.type == "powerVote"){
                      //
                      //   var alertMessage = "Yayy! We are as excited as you to see this feature live! You'll be notified when it is available. Stay tuned 😉";
                      //   Alert.showAlert('', alertMessage);
                      //
                      //   Meteor.call('trackMonetization', Meteor.user()._id, this.props.type, qty, 'native', (err, result) => {
                      //   })
                      //
                      //   return true;
                      //
                      // }



                      let indexCategory;
                      // complete, profiles, winks
                      switch(this.props.type){
                        case 'profiles':
                        indexCategory = 0;
                        break;
                        case 'winks':
                        indexCategory = 1;
                        break;
                        case 'boost':
                        indexCategory = 2;
                        break;
                        case 'subscription':
                        indexCategory = 5; // changed from 3 to 5 for new subscriptions
                        break;

                        case "powerVote":
                        indexCategory = 4;

                        case "powerVoteAll":
                        indexCategory = 6;

                        break;
                        default:
                        indexCategory = -1;
                      }

                      var selectedId = purchaseId[indexCategory][this.state.selected]
                      if(this.props.container.state.showDiscount){
                        selectedId = purchaseIdDisc[indexCategory][this.state.selected]
                      }

                      trackEvent('Monetization', 'BuyClicked', {"label": selectedId, "value": price})

                      var purchasedCollection = this.props.container.state.purchased
                      // if(purchasedCollection){
                      //   if(purchasedCollection[this.props.type] && purchasedCollection[this.props.type].quantity == 0){
                      //
                      //     this.pay(selectedId, this.props.type, qty, price);
                      //   }  else if (this.props.type == "powerVote" && purchasedCollection[this.props.type] && (purchasedCollection[this.props.type][qty.toLowerCase()] == undefined || purchasedCollection[this.props.type][qty.toLowerCase()] == 0)){
                      //
                      //     this.pay(selectedId, this.props.type, qty, price);
                      //   } else if (this.props.type == "powerVote" && purchasedCollection[this.props.type] && purchasedCollection[this.props.type][qty.toLowerCase()] && purchasedCollection[this.props.type][qty.toLowerCase()] > 0){
                      //
                      //     this.pay(selectedId, this.props.type, qty, price);
                      //   } else if (this.props.type != "powerVote" && purchasedCollection[this.props.type] && purchasedCollection[this.props.type].quantity > 0){
                      //
                      //     GoogleAnalytics.trackEvent('Monetization', 'Credits Not Consumed', {"label": selectedId, "value": price})
                      //     Alert.showAlert('', "You need to use the credits you previously bought before you can buy new ones.");
                      //   } else {
                      //     this.pay(selectedId, this.props.type, qty, price);
                      //   }
                      // } else {
                      //   this.pay(selectedId, this.props.type, qty, price);
                      // }
                      this.pay(selectedId, this.props.type, qty, price);
                      // Alert.showAlert('', "Yayy! We are as excited as you to see this feature live! You'll be notified when it is available. Stay tuned 😉");

                    }.bind(this)}>
                    <Text className="loginButton" style={{fontSize: 16, color: refColor, textAlign:'center'}} >{this.props.cta}</Text>
                  </TouchableOpacity>}
                  {(this.props.type == "subscription" && isSubscribed) && <TouchableOpacity id="loginButton" style={{
                    marginTop:25, marginBottom:150, width:WIDTH*0.96,  borderWidth:2,
                    borderColor: refColor, padding:15,
                    borderStyle: 'solid'
                  }} onPress={()=>{
                    Alert.showAlert('', I18n.t('app.components.monetization.MonetizationSlideShowTab.activeSubscriptionAlert'));
                  }}>
                  <Text className="loginButton" style={{fontSize: 14, color: refColor, textAlign:'center'}} >
                  {I18n.t('app.components.monetization.MonetizationSlideShowTab.subscriptionActive')}
                  </Text>

                </TouchableOpacity>}
              </View>
            )
          }
        }

        class PriceBox extends Component {

          constructor(props) {
            super(props);
          }

          render(){
            var WIDTH = Dimensions.get('window').width;
            var HEIGHT = Dimensions.get('window').height - 60;
            var borderColor = '#fff' ;

            var price = this.props.price
            if(this.props.type == "subscription" && this.props.price){
              // console.log('price: ', this.props.price);
              var priceNum = Number(this.props.price.replace(/[^0-9\.-]+/g,""))
              // console.log('price after regex: ', priceNum);
              if (this.props.qtyCalc) {
                // console.log('quantity: ', this.props.qtyCalc);
                price = priceNum/this.props.qtyCalc
              } else {
                price = priceNum/this.props.qty
              }
              // console.log('final price: ', price);

              if(priceNum > 450){
                // console.log('DIVIDE BIG NUMBER');
                price = price/100;
              } else {
                // for prices per week
                // price = price*100;
              }

              //console.log('final price 2: ', price);

              // Temporary 50% discount
              // price = Math.ceil(price/2) - 0.01;
              const finalPrice = Math.floor(price * 100) / 100;

              //console.log('final final price: ', finalPrice);
              // Math.floor(a * 100) / 100
              price = '€'+finalPrice+'/week'
            }

            let backgroundColor = 'transparent'
            let lineColor = '#ffffff'

            if(this.props.selected == this.props.num && this.props.type != "referral"){
              lineColor = this.props.color
              backgroundColor = "#ffffff"
            }
            return(
              <View>
                {this.props.popular &&
                  <View style={{ position: 'absolute', backgroundColor: backgroundColor, height: 20, width:WIDTH*0.30, marginLeft: 5, marginTop: -15, borderColor: '#fff', borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2 }}>
                    <Text style={{ textAlign: 'center', color: lineColor, fontSize: 14}}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.mostPopular')}</Text>
                  </View>
                }
                <TouchableOpacity
                  activeOpacity={this.props.type == "referral" ? 1:0.2}
                  onPress={() => {
                    if(this.props.type != "referral"){
                      this.props.container.setState({selected: this.props.num})
                      if(!isNaN(this.props.qty)){
                        trackEvent('Monetization', 'BoxClicked', {'label': this.props.type, "value": parseInt(this.props.qty)})
                      }
                    }
                  }}
                  style={{
                    backgroundColor:backgroundColor, borderColor: borderColor, borderWidth:2,
                    borderStyle: 'solid', height:100, width:WIDTH*0.30, margin:5,
                    flexDirection:'column',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                  <Text style={{color: lineColor, margin:0, fontFamily: 'Montserrat-Bold', fontSize:30}}>{this.props.qty}{(this.props.type=='boost' || (this.props.type=='referral' && this.props.num == 2)) && <Text style={{fontSize:10}}>Hrs</Text>}</Text>

                  <Text style={{color: lineColor, margin:0, textAlign:'center', marginLeft:5, marginRight: 5}}>{this.props.unit}</Text>
                  {this.props.price != -1 && <View style={{height:2, width:WIDTH*0.8, backgroundColor:lineColor, margin:5}}></View>}
                  {this.props.price != -1 && <Text style={{color: lineColor, margin:0}}>{price}{this.props.type=='complete' && <Text style={{fontSize:10}}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.mostPopular')}</Text>}</Text>}
                </TouchableOpacity>
              </View>
            )
          }

        }
