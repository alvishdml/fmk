import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
    View,
    Text,
    Switch,
} from 'react-native';
import styles from '../../styles/styles';
import Meteor from '@meteorrn/core';

const BD = require('../../utilities/DAAsyncStorage');
const myBD = new BD();
import { trackEvent } from '../../utilities/Analytics';

export default class GenderSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            male: false,
            female: false,
            selectedOption: ''
        }
    }

    componentWillMount() {
        myBD.buscarItem('gender_search_option', (item) => {
            if (item == 'female') {
                this.setState({
                    female: true,
                    male: false,
                });
            } else if (item == 'male') {
                this.setState({
                    female: false,
                    male: true,
                });
            } else {
                
                this.setState({
                    female: true,
                    male: true,
                });
            }
        });
    }

    changeOption(value, gender) {
        trackEvent('Settings_Profile','slider_gender', gender)
        if (gender == 'male') {
            if (this.state.female == true && value == true) {
                this.setState({
                    selectedOption: 'both',
                    male: value
                });
                myBD.criarItem('gender_search_option', 'both', () => { } );
            } else if (this.state.female == false && value == false) {
                this.setState({
                    selectedOption: 'female',
                    male: value, female: true
                });
                myBD.criarItem('gender_search_option', 'female', () => { } );
            } else if (this.state.female == false && value == true) {
                this.setState({
                    selectedOption: 'male',
                    male: value
                });
                myBD.criarItem('gender_search_option', 'male', () => { } );
            } else if (this.state.female == true && value == false) {
                this.setState({
                    selectedOption: 'female',
                    male: value
                });
                myBD.criarItem('gender_search_option', 'female', () => { } );
            }
        } else if (gender == 'female') {
            if (this.state.male == true && value == true) {
                this.setState({
                    selectedOption: 'both',
                    female: value
                });
                myBD.criarItem('gender_search_option', 'both', () => { } );
            } else if (this.state.male == false && value == false) {
                this.setState({
                    selectedOption: 'male',
                    female: value, male: true
                });
                myBD.criarItem('gender_search_option', 'male', () => { } );
            } else if (this.state.male == false && value == true) {
                this.setState({
                    selectedOption: 'female',
                    female: value
                });
                myBD.criarItem('gender_search_option', 'female', () => { } );
            } else if (this.state.male == true && value == false) {
                this.setState({
                    selectedOption: 'male',
                    female: value
                });
                myBD.criarItem('gender_search_option', 'male', () => { } );
            }
        }
        this.props.mainPage.changeGender();
    }

    render() {
        return (
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 5}} >
                    <Text style={[styles.subtituloSettings,{fontFamily: 'Montserrat-Regular', fontSize: 13}]}>{I18n.t('app.components.SettingsComponents.ChangeGender.female')}</Text>
                    <Switch
                        onValueChange={(value) => {this.changeOption(value, 'female')}}
                        value={this.state.female} />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 5}} >
                    <Text style={[styles.subtituloSettings,{fontFamily: 'Montserrat-Regular', fontSize: 13}]}>{I18n.t('app.components.SettingsComponents.ChangeGender.male')}</Text>
                    <Switch
                        onValueChange={(value) => {this.changeOption(value, 'male')}}
                        value={this.state.male} />
                </View>
            </View>
        );
    }

}
