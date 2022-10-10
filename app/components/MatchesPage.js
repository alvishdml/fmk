import React, { Component } from 'react';
import I18n from '../../config/i18n';
import { Text, View, Platform } from 'react-native';
import Meteor, { createContainer } from '@meteorrn/core'
import styles from '../styles/styles';
import NewMatchesList from './matchesPage/NewMatchesList';
import MessagesList from './matchesPage/MessagesList';
import TimerMixin from 'react-timer-mixin';
import { getLanguages } from 'react-native-i18n';

const MATCHES_METHOD =
  Platform.OS === 'ios' ? 'userNewMatchesListIOS' : 'userNewMatchesList';
const NEW_MATCHES_METHOD =
  Platform.OS === 'ios'
    ? 'userMessagesMatchesListIOS'
    : 'userMessagesMatchesList';
const sponsoredMatchMaleDE = {
  _id: 'en3qhiAjBwcza8Eja',
  first: 'dNRqR5x7aLvuzLdrE',
  first_seen: false,
  second: '4DJvtbaJcbvxRjS99',
  second_seen: false,
  type: 'sponsored',
  disabled: false,
  unread: -1,
  notified: false,
  when: '2018-08-19T19:13:50.670+0000',
  last_action: '2018-08-19T19:13:50.670+0000',
  hidden: false,
  country: 'de',
  gender: 'male',
};
const sponsoredMatchFemaleDE = {
  _id: 'en3qhiAjBwcza8Eja',
  first: 'dNRqR5x7aLvuzLdrE',
  first_seen: false,
  second: '4DJvtbaJcbvxRjS99',
  second_seen: false,
  type: 'sponsored',
  disabled: false,
  unread: -1,
  notified: false,
  when: '2018-08-19T19:13:50.670+0000',
  last_action: '2018-08-19T19:13:50.670+0000',
  hidden: false,
  country: 'de',
  gender: 'female',
};
// const sponsoredMatchMale = {
//     "_id": "en3qhiAjBwcza8Eja",
//     "first": "dNRqR5x7aLvuzLdrE",
//     "first_seen": false,
//     "second": "4DJvtbaJcbvxRjS99",
//     "second_seen": false,
//     "type": "sponsored",
//     "disabled": false,
//     "unread": -1,
//     "notified": false,
//     "when": "2018-08-19T19:13:50.670+0000",
//     "last_action": "2018-08-19T19:13:50.670+0000",
//     "hidden": false,
//     "country": 'de'
// };
/* const sponsoredMatchDE = {
    "_id" : "en3qhiAjBwcza8Eja",
    "first" : "dNRqR5x7aLvuzLdrE",
    "first_seen" : false,
    "second" : "4DJvtbaJcbvxRjS99",
    "second_seen" : false,
    "type" : "sponsored",
    "disabled" : false,
    "unread" : -1, 
    "notified" : false,
    "when" : "2018-08-19T19:13:50.670+0000",
    "last_action" : "2018-08-19T19:13:50.670+0000",
    "hidden" : false,
    "country" : 'de'
}; */
const sponsoredMatchFemale = {
  _id: 'en3qhiAjBwcza8Eja',
  first: 'dNRqR5x7aLvuzLdrE',
  first_seen: false,
  second: '4DJvtbaJcbvxRjS99',
  second_seen: false,
  type: 'sponsored',
  disabled: false,
  unread: -1,
  notified: false,
  when: '2018-08-19T19:13:50.670+0000',
  last_action: '2018-08-19T19:13:50.670+0000',
  hidden: false,
  country: 'notDe',
};
const showAd = false;

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
      updateNewMatches: false,
      refresh: false,
    };
    this._reRender = this._reRender.bind(this);
    this._updateAll = this._updateAll.bind(this);
    this.showAdModal = this.showAdModal.bind(this);
    /* this.showLeloAdModal = this.showLeloAdModal.bind(this); */
  }

  componentDidMount() {
    this.props.mainPage.setMatches(this);
    this._updateNewMatches();
    this._updateMatchesList();
    this.interval = TimerMixin.setInterval(this._updateAll.bind(this), 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) {
    this._updateNewMatches();
    this._updateMatchesList();
  }

  componentDidMount() {}

  _updateAll() {
    this._updateNewMatches();
    this._updateMatchesList();
  }

  _reRender() {
    this.refs.MessagesList._refresh();
  }

  updateNewMatchesAfterWink() {
    Meteor.call(MATCHES_METHOD, Meteor.user()._id, (err, result) => {
      if (!err) {
        if (result) {
          this.setState({ newMatches: result });
        } else if (result == 0) {
          this.setState({ newMatches: null });
        }
      }
    });
  }

  _updateNewMatches() {
    if (Meteor.user()) {
      if (!this.state.isUpdatingNew) {
        this.setState({ isUpdatingNew: true });
        if (!this.state.firstUpdateNew) {
          Meteor.call(MATCHES_METHOD, Meteor.user()._id, (err, result) => {
            if (!err) {
              if (result) {
                const matchesList = result;
                const userGender = Meteor.user().profile.gender;
                //check user language. Usefull for more segmented ADS
                getLanguages().then((languages) => {
                  if (languages.includes('de-DE')) {
                    /* if(languages.includes('pt-PT')){
                        matchesList.splice(0, 0, sponsoredMatchPT);
                        this.setState({ newMatches: matchesList, firstUpdateNew: true, updateNewMatches: true });
                    }else if(languages.includes('de-DE')){
                        matchesList.splice(0, 0, sponsoredMatchDE);
                        this.setState({ newMatches: matchesList, firstUpdateNew: true, updateNewMatches: true });
                    }else{
                        this.setState({ newMatches: matchesList, firstUpdateNew: true, updateNewMatches: true });
                    } */
                    const sponsoredMatch = sponsoredMatchMaleDE;
                    if (userGender === 'female') {
                      sponsoredMatch = sponsoredMatchFemaleDE;
                    }
                    matchesList.splice(0, 0, sponsoredMatch);
                    this.setState({
                      newMatches: matchesList,
                      firstUpdateNew: true,
                      updateNewMatches: true,
                    });
                  } else {
                    // matchesList.splice(0, 0, sponsoredMatchFemale); // TODO: uncomment to add the ADS again
                    this.setState({
                      newMatches: matchesList,
                      firstUpdateNew: true,
                      updateNewMatches: true,
                    });
                  }
                });
                //this.setState({ newMatches: matchesList, firstUpdateNew: true, updateNewMatches: true });
              } else if (result == 0) {
                this.setState({
                  newMatches: null,
                  firstUpdateNew: true,
                  updateNewMatches: true,
                });
              }
            }
            this.setState({ isUpdatingNew: false });
          });
        } else {
          if (Meteor.user().profile.update_matches) {
            Meteor.call(MATCHES_METHOD, Meteor.user()._id, (err, result) => {
              if (!err) {
                if (result) {
                  const matchesList = result;
                  const userGender = Meteor.user().profile.gender;
                  //check user language. Usefull for more segmented ADS
                  getLanguages().then((languages) => {
                    if (languages.includes('de-DE')) {
                      /* if(languages.includes('pt-PT')){
                            matchesList.splice(0, 0, sponsoredMatchPT);
                            this.setState({ newMatches: matchesList, firstUpdateNew: true, updateNewMatches: true });
                        }else if(languages.includes('de-DE')){
                            matchesList.splice(0, 0, sponsoredMatchDE);
                            this.setState({ newMatches: matchesList, firstUpdateNew: true, updateNewMatches: true });
                        }else{
                            this.setState({ newMatches: matchesList, firstUpdateNew: true, updateNewMatches: true });
                        } */
                      const sponsoredMatch = sponsoredMatchMaleDE;
                      if (userGender === 'female') {
                        sponsoredMatch = sponsoredMatchFemaleDE;
                      }
                      matchesList.splice(0, 0, sponsoredMatch);
                      this.setState({
                        newMatches: matchesList,
                        firstUpdateNew: true,
                        updateNewMatches: true,
                      });
                    } else {
                      // matchesList.splice(0, 0, sponsoredMatchFemale); // TODO: uncomment to add the ADS again
                      this.setState({
                        newMatches: matchesList,
                        firstUpdateNew: true,
                        updateNewMatches: true,
                      });
                    }
                  });
                } else if (result == 0) {
                  this.setState({
                    newMatches: null,
                    firstUpdateNew: true,
                    updateNewMatches: true,
                  });
                }
              }
              this.setState({ isUpdatingNew: false });
            });
          } else {
            this.setState({ isUpdatingNew: false, updateNewMatches: false });
          }
        }
      }
    }
  }

  _updateMatchesList() {
    if (Meteor.user()) {
      if (!this.state.isUpdatingMatches) {
        this.setState({ isUpdatingMatches: true });
        if (!this.state.firstUpdateMatches) {
          Meteor.call(NEW_MATCHES_METHOD, Meteor.user()._id, (err, result) => {
            if (!err) {
              if (result) {
                this.setState({
                  matchesList: result,
                  firstUpdateMatches: true,
                  updateMessagesList: true,
                });
              } else {
                this.setState({
                  matchesList: null,
                  firstUpdateMatches: true,
                  updateMessagesList: true,
                });
              }
            }
            this.setState({ isUpdatingMatches: false });
          });
        } else {
          if (Meteor.user().profile.update_messages) {
            Meteor.call(
              NEW_MATCHES_METHOD,
              Meteor.user()._id,
              (err, result) => {
                if (!err) {
                  if (result) {
                    this.setState({
                      matchesList: result,
                      firstUpdateMatches: true,
                      updateMessagesList: true,
                    });
                  } else {
                    this.setState({
                      matchesList: null,
                      firstUpdateMatches: true,
                      updateMessagesList: true,
                    });
                  }
                }
                this.setState({ isUpdatingMatches: false });
              },
            );
          } else {
            this.setState({
              isUpdatingMatches: false,
              updateMessagesList: false,
            });
          }
        }
      }
    }
  }

  showAdModal(country, gender) {
    this.props.mainPage.showAdModal(true, country, gender);
  }

  /* showLeloAdModal(){
        this.props.mainPage.showLeloAdModal(true);
    } */

  render() {
    return (
      <View style={{ flex: 1, margin: 10, marginBottom: 0 }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: '#aeb7b7',
              fontSize: 13,
              fontFamily: 'Montserrat-Bold',
            }}
          >
            {I18n.t('app.components.MatchesPage.newMatches')}
          </Text>
          <NewMatchesList
            data={this.state.newMatches}
            matchesPage={this}
            update={this.state.updateNewMatches}
          />
        </View>
        <View style={{ flex: 3 }}>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#aeb7b7',
              fontSize: 13,
              marginBottom: 5,
            }}
          >
            {I18n.t('app.components.MatchesPage.messages')}
          </Text>
          <MessagesList
            popUp={this.props.popUp}
            ref="MessagesList"
            data={this.state.matchesList}
            update={this.state.updateMessagesList}
          />
        </View>
      </View>
    );
  }
}
