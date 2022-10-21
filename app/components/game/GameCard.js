import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import Meteor from '@meteorrn/core';
import styles from '../../styles/styles';
import TimerMixin from 'react-timer-mixin';
import Constants from '../../utilities/Constants';
import NewMatchManager from '../../utilities/NewMatchManagement';
import LinearGradient from 'react-native-linear-gradient';
import GameTagIcon from '../../font/customIcon';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { trackEvent } from '../../utilities/Analytics';


const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const connectMethod = Platform.OS == 'ios' ? 'connectiOS' : 'connect';

let lastStateChoice = 0;
let currentStateChoice = 0;
let currentStateChosen = [];

export default class GameCard extends Component {
  constructor(props) {
    super(props);
    let color = '#424949';
    let color1 = '#424949';
    let select = 1;
    if (props.type) {
      let constants = new Constants();
      select = 0.15;
      switch (props.type) {
        case 'fuck':
          color = constants.colors[0];
          color1 = constants.colors1[0];
          break;
        case 'marry':
          color = constants.colors[1];
          color1 = constants.colors1[1];
          break;
        case 'kill':
          color = constants.colors[2];
          color1 = constants.colors1[2];
          break;
        default:
      }
    }
    this.state = {
      pressAction: new Animated.Value(0),
      estado: false,
      imagem: { uri: 'https://heatherchristenaschmidt.files.wordpress.com/2011/09/facebook_no_profile_pic2-jpg.gif' },
      birthday: '',
      nome: '',
      type: props.type || '',
      color,
      color1,
      select, //image opcacity
      top: 0,
      bottom: 0,
      crossOpacity: 0,
    };
  }

  componentWillMount() {
    this._value = 0;
    this.state.pressAction.addListener((v) => this._value = v.value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.type) {
      let color = '#424949';
      let color1 = '#424949';
      let select = 1;
      let constants = new Constants();
      select = 0.15;
      switch (nextProps.type) {
        case 'fuck':
          trackEvent('Game_Screen', 'Click_Fuck');
          color = constants.colors[0];
          color1 = constants.colors1[0];
          break;
        case 'marry':
          trackEvent('Game_Screen', 'Click_Marry');
          color = constants.colors[1];
          color1 = constants.colors1[1];
          break;
        case 'kill':
        trackEvent('Game_Screen', 'Click_Kill');
          color = constants.colors[2];
          color1 = constants.colors1[2];
          break;
        default:
      }
      this.setState({ color, color1, select, type: nextProps.type });
    }
  }

  handlePressIn() {
    Animated.timing(this.state.pressAction, {
      duration: 0,
      toValue: 1,
      useNativeDriver: true
    }).start(this.animationActionComplete.bind(this));
  }

  handlePressOut() {
    Animated.timing(this.state.pressAction, {
      duration: this._value * 20,
      toValue: 0,
      useNativeDriver: true
    }).start(this.animationActionComplete.bind(this));
  }

  animationActionComplete() {
    let est = false;
    if (this._value === 1) {
      est = true;
    }
    this.setState({
      estado: est,
    });
  }

  renderAge() {
    if (this.props.user.profile.birthday && this.props.user.profile.birthday != 'null') {
      return ' - ' + getAge(this.props.user.profile.birthday);
    } else {
      return '';
    }
  }

  renderCustomClose() {
    <View style={{position: 'relative', top:10, right:10, width:25, height:25, backgroundColor:'#FFFFFFaa', borderRadius: 100, alignItems:'center', visibility: 'hidden'}} >
      <Text style={{fontFamily:'Montserrat-light', fontSize:12, fontColor:'#3333333', paddingTop: 4, paddingBottom: 4}}>X</Text>
    </View>
  }

