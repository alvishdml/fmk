import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import Meteor, { MeteorListView } from '@meteorrn/core';
import styles from '../../styles/styles';
import Constants from '../../utilities/Constants';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import GameTagIcon from '../../font/customIcon';
import NotificationCounter from '../../utilities/NotificationCounter';

export default class NewMatchesList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      hasMatches: null,
      updatedAt: new Date(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data) {
      this.setState({ hasMatches: false });
    } else if (nextProps.update) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.data),
        hasMatches: true,
        updatedAt: new Date(),
      });
    }
  }

  render() {
    if (this.state.hasMatches !== null) {
      if (this.state.hasMatches) {
        return (
          <ListView
            key={this.state.updatedAt}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={false}
          />
        );
      } else {
        return (
          <View style={{ flex: 1 }}>
            <View
              style={[styles.loadingPage, { flex: 1, backgroundColor: '#fff' }]}
            >
              <Text
                style={[
                  styles.legendas,
                  {
                    fontSize: 16,
                    color: '#aeb7b7',
                    fontFamily: 'Montserrat-Light',
                  },
                ]}
              >
                {I18n.t('app.components.matchesPage.NewMatchesList.noMatches')}
              </Text>
            </View>
          </View>
        );
      }
    } else {
      return (
        <View
          removeClippedSubviews={true}
          style={[styles.loadingPage, { backgroundColor: '#fff' }]}
        >
          <ActivityIndicator
            animating={true}
            color="#aeb7b7"
            style={{ transform: [{ scale: 1 }] }}
            size="large"
          />
        </View>
      );
    }
  }

  _renderRow(matchData) {
    return (
      <MatchRow matchesPage={this.props.matchesPage} matchData={matchData} />
    );
  }
}

class MatchRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picture: '',
      typeColor: 3,
      idMatch: '',
    };
  }

  componentwillUpdate() {
    Actions.refresh();
  }

  getUser() {
    let matchData = this.props.matchData,
      idMatch,
      idUser = Meteor.user()._id;

    if (idUser == matchData.first) {
      idMatch = matchData.second;
    } else {
      idMatch = matchData.first;
    }
    let user = Meteor.call('userPhoto', idMatch, (err, result) => {
      if (!err && result) {
        let cor = 3;
        if (matchData.type == 'fuck') {
          cor = 0;
        } else if (matchData.type == 'marry') {
          cor = 1;
        } else if (matchData.type == 'kill') {
          cor = 2;
        } else if (matchData.type == 'wink') {
          cor = 4;
        }
        this.setState({
          picture: result,
          typeColor: cor,
          idMatch: idMatch,
        });
      }
    });
  }

  openMatch() {
    let idUser = Meteor.user()._id,
      matchData = this.props.matchData,
      isNew = false;

    if (idUser == matchData.first) {
      if (!matchData.first_seen) {
        isNew = true;
      }
    } else {
      if (!matchData.second_seen) {
        isNew = true;
      }
    }
    if (isNew) {
      Meteor.call('openMatch', idUser, matchData._id, (error, result) => {
        if (!error) {
          NotificationCounter.refreshNotification();
        }
      });
    }
  }

  openModal(country, gender) {
    this.props.matchesPage.showAdModal(country, gender);
  }

  /* showLeloAdModal(){
        this.props.matchesPage.showLeloAdModal()
    } */

  render() {
    let constants = new Constants();
    if (!this.state.picture && this.props.matchData.type !== 'sponsored') {
      this.getUser();
      return (
        <View style={[styles.profileUserHistory]}>
          <View style={[styles.loadingPage, { backgroundColor: '#fff' }]}>
            <ActivityIndicator
              style={[styles.centering]}
              color="#aeb7b7"
              size="large"
            />
          </View>
        </View>
      );
    } else {
      let cor = constants.colors[this.state.typeColor],
        cor1 = constants.colors1[this.state.typeColor];

      let sponsoredMatchIMG = '';
      let sponsoredMatchName = '';
      if (this.props.matchData.type == 'sponsored') {
        if (this.props.matchData.country === 'de') {
          if (this.props.matchData.gender === 'male') {
            // sponsoredMatchIMG = 'https://i1.wp.com/golfpagosa.com/wp-content/uploads/2018/07/Adidas-Logo.jpg';
            sponsoredMatchIMG =
              'https://playfmk.com/images/ads/emma_circle.png';
            sponsoredMatchName = 'EMMA';
          } else {
            sponsoredMatchIMG =
              'https://playfmk.com/images/ads/parship_circle.png';
            sponsoredMatchName = 'PARSHIP';
          }
        } else {
          sponsoredMatchIMG = 'https://playfmk.com/images/bookingLogo.png';
        }
      }

      return (
        <View renderToHardwareTextureAndroid={true} collapsable={false}>
          <TouchableOpacity
            style={[styles.profileUserHistory]}
            onPress={() => {
              this.props.matchData.type == 'sponsored'
                ? this.props.matchData.country &&
                  this.openModal(
                    this.props.matchData.country,
                    this.props.matchData.gender,
                  )
                : Actions.chatWindow({
                    idMatch: this.props.matchData._id,
                    first: this.props.matchData.first,
                    second: this.props.matchData.second,
                    matchType: this.props.matchData.type,
                    numPaginasPop: 1,
                    unmounted: false,
                    image: { uri: this.state.picture },
                  });
            }}
          >
            <LinearGradient
              style={{
                width: 68,
                height: 68,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 40,
              }}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              colors={
                this.props.matchData.type == 'sponsored'
                  ? ['#FFD700', '#DAA520']
                  : [cor, cor1]
              }
            >
              {this.props.matchData.type == 'sponsored' ? (
                <Image
                  style={[styles.photoHistory, { borderColor: cor }]}
                  source={{ uri: sponsoredMatchIMG }}
                />
              ) : (
                <Image
                  style={[styles.photoHistory, { borderColor: cor }]}
                  source={{ uri: this.state.picture }}
                />
              )}
            </LinearGradient>
            {this.props.matchData.type === 'sponsored' && (
              <Text
                color="#aeb7b7"
                style={{
                  fontSize: 18,
                  marginTop: 5,
                  fontFamily: 'Selima',
                  opacity: 0.5,
                }}
              >
                {sponsoredMatchName}
              </Text>
            )}
            {this.props.matchData.type === 'wink' && (
              <Image
                resizeMethod={'scale'}
                resizeMode={'contain'}
                height={20}
                style={{ marginTop: 10, height: 20 }}
                source={require('../../../images/winked.png')}
              />
            )}
            {this.props.matchData.type == 'marry' && (
              <GameTagIcon
                name={this.props.matchData.type}
                color="#aeb7b7"
                style={{ fontSize: 20, marginTop: 10 }}
              />
            )}
            {this.props.matchData.type == 'kill' && (
              <GameTagIcon
                name={this.props.matchData.type}
                color="#aeb7b7"
                style={{ fontSize: 20, marginTop: 10 }}
              />
            )}
            {this.props.matchData.type == 'fuck' && (
              <GameTagIcon
                name={this.props.matchData.type}
                color="#aeb7b7"
                style={{ fontSize: 20, marginTop: 10 }}
              />
            )}
          </TouchableOpacity>
        </View>
      );
    }
  }
}
