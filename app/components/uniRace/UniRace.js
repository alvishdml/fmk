import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  BackAndroid,
  ImageBackground
} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import Alert from '../../utilities/Alert';
import Meteor from '@meteorrn/core';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../utilities/Constants';
import {StatusBar} from 'react-native';
import GameTagIcon from '../../font/customIcon';
import ShareApp from '../sharing/ShareApp';
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
import branch from 'react-native-branch';
import Share, { ShareSheet, Button } from 'react-native-share';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

export default class UniRace extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1._id !== r2._id});

    var SELECT_SCHOOL = false;

    if(!Meteor.user().profile.unirace){
      SELECT_SCHOOL = true;
    }

    this.state = {
      hottest: null,
      school: null,
      input: '',
      searchList: ds.cloneWithRows([]),
      offset: 0,
      selectSchool: SELECT_SCHOOL,
      shareUrl: 'http://www.playfmk.com',

    }

    this._loadBranch = this._loadBranch.bind(this);

  }

  update(school){
    // Get user's school rank
    Meteor.call("getUniSingleRank", school.name, (err, result) => {
      if(result){
        this.setState({school: result})
      }
    })
  }

  componentWillMount() {
    this.emitter = new EventEmitter();

    // Get user's school rank
    if(!this.state.selectSchool){
      if(Meteor.user().profile.school && Meteor.user().profile.school.length === undefined){
        Meteor.call("getUniSingleRank", Meteor.user().profile.school.name, (err, result) => {
          if(result){
            this.setState({school: result})
          }
        })
      }
    }

    // Get hottest school
    Meteor.call("getUniFullRank", 1, (err, result) => {
      if(result && result.length > 0){
        this.setState({hottest: result[0]})
      }
    });
  }

  componentDidMount(){
    this.emitter.addListener('shareInviteLink', this._loadBranch, this);
    if(this.state.selectSchool){
      trackScreen('University_Challenge');
    }else{
      trackScreen('Join_University');
    }
  }

  async _loadBranch() {
    branchUniversalObject = await branch.createBranchUniversalObject(
      'content/12345', // canonical identifier
      {
        title: 'Play F*ck Marry Kill',
        contentImageUrl: 'http://www.playfmk.com/images/preview.png',
        contentDescription: I18n.t('app.components.uniRace.UniRace.description'),
        metadata: {
          user_id: Meteor.user()._id,
          uniChallengeId: this.state.school._id,
        }
      }
    )

    let linkProperties = {
      feature: 'share',
      channel: 'uniChallenge',
      campaign: 'InviteFriendsApp'
    }

    let controlParams = {
    }

    let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
    this.setState({shareUrl: url});

    let urlObject ={
      title: 'F*ck Marry Kill',
      message: I18n.t('app.components.uniRace.UniRace.helpMe'),
      url: url,
      subject: I18n.t('app.components.uniRace.UniRace.helpMe')
    }

    //let {channel, completed, error} = await branchUniversalObject.showShareSheet(branchUniversalObject, linkProperties, controlParams)

  Share.open(urlObject);
  }

  _shareLink() {
    //this.refs['shareApp'].onOpen(true);
    this.emitter.emit('shareInviteLink');
    trackEvent('University_Challenge', 'Click_Invite_Friends')
  }

  renderHeader(){
    var WIDTH = Dimensions.get('window').width;
    var header = <View style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width: WIDTH,
        height: 43,
        zIndex:10
      }}>
      <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'flex-start', height: 43, width:WIDTH,
        backgroundColor: 'transparent'}}>
        <TouchableOpacity onPress={() => {
            try{
              Actions.pop({refresh: {refresh:true}});
            }
            catch(err) {

            }
          }
        }>
          <Icon style={{ marginLeft: 15, backgroundColor: 'transparent' }} name={'keyboard-arrow-left'} size={30} color={'#cccccc'}/>
        </TouchableOpacity>
      </View>
    </View>;
    return header;
  }

  _renderRow(school, sectionID, rowID, highlightRow) {
    return (
      <UniSearchRow school={school} num={rowID} container={this}/>
    );
  }

  render(){

    let SHOW_YOUR_SCHOOL = false;
    if((this.state.school != null) && !this.state.selectSchool){
      SHOW_YOUR_SCHOOL = true;
    }

    if(Meteor.user()){
      let picture = Meteor.user().profile.picture;
      let about = Meteor.user().profile.about;
      if (this.state.picture) {
        picture = this.state.picture;
      } else if (Meteor.user().profile.custom_picture) {
        picture = Meteor.user().profile.custom_picture;
      }
      let constants = new Constants();
      var WIDTH = Dimensions.get('window').width;
      var HEIGHT = Dimensions.get('window').height;

      // Calculate badge image and spacing
      let badgeUrl;
      let badgeHeight;
      let badgeWidth;
      if (this.state.school && this.state.school.rank){
        badgeUrl = 'https://app.playfmk.com/images/uni' + Math.min(this.state.school.rank, 4)+ '.png'
        if(this.state.school.rank == 1){
          badgeHeight = 30
          badgeWidth = 27
          marginText = 5
        } else if (this.state.school.rank == 2) {
          badgeHeight = 30
          badgeWidth = 27
          marginText = 4
        } else if (this.state.school.rank == 3){
          badgeHeight = 27
          badgeWidth = 27
          marginText = 6
        } else {
          badgeHeight = 27
          badgeWidth = 27
          marginText = 6
        }
      }

      let subtitleCopy;
      if(this.state.selectSchool){
        subtitleCopy =I18n.t('app.components.uniRace.UniRace.subtitle0');
      } else {
        subtitleCopy = I18n.t('app.components.uniRace.UniRace.subtitle1');
      }

      return (
        <View style={{ flex: 1, marginTop:this.state.offset}}>
          <ImageBackground source={{uri: picture}} style={{ width: WIDTH, height: HEIGHT-StatusBar.currentHeight, flex: 1, position: 'absolute', alignItems: 'center', top: 0, left: 0 }}>
            <LinearGradient
              style={styles.swipePageContainer}
              colors={['#1d2e47ee', '#411744ee']}>

              {this.renderHeader()}
              <View style={{
                  width:WIDTH, height:HEIGHT, flex: 1,
                  justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column'}}>

                  <View style={{ flexDirection: 'column',
                    margin: 0, justifyContent: 'flex-start'}}>
                    <Text style={{margin:0, marginLeft: 0, marginTop:-43, fontFamily: 'Selima', fontSize:65, textAlign:'center', color:'#ffffff'}}>
                    {I18n.t('app.components.uniRace.UniRace.university0')}
                    </Text>
                    <Text style={{margin:0, marginLeft: 40, marginTop:-10, fontFamily: 'Selima', fontSize:65, textAlign:'center', color:'#ffffff'}}>
                    {I18n.t('app.components.uniRace.UniRace.challenge')}
                    </Text>
                    <Text style={{margin: 0, marginTop:20, marginLeft:20, marginRight:20, fontFamily: 'Montserrat-Light', fontSize:17, textAlign:'left', color:"#fff"}}>
                      {subtitleCopy}
                    </Text>
                  </View>


                  <View style={{flexGrow:1, justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>

                    <View style={{marginRight:20, marginLeft:20, marginTop:0, marginBottom:0, width:WIDTH-40}}>
                      {(this.state.hottest && (this.state.school != null)) && <Text style={{margin: 0, marginTop:0, marginLeft:20, marginRight:20, fontFamily: 'Montserrat-Bold', fontSize:10, color: '#cccccc', textAlign:'left'}}>
                      {I18n.t('app.components.uniRace.UniRace.hottestSchool')}
                    </Text>}

                    <View style={{margin:0, backgroundColor:"transparent",  justifyContent: 'flex-start',
                      alignItems: 'flex-start', flexDirection: 'column',  width:WIDTH-30}}>

                      {((this.state.hottest && (this.state.school != null)) && (this.state.school != null)) &&   <View style={{justifyContent: 'flex-start', width:WIDTH-40,
                        alignItems: 'flex-start', height:70,  flexDirection: 'row', margin: 0, marginBottom: 0, marginTop:5}}>
                        <Text style={{ width:27,
                            margin: 0, marginLeft:0, marginTop:5, marginRight:5, fontFamily: 'Montserrat-Light', textAlign:'center',
                            fontSize:12, color: '#fff'}}>
                            1
                          </Text>
                          <Image source={{uri: 'https://app.playfmk.com/images/uni1.png'}} style={{ position:'absolute', left:0, top: 0, height:30, width:27, resizeMode:'contain'}} />

                          <View style={{
                              margin: 0, flexGrow: 1, flexDirection:"column"}}>
                              <Text style={{
                                  margin: 0, marginLeft:10, marginRight:10, fontFamily: 'Montserrat-Bold', textAlign:'left',
                                  fontSize:14, color: '#fff', maxWidth:WIDTH*0.60}}>
                                  {this.state.hottest.name.toUpperCase()}
                                </Text>
                                <Text style={{
                                    margin: 0, marginTop: 3, marginLeft: 10, fontFamily: 'Montserrat-Light', textAlign:'left',
                                    fontSize: 10, color: '#FFFFFF'}}>
                                    {I18n.t('app.components.uniRace.UniRace.students')} {this.state.hottest.students}
                                </Text>
                              </View>

                              <Text style={{
                                  margin: 0, marginTop:3, fontFamily: 'Montserrat-Light', textAlign:'right',
                                  fontSize:10, color: '#FFFFFF'}}>
                                 {I18n.t('app.components.uniRace.UniRace.hotness')} <Text style={{color: '#F74985'}}>{this.state.hottest.hotness}%</Text>
                              </Text>

                            </View> }

                          </View>
                        </View>


                        {SHOW_YOUR_SCHOOL &&
                          <View style={{marginRight:20, marginLeft:20, marginTop:0, marginBottom:0, width:WIDTH-40}}>
                            <Text style={{margin: 0, marginTop:20, marginLeft:20, marginRight:20, fontFamily: 'Montserrat-Bold', fontSize:10, color: '#cccccc', textAlign:'left'}}>
                            {I18n.t('app.components.uniRace.UniRace.yourSchool')}
                            </Text>
                            <View style={{margin:0, backgroundColor:"transparent",  justifyContent: 'flex-start',
                              alignItems: 'flex-start', flexDirection: 'column', width:WIDTH-30 }}>

                              <View style={{justifyContent: 'center', width:WIDTH-40,
                                alignItems: 'flex-start',height:50,  flexDirection: 'row', margin: 0, marginBottom: 0, marginTop:5}}>
                                  {this.state.school && this.state.school.rank &&
                                    <Text style={{
                                      margin: 0, width:badgeWidth, marginTop:marginText, fontFamily: 'Montserrat-Light', textAlign:'center',
                                      fontSize:12, color: '#fff'}}>
                                      {this.state.school.rank}
                                    </Text>
                                  }
                                  <Image source={{uri: badgeUrl}} style={{ position:'absolute', left:0, top: 0, height:badgeHeight, width:badgeWidth, resizeMode:'contain'}} />
                                  <View style={{
                                      margin: 0, flexGrow: 1}}>
                                      <Text style={{
                                          margin: 0, marginLeft:10, marginRight:10, fontFamily: 'Montserrat-Bold', textAlign:'left',
                                          fontSize:14, color: '#fff', maxWidth:WIDTH*0.60}}>
                                          {this.state.school.name.toUpperCase()}
                                        </Text>
                                        <Text style={{
                                            margin: 0, marginTop: 3, marginLeft: 10, fontFamily: 'Montserrat-Light', textAlign:'left',
                                            fontSize: 10, color: '#FFFFFF'}}>
                                            {I18n.t('app.components.uniRace.UniRace.students')} {this.state.school.students}
                                        </Text>
                                      </View>

                                      <View style={{flexDirection: 'column', alignItems:'flex-end', justifyContent:'flex-start', height:50}}>
                                        <Text style={{
                                            margin: 0, marginTop:3, fontFamily: 'Montserrat-Light', textAlign:'right',
                                            fontSize:10, color: '#FFFFFF'}}>
                                            {I18n.t('app.components.uniRace.UniRace.hotness')} <Text style={{color: '#F74985'}}>{this.state.school.hotness}%</Text>
                                        </Text>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({selectSchool:true})
                                            trackEvent('University_Challenge', 'Edit_School');
                                          }} style={{ flexDirection:'row', justifyContent:'flex-end', marginTop:5}}>
                                          <Icon name={'mode-edit'} size={15} color={'#ffffff'} />
                                        </TouchableOpacity>
                                      </View>

                                    </View>

                                  </View>
                                </View>
                              }

                              {this.state.selectSchool &&
                                <View style={{flexDirection:'column', alignItems:'flex-end',
                                  justifyContent:'flex-end', marginRight:20,
                                  marginLeft:20, marginTop:0, marginBottom:0, width:WIDTH-40,
                                  maxHeight:HEIGHT*0.4, flexGrow:1}}>
                                  <TextInput id="inputAbout" defaultValue={""}
                                    multiLine={false} rows={1}
                                    value={this.state.input}
                                    style={{color: '#ffffff', width:WIDTH-40}}
                                    placeholder={I18n.t('app.components.uniRace.UniRace.searchSchool')}
                                    underlineColorAndroid={"#ffffff"}
                                    clearTextOnFocus={true}
                                    placeholderTextColor={'#ffffff'}
                                    onChangeText = {(newValue)=>{
                                      this.setState({input: newValue, offset: -240});
                                      Meteor.call("searchUni", newValue, (err, result) => {
                                        this.setState({searchList:this.state.searchList.cloneWithRows(result)});
                                      })

                                    }}

                                    onFocus = {() => {
                                      this.setState({offset: -240})
                                    }}

                                    onEndEditing = {() => {
                                      this.setState({offset: 0})
                                    }}

                                    onSubmitEditing = {() => {
                                      trackEvent(this.state.selectSchool ? 'Join University' : 'University_Challenge', 'Search_School');
                                      this.setState({offset: 0})
                                    }}


                                    />
                                  <ListView
                                    showsHorizontalScrollIndicator={false}
                                    dataSource={this.state.searchList}
                                    renderRow={this._renderRow.bind(this)}
                                    enableEmptySections={true}
                                    style={{height:100}}
                                    />

                                  {
                                    (this.state.selectSchool &&
                                      this.state.input != "" &&
                                      this.state.input != I18n.t('app.components.uniRace.UniRace.searchSchool') &&
                                      this.state.searchList.getRowCount() == 0) &&

                                      <TouchableOpacity style={{flexDirection:'column', alignItems:'center',
                                        justifyContent:'flex-start', width:WIDTH-40, flexGrow:1,}}>

                                        <Text style={{borderWidth:1, borderStyle:'solid',
                                          borderColor:'#ffffff',color:'#ffffff',
                                          fontFamily:'Montserrat-Light', fontSize:13,
                                          padding:10, textAlign:'center',
                                          marginTop:0
                                        }} onPress={()=>{
                                          Actions.addSchool()
                                        }}>
                                        {I18n.t('app.components.uniRace.UniRace.couldntFindSchool')}
                                      </Text>
                                    </TouchableOpacity>

                                  }

                                </View>

                              }



                            </View>

                            <View style={{backgroundColor:'transparent', bottom:0,
                              left:0, width: WIDTH, alignItems: 'center', justifyContent: 'flex-start',
                              flexDirection: 'column' }}>
                              {!this.state.selectSchool && <TouchableOpacity style={[styles.loginButton, {marginRight:20, marginLeft:20, marginBottom: 50, flexDirection: 'column', alignItems:'center', justifyContent:'center', width: WIDTH-40 }]}
                              onPress={ ()=> { this._shareLink() }}>
                              <Text style={{fontFamily:'Montserrat-Light', color:'#ffffff', textAlign:'center', marginLeft:10}}>
                              {I18n.t('app.components.uniRace.UniRace.invite')} &nbsp; {I18n.t('app.components.uniRace.UniRace.your')} &nbsp; {I18n.t('app.components.uniRace.UniRace.friends')}
                              </Text>
                              <Text style={{ fontFamily: 'Montserrat-Light', color: '#ffffff', backgroundColor: 'transparent', fontSize: 8, marginTop:2}}>{I18n.t('app.components.uniRace.UniRace.getFreeMatches')}</Text>
                            </TouchableOpacity> }

                            {(this.state.school != null) &&
                              <View style={{ display: 'flex', flexDirection: 'row'}}>

                                <TouchableOpacity onPress={() => {
                                  trackEvent('University_Challenge', 'Click_Country_Ranking')
                                  Actions.uniRank({ country: this.state.school.country });
                                }}
                                style={{height: 50,
                                        lineHeight: 50,
                                        cursor: 'pointer',
                                        flex: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        paddingBottom: 30,
                                        alignItems: 'center'}}>
                                  <Text style={{ color: '#FFFFFF',
                                    fontSize: 10, fontFamily: 'Montserrat-Light',}}>
                                    {I18n.t('app.components.uniRace.UniRace.countryRanking')}
                                  </Text>
                                  <View style={{  height: 2,
                                                  marginTop: 5,
                                                  width: 135,
                                                  backgroundColor:'#cc4973'}} ></View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                  trackEvent('University_Challenge', 'Click_Full_Ranking')
                                  Actions.uniRank()
                                }}
                                style={{height: 50,
                                        lineHeight: 50,
                                        cursor: 'pointer',
                                        flex: 1,
                                        display: 'flex',
                                        paddingBottom: 30,
                                        justifyContent: 'center',
                                        alignItems: 'center'}}>
                                  <Text style={{ color: '#FFFFFF',
                                    fontSize: 10, fontFamily: 'Montserrat-Light',}}>
                                    {I18n.t('app.components.uniRace.UniRace.fullRanking')}
                                  </Text>
                                  <View style={{height: 2,
                                                marginTop: 5,
                                                width: 100,
                                                backgroundColor:'#cc4973'}} ></View>
                                </TouchableOpacity>

                            </View>}
                          </View>


                        </View>


                      </LinearGradient>
                    </ImageBackground>
                    <ShareApp ref={'shareApp'} />
                  </View>
                )
              } else {
                return null;
              }

            }

          }

          class UniSearchRow extends Component {

            constructor(props) {
              super(props);
            }

            render(){
              var WIDTH = Dimensions.get('window').width;
              return(
                <TouchableOpacity onPress={() => {
                    Meteor.call("setUni", Meteor.user()._id, this.props.school._id, (err, result) => {
                      this.props.container.setState({
                        selectSchool: false
                      })
                      this.props.container.update(this.props.school);
                      trackEvent('University_Challenge', 'School_selected');
                    })

                  }} key={this.props.school.name} style={{
                    width:WIDTH, height:60}}>
                    <View style={{justifyContent: 'center', width:WIDTH-20,
                      alignItems: 'center', flexDirection: 'row', marginLeft: 10, marginRight: 10,
                      height:65}}>

                      <Text style={{
                          margin: 0, fontFamily: 'Montserrat-Light', textAlign:'left',
                          fontSize:14, color: '#FFFFFF', flexGrow: 1, flexGrow:1}}>
                          {this.props.school.name.toUpperCase()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                }

              }
