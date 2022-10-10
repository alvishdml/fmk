import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import Meteor from '@meteorrn/core';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class ChangeLanguagePicker extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
            selected: ''
        }
        this._confirmLangues = this._confirmLangues.bind(this);
    }

    componentWillMount(){
        if(I18n.currentLocale() != 'pt-BR' && I18n.currentLocale() != 'es_ES'){
            this.setState({selected: 'en-EN'})
        }
        const userLang = Meteor.user().profile.lang;
        if(userLang && userLang != this.state.selected){
            this.setState({selected: userLang})
        }
    }

    _confirmLangues() {
         const code  = this.state.selected;
         const id = Meteor.user()._id;
        Meteor.call(
          'users.updateLanguage',
           id, code , (err, result) => {
            if(!err){
                I18n.locale = code;
            }
            this.setState({ isOpen: false });
            this.props.mainPage.languageChanged(true);
        });
    }

    openPopUp(value) {
        this.setState({ isOpen: value }); 
        trackScreen('Change_Language_Picker');
    }

    render(){
        return (
        <Modal
          onDismiss={() => { this.setState({ isOpen: false }); } }
          offset={0}
          hideCloseButton={false}
          backdropType= 'blur'
          isVisible={this.state.isOpen}
          style={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}>
            <View style={styles.mainView}>
                <Icon onPress={() => {this.setState({ isOpen: false }); trackEvent('Click_Change_Lang','Click_close')}} style={{ position: 'absolute', top:5, right:5, backgroundColor: 'transparent' }} name={'cancel'} size={30} color={'#aeb7b7'} />         
                <Text style={styles.title}>{I18n.t('app.components.UserProfile.changeLanguage')}</Text>
                <View style={{marginTop: 50}}>
                    <TouchableOpacity style={this.state.selected == 'en-EN' || this.state.selected == 'en-US' ? styles.loginButtonSelected : styles.loginButton} onPress={() => {this.setState({selected: 'en-EN'});}}>
                    <Text style={styles.text}>E N G L I S H</Text>
                    </TouchableOpacity>  
                    <TouchableOpacity style={this.state.selected == 'pt-BR' ? styles.loginButtonSelected : styles.loginButton} onPress={() => {this.setState({selected: 'pt-BR'})}}>
                    <Text style={styles.text}>P O R T U G U Ê S</Text>
                    </TouchableOpacity>      
                    <TouchableOpacity style={this.state.selected == 'es_ES' ? styles.loginButtonSelected : styles.loginButton} onPress={() => {this.setState({selected: 'es_ES'})}}>
                    <Text style={styles.text}>E S P A Ñ O L</Text>
                    </TouchableOpacity>     
                    <TouchableOpacity style={styles.loginButtonConfirm} onPress={() => {this._confirmLangues(); trackEvent('Click_Change_Lang','Click_confirm')}}>
                    <Text style={styles.text}>C O N F I R M</Text>
                    </TouchableOpacity>  
                </View>
            </View>
        </Modal>
    );
    }
}
const styles = StyleSheet.create ({
    title:{
        fontFamily: 'Montserrat-Light', 
        color: '#424949', 
        backgroundColor: 'transparent', 
        fontSize: 16,
        position: 'absolute',
        top: 40,
        textAlign:'center',
        width: WIDTH * 0.8
    },
    text: {
        fontFamily: 'Montserrat-Light', 
        color: '#424949', 
        backgroundColor: 'transparent', 
        fontSize: 14
    },
    mainView:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white', 
        height: HEIGHT * 0.65, 
        marginRight: 40, 
        marginLeft: 40, 
        borderRadius: 5,
        position: 'relative',
    },
    loginButton: {
        width: WIDTH * 0.7,
        height: 50,
        backgroundColor: '#E5E5E5',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 15
    },
    loginButtonSelected: {
        width: WIDTH * 0.7,
        height: 50,
        backgroundColor: '#F67D56',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 15
    },
    loginButtonConfirm: {
        width: WIDTH * 0.7,
        height: 50,
        backgroundColor: '#F67D56',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 30
    },
 })