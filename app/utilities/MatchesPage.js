import React, { Component } from 'react';
import {
    Text,
    View,
    Platform
} from 'react-native';
import Meteor, {createContainer} from '@meteorrn/core'
import styles from '../styles/styles'
import NewMatchesList from './matchesPage/NewMatchesList'
import MessagesList from './matchesPage/MessagesList'
import TimerMixin from 'react-timer-mixin';

const MATCHES_METHOD = Platform.OS === 'ios' ? 'userNewMatchesListIOS' : 'userNewMatchesList';
const NEW_MATCHES_METHOD = Platform.OS === 'ios' ? 'userMessagesMatchesListIOS' : 'userMessagesMatchesList';

export default class MatchesPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newMatches: [],
            matchesList: [],
            isUpdatingNew: false,
            isUpdatingMatches: false,
            firstUpdateNew: false,
            firstUpdateMatches: false,
            updateMessagesList: false,
            updateNewMatches: false
        }
    }

    componentDidMount(){
        this.props.mainPage.setMatches(this);
        this._updateNewMatches();
        this._updateMatchesList();
        TimerMixin.setInterval(
            this._updateAll.bind(this),
            5000
        );
    }

    componentWillReceiveProps(nextProps) {
        this._updateNewMatches();
        this._updateMatchesList();
    }

    _updateAll() {
        this._updateNewMatches();
        this._updateMatchesList();
    }

    _updateNewMatches() {
        if(Meteor.user()){
            if (!this.state.isUpdatingNew) {
                this.setState({ isUpdatingNew: true });
                if (!this.state.firstUpdateNew) {
                    Meteor.call(MATCHES_METHOD, Meteor.user()._id, (err, result) => {
                        if (!err) {
                            if (result) {
                                this.setState({ newMatches: result, firstUpdateNew: true, updateNewMatches: true });
                            } else if(result == 0) {
                                this.setState({ newMatches: null, firstUpdateNew: true, updateNewMatches: true });
                            }
                        }
                        this.setState({ isUpdatingNew: false })
                    });
                } else {
                    if(Meteor.user().profile.update_matches) {
                        Meteor.call(MATCHES_METHOD, Meteor.user()._id, (err, result) => {
                            if (!err) {
                                if (result) {
                                    this.setState({ newMatches: result, firstUpdateNew: true, updateNewMatches: true });
                                } else if(result == 0) {
                                    this.setState({ newMatches: null, firstUpdateNew: true, updateNewMatches: true });
                                }
                            }
                            this.setState({ isUpdatingNew: false })
                        });
                    } else {
                        this.setState({ isUpdatingNew: false, updateNewMatches: false })
                    }
                }
            }
        }
    }

    _updateMatchesList() {
        if(Meteor.user()){
            if (!this.state.isUpdatingMatches) {
                this.setState({ isUpdatingMatches: true });
                if (!this.state.firstUpdateMatches) {
                    Meteor.call(NEW_MATCHES_METHOD, Meteor.user()._id, (err, result) => {
                        if (!err) {
                            if (result) {
                                this.setState({ matchesList: result, firstUpdateMatches: true, updateMessagesList: true });
                            } else {
                                this.setState({ matchesList: null, firstUpdateMatches: true, updateMessagesList: true });
                            }
                        }
                        this.setState({ isUpdatingMatches: false })
                    });
                } else {
                    if (Meteor.user().profile.update_messages) {
                        Meteor.call(NEW_MATCHES_METHOD, Meteor.user()._id, (err, result) => {
                            if (!err) {
                                if (result) {
                                    this.setState({ matchesList: result, firstUpdateMatches: true, updateMessagesList: true });
                                } else {
                                    this.setState({ matchesList: null, firstUpdateMatches: true, updateMessagesList: true });
                                }
                            }
                            this.setState({ isUpdatingMatches: false })
                        });
                    } else {
                        this.setState({ isUpdatingMatches: false, updateMessagesList: false })
                    }
                }
            }
        }
    }

    render(){
        return (
            <View style={{flex:1, margin: 10, marginBottom: 0}}>
                <View style={{flex:1}}>
                    <Text style={{ color: '#aeb7b7', fontSize: 13, fontFamily: 'Montserrat-Bold' }}>
                        N E W  M A T C H E S
                    </Text>
                    <NewMatchesList data = {this.state.newMatches} update = {this.state.updateNewMatches}/>
                </View>
                <View style={{flex:3}}>
                    <Text style={{fontFamily: 'Montserrat-Bold', color: '#aeb7b7', fontSize: 13, marginBottom:5}}>
                        M E S S A G E S
                    </Text>
                    <MessagesList data = {this.state.matchesList} update = {this.state.updateMessagesList}/>
                </View>
            </View>
        );
    }
}
