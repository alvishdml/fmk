import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
    Text,
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import Meteor, { MeteorListView } from '@meteorrn/core';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/styles';
import Constants from '../../utilities/Constants';
import { Actions } from 'react-native-router-flux';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class MessagesList extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1._id !== r2._id});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            hasMatches: null,
            updatedAt: new Date()
        };
    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps.data) {
            this.setState({ hasMatches: false });
        } else if(nextProps.update) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(nextProps.data),
                hasMatches: true,
                updatedAt: new Date()
            });
        }
    }

    componentDidMount() {
        trackScreen('Messages_Screen');
    }

    render() {
        if (this.state.hasMatches !== null) {
            if(this.state.hasMatches) {
                return (
                    <ListView
                        key={this.state.updatedAt}
                        showsHorizontalScrollIndicator={false}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow.bind(this)}
                        enableEmptySections={true}
                        />
                );
            } else {
                return (
                    <View style={{ flex: 1 }}>
                        <View style={[styles.loadingPage, { flex: 1, backgroundColor: '#fff' }]}>
                            <Text style={[styles.legendas, { fontSize: 20, color: '#aeb7b7', fontFamily: 'Montserrat-Light' }]}>
                            {I18n.t('app.components.matchesPage.MessagesList.noNewMessages')}
                            </Text>
                        </View>
                    </View>
                );
            }
        } else {
            return (
                <View removeClippedSubviews={true} style={[styles.loadingPage, { backgroundColor: '#fff' }]}>
                    <ActivityIndicator
                        animating={true}
                        color='#aeb7b7'
                        style={{ transform: [{ scale: 1 }] }}
                        size="large"
                        />
                </View>
            );
        }
    }

    _renderRow(matchData) {
        return (
            <MatchRow popUp={this.props.popUp} matchData={matchData} showNew={this.props.showNew} />
        );
    }
}

class MatchRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            picture: '',
            name: '',
            typeColor: 3,
            idMatch: '',
            lastMessage: '',
            isNew: false,
            hasMessages: false,
            hasNewMessages: false,
            newMessageCount: 0,
            isLoading: true,
            id:'',
            matchType: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.elements != this.props.elements){
            this.getUser();
        }
    }
    getUser() {
        let matchData = this.props.matchData,
        idMatch,
        idUser = Meteor.user()._id,
        isNew = false,
        hasNewMessages = false;

        if (matchData.unread != -1) {
            if(idUser == matchData.first) {
                idMatch = matchData.second;
                if (matchData.unread == 1) {
                    hasNewMessages = true;
                }
                if (!matchData.first_seen) {
                    isNew = true;
                }
            } else {
                if (matchData.unread == 2) {
                    hasNewMessages = true;
                }
                if (!matchData.second_seen) {
                    isNew = true;
                }
                idMatch = matchData.first;
            }
            let user = Meteor.call('userProfile', idMatch, (err, result) => {
                if (!err && result) {
                    let cor = 3;
                    if (matchData.type == 'fuck') {
                        cor = 0;
                    } else if (matchData.type == 'marry') {
                        cor = 1;
                    } else if(matchData.type == 'kill') {
                        cor = 2;
                    } else if(matchData.type == 'wink') {
                        cor = 4;
                    }
                    let urlPicture = result.picture;
                    if (result.custom_picture) {
                        urlPicture = result.custom_picture;
                    }
                    this.renderLastMessage();
                    this.setState({
                        picture: urlPicture,
                        name: result.first_name,
                        typeColor: cor,
                        idMatch: idMatch,
                        isNew: isNew,
                        isLoading: false,
                        hasMessages: true,
                        hasNewMessages: hasNewMessages,
                        id: matchData._id,
                        matchType: matchData.type
                    });
                }
            });
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }

    renderLastMessage(){
        Meteor.call('getLastMessage', this.props.matchData._id, (err, result) =>{
            if(!err) {
                var isNewMessage = this.checkForNewMessages();
                this.setState({
                    lastMessage: result,
                    newMessageCount: this.props.matchData.to_read,
                    hasNewMessages: isNewMessage
                });
            }
        })
    }

    renderNewMessageCount() {
        if (this.state.hasNewMessages) {
            let count = this.props.matchData.to_read;
            if (count > 0) {
                return (
                    <View style={{width:25, height:25, backgroundColor:'#fff', borderRadius:50, justifyContent:'center', alignItems:'center', marginLeft: 15}}>
                        <Text style={{fontFamily: 'Montserrat-Light', color: '#aeb7b7', fontSize: 12}}>
                            {this.props.matchData.to_read}
                        </Text>
                    </View>
                );
            } else {
                return <Text></Text>;
            }
        } else {
            return <Text></Text>;
        }
    }

    checkForNewMessages() {
      if(Meteor.user()){
        let matchData = this.props.matchData,
            idUser = Meteor.user()._id,
            hasNewMessages = false;

        if (matchData.unread != -1) {
            if (idUser == matchData.first) {
                if(matchData.unread == 1) {
                    hasNewMessages = true;
                }
            } else {
                if (matchData.unread == 2) {
                    hasNewMessages = true;
                }
            }

            if(hasNewMessages) {
                return true;
            } else {
                return false;
            }
        }
      } else {
        return false;
      }
    }

    render() {
        let constants = new Constants();
        if(this.props.matchData._id != this.state.id && !this.state.isLoading) {
            this.getUser();
        }
        if(this.props.matchData.to_read != this.state.newMessageCount) {
                this.renderLastMessage();
        }
        if (this.state.isLoading) {
            this.getUser();
            return (
                <View style={[styles.profileUserHistory, {height: 100, width: WIDTH-20, backgroundColor:'#fff'}]}>
                    <View style={[styles.loadingPage, {height: 100, width: WIDTH-20}]}>
                        <ActivityIndicator style={[styles.centering]} color='#aeb7b7' size="large"/>
                    </View>
                </View>
            );
        } else {
            let message = this.state.lastMessage;
            if(!this.state.lastMessage) {
                message = I18n.t('app.components.matchesPage.MessagesList.gifSent')
            }
            let cor = constants.colors[this.state.typeColor] + 'E6',
                cor1 = constants.colors1[this.state.typeColor] + 'E6';
            return (
                <TouchableOpacity key={this.props.matchData.last_action} style={{flex:1 , height: 100, width: WIDTH-20, marginBottom: 5}} onPress={() => {
                        this.setState({hasNewMessages:false});
                        Actions.chatWindow({
                            idMatch: this.props.matchData._id,
                            first: this.props.matchData.first,
                            second: this.props.matchData.second,
                            matchType: this.props.matchData.type,
                            numPaginasPop: 1,
                            unmounted: false,
                            unread: this.props.matchData.unread,
                            image: {uri: this.state.picture},
                            popUp: this.props.popUp
                        });

                    } }>
                    <ImageBackground style={{flex: 1, width: WIDTH-20, height:100}} source={{ uri: this.state.picture }}>
                    
                        <LinearGradient style={{flex:1, width: WIDTH-20, height:100, justifyContent: 'center'}} colors={[cor1, cor]}>
                            {this.state.matchType == 'wink' && <Image style={{ height: 25, width: 25, position: 'absolute', right: 20, top: 10   }} source={require('../../../images/wink.png')}/> }
                            <View style={{flex: 1, margin: 15, flexDirection:'row'}}>
                                <View style={{flex: 1, alignItems: 'flex-start', justifyContent:'center', flexDirection:'row'}}>
                                    <View style={{height:70, justifyContent:'center', alignItems:'center'}}>
                                        <Image style={[styles.photoHistory]} source={{ uri: this.state.picture }}/>
                                    </View>
                                    <View style={{flex: 1, height:70, paddingLeft:10, justifyContent:'center'}}>
                                        <Text style={{fontFamily: 'Montserrat-Bold', backgroundColor:'transparent', color: 'white', fontSize: 15 }}>
                                            { this.state.name }
                                        </Text>
                                        <Text style={{fontFamily: 'Montserrat-Light', backgroundColor:'transparent', color: 'white', fontSize: 15}} numberOfLines={2}>
                                            { message }
                                        </Text>
                                    </View>
                                </View>
                                <View ref="newMessageCount" style={{justifyContent:'center', alignItems:'center'}}>
                                    { this.renderNewMessageCount() }
                                </View>
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                </TouchableOpacity>
            );
        }
    }
}
