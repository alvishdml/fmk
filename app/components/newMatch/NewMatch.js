import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import Meteor from '@meteorrn/core';
import styles from '../../styles/styles';
import GameTagIcon from '../../font/customIcon';
import Constants from '../../utilities/Constants'
import LinearGradient from 'react-native-linear-gradient';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class NewMatchPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            urlImagem: { uri: 'https://heatherchristenaschmidt.files.wordpress.com/2011/09/facebook_no_profile_pic2-jpg.gif' },
            nomeMatch: '',
            isOpen: false,
            matchType: 'fuck',
            idOtherUser: '',
            idMatch: '',
            phrase0: '',
            phrase1: '',
            manager: '',
            toChat: false,
        }
    }

    showModal(matchType, idOtherUser, idMatch, manager) {
        let constants = new Constants();
        let corIndex = 3;
        if (matchType == 'fuck') {
            corIndex = 0;
        } else if (matchType == 'marry') {
            corIndex = 1;
        } else {
            corIndex = 2;
        }
        trackScreen('New_Match_Screen');
        trackEvent('New_Match_Screen', matchType);
        let cor = constants.colors[corIndex] + 'D9';
        let cor1 = constants.colors1[corIndex] + 'D9';
        this.setState({
            isOpen: true,
            matchType: matchType,
            idOtherUser: idOtherUser,
            idMatch: idMatch,
            cor: cor,
            cor1: cor1,
            manager: manager,
            toChat: false,
        });
    }

    loadUserPictures() {
        if (!this.state.nomeMatch) {
            getUserProfile(this);
            return null;
        }else{
            let urlPictureUser = {uri: Meteor.user().profile.picture};
            if (Meteor.user().profile.custom_picture) {
                urlPictureUser = {uri: Meteor.user().profile.custom_picture};
            }
            return(
                <View style={{flex:1,  justifyContent:'center', alignItems: 'center', flexDirection:'row'}}>
                    <Image source= {urlPictureUser} style={[styles.photoMatchPage, {marginRight: -10}]}/>
                    <Image source= {this.state.urlImagem} style={[styles.photoMatchPage, {marginLeft: -10}]}/>
                </View>
            );
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback style={{top: 0, left: 0, position: 'absolute', width: WIDTH, height: HEIGHT }}>
                <Modal
                    offset={0}
                    modalDidClose={() => {
                        this.setState({
                            nomeMatch: '',
                            isOpen: false,
                            matchType: 'fuck',
                            idOtherUser: '',
                            idMatch: '',
                            phrase0: '',
                            phrase1: '',
                        });
                        this.state.manager.nextUser(this.state.toChat);
                    } }
                    hideCloseButton={false}
                    backdropType= 'blur'
                    open={this.state.isOpen}
                    modalStyle={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}
                    containerStyle={{backgroundColor: '#fff0'}}>
                    <LinearGradient style={{width: WIDTH, height: HEIGHT}} start={{x:0, y:1}} end={{x:1, y:0}} colors={[this.state.cor, this.state.cor1]}>
                        <View style={{flex:1, justifyContent:'center', alignItems: 'center', margin: 20, marginBottom:0}}>
                            <View style={{ justifyContent:'center', alignItems: 'center', margin: 10}}>
                                <Text style={{fontFamily: 'Montserrat-Light', color: '#ffffff', fontSize: 17, marginBottom:10}}>
                                {I18n.t('app.components.newMatch.NewMatch.youHave')}
                                </Text>
                                <GameTagIcon name={this.state.matchType} color="#fff" style={{fontSize:90}} />
                                <Text style={{fontFamily: 'Montserrat-Light', color: '#ffffff', fontSize: 17}}>
                                {I18n.t('app.components.newMatch.NewMatch.match')}
                                </Text>
                            </View>
                            {this.loadUserPictures()}
                            <View style={{justifyContent:'center', alignItems: 'center'}}>
                                <Text style={{fontFamily: 'Montserrat-Bold', color: '#ffffff', fontSize: 14, textAlign: 'center', lineHeight:20}}>
                                    {this.state.phrase1}
                                </Text>
                            </View>
                            <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
                                <TouchableOpacity style={[styles.popUpButton, {marginBottom: 5}]} onPress={() =>{
                                        trackEvent('New_Match_Screen', 'Click_Start_Chat');
                                        this.setState({isOpen:false, toChat:true});
                                        Actions.chatWindow({
                                            idMatch: this.state.idMatch,
                                            first: this.state.idOtherUser,
                                            numPaginasPop: 1,
                                            second: Meteor.user()._id,
                                            matchType: this.state.matchType,
                                            unmounted: false,
                                            image: this.state.urlImagem
                                        });
                                    }}>
                                    <Text style={{fontFamily: 'Montserrat-Light', color: 'white', fontSize: 13}}>
                                    {I18n.t('app.components.newMatch.NewMatch.startChat')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.popUpButton, {borderWidth:0}]} onPress={() =>{
                                        trackEvent('New_Match_Screen', 'Click_Continue_Playing');
                                        this.setState({isOpen:false, nomeMatch:''})
                                    }}>
                                    <Text style={{fontFamily: 'Montserrat-Light', color: 'white', fontSize: 13}}>
                                    {I18n.t('app.components.newMatch.NewMatch.continuePlaying')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </Modal>
            </TouchableWithoutFeedback>
        );
    }
}

function getUserProfile(page) {
    let id = page.state.idOtherUser;
    let constants = new Constants();
    if (id != undefined && page.state.isOpen) {
        Meteor.call('userProfile', id, (err, result) => {
            if (result) {
                let urlPicture = result.picture;
                if (result.custom_picture) {
                    urlPicture = result.custom_picture;
                }
                phrases = constants.newMatchText(page.state.matchType, Meteor.user().profile.gender, result.gender);
                if (phrases.length == 1) {
                    page.setState({
                        isLoading: false,
                        urlImagem: { uri: urlPicture },
                        nomeMatch: result.first_name,
                        phrase0: '',
                        phrase1: phrases[0],
                    });
                } else {
                    page.setState({
                        isLoading: false,
                        urlImagem: { uri: urlPicture },
                        nomeMatch: result.first_name,
                        phrase0: phrases[0],
                        phrase1: phrases[1],
                    });
                }
            }
        });
    }
}
