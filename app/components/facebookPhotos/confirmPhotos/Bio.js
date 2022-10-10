import React, { Component } from 'react';
import I18n from '../../../../config/i18n';
import {
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Alert,
    PanResponder,
    Animated,
    TextInput,
    Keyboard,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import styles from '../../../styles/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Meteor from '@meteorrn/core'
import { trackEvent } from '../../../utilities/Analytics';

export default class Bio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editBio: false,
            newBio: '',
            hasBio: Meteor.user().profile.about
        }
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        this.props.confirmPage.setState({
            edit: true
        });
    }

    _keyboardDidHide() {
        this.props.confirmPage.setState({
            edit: false
        });
    }

    removeEmptySpace(str) {
        return str.replace(new RegExp(' ', 'g'), '');
    }

    clearText(fieldName, textoLet) {
        this.refs[fieldName].clear();
        Meteor.user().profile.about = '';
        this.setState({
            newBio: '',
            editBio: true,
        })
         this.props.confirmPage.setState({ newBio: '' });
    }

    submitBio(){
        Meteor.call('clearBio', Meteor.user()._id);
        this.setState({ editBio: false, hasBio: true });
        this.refs['aboutTextBox'].blur();
        trackEvent('Edit_Profile', 'Edit_description');
    }

    render() {
        //let placeholder = I18n.t('app.components.facebookPhotos.confirmPhotos.Bio.placeholder');
        let textoLet = '';

        if (Meteor.user().profile.about) {
            textoLet = Meteor.user().profile.about;
        }

        if (this.state.newBio) {
            textoLet = this.state.newBio;
        }

        let hasBio = Meteor.user().profile.about !== '' || this.state.newBio !== '';

        if (!hasBio && !this.state.editBio && this.state.newBio === '') {
            return (
                <View style={styles.bioWithInputContainer}>
                    <Text style={styles.userAboutTextinputNewTitle}>{I18n.t('app.components.facebookPhotos.confirmPhotos.Bio.addBio')}</Text>
                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <TextInput underlineColorAndroid='transparent' style={[styles.userAboutTextinputNew, { width: Dimensions.get('window').width - 30, height: Dimensions.get('window').height * 0.09}]}
                            ref='aboutTextBox'
                            returnKeyType="done"
                            autoCapitalize="sentences"
                            maxLength={200}
                            multiline={true}
                            placeholder={this.props.placeholder}
                            onFocus={() => {
                                this.setState({ editBio: true });
                            }}
                            defaultValue={textoLet} />
                            <View style={{ position: 'absolute', right: 20, top: 14, width: 25, height: 25, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }} >
                                <Icon name={'mode-edit'} size={15} color={'rgb(63,66,67)'} style={{ backgroundColor: 'transparent' }} />
                            </View>
                    </View>
                </View>
            )
        } else if (this.state.editBio) {
            return (
                <View style={styles.bioWithInputContainer}>
                    <Text style={styles.userAboutTextinputNewTitle}>{I18n.t('app.components.facebookPhotos.confirmPhotos.Bio.addBio')}</Text>
                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: Dimensions.get('window').height * 0.4}}>
                        <TextInput underlineColorAndroid='transparent' style={[styles.userAboutTextinputNew, { width: Dimensions.get('window').width - 60, marginLeft: Dimensions.get('window').width * 0.095, height: Dimensions.get('window').height * 0.09}]}
                            ref='aboutTextBox'
                            //returnKeyType="done"
                            //autoCapitalize="sentences"
                            autoCorrect={false} 
                            maxLength={200}
                            multiline={true}
                            placeholder={this.props.placeholder}
/*                             onSubmitEditing={() => {
                                this.setState({ editBio: false, hasBio: true });
                            this.refs['aboutTextBox'].blur();
                            }} */
                            onChangeText={(text) => { this.setState({ newBio: text }); this.props.confirmPage.setState({ newBio: text }); if(text == ""){this.clearText('aboutTextBox'), textoLet = ''}}}
                            defaultValue={textoLet} />
                        <View style={{ marginLeft:3, position: 'relative', right: 13, top: -10, width: 25, height: 25, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }} >
                            <Icon name={'done'} size={30} onPress={() => { this.submitBio()}} />
                        </View>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.bioWithInputContainer}>
                    <Text style={styles.userAboutTextinputNewTitle}>{I18n.t('app.components.facebookPhotos.confirmPhotos.Bio.editBio')}</Text>
                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'flex-start' }}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => { this.setState({ editBio: true }) }}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 10, paddingRight: 10}}>
                                <View style={{ position: 'absolute', right: -5, top: 0, backgroundColor: 'transparent', width: 25, height: 25, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }} >
                                    <Icon name={'mode-edit'} size={10} color={'rgb(63,66,67)'} style={{ backgroundColor: 'transparent' }} />
                                </View>
                                <Text style={styles.userAboutTextinputEdit}>{textoLet}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }
}