  renderCardContent() {
    var powerDetails = false
    if(this.props.user.profile.about && this.props.user.profile.photoArray && this.props.user.profile.photoArray.length > 1){
      powerDetails = true;
    }

    let simboloState = '';
    if (this.state.type) {
      switch (this.state.type) {
        case 'fuck':
        simboloState = 'fuck';
        break;
        case 'marry':
        simboloState = 'marry';
        break;
        case 'kill':
        simboloState = 'kill';
        break;
        default:
        simboloState = require('../../../images/none.png');
      }

      return (

        <View style={{ flexGrow: 1, width: WIDTH, height: 60, alignItems: 'center', justifyContent: 'center' }}>
          <GameTagIcon name={simboloState} color="#ffffff" style={{ fontSize: 90, backgroundColor: 'transparent' }} />
        </View>

      );
    } else {
      return (
        <View style={{ width: WIDTH, height: 60 }}>
          <LinearGradient style={{ flex: 1 }} colors={['transparent', '#181b1b']}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ flex: 1, alignItems: 'flex-end', justifyContent:'flex-start', flexDirection:'row', marginBottom: 13, marginLeft: 10 }}>
                <Text style={{ fontFamily: 'Montserrat-Bold', color: 'white', backgroundColor: 'transparent', fontSize: 15 }}>
                  {this.props.user.profile.first_name || this.props.user.profile.user_name + this.renderAge() }
                </Text>
                {this.props.user.profile.vip && <Icon style={{marginLeft: 5, marginBottom: 2}} name={'verified-user'} size={15} color={'#F76371'}/>}
              </View>
              {!this.props.share &&
                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 13, alignItems: 'flex-end', marginRight: 10 }}>
                  {powerDetails && <Text style={{ fontFamily: 'Montserrat-Regular', color: '#333', backgroundColor: 'rgba(255,255,255,0.8)', fontSize: 11, padding:2, paddingRight: 5, paddingLeft: 5, }}>
                  {I18n.t('app.components.game.GameCard.seeDetail')}
                  </Text>}
                  {!powerDetails && <Text style={{ fontFamily: 'Montserrat-Thin', color: '#ffffff', backgroundColor: 'transparent', fontSize: 12 }}>
                  {I18n.t('app.components.game.GameCard.seeDetail')}
                  </Text>}
                </View>
              }
            </View>
          </LinearGradient>
        </View>
      );
    }
  }
  componentDidUpdate(){
    if(this.props.powerVote){
      currentStateChoice = 0;
      currentStateChosen = [-1, -1, -1];
    }
  }
  render() {
    let cor = this.state.color;
    let cor1 = this.state.color1;

    if(this.state.type){
      this.state.crossOpacity = 1
    } else {
      this.state.crossOpacity = 0
    }

    if (this.state.select == 1) {
      cor += '00';
      cor1 += '00';
    } else {
      cor += 'CC';
      cor1 += 'CC';
    }
    let urlPicture = this.props.user.profile.picture;
    if (this.props.user.profile.custom_picture) {
      urlPicture = this.props.user.profile.custom_picture;
    }
    let translateY = 75;
    if (this.props.user.profile.custom_picture_translateY) {
      translateY = this.props.user.profile.custom_picture_translateY;
    }
    return (
      <TouchableOpacity
        hitSlop={{ top: this.state.top, left: 0, bottom: this.state.bottom, right: 0 }}
        style={{ flexGrow: 1, backgroundColor: 'rgba(66, 73, 73, 0.5)' }}
        onPress={gameStateChange.bind(this, this.props.gameView)}
        onPressOut={() => {
          // this.props.gameView.props.gameScene.close();
          this.setState({ top: 0, bottom: 0 }); } }
          onLongPress={() => {
            trackEvent('Game_Screen', 'Open_Profile_Details');
            this.props.gameView.props.gameScene.previewPhoto(true, this.props.user._id, this.props.user);
            this.setState({ top: 1000, bottom: 1000 }); } }>
            <View style={{ flexGrow: 1, overflow: 'hidden' }}>
              <Image source= {{ uri: urlPicture }} style={{ position: 'absolute', height: WIDTH, width: WIDTH, bottom: 0, transform: [{translateY: translateY}] }}></Image>

              <LinearGradient style={{ flexGrow: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }} start={{x:0, y:1}} end={{x:1, y:0}} colors={[cor, cor1]}>
                <View style={{position: 'absolute', opacity:this.state.crossOpacity, top:8, right:8, width:17, height:17, borderWidth: 1, borderColor: '#ffffff66', borderStyle: 'solid', backgroundColor:'#00000000', borderRadius: 100, alignItems:'center'}} >
                  <Text style={{fontFamily:'Montserrat-Light', fontSize:9, color:'#ffffff66', paddingTop: 2.2, paddingBottom:2.2}}>X</Text>
                </View>
                {this.renderCardContent() }
              </LinearGradient>
            </View>
          </TouchableOpacity>
        );
      }
    }

    function checkUnusedState(cena, constants) {
      let index = -1;
      let indexState = -1;
      //percorre o array de tipos existentes(F, M, K)
      for (let i = 0; i < constants.states.length; i++) {
        //verifica se o tipo actual já está escolhido
        indexState = constants.states.indexOf(constants.states[i]);
        if (!(currentStateChosen.indexOf(indexState) > -1)) {
          //caso não esteja escolhido retorna o index do tipo
          currentStateChosen[cena.props.indexCard] = indexState;
          return i;
        }
      }
      return index;
    }

    function gameStateChange(gameView) {
      this.props.emitter.emit('vote');
      let constants = new Constants();
      //verifica se a card já tem algum tipo escolhido
      if (constants.states.indexOf(this.state.type) > -1) {
        //se for verificado que já existe, faz reset ao tipo
        currentStateChosen[this.props.indexCard] = -1;
        //aos states da card
        this.setState({ color: constants.colors[3], color1: constants.colors1[3], type: '', select: 1 });
        //e decrementa qual o numero de tipos já escolhidos
        currentStateChoice--;
      } else {
        //se não tiver nenhum tipo escolhido vai verificar qual é que ainda não está a ser usado
        let unusedStateId = checkUnusedState(this, constants);
        //faz set ao state da card
        this.setState({ type: constants.states[unusedStateId], color: constants.colors[unusedStateId], color1: constants.colors1[unusedStateId], select: 0.15 });
        //incrementa o numero de tipos escolhidos
        currentStateChoice++;
        //e verifica se já todos estão escolhidos
        if (currentStateChoice === 3) {
          //adiciona a selecção à base de dados
          adicionarEntrada(gameView, constants, this);
        }
      }
      if(currentStateChoice > 0) {
        // gameView._toggleSkip(true);
      } else {
        // gameView._toggleSkip(false);
      }
    }

    function adicionarEntrada(gameView, constants, gameCard) {
      //referencia ao ecran de novos matches
      let newMatchManager = new NewMatchManager(gameView.props.gameScene);
      //referencia ao array de id's
      let arrayIDCards = gameView.state.array;
      for (let i = 0; i < arrayIDCards.length; i++) {
        let matchType = constants.states[currentStateChosen[i]];
        let idOtherUser = arrayIDCards[i]._id;
        let index = i;
        //cria a conecção entre os dois utilizadores
        Meteor.call(connectMethod, idOtherUser, Meteor.user()._id, matchType, (err, result) => {
          if (err) {
            ////console.log('Isto ta a dar erro soice!!!');
          } else {
            //verifica a existencia de um match
            if (result) {
              //no caso de existir adiciona o utilizador ao array de matches a ser apresentados como novos
              newMatchManager.addUser(idOtherUser, matchType, result);
            }
          }
          //verifica se está no fim do array
          if (index == 2) {
            //caso esteja apresenta o primeiro ecran de novo match
            newMatchManager.nextUser();
          }
        });
      }
      gameView.voted();
      //pequeno delay para a transição para a proxima combinação não ser tão repentina
      this.setTimeout(() => {
        //reset aos dados
        currentStateChoice = 0;
        currentStateChosen = [-1, -1, -1];
        gameView.setState({ numberShuffle: gameView.state.numberShuffle + 1 });
        gameView.reset();
      }, 500);
    }

    function getAge(dateString) {
      let today = new Date();
      let birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
