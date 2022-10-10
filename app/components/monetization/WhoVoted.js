import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import Meteor from '@meteorrn/core';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  findNodeHandle,
  ActivityIndicator,
  InteractionManager,
  TouchableNativeFeedback,
  TouchableHighlight,
  ImageBackground
} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
// import GoogleAnalytics from 'react-native-google-analytics-bridge';
import {StatusBar} from 'react-native';
import PreviewLayer from '../game/PreviewLayer';
import { BlurView, VibrancyView } from '@react-native-community/blur';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Alert from '../../utilities/Alert';
import InAppBilling from 'react-native-billing';
import GameTagIcon from '../../font/customIcon';
import styles from '../../styles/styles';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

export default class WhoVoted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picture: Meteor.user().profile.picture || '',
      selectedTab: 0,
      dataDownloaded: false,
      all: [],
      locked: [],
      unlocked: [],
      showOverlay : false,
      refreshWinks: false,
      rowsLoaded: 0,
      limit: 15,
      offset:0,
      refreshingList: false
    }
    this.refreshLists = this.refreshLists.bind(this);
  }

  componentWillMount() {
    // this.refreshPurchased()
  }

  componentDidMount() {
    //trackScreenView('WhoVotedForYou');
    this.refreshLists();
    Meteor.call('userRank', Meteor.user()._id, Meteor.user().profile.gender, (err, result) => {
      this.setState({userRank: result});
    });
    this.refreshPurchased()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.refresh){
      this.refreshPurchased()
      // Meteor.call('purchasedItems', Meteor.user()._id, (err, result) => {
      //   if(!err){
      //     this.setState({all: [], locked: [], unlocked: [],
      //       purchased: result, dataDownloaded:true})
      //     this.refreshLists()
      //   }
      // })
    }
  }

  refreshPurchased(){
    Meteor.call('purchasedItems', Meteor.user()._id, (err, result) => {
      if(!err){
        this.setState({purchased: result, dataDownloaded:true, refreshWinks: true})
      }
    })
  }

  refreshLists() {

    Meteor.call('gotVotedByObject', Meteor.user()._id, this.props.typeSelected, this.state.limit, this.state.offset, (err, result) => {
      if (!err) {
        var endOfList = false;
        if(result.userList){
          endOfList = result.endOfList
          result = result.userList
        }
        var filteredResult = [];
        var lockedResult = [];
        var unlockedResult = [];
        for (var i in result) {
          if (result[i].profile != null && result[i].profile.name != null) {
            filteredResult.push(result[i]);
            if (result[i].unlocked) {
              unlockedResult.push(result[i]);
            } else {
              lockedResult.push(result[i]);
            }
          }
        }
        this.setState({
          all: filteredResult,
          locked: lockedResult,
          unlocked: unlockedResult,
          refreshingList: false,
          endOfList: endOfList
        });
      }
    });
  }


  renderHeader(){
    var WIDTH = Dimensions.get('window').width;
    var header = <View style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width: WIDTH,
        height: 45,
        position:'absolute',
        top:0
      }}>
      <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'flex-start', height: 43, width:WIDTH,
        backgroundColor: 'transparent'}}>
        <TouchableOpacity onPress={() => {
            try{
              Actions.pop( {refresh: {refreshGameView: true} });
            }
            catch(err) {

            }

          } }>
          <Icon style={{ marginLeft: 15, backgroundColor: 'transparent' }} name={'keyboard-arrow-left'} size={30} color={'#fff'}/>
        </TouchableOpacity>
      </View>

    </View>;
    return header;
  }

  unlockUser(qty){
    if(qty != null){
      var productUpdated = this.state.purchased
      productUpdated.profiles.quantity = qty
      this.setState({purchased: productUpdated})
    }
    this.refreshLists()
  }

  renderRank(){
    if(this.state.userRank){
      if(this.props.typeSelected == 'fuck') {
        trackScreen('Fuck_List');
        var rank = this.state.userRank.fuck
        var diff = this.state.userRank.fuckDiff
      } else {
        trackScreen('Marry_List');
        var rank = this.state.userRank.marry
        var diff = this.state.userRank.marryDiff
      }
    }
    else {
      var rank = "-"
    }

    let showIcon = true
    let iconName = 'arrow-drop-down'
    if(rank == "-"){
      showIcon = false
      iconName = ""
    } else if(rank > 0){
      iconName = 'arrow-drop-up';
    }

    return(
      <View style={{flexGrow:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        {this.props.showStats &&
          <Text style={{color:'#fff', fontFamily:'Montserrat-Bold', fontSize:70, textAlign:'center'}}> {rank} </Text>
        }
        {!this.props.showStats &&
          <Text style={{color:'#fff', fontFamily:'Montserrat-Bold', fontSize:20, textAlign:'center'}}>
            {I18n.t('app.components.monetization.WhoVoted.keepPlaying')}
          </Text>
        }
        {(diff != 0 && this.props.showStats) &&

          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', position:'absolute', left: 0, right: 0, bottom:0}}>
            <Text style={{fontFamily: 'Montserrat-light', color:'#FFFFFF', fontSize:10, textAlign:'center'}}>{diff}</Text>
            {showIcon && <Icon name={iconName} size={20} color={'#e3e6e8'}  />}
          </View>

        }
      </View>
    )
  }

  openPreviewLayer(estado, id, user) {
    this.setState({ estadoModel: estado, id: id });
    this.refs['previewLayer'].toggleModal(estado, id, this, user);
  }

  closePreviewLayer() {
    this.refs['previewLayer'].closeModal();
  }

  renderLoader(){
    var HEIGHT = Dimensions.get('window').height;
    var WIDTH = Dimensions.get('window').width;
    return(
      <View style={[styles.loadingPage, { position: 'absolute', top: HEIGHT*0.25, left: 0, flex: 1, width:WIDTH, height: HEIGHT*0.75, backgroundColor: 'transparent' }]}>
        <ActivityIndicator
          animating={true}
          color = {'#ffffff'}
          style={{ transform: [{ scale: 1.8 }] }}
          size="large"
          />
      </View>
    )
  }

  render(){

    var credits = 0
    var creditsCopy = I18n.t('app.components.monetization.WhoVoted.profilesUnlocked');
    if(this.state.purchased && this.state.purchased['profiles']){
      credits = this.state.purchased['profiles'].quantity
      if(credits == 1){
        creditsCopy = I18n.t('app.components.monetization.WhoVoted.profilesUnlocked');
      }
    }

    // var showOverlay = false;
    // if(this.state.dataDownloaded && (this.state.purchased == undefined || (this.state.purchased && this.state.purchased['profiles'] == undefined))){
    //   showOverlay = true;
    // }

    var WIDTH = Dimensions.get('window').width;
    var HEIGHT = Dimensions.get('window').height;

    let colors = []
    if(this.props.typeSelected == 'fuck'){
      colors = ['rgba(247,71,134,0.8)', 'rgba(248,137,86,1.0)']
    } else {
      colors = ['rgba(142,68,173,0.9)', 'rgba(52,73,94,1.0)']
    }

    return(
      <View id={"mainContainer"} style={{
          width:WIDTH, height:HEIGHT, backgroundColor: '#fff', flex: 1,
          justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column'}}>

          <ImageBackground source={{uri: this.state.picture}} style={{ width: WIDTH, height: HEIGHT-StatusBar.currentHeight, position: 'absolute', alignItems: 'center', top: 0, left: 0 }}>
            <LinearGradient
              style={[styles.swipePageContainer, {width: WIDTH, height: HEIGHT, position: 'absolute', top: 0, left: 0  }]}
              colors={colors}>
            </LinearGradient>
          </ImageBackground>

          {this.renderHeader()}
          <View style={{height: HEIGHT*0.25, justifyContent: 'flex-start', flexDirection:'column', margin:15}}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <Text style={{color:'#fff', fontFamily:'Montserrat-Regular', fontSize:11, textAlign:'center'}}>{I18n.t('app.components.monetization.WhoVoted.yourPosition')}</Text>
              <GameTagIcon name={this.props.typeSelected} color="#ffffff" style={{fontSize:16, marginLeft:6, marginRight:5, marginTop: -2}} />
              <Text style={{color:'#fff', fontFamily:'Montserrat-Regular', fontSize:11, textAlign:'center'}}>{I18n.t('app.components.monetization.WhoVoted.rank')}</Text>
            </View>
            {this.renderRank()}
            <Text style={{color:'#fff', fontFamily:'Montserrat-Light', fontSize:16, textAlign:'center'}}>{I18n.t('app.components.monetization.WhoVoted.whoVotedForYou')}</Text>
            {!Meteor.user().profile.subscription && <Text style={{color:'#fff', fontFamily:'Montserrat-Bold', fontSize:10, textAlign:'left', marginTop:5, marginBottom:-10}}>{credits} {creditsCopy}</Text>}
          </View>
          <ScrollableTabView
            style={{width: WIDTH, height: HEIGHT*0.75}}
            tabBarUnderlineStyle={{backgroundColor:'#ffffff', height:2,}}
            tabBarActiveTextColor={"#ffffff"}
            tabBarInactiveTextColor={"rgba(255,255,255,0.5)"}
            tabBarTextStyle={{fontFamily:'Montserrat-light', fontSize:10, marginBottom: -20}}
            onChangeTab={(obj)=>{
              this.state.selectedTab = obj.i;
              if(obj.i == 0){
                trackEvent(this.props.typeSelected+'_List','Click_Locked');
              }else if(obj.i == 1){
                trackEvent(this.props.typeSelected+'_List','Click_Unlocked');
              }else{
                trackEvent(this.props.typeSelected+'_List','Click_Close');
              }
            }}
            >
            <VotesList ref="userList" type="full" container={this} userList={this.state.all} tabLabel={I18n.t('app.components.monetization.WhoVoted.allVotes')} purchased={this.state.purchased}/>
            <VotesList ref="lockedList" type="locked" container={this} userList={this.state.locked} tabLabel={I18n.t('app.components.monetization.WhoVoted.locked')} purchased={this.state.purchased} />
            <VotesList ref="unlockedList" type="unlocked" container={this} userList={this.state.unlocked} tabLabel={I18n.t('app.components.monetization.WhoVoted.unlocked')} purchased={this.state.purchased} />
          </ScrollableTabView>

          {this.state.showOverlay &&
            <View style={{
                backgroundColor:'rgba(0,0,0,0.8)', width: WIDTH, height: HEIGHT-StatusBar.currentHeight,
                position: 'absolute', alignItems: 'center', justifyContent:'center', top: 0, left: 0,
              }}>

              <View style={{alignItems: 'center', flexDirection:'column',
                alignItems:'center', justifyContent:'center', padding:20
              }}>

              <Image style={{ height:100, width:200, marginBottom:20, resizeMode:'contain' }} source={{uri: 'https://fmk-images.ams3.digitaloceanspaces.com/defaults/zoom.png'}} />
              <Text style={{
                  fontFamily:'Montserrat-Bold', color:'white', fontSize:24,
                  textAlign:'center', marginBottom:20, textShadowColor: '#rgba(196,196,196,0.5)',
                  textShadowOffset: {width: 2, height: 2}, textShadowRadius: 1
                }}>
                {I18n.t('app.components.monetization.WhoVoted.curious')}
              </Text>
              <Text style={{fontFamily:'Montserrat-light', color:'white', fontSize:16, textAlign:'center', marginBottom:20,
                textShadowColor: '#rgba(196,196,196,0.5)',
                textShadowOffset: {width: 1, height: 1}, textShadowRadius: 1}}>
                {I18n.t('app.components.monetization.WhoVoted.unlockProfiles')}
              </Text>
              <TouchableOpacity onPress={()=>{
                  GoogleAnalytics.trackEvent('Who Voted', 'Get More Unlocks');
                  try {
                    Actions.pop();
                  } catch (error) {
                    console.log(error);
                  }
                  Actions.mainPage({ initialPage: 3, triggerOffer: 'profile' });
                }} style={{borderStyle:'solid', borderWidth:1, borderColor:'#ffffff'}}>
                <Text style={{fontFamily:'Montserrat-Bold', color:'white', fontSize:16, textAlign:'center', margin:20}}>
                {I18n.t('app.components.monetization.WhoVoted.learnMore')}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.setState({showOverlay: false})
              }}
              style={{backgroundColor:'transparent', position:'absolute', top:7, right:15,height: 30, width: 30 }}>
              <Icon name={'close'} size={30} color={'#fff'} style={{ margin:0, height: 30, width: 30 }} />
            </TouchableOpacity>

          </View>
        }
        {((this.state.all.length - 1 > this.state.rowsLoaded) && false) && this.renderLoader()}
        <PreviewLayer ref={'previewLayer'} id={this.state.id}  />

      </View>
    );
  }

}

class VotesList extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => (r1._id !== r2._id) || (r1.unlocked !== r2.unlocked) || this.props.container.state.refreshWinks });

    this.state = {
      userList: ds.cloneWithRows(this.props.userList)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      userList: this.state.userList.cloneWithRows(nextProps.userList),
    });
  }

  _renderRow(user, sectionID, rowID, highlightRow) {
    console.log(user, 'oopwopeopw')
    if(user.profile && user.profile.name){
      var picture = user.profile.picture
      if(user.profile.custom_picture){
        picture = user.profile.custom_picture
      }

      return (
        <UserProfile
          user={user} picture={picture} container={this.props.container} type={this.props.type} key={user._id} listComponent={this}
          purchased={this.props.purchased}
          />
      );
    }
    else{
      return null; // FIXME: users with Instagram (without name) won't appear here
      // return( <Text>{user._id}</Text>)
    }
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    let renderFooter = false
    if(rowID == this.props.userList.length - 1){
      renderFooter = true
    }
    var WIDTH = Dimensions.get('window').width;
    return(
      <View key={rowID}>
        <View style={{height:1, width:WIDTH*0.8, marginRight:WIDTH*0.1, marginLeft:WIDTH*0.1, backgroundColor:'#fff'}}></View>
        {renderFooter &&
          <View>
            {(this.props.type != 'unlocked' && !this.props.container.state.endOfList ) &&
              <TouchableOpacity onPress={()=>{
                  this.props.container.state.limit += 15;
                  this.props.container.setState({refreshingList: true})
                  trackEvent(this.props.type + '_list_' + this.state.unlocked ? 'unlocked' : 'locked', 'Click_Unlock_Profile');
                  this.props.container.refreshLists();
                }}
                style={{marginTop:8, padding:10, alignItems:'center', marginRight:WIDTH*0.1, marginLeft:WIDTH*0.1, borderStyle:'solid', borderColor:'#fff', borderWidth:0, }}>
                <View style={{flexDirection:'row'}}>

                  <View>
                    <Text style={{textAlign:'center', fontSize:12, fontFamily:'Montserrat-Light', color:'#ffffff', textAlign:'left' }}>{I18n.t('app.components.monetization.WhoVoted.loadMore')}</Text>
                    <View style={{height:1, width:103, marginTop:3, backgroundColor:'#fff'}}></View>
                  </View>
                  {this.props.container.state.refreshingList &&  <ActivityIndicator
                    animating={true}
                    color = {'#ffffff'}
                    size="small"
                    style={{position:'absolute', right: -25}}
                    />}
                  </View>

                </TouchableOpacity>}
                <Text style={{marginTop:6, height:25, marginRight:WIDTH*0.1, marginLeft:WIDTH*0.1, fontSize:10, fontFamily:'Montserrat-Light', color:'#ffffff', textAlign:'left' }}>{I18n.t('app.components.monetization.WhoVoted.deletedProfiles')}</Text>
              </View>
            }
          </View>
        )
      }

      render(){
        var WIDTH = Dimensions.get('window').width;
        var HEIGHT = Dimensions.get('window').height;

        // var listOpacity = 0;
        // if(this.props.container.state.all.length - 1 <= this.props.container.state.rowsLoaded){
        //   listOpacity = 100;
        // }

        var listOpacity = 100;



        return(
          <ListView
            showsHorizontalScrollIndicator={false}
            dataSource={this.state.userList}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            renderSeparator={this._renderSeparator.bind(this)}
            style={{width: WIDTH, height: HEIGHT*0.75, opacity:listOpacity}}
            removeClippedSubviews = {false}
            />
        )
      }
    }

    class UserProfile extends Component {
      constructor(props) {
        super(props);
        this.state = {
          unlocked: this.props.user.unlocked,
          opacityBlur: this.props.user.unlocked ? 0 : 100,
          viewRef: null,
          opacity: 0,
          loadedOnce: false
        }
      }

      componentWillReceiveProps(nextProps){
        this.setState({unlocked: nextProps.user.unlocked, opacityBlur: nextProps.user.unlocked ? 0 : 100})
      }

      async unlockUser(){
        if(!this.state.unlocked){
          await InAppBilling.close();
          try {
            await InAppBilling.open();
            var ownedProducts = await InAppBilling.listOwnedProducts();
          } catch (err) {
            console.log(err);
          } finally {
            await InAppBilling.close();

            if(
              (this.props.container.state.purchased &&
              this.props.container.state.purchased['profiles'])
              || Meteor.user().profile.subscription
            ){
              this.setState({opacity:0})
              Meteor.call('unlockUser', Meteor.user()._id, this.props.user._id, async (err, result)  => {
                if(!err){
                  GoogleAnalytics.trackEvent('Who Voted', 'Unlock User');
                  this.setState({unlocked: true, viewRef: null, opacityBlur:0})
                  this.props.container.unlockUser(result.quantity)
                  if(result.quantity == 0){
                    // The user ran out of credits, delete the product from his account on the store
                    await InAppBilling.close();
                    try {
                      await InAppBilling.open();
                      await InAppBilling.consumePurchase(result.productid);
                    } catch (err) {
                      console.log(err);
                    } finally {
                      await InAppBilling.close();
                    }
                  }
                } else {
                  this.setState({opacity:100})
                  if(err.error == 8001){
                    GoogleAnalytics.trackEvent('Who Voted', 'No More Unlock');
                    Alert.showAlert('', err.details, 'noMoreProfiles');
                  }
                }
              })
            } else {
              if(this.props.container.state.purchased){
                if(this.props.purchased['profiles']){
                  GoogleAnalytics.trackEvent('Who Voted', 'No More Unlock');
                  Alert.showAlert('', I18n.t('app.components.monetization.WhoVoted.ranOutOfCredtis'), 'noMoreProfiles');
                } else {
                  GoogleAnalytics.trackEvent('Who Voted', 'Show Overlay');
                  this.props.container.setState({showOverlay: true})
                  // Alert.showAlert('', "Did you know that now it's possible to see who voted for you?", 'firstTimeProfiles');
                }
              } else {
                GoogleAnalytics.trackEvent('Who Voted', 'Show Overlay');
                this.props.container.setState({showOverlay: true})
                // Alert.showAlert('', "Did you know that now it's possible to see who voted for you?", 'firstTimeProfiles');
              }

            }
          }

        } else {
          trackEvent('Who Voted', 'Open Profile Details');
          trackEvent(this.props.type + '_list_' + 'unlocked', 'Click_Profile');
          this.props.container.openPreviewLayer(true, this.props.user._id, this.props.user)
        }
      }

      async sendWink(){
        trackEvent(this.props.type + '_list_unlocked', 'Click_Send_Wink');
        await InAppBilling.close();
        try {
          await InAppBilling.open();
          var ownedProducts = await InAppBilling.listOwnedProducts();
        } catch (err) {
          console.log(err);
        } finally {
          await InAppBilling.close();

          if(
            this.props.container.state.purchased &&
            this.props.purchased['winks']
          ){
            Meteor.call('sendWink', Meteor.user()._id, this.props.user._id, async (err, result) => {
              if(!err){
                GoogleAnalytics.trackEvent('Who Voted', 'Wink Sent');
                Alert.showAlert('', I18n.t('app.components.monetization.WhoVoted.youSentAWink') + this.props.user.profile.first_name || this.props.user.profile.user_name + I18n.t('app.components.monetization.WhoVoted.matchlistUpdated'), 'newWinkWhoVoted');
                var newPurchased = this.props.purchased;
                newPurchased['winks'].quantity = result.quantity;
                this.props.container.setState({purchased: newPurchased, refreshWinks: true})
                this.props.container.refreshLists()

                if(result.quantity == 0){
                  // The user ran out of credits, delete the product from his account on the store
                  await InAppBilling.close();
                  try {
                    await InAppBilling.open();
                    await InAppBilling.consumePurchase(result.productid);
                  } catch (err) {
                    console.log(err);
                  } finally {
                    await InAppBilling.close();
                  }
                }
              } else {
                if(err.error == 8002){
                  GoogleAnalytics.trackEvent('Who Voted', 'No More Winks');
                  Alert.showAlert('', err.details, 'noMoreWinks');
                } else if(err.error == 8003) {
                  GoogleAnalytics.trackEvent('Who Voted', 'Wink Already sent');
                  Alert.showAlert('', err.details);
                }
              }
            })
          } else {
            if(this.props.container.state.purchased){
              if(this.props.purchased['winks']){
                GoogleAnalytics.trackEvent('Who_Voted', 'No_More_Winks');
                Alert.showAlert('', I18n.t('app.components.monetization.WhoVoted.runOutWinks'), 'noMoreWinks');
              } else {
                GoogleAnalytics.trackEvent('Who_Voted', 'First_Time_Winks');
                Alert.showAlert(I18n.t('app.components.monetization.WhoVoted.crush'), I18n.t('app.components.monetization.WhoVoted.sendWink'), 'firstTimeWinks');
              }
            } else {
              GoogleAnalytics.trackEvent('Who_Voted', 'First_Time_Winks');
              Alert.showAlert(I18n.t('app.components.monetization.WhoVoted.crush'), I18n.t('app.components.monetization.WhoVoted.sendWink'), 'firstTimeWinks');
            }

          }
        }
      }

      imageLoaded() {
        this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
      }

      viewLoaded() {
        if(!this.state.loadedOnce){
          this.props.container.setState({rowsLoaded: this.props.container.state.rowsLoaded + 1})
          this.state.loadedOnce = true
        }

        if(this.state.imageLoaded){
          if(!this.state.unlocked){
            this.setState({ viewRef: findNodeHandle(this.backgroundWrapper), opacity: 100 });
          } else {
            this.setState({ viewRef: null, opacity: 100  });
          }

        } else {
          setTimeout(this.viewLoaded.bind(this), 500)
        }

      }

      componentWillUnmount() {
      }

      render(){
        var winks = 0
        if(this.props.purchased && this.props.purchased['winks']){
          winks = this.props.purchased['winks'].quantity;
        }

        var WIDTH = Dimensions.get('window').width;
        var HEIGHT = Dimensions.get('window').height;

        var unlockedText = I18n.t('app.components.monetization.WhoVoted.unlockedText0')
        if(this.state.unlocked){
          unlockedText = I18n.t('app.components.monetization.WhoVoted.unlockedText1')
        }

        var zIndex = this.state.unlocked ? 11 : 9

        return(
          <View>
            <View style={{position:'absolute', top:0, left:0, width: WIDTH, height: 80, backgroundColor: 'transparent', alignItems:'center', justifyContent:'center' }}>
              <ActivityIndicator
                animating={true}
                color = {'#ffffff'}
                style={{ opacity: (100 - this.state.opacity)*0.5 }}
                size="large"
                />
            </View>

            <View style={{opacity:this.state.opacity}}>
              <TouchableHighlight
                style={{height:80, width:WIDTH,}} 
                onPress={this.unlockUser.bind(this)}
                underlayColor={"rgba(255,255,255,0.2)"}
                >
                <View style={{height:80, width:WIDTH}}>
                  <BlurView
                    style={{position: "absolute", top: 0, left:0, bottom: 0, right: 0, zIndex:10, opacity:this.state.opacityBlur}}
                    viewRef={this.state.viewRef}
                    blurType="light"
                    overlayColor={"transparent"}
                    blurRadius={3}
                    downsampleFactor={3}
                    ref="blurView"
                    />

                  {!this.state.unlocked && <View
                    style={{
                      position: "absolute", top: 0, left: 0, bottom: 0, right: 0,
                      zIndex:10, alignItems:'center', justifyContent:'center',
                    }}>
                    <Text style={{
                        textAlign:'center', fontFamily:'Montserrat-Light', color:'#ffffff', marginLeft:15,
                        borderStyle:'solid', borderWidth:1, padding:10, borderColor:'#ffffff'
                      }}>
                      {I18n.t('app.components.monetization.WhoVoted.unlockProfile')}
                    </Text>
                  </View>}

                  <View
                    style={{flexDirection: 'row', alignItems:'center', justifyContent:'flex-start', zIndex: zIndex}}
                    ref={(view) => {
                      this.backgroundWrapper = view; }}
                      onLayout={()=>{
                        this.viewLoaded()}
                      }
                      >
                      <Image
                        ref={(img) => {
                          this.backgroundImage = img; }}
                          source={{uri: this.props.picture}}
                          onLoadEnd={this.imageLoaded.bind(this)}
                          style={{height:50, width:50, borderRadius:50, marginLeft: (WIDTH*0.1),
                            marginTop: 15, marginRight:10, marginBottom:15,
                          }}
                          // onLoadEnd={()=>{
                          //   this.state.imageLoaded = true
                          // }}
                          />

                        {!this.state.unlocked &&
                          <View style={{height:30}}>
                            <Image resizeMode="contain" resizeMethod="resize" source={require('../../../images/blurry_name.png')}  style={{maxWidth:(WIDTH-WIDTH*0.2-110) }}></Image>
                          </View>}

                          {this.state.unlocked &&
                            <View
                              style={{flexDirection: 'row', alignItems:'center', justifyContent:'flex-start', width:(WIDTH-WIDTH*0.2-60)}}>

                              <View style={{marginRight:10, width:(WIDTH-WIDTH*0.2-110), flexDirection:'column'}}>
                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 11, color: '#ffffff', textAlign: 'left', width: (WIDTH - WIDTH * 0.2 - 110) }}>{this.props.user.profile.first_name.toUpperCase() || this.props.user.profile.user_name.toUpperCase()}, {this.props.user.profile.age}</Text>
                                <Text style={{fontFamily:'Montserrat-Light', fontSize:10, color:'#ffffff', textAlign:'left', width:(WIDTH-WIDTH*0.2-110)}}>{I18n.t('app.components.monetization.WhoVoted.profileDetails')}</Text>
                              </View>
                            </View>
                          }

                        </View>
                      </View>
                    </TouchableHighlight>
                    {this.state.unlocked &&
                      <TouchableOpacity onPress={this.sendWink.bind(this)} style={{position:'absolute', alignItems:'center', justifyContent:'center', right:WIDTH*0.1, top:0, height:80, width:41}}>
                        <Image source={require('../../../images/wink.png')}  style={{height:40, width:40}}></Image>
                        <View style={{height:15, width:15, backgroundColor:'#ffffff', position: 'absolute', bottom:23, right:0, borderRadius: 20}}>
                          <Text style={{fontFamily:'Montserrat-Light', fontSize:8, color:'#333333', textAlign:'center', marginTop: 2.5}}>{winks}</Text>
                        </View>
                        <Text style={{fontFamily:'Montserrat-Light', fontSize:6, color:'#ffffff', textAlign:'center', marginTop:5}}>{I18n.t('app.components.monetization.WhoVoted.getAMatch')}</Text>
                      </TouchableOpacity>}

                    </View>
                  </View>
                )
              }
            }
