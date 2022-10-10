
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
import { ActivityIndicator } from 'react-native'
import MenuTab from '../../../MenuTab';
import { trackEvent } from '../../../utilities/Analytics';



export default class Header extends Component {
    constructor() {
        super();
        this.state = {
            loading: false
        }
    }

    componentWillMount() {
        this.setState({ loading: false });
    }

    render() {
        return (
            <View style={[styles.headerChat, { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }]}>
                <StatusBar backgroundColor={'grey'} translucent={false} barStyle="default" />
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flex: 1 }}>

                        {(!this.props.firstTime && !this.props.confirmPage.props.locked) &&
                            <TouchableOpacity onPress={() => {
                                trackEvent('Edit_Profile', 'Save_Profile')
                                Meteor.call('savePhotoToArrayResize', Meteor.user()._id, this.props.index);
                                this.setState({ unmounted: true, loading: true });
                                setTimeout(() => {
                                    this.props.confirmPage.capture();
                                }, 10);
                            }}>
                                {this.state.loading &&
                                    <ActivityIndicator size="large" color="#aeb7b7" />
                                    || <Icon style={{ marginLeft: 15, backgroundColor: 'transparent' }} name={'done'} size={30} color={'green'} />
                                }
                            </TouchableOpacity>
                        }

                        {(!this.props.firstTime && this.props.confirmPage.props.locked) &&
                            <TouchableOpacity onPress={() => {
                                trackEvent('Edit_Profile', 'Save_Profile')
                                if (this.props.confirmPage.props.locked) {
                                    Keyboard.dismiss();
                                    setTimeout(() => {
                                        CustomAlert.showAlert('', I18n.t('app.components.facebookPhotos.confirmPhotos.Header.differentPhoto'));
                                    }, 500);
                                } else {
                                    Meteor.call('savePhotoToArrayResize', Meteor.user()._id, this.props.index);
                                    this.setState({ unmounted: true });
                                    this.setState({ loading: true });
                                    this.props.confirmPage.setState({
                                        edit: true
                                    });
                                    Actions.mainPage({ editProfile: true });
                                }

                            }}>
                                {this.state.loading &&
                                    <ActivityIndicator size="large" color="#aeb7b7" />
                                    || <Icon style={{ marginLeft: 15, backgroundColor: 'transparent' }} name={'done'} size={30} color={'green'} />
                                }
                            </TouchableOpacity>
                        }
                    </View>

                    {!this.props.firstTime &&
                        <Text style={{ flex: 3, fontFamily: 'Montserrat-Light', backgroundColor: 'transparent', color: '#aeb7b7', textAlign: 'center' }}>
                            {I18n.t('app.components.facebookPhotos.confirmPhotos.Header.panPinch')}
                        </Text>
                    }

                    {this.props.firstTime &&
                        <Text style={{ flex: 3, fontFamily: 'Montserrat-Light', backgroundColor: 'transparent', color: '#aeb7b7', textAlign: 'center' }}>
                            {I18n.t('app.components.facebookPhotos.confirmPhotos.Header.profilePicture')}
                        </Text>
                    }

                    <View style={{ flex: 1 }}>

                        {(this.props.firstTime && this.props.currentPic != 'https://playfmk.com/images/noPic.png') &&
                            <TouchableOpacity onPress={() => {
                                trackEvent('Edit_Profile', 'Save_Profile')
                                this.props.confirmPage.setState({
                                    edit: true
                                });
                                Meteor.call('savePhotoToArrayResize', Meteor.user()._id, 1);
                                Actions.mainPage({ editProfile: true, firstTime: false });
                                this.setState({ unmounted: true });
                            }}>
                                <Icon style={{ marginLeft: 15, backgroundColor: 'transparent' }} name={'done'} size={30} color={'green'} />
                            </TouchableOpacity>
                        }

                    </View>
                </View>
            </View>
        );
    }
}
