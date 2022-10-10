import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import Alert from '../../utilities/Alert';
import Meteor from '@meteorrn/core';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../utilities/Constants';
import {StatusBar} from 'react-native';
import { trackScreen, trackEvent } from '../../utilities/Analytics';


export default class UniRank extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1._id !== r2._id});
    this.state = {
      list: [],
      filteredList: ds.cloneWithRows([]),
      input: I18n.t('app.components.uniRace.UniRank.searchSchoolInput'),
    }
  }

  componentWillMount(){
    if(this.props.country){
      const TOP_SCHOOL_LIMIT = 20;
      Meteor.call("getUniFullRankCountry", TOP_SCHOOL_LIMIT, this.props.country, (err, result) => {
        if(result){
          this.setState({list: result, filteredList: this.state.filteredList.cloneWithRows(result)})
        }
      })
    } else {
      const TOP_SCHOOL_LIMIT = 100
      Meteor.call("getUniFullRank", TOP_SCHOOL_LIMIT, (err, result) => {
        if(result){
          this.setState({list: result, filteredList: this.state.filteredList.cloneWithRows(result)})
        }
      })
    }
  }

  componentDidMount(){
    trackScreen( this.props.country ? 'Country_List_University_Challenge' : 'Full_Ranking_University_Challenge');
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
          trackEvent(this.props.country ? 'Country_List_University_Challenge' : 'Full_Ranking_University_Challenge', 'Click_Close');
            try{
              Actions.pop();
            }
            catch(err) {

            }
          } }>
          <Icon style={{ marginLeft: 15, backgroundColor: 'transparent' }} name={'keyboard-arrow-left'} size={30} color={'#cccccc'}/>
        </TouchableOpacity>
      </View>
    </View>;
    return header;
  }

  _renderRow(school, sectionID, rowID, highlightRow) {
    return (
      <UniRow school={school} num={parseInt(rowID) + 1}/>
    );
  }

  filter(query){
    var newList = [];
    query = query.toLowerCase()
    for (s of this.state.list) {
      if(s.name.toLowerCase().includes(query)){
        newList.push(s)
      }
    }
    this.setState({filteredList: this.state.filteredList.cloneWithRows(newList)});
  }

  render(){
    let constants = new Constants();
    var WIDTH = Dimensions.get('window').width;
    var HEIGHT = Dimensions.get('window').height;

    if(Meteor.user()) {
      let picture = Meteor.user().profile.picture;
      let about = Meteor.user().profile.about;

      if (this.state.picture) {
        picture = this.state.picture;
      } else if (Meteor.user().profile.custom_picture) {
        picture = Meteor.user().profile.custom_picture;
      }

      return (
        <View style={{ flex: 1, }}>
          <ImageBackground source={{uri: picture}} style={{ width: WIDTH, height: HEIGHT-StatusBar.currentHeight, flex: 1, position: 'absolute', alignItems: 'center', top: 0, left: 0 }}>
            <LinearGradient
              style={styles.swipePageContainer}
              colors={['#1d2e47ee', '#411744ee']}>

              {this.renderHeader()}
              <View style={{
                  width:WIDTH, height:HEIGHT, flex: 1,
                  justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column'}}>

                  <View style={{ flexDirection: 'column',
                    margin: 0, justifyContent: 'flex-start'}}>
                    <Text style={{margin:0, marginLeft: 0, marginTop:-43, fontFamily: 'Selima', fontSize:65, textAlign:'center', color:'#ffffff'}}>
                    {I18n.t('app.components.uniRace.UniRank.university0')}
                    </Text>
                    <Text style={{margin:0, marginLeft: 40, marginTop:-10, fontFamily: 'Selima', fontSize:65, textAlign:'center', color:'#ffffff'}}>
                    {I18n.t('app.components.uniRace.UniRank.challenge')}
                    </Text>
                  </View>

                  <TextInput id="inputSearch" defaultValue={""}
                    multiLine={false} rows={1}
                    value={this.state.input}
                    style={{color: '#ffffff', width:WIDTH-40}}
                    onChangeText = {(newValue)=>{
                      this.setState({input: newValue});
                      this.filter(newValue)
                    }}

                    onFocus = {() => {
                      if(this.state.input == I18n.t('app.components.uniRace.UniRank.searchSchoolInput')){
                        this.setState({input: ''})
                      }
                    }}

                    onSubmitEditing = {() => {
                      if(this.state.input == ''){
                        this.setState({input: I18n.t('app.components.uniRace.UniRank.searchSchoolInput')})
                      }else{
                        trackEvent(this.props.country ? 'Country_List_University_Challenge' : 'Full_Ranking_University_Challenge', 'Search_Uni')
                      }
                    }}/>

                    <View style={{flexDirection: 'row', width:WIDTH-20, margin:10, marginBottom:5, justifyContent:'flex-start', alignItems:'center'}}>
                      <Text style={{color:'#ffffff', fontSize:10, width:42}}>
                      {I18n.t('app.components.uniRace.UniRank.rank')}
                      </Text>
                      <Text style={{color:'#ffffff', fontSize: 10, flexGrow: 1}}>
                      {I18n.t('app.components.uniRace.UniRank.university1')}
                      </Text>
                      <Text style={{color: '#fff', fontSize: 10, paddingRight: 10}}>
                      {I18n.t('app.components.uniRace.UniRank.students')}
                      </Text>
                      <Text style={{color:'#ffffff', fontSize:10}}>
                      {I18n.t('app.components.uniRace.UniRank.hotness')}
                      </Text>
                    </View>
                    <ListView
                      showsHorizontalScrollIndicator={false}
                      dataSource={this.state.filteredList}
                      renderRow={this._renderRow.bind(this)}
                      enableEmptySections={true}
                      style={{width: WIDTH}}
                      />
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>
          )}
          else {
            return null;
          }

        }

      }

      class UniRow extends Component {

        constructor(props) {
          super(props);

        }

        render() {
          const WIDTH = Dimensions.get('window').width;
          const root = 'https://app.playfmk.com'
          var rank = this.props.school && this.props.school.rank;

          // Calculate badge image and spacing
          let badgeUrl;
          let badgeHeight;
          let badgeWidth;

          badgeUrl = 'https://app.playfmk.com/images/uni' + Math.min(rank, 4)+ '.png';

          if(rank == 1){
            badgeHeight = 35
            badgeWidth = 25
          } else if (rank == 2) {
            badgeHeight = 35
            badgeWidth = 29
          } else if (rank == 3){
            badgeHeight = 30
            badgeWidth = 28
          } else {
            badgeHeight = 29
            badgeWidth = 29
          }

          return(
            <View key={this.props.school.name} style={{
                width: WIDTH, height:60}}>
                <View style={{justifyContent: 'center', width: WIDTH-20,
                  alignItems: 'center', flexDirection: 'row', marginLeft: 10, marginRight: 10,
                  height:65}}>
                  <View style={{flexDirection: 'row', width:40, justifyContent:'center'}}>
                    <Image source={{uri: badgeUrl}} style={{ position:'absolute', left:0, top: 0, height:badgeHeight, width:badgeWidth, resizeMode:'contain'}} />

                    <Text style={{
                        margin: 0, marginLeft:0, marginTop:5, marginRight:12, fontFamily: 'Montserrat-Light', textAlign:'center',
                        fontSize:14, color: '#fff', }}>
                        {rank}</Text>
                    </View>

                    <Text style={{
                        margin: 0, marginRight: 5, fontFamily: 'Montserrat-Light', width: WIDTH - 200,  textAlign:'left',
                        fontSize: 14, color: '#FFFFFF', flexGrow: 1, flexGrow:1}}>
                        {this.props.school.name.toUpperCase()}
                      </Text>

                      <Text style={{
                          margin: 0,  fontFamily: 'Montserrat-Light', textAlign:'center',
                          fontSize: 10, color: '#FFFFFF'}}>
                          {this.props.school.students}
                        </Text>

                        <Text style={{
                            margin: 0, marginLeft:10, fontFamily: 'Montserrat-Light', textAlign:'right', width: 50,
                            fontSize: 10, color: '#FFFFFF'}}>
                            <Text style={{color: '#cc4973', fontSize:12}}>{this.props.school.hotness}%</Text>
                          </Text>
                        </View>
                      </View>
                    )
                  }
                }
