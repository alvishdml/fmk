import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
} from 'react-native';
import Meteor, { Accounts } from '@meteorrn/core';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Alert from '../../utilities/Alert';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selected: '',
      currentPassword: '',
      newPassword: '',
      changing: false,
    };
    this._confirmPassword = this._confirmPassword.bind(this);
  }

  _confirmPassword() {
    const { currentPassword, newPassword } = this.state;

    this.setState({ changing: true }, () => {
      Accounts.changePassword(currentPassword, newPassword, err => {
        if (err) {
          trackEvent('Change_Password', 'Error');
          this.setState({ changing: false, error: true });
        } else {
          trackEvent('Change_Password', 'Success');
          this.setState(
            {
              isOpen: false,
              changing: false,
              error: false,
              currentPassword: '',
              newPassword: '',
            },
            () => {
              Alert.showAlert('', 'Password was changed!', '');
            }
          );
        }
      });
    });
  }

  openPopUp(value) {
    this.setState({ isOpen: value });
    trackScreen('Change_Password');
  }

  render() {
    return (
      <Modal
        onDismiss={() => {
          this.setState({ isOpen: false });
        }}
        offset={0}
        hideCloseButton={false}
        backdropType="blur"
        isVisible={this.state.isOpen}
        style={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500' }}
      >
        <View style={styles.mainView}>
          <Icon
            onPress={() => {
              this.setState({ isOpen: false });
              trackEvent('Click_Change_Lang', 'Click_close');
            }}
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              backgroundColor: 'transparent',
            }}
            name={'cancel'}
            size={30}
            color={'#aeb7b7'}
          />
          <Text style={styles.title}>
            {I18n.t('app.components.UserProfile.changePassword')}
          </Text>
          <Text style={styles.textInputTitle}>
            {I18n.t('app.components.UserProfile.currentPassword')}
          </Text>
          <TextInput
            secureTextEntry
            style={styles.textInput}
            onChangeText={currentPassword => this.setState({ currentPassword })}
            value={this.state.currentPassword}
          />
          <Text style={styles.textInputTitle}>
            {I18n.t('app.components.UserProfile.newPassword')}
          </Text>
          <TextInput
            secureTextEntry
            style={styles.textInput}
            onChangeText={newPassword => this.setState({ newPassword })}
            value={this.state.newPassword}
          />
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={styles.loginButtonConfirm}
              onPress={() => {
                this._confirmPassword();
                trackEvent('Click_Change_Lang', 'Click_confirm');
              }}
              disabled={this.state.changing}
            >
              <Text style={(styles.text, { color: 'white' })}>
                C O N F I R M
              </Text>
            </TouchableOpacity>
            {this.state.error && (
              <Text style={styles.error}>
                {I18n.t('app.components.UserProfile.changePasswordError')}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Montserrat-Light',
    color: '#424949',
    backgroundColor: 'transparent',
    fontSize: 16,
    position: 'absolute',
    top: 40,
    textAlign: 'center',
    width: WIDTH * 0.8,
  },
  text: {
    fontFamily: 'Montserrat-Light',
    color: '#424949',
    backgroundColor: 'transparent',
    fontSize: 14,
  },
  textInputTitle: {
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    textAlign: 'left',
    width: WIDTH / 2,
    marginTop: 20,
  },
  textInput: {
    height: 40,
    width: WIDTH / 2,
  },
  error: {
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    color: 'red',
    width: WIDTH * 0.7,
    textAlign: 'center',
    marginTop: 20,
  },
  mainView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: HEIGHT * 0.65,
    marginRight: 40,
    marginLeft: 40,
    borderRadius: 5,
    position: 'relative',
  },
  loginButtonConfirm: {
    width: WIDTH * 0.7,
    height: 50,
    backgroundColor: '#F67D56',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
});
