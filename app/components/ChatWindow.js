import React, { Component } from 'react';
import I18n from '../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Meteor, { createContainer } from '@meteorrn/core';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GiftedChat,
  Bubble,
  Send,
  MessageText,
  Time,
  Composer
} from 'react-native-gifted-chat';
import _ from 'lodash';
import ChatHeader from './chat/ChatHeader';
import Constants from '../utilities/Constants';
import styles from '../styles/styles';
import PreviewLayer from './game/PreviewLayer';
import Giphy from './chat/giphy';
import NotificationCounter from '../utilities//NotificationCounter';
import { trackScreen, trackEvent } from '../utilities/Analytics';

const BD = require('../utilities/DAAsyncStorage');
const myBD = new BD();

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const UPDATE_TIMER = 10000; // 10 seconds between each update

export default class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      firstTime: true,
      userPosition: -1,
      image: '', name: '',
      idOtherUser: '',
      chatHandle: '',
      unmounted: true,
      isLoading: true,
      cor: 3,
      estadoModel: false,
      id: '',
      isGiphyOpen: false,
      giphyComponent: '',
      loadingPickup: false,
      text: '',
      pickuplineAsked: false,
      ready: false,
      updateTimer: null,
      country: 'GB',
      sentMessage: false,
      matchType: this.props.matchType
    };
    this.onSend = this.onSend.bind(this);
    this.updateMessages = this.updateMessages.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.triggerRate = this.triggerRate.bind(this);
    this.ref_Giphy = React.createRef(null);
    this.ref_chat = React.createRef(null);
    this.ref_previewLayerProfile = React.createRef(null);
  }

  componentWillMount() {
    this.resetChat();
  }

  componentDidMount() {
    trackScreen('New_Conversation_Screen');
    Meteor.call(
      'chat',
      this.props.idMatch,
      (err, res) => {
        if (!err) {
          this.setState({
            messages: res,
            ready: true,
            updateTimer: setInterval(this.updateMessages, UPDATE_TIMER),
          });
        }
      }
    );
  }

  componentWillUnmount() {
    clearInterval(this.state.updateTimer);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.elements != this.props.elements) {
      this.resetChat();
    }
  }

  updateMessages() {
    Meteor.call(
      'chat',
      this.props.idMatch,
      (err, res) => {
        if (!err) {
          if (res.length !== this.state.messages.length) {
            this.setState({
              messages: res,
            });
          }
        }
      }
    );
  }

  resetChat() {
    this.setState({
      messages: [],
      firstTime: true,
      userPosition: -1,
      image: '', name: '',
      idOtherUser: '',
      chatHandle: '',
      unmounted: true,
      cor: 3,
      estadoModel: false,
      id: '',
      isGiphyOpen: false,
    });
  }

  renderSend(props) {
    if (this.state.isGiphyOpen) {
      return (
        <Send {...props} label= { <Icon name={'search'} size={30} color={'#babfc4'}/> }/>
      );
    } else {
      return (
        <Send {...props} label= { <Icon name={'send'} size={30} color={'#babfc4'}/> }/>
      );
    }
  }

  renderMessageImage(props) {
    return (
      <View renderToHardwareTextureAndroid={true} style={{ height: 200, width: WIDTH / 1.3 }}>
        <Image source={props.currentMessage.image} resizeMode="contain" style={{ height: 200, flex: 1 }}/>
      </View>
    );
  }

  renderTime(props) {
    return (
      <Time
        {...props}
        textStyle={{
          right: {
            color: '#aaa',
            fontFamily: 'Montserrat-Regular'
          },
          left: {
            color: 'white',
            fontFamily: 'Montserrat-Regular'
          }
        }}
        />
    );
  }

  renderLoading(props){
    let marginTop = -60;
    if(this.state.messages.length == 0){
      marginTop = 100;
    }
    return(
      <View style={[styles.loadingPage, { backgroundColor: '#fff' }]}>
        <ActivityIndicator
          animating={true}
          color = {'#aeb7b7'}
          style={{ transform: [{ scale: 1.8 }], marginTop: marginTop }}
          size="large"
          />
      </View>
    )
  }

  renderMessageText(props) {
    return (
      <MessageText
        {...props}
        textStyle={{
          right: {
            color: 'black',
            fontFamily: 'Montserrat-Regular',
            marginTop: 20,
            backgroundColor: 'transparent',
          },
          left: {
            color: 'white',
            fontFamily: 'Montserrat-Regular',
            marginTop: 20,
            backgroundColor: 'transparent',
          }
        }}
        />

    );
  }

  renderAvatar(props) {
    let image = { uri: 'https://facebook.github.io/react/img/logo_og.png' };
    if (props.currentMessage.user._id == this.state.userPosition) {
      if (Meteor.user().profile.custom_picture) {
        image = { uri: Meteor.user().profile.custom_picture };
      } else {
        image = { uri: Meteor.user().profile.picture };
      }
    } else if (props.currentMessage.user._id != 19) {
      image = this.props.image;
    }
    return (
      <View renderToHardwareTextureAndroid={true}>
        <Image source={image} style={{ height: 36, width: 36, borderRadius: 18, }}/>
      </View>
    );
  }

  goBack() {
    if (this.state.chatHandle) {
      if (this.props.numPaginasPop > 1) {
        try{
          Actions.pop({ popNum: this.props.numPaginasPop });
        }
        catch(err) {

        }
      } else {
        try{
          Actions.pop();
        }
        catch(err) {

        }
      }
    }
  }

  renderBubble(props) {
    let constants = new Constants();
    let cor;
    if (this.props.matchType == 'fuck') {
      cor = constants.colors[0];
    } else if (this.props.matchType == 'marry') {
      cor = constants.colors1[1];
    } else if(this.props.matchType == 'kill') {
      cor = constants.colors[2];;
    } else if(this.props.matchType == 'wink') {
      cor = constants.colors[4];;
    }

    return (
      <Bubble
        {...props}
        color0={constants.colors[this.state.cor]}
        color1={constants.colors1[this.state.cor]}
        wrapperStyle={{
          right: {
            backgroundColor: '#f0f0f0',
            padding:5
          },
          left: {
            backgroundColor: cor,
            padding: 5
          }
        }}
        >
      </Bubble>
    );
  }

  onSend(text, giphy) {
    var  oldComposerHeight = 0;
    var oldContainerHeight = 0;
    if(this.ref_chat?.current){
      oldComposerHeight = this.ref_chat?.current.state.composerHeight;
      oldContainerHeight = this.ref_chat?.current.state.messagesContainerHeight
    }
    let headerOffset = 0;

    if (this.state.messages.length > 0) {
      if (giphy) {
        trackEvent('New_Conversation_Screen', 'Click_SendGif', {label: 'response'});
      } else {
        trackEvent('New_Conversation_Screen', 'Click_SendText', {label: 'response'});
      }
    } else {
      headerOffset = 45;
      if(giphy) {
        trackEvent('New_Conversation_Screen', 'Click_SendGif', {label: 'first message'});
      } else {
        trackEvent('New_Conversation_Screen', 'Click_SendText', {label: 'first message'});
      }
      if(this.state.pickuplineAsked){
        trackEvent('Chat Page', 'Pickup line sent');
        Meteor.call("trackPickupLine", this.props.idMatch)
      }
    }
    if (this.state.isGiphyOpen && !giphy) {
      this.state.giphyComponent.searchGIF(text[0].text);
    } else if (!giphy) {
      Meteor.call('newMessage', this.props.idMatch, text[0].text, this.state.userPosition, this.state.idOtherUser, giphy, (err, result) => {
        if (!err) {
          var message = {
            _id: Math.round(Math.random() * 1000000),
            text: text[0].text,
            createdAt: new Date(),
            user: {
              _id: this.state.userPosition,
              avatar: Meteor.user().profile.picture,
            },
          }
          this.setState({
            messages: [message,...this.state.messages],
            sentMessage: true,
          });

          // TODO this is a workaround to set chat composer height, find a better way
          newComposerHeight = 41
          if(this.ref_chat.current){
            this.ref_chat.current.setState({
              composerHeight: newComposerHeight,
              messagesContainerHeight: oldContainerHeight + oldComposerHeight - newComposerHeight - headerOffset
            })
          }
        }
      });
    } else {
      Meteor.call('newMessage', this.props.idMatch, text, this.state.userPosition, this.state.idOtherUser, giphy, (err, result) => {
        if (!err) {
          var message = {
            _id: Math.round(Math.random() * 1000000),
            text: text[0].text,
            image: text,
            createdAt: new Date(),
            user: {
              _id: this.state.userPosition,
              avatar: Meteor.user().profile.picture,
            },
          }
          this.setState({
            messages: [message,...this.state.messages],
            sentMessage: true,
          });

          // TODO this is a workaround to set chat composer height, find a better way
          newComposerHeight = 41
          if(this.ref_chat){
            this.ref_chat.setState({
              composerHeight: newComposerHeight,
              messagesContainerHeight: oldContainerHeight + oldComposerHeight - newComposerHeight - headerOffset
            })
          }
        }
      });
    }

  }

  getInfo(id) {
    Meteor.call('userProfile', id, (err, result) => {
      if (result) {
        var urlPicture = result.picture;
        if (result.custom_picture) {
          urlPicture = result.custom_picture;
        }
        this.setState({
          name: result.first_name,
          image: { uri: urlPicture },
          idOtherUser: id,
        });
      }
    });
  }

  onChatChange(chat, chatWindow) {
    if (chat) {
      var message = chat[0];
      if (message.user._id != chatWindow.state.userPosition) {
        var newMessages = GiftedChat.append(chatWindow.state.messages, message);
        console.log(newMessages, 'new messagess')
        chatWindow.setState({ messages: newMessages });
        Meteor.call('readMessage', this.props.idMatch, (err, result) => {
          if (!err) {
            NotificationCounter.refreshNotification()
          } else {
            ////console.log(err);
          }
        });
      }
    }
  }

  loadChat() {
    const { ready } = this.state;
    const { chatHandle } = this.props;
    let chat;
    if (this.props.matchType == 'fuck') {
      cor = 0;
    } else if (this.props.matchType == 'marry') {
      cor = 1;
    } else if(this.props.matchType == 'kill') {
      cor = 2;
    } else if(this.props.matchType == 'wink') {
      cor = 4;
    }
    if (ready && !this.state.unmounted) {
      chat = this.state.messages;
      // chat = chat.reverse();
      if(chat.length == 0){
        trackEvent('New_Conversation_Screen', 'Pickup_line_viewed');
      }
      if (this.state.firstTime) {
        var idUser = Meteor.user()._id;
        var pos = -1;
        if (idUser == this.props.first) {
          this.getInfo(this.props.second);
          if (this.props.unread == 1) {
            Meteor.call('readMessage', this.props.idMatch, (err, result) => {
              if (!err) {
                NotificationCounter.refreshNotification()
              }
            });
          }
          pos = 1;
        } else {
          if (this.props.unread == 2) {
            Meteor.call('readMessage', this.props.idMatch, (err, result) => {
              if (!err) {
                NotificationCounter.refreshNotification()
              }
            });
          }
          this.getInfo(this.props.first);
          pos = 2;
        }
        this.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, chat),
            firstTime: false,
            userPosition: pos,
            chatHandle: chatHandle,
            cor: cor,
            isLoading: false,
          }
        });
      }
      if (chat.length > this.state.messages.length && chat.length != 0 && !this.state.firstTime) {
        this.onChatChange(chat, this);
      }
    }
  }

  getLines(){
    Meteor.call("getPickupLine", this.state.country, (err, res) =>{
      if(!err){
        this.setState({pickuplineAsked: true})
        // TODO this is a workaround to set chat composer height, find a better way
        var oldComposerHeight = 0;
        var oldContainerHeight = 0;

        if(this.ref_chat?.current){
          oldComposerHeight = this.ref_chat?.current.state.composerHeight;
          oldContainerHeight = this.ref_chat?.current.state.messagesContainerHeight
        }

        let newComposerHeight;

        if(res.length > 105){
          newComposerHeight = 94
        } else if(res.length > 70){
          newComposerHeight = 72
        } else {
          newComposerHeight = 50
        }

        if(this.ref_chat?.current){
          this.ref_chat?.current.setState({
            text: res, composerHeight: newComposerHeight,
            messagesContainerHeight: oldContainerHeight + oldComposerHeight - newComposerHeight})
          }
          this.setState({loadingPickup: false})
        }
      });
    }

    renderFooter(props) {
      if (this.state.isGiphyOpen) {
        return (
          <View style={{ width: WIDTH, height: 120, backgroundColor: '#fff' }}>
            <Giphy ref={this.ref_Giphy} sendGiphy={this} chat={this} cor={this.state.cor} type={this.props.matchType}/>
          </View>
        );
      } else if (this.state.messages.length == 0) {
        let marginBottom = 30
        if(this.state.loadingPickup){
          marginBottom = 0
        }
        return (
          <View style={{ flex:1, height:HEIGHT-200, marginTop: 0, alignItems: 'center', justifyContent: 'flex-end', flexDirection:'column' }}>

            <View style={{ flexGrow:2,  justifyContent:'center'}}>
              <Text style={{ textAlign: 'center', color: '#aaa', fontFamily: 'Montserrat-Regular' }}>
              {I18n.t('app.components.ChatWindow.rememberCreeps')}
              </Text>
            </View>

            <View style={{ flexGrow:1, width:WIDTH, marginTop: 0, marginBottom:20,  alignItems: 'center', justifyContent: 'flex-end' }}>

              <Text style={{textAlign: 'center', color: '#aaa', fontFamily: 'Montserrat-Regular', fontSize:50 }}>
                🙊
              </Text>
              <Text style={{textAlign: 'center', color: '#aaa', fontFamily: 'Montserrat-Regular' }}>
              {I18n.t('app.components.ChatWindow.startConversation')}
              </Text>
              <TouchableOpacity
                onPress={()=>{
                  trackEvent('New_Conversation_Screen','Click_GiveHint')
                  this.setState({loadingPickup: true})
                  trackEvent('New_Conversation_Screen', 'Ask_Pickup_line');
                  this.getLines();
                }}
                style={{
                  padding: 10, borderWidth:2, marginTop:10, borderColor:'#aaa',
                  borderStyle:'solid', marginBottom: marginBottom
                }}
                >
                {this.state.pickuplineAsked && <Text style={{textAlign: 'center', color: '#aaa', fontFamily: 'Montserrat-Regular' }}>
                {I18n.t('app.components.ChatWindow.giveAnotherHint')}
              </Text>}
              {!this.state.pickuplineAsked && <Text style={{textAlign: 'center', color: '#aaa', fontFamily: 'Montserrat-Regular' }}>
              {I18n.t('app.components.ChatWindow.giveHint')}
            </Text>}
          </TouchableOpacity>

          {this.state.loadingPickup && <ActivityIndicator
            animating={true}
            color = {'#aeb7b7'}
            style={{ marginTop:10 }}
            size="small"
            />}

            {this.state.pickuplineAsked &&
              <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                <TouchableOpacity  style={this.state.country === 'PT' ? styles.flagSelected : styles.flagUnselected } onPress={() => {
                    this.setState({country: 'PT'}, () => {
                      this.getLines();
                      trackEvent('New_Conversation_Screen', 'Hint', {label: 'PT Flag'});
                    });
                  }}>
                  <Image source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAvCAYAAABe1bwWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1RUIxQTBDMzA1RUUxMUUzOTkwODgwRUU1QTkwOENFMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1RUIxQTBDNDA1RUUxMUUzOTkwODgwRUU1QTkwOENFMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVFQjFBMEMxMDVFRTExRTM5OTA4ODBFRTVBOTA4Q0UwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVFQjFBMEMyMDVFRTExRTM5OTA4ODBFRTVBOTA4Q0UwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+awdMuAAAAa5JREFUeNrs2z9IAmEYBvD3rjs7rTYpaSiamtprqU2ayikjagqqub2pvTGStmiQoqGpP1PWEq1NTUWDIGiDWCeeer1vfh7WJSROds8DD4inw/fj7v2EO7Vkep1aMs/d5E5zR7ga/TH7Zzr1YFxujnvPTXEvmweaq7G4ae4FN8GNdYLSw9HUWhNq7WIQlgOG+sAhN0mIGDjcNTlj4txVmHgRi7iuZgryPVsCMwsHX2YEJgoHX4Z1GPwaHTDtZEAAGMAABjCAAQxgAAMYwAQ5RjdfjoXqtBIt01SkStY2kfNikH0TodqbHlyYUUbZHSvRgO423ugnCk06ZI4XqXg0RLVCXzAvpWU+UzyUlmiWS+E5O7gzRi6fdjEnqhi+2JV+5PGj/Xhyno3gwqTzFr3X/ffk3LJGdiYcXJhsRaed10F6KJlkM5Bb0ajyZP6LHanr3zGCs5eNfL3u0XvXGL6AAQxgAAMYwAAGMIABDAKYDmHyYPClIDB3cPDlVmAO4OBLSmCuucew8CIWV83hu8E9gQmdKgtvV5IbQfIc/QL3nBr/yAhKcmrNi9wlZUGfAgwAHstZNXyQoDAAAAAASUVORK5CYII=' }} style={{height: 30, width: 50}} />
                </TouchableOpacity>
                <TouchableOpacity style={this.state.country === 'GB' ? styles.flagSelected : styles.flagUnselected } onPress={() => {
                    this.setState({country: 'GB'}, () => {
                      this.getLines();
                      trackEvent('New_Conversation_Screen', 'Hint', {label: 'GB Flag'});
                    });
                  }}>
                  <Image source={{ uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAvCAYAAABe1bwWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNkZCQjA0NzA1RUQxMUUzOTkwODgwRUU1QTkwOENFMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNkZCQjA0ODA1RUQxMUUzOTkwODgwRUU1QTkwOENFMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU2RkJCMDQ1MDVFRDExRTM5OTA4ODBFRTVBOTA4Q0UwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU2RkJCMDQ2MDVFRDExRTM5OTA4ODBFRTVBOTA4Q0UwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jIYSGQAACrdJREFUeNrsWglY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' }} style={{height: 30, width: 50}} />
                </TouchableOpacity>
                <TouchableOpacity style={this.state.country === 'DE' ? styles.flagSelected : styles.flagUnselected } onPress={() => {
                    this.setState({country: 'DE'}, () => {
                      this.getLines();
                      trackEvent('New_Conversation_Screen', 'Hint', {label: 'DE Flag'});
                    });
                  }}>
                  <Image source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAvCAYAAABe1bwWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1OTU2RkI3RDA1RUYxMUUzOTkwODgwRUU1QTkwOENFMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1OTU2RkI3RTA1RUYxMUUzOTkwODgwRUU1QTkwOENFMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5NTZGQjdCMDVFRjExRTM5OTA4ODBFRTVBOTA4Q0UwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5NTZGQjdDMDVFRjExRTM5OTA4ODBFRTVBOTA4Q0UwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ddPfEAAAARZJREFUeNrs2zFqAlEUheHnMIWSKiDqUrRJE5BgoSkkabRVlxRJayGmSmViqU024QIErVOk0HPxOkRebCXof+DHYmzm4zHTaO6+0Q6/9qD6qqrKKhcue1u1Ul9qqD4OFxL/zKuxmqpHVbkClOD3WPF7nrpBwS6k/oVX9RyYGfyorp2Yuupgks0s6ok/U9jxBgZzh0O0msEUcYhWSjD4cwkwp2QgAAYYYIABBpj/vnRyc4sCJwYYYIABBhhggAEGGGAYMMAAA8z5lhZ6SxQ4McAAAwwwwAADzIXBrGGItjGYBQ7R5gbzgkO0ocHM1AiLbGbxeXj49tQEk/DmFtlb6Tvsf0ffVO9h/4+Ma9nK77mlntwi7AQYADcUISaTLHyvAAAAAElFTkSuQmCC' }} style={{height: 30, width: 50}} />
                </TouchableOpacity>
              </View>
            }

          </View>
        </View>
      );
    }
    return null;
  }

  activeType(trigger) {
    this.setState({ isGiphyOpen: trigger });
  }

  renderActions() {
    if (this.state.isGiphyOpen) {
      return (
        <TouchableOpacity onPress={() => this.activeType(false) }>
          <Icon name={'text-format'} size={40} color={'#babfc4'} style={{ margin: 5 }}/>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this.activeType(true) }>
          <Icon name={'gif'} size={40} color={'#babfc4'} style={{ margin: 5 }}/>
        </TouchableOpacity>
      );
    }
  }

  renderImage(props){
    return (
      <View>
        <Text>
          {props.currentMessage.image}
        </Text>
      </View>
    );
  }

  renderComposer(props) {
    if (this.state.isGiphyOpen ) {
      return (<Composer {...props} placeholder='Search for a GIF...' />);
    } else {
      return (<Composer {...props} placeholder='Type a message...' />);
    }
  }

  setCustomText(text){
    this.setState({text: text})
  }

  renderChat() {
    if (this.state.isLoading) {
      if (!this.state.firstTime) {
        this.resetChat();
      } else {
        this.loadChat();
      }
      return (
        <View style={[styles.loadingPage, { backgroundColor: '#fff' }]}>
          <ActivityIndicator
            animating={true}
            color = {'#aeb7b7'}
            style={{ transform: [{ scale: 1.8 }] }}
            size="large"
            />
        </View>
      );
    } else {
      this.loadChat();
      // TODO: Check this -> loadEarlier={true}
      return (
        <GiftedChat
          ref="chat"
          messages={_.orderBy(this.state.messages, ['createdAt'], ['desc'])}
          // messages={this.state.messages.reverse()}
          onSend={this.onSend.bind(this) }
          locale='pt'
          renderBubble={this.renderBubble.bind(this) }
          renderSend={this.renderSend.bind(this) }
          renderAvatar={this.renderAvatar.bind(this) }
          renderMessageText={this.renderMessageText.bind(this)}
          renderTime={this.renderTime}
          renderFooter={this.renderFooter.bind(this) }
          renderActions={this.renderActions.bind(this) }
          renderComposer={this.renderComposer.bind(this) }
          user={{
            _id: this.state.userPosition,
          }}
          renderLoading={this.renderLoading.bind(this)}
          keyboardShouldPersistTaps="never"
          multiline={true}
          onLongPress={()=>{}}
          />
      );
    }
  }

  triggerRate() {
    if (this.props.popUp) {
      Meteor.call('tiggerChatRate', Meteor.userId(), (err, res) => {
        if (!err && res) {
          this.props.popUp.showRatePopUp(true);
        }
      });
    } else {
      myBD.criarItem('ratePopUp','true',() => {});
    }
  }

  openProfile(estado, id) {
    trackEvent('Chat Page', 'Open Profile Details');
    this.ref_previewLayerProfile.current.toggleModal(estado, id, this);
    this.setState({ estadoModel: estado, id: id });
    this.setState({ lock: true });
  }

  render() {
    if (!this.props.unmounted) {
      Actions.refresh({ unmounted: true });
      this.setState({ unmounted: false });
    }
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <ChatHeader notification={this.props.notification} sentMessage={this.state.sentMessage} chatWindow={this} idUserProfile={this.state.idOtherUser} image={this.props.image} cor={this.state.cor} matchId={this.props.idMatch} name={this.state.name} chat={this} matchType={this.state.matchType}/>

        {this.state.messages.length > 0 &&
          <View style={{position: 'relative', height:45, top: 0, justifyContent:'center'}}>
            <Text style={{textAlign: 'center', color: '#aaa', fontFamily: 'Montserrat-Regular' }}>
            {I18n.t('app.components.ChatWindow.rememberCreeps')}
            </Text>
          </View>
        }
        { this.renderChat() }
        <PreviewLayer ref={this.ref_previewLayerProfile}/>
      </View>
    );
  }
}
