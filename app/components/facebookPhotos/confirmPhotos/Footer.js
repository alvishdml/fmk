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
    Keyboard
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Constants from '../../../utilities/Constants'
import Meteor from '@meteorrn/core'
import styles from '../../../styles/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import CustomAlert from '../../../utilities/Alert';


/**
 * The footer for the confirmPhoto  page
 */
export default class Footer extends Component {
    render() {
        if (!this.props.confirmPage.state.edit) {
            return (
                <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>

                    <TouchableOpacity onPress={() => {
                        Keyboard.dismiss();
                        Actions.facebookPhotos({ profile: this.props.profile });
                    }}
                        style={{
                            flex: 1,
                            height: 60,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 2, backgroundColor: 'rgb(63,66,67)' }}>
                            <Text style={{ color: '#fff' }}>{I18n.t('app.components.facebookPhotos.confirmPhotos.Footer.changePhoto')}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ width: 1, heigth: 60 }}>
                        <View style={{ flex: 1, backgroundColor: 'rgb(63,66,67)' }}>
                            <View style={{ marginTop: 15, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' }}>
                            </View>
                        </View>
                    </View>

                    {this.props.confirmPage.props.locked &&
                        <TouchableOpacity onPress={() => {
                            Keyboard.dismiss();
                            setTimeout(() => {
                                CustomAlert.showAlert('', I18n.t('app.components.facebookPhotos.confirmPhotos.Footer.differentPhoto'));
                            }, 500);
                        }}
                            style={{
                                flex: 1,
                                height: 60,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 2, backgroundColor: 'rgb(63,66,67)' }}>
                                <Text style={{ color: '#fff' }}>{I18n.t('app.components.facebookPhotos.confirmPhotos.Footer.confirm')}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    {!this.props.confirmPage.props.locked &&
                        <TouchableOpacity onPress={() => {
                            Keyboard.dismiss();
                            setTimeout(() => {
                                this.props.confirmPage.capture();
                            }, 500);
                        }}
                            style={{
                                flex: 1,
                                height: 60,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 2, backgroundColor: 'rgb(63,66,67)' }}>
                                <Text style={{ color: '#fff' }}>{I18n.t('app.components.facebookPhotos.confirmPhotos.Footer.confirm')}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            );
        } else {
            return (
                <View></View>
            )
        }
    }
}
