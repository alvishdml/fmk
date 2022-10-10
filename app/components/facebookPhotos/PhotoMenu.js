import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../../styles/styles';
import FBPhotoHeader from './FBPhotoHeader';

export default class PhotoMenu extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FBPhotoHeader titulo={'Photo menu'}/>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={[styles.loginButton, { borderColor: '#AEB7B7', marginBottom: 50, marginTop: -25 }]} onPress={() => {
                            Actions.facebookPhotos({ profile: this.props.profile });
                        } }>
                        <Text style={{ fontFamily: 'Montserrat-Light', color: '#AEB7B7', backgroundColor: 'transparent', fontSize: 14 }}>
                        {I18n.t('app.components.facebookPhotos.PhotoMenu.newPhoto')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.loginButton, { borderColor: '#AEB7B7' }]} onPress={() => {
                            Actions.confirmPhoto({ urlPhoto: 'https://fmk-images.ams3.digitaloceanspaces.com/profile/AGL54hFymccEai7Mw.png', profile: this.props.profile, toPop: 2 })
                        } }>
                        <Text style={{ fontFamily: 'Montserrat-Light', color: '#AEB7B7', backgroundColor: 'transparent', fontSize: 14 }}>
                        {I18n.t('app.components.facebookPhotos.PhotoMenu.cropPhoto')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}
