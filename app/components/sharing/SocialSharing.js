import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import ReactNative, {
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import Meteor, { createContainer } from '@meteorrn/core';
import Share, { ShareSheet, Button } from 'react-native-share';
import { captureRef } from "react-native-view-shot";
import styles from '../../styles/styles';
import LinearGradient from 'react-native-linear-gradient';
import GameTagIcon from '../../font/customIcon';
import Constants from '../../utilities/Constants';
import { Actions } from 'react-native-router-flux';
import { trackEvent } from '../../utilities/Analytics';


const CONSTANTS = new Constants();
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class SocialSharing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            renderAgain: 0,
            image: '',
            loadingShare: false,
        }
        this.ref_profileView = React.createRef(null);

    }

    statistics(type, totalFucks, totalMarries, totalKills, renderKill, hideKill) {

        if(type == 'fuck') {
            if(!hideKill) {
                return (
                    <View style={[styles.rowStat]}>
                        <LinearGradient style={[styles.statsContainerMaster]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#f74786', '#f88956']}>
                            <Text style={styles.legendasNumber}>{totalFucks}</Text>
                            <GameTagIcon name='fuck' color="#ffffff" style={{ fontSize: 40 }} />
                        </LinearGradient>
                        <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#5797c2', '#be29bc']}>
                            <Text style={styles.legendasNumber}>{totalMarries}</Text>
                            <GameTagIcon name='marry' color="#ffffff" style={{ fontSize: 30 }} />
                        </LinearGradient>
                        {renderKill &&
                            <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#00cbb3', '#004bb5']}>
                                <Text style={styles.legendasNumber}>{totalKills}</Text>
                                <GameTagIcon name='kill' color="#ffffff" style={{ fontSize: 30 }} />
                            </LinearGradient>
                        }
                        {!renderKill &&
                            <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#00cbb3', '#004bb5']}>
                                <Text style={styles.killEmoticon}>¯\_(ツ)_/¯</Text>
                                <GameTagIcon name='kill' color="#ffffff" style={{ fontSize: 30 }} />
                            </LinearGradient>
                        }
                    </View>
                );
            } else {
                return (
                    <View style={[styles.rowStat]}>
                        <LinearGradient style={[styles.statsContainerMaster]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#f74786', '#f88956']}>
                            <Text style={styles.legendasNumber}>{totalFucks}</Text>
                            <GameTagIcon name='fuck' color="#ffffff" style={{ fontSize: 40 }} />
                        </LinearGradient>
                        <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#5797c2', '#be29bc']}>
                            <Text style={styles.legendasNumber}>{totalMarries}</Text>
                            <GameTagIcon name='marry' color="#ffffff" style={{ fontSize: 30 }} />
                        </LinearGradient>
                    </View>
                );
            }
        } else if (type == 'marry') {
            if (!hideKill) {
                return (
                    <View style={[styles.rowStat]}>
                        <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#f74786', '#f88956']}>
                            <Text style={styles.legendasNumber}>{totalFucks}</Text>
                            <GameTagIcon name='fuck' color="#ffffff" style={{ fontSize: 30 }} />
                        </LinearGradient>
                        <LinearGradient style={[styles.statsContainerMaster]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#5797c2', '#be29bc']}>
                            <Text style={styles.legendasNumber}>{totalMarries}</Text>
                            <GameTagIcon name='marry' color="#ffffff" style={{ fontSize: 40 }} />
                        </LinearGradient>
                        {renderKill &&
                            <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#00cbb3', '#004bb5']}>
                                <Text style={styles.legendasNumber}>{totalKills}</Text>
                                <GameTagIcon name='kill' color="#ffffff" style={{ fontSize: 30 }} />
                            </LinearGradient>
                        }
                        {!renderKill &&
                            <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#00cbb3', '#004bb5']}>
                                <Text style={styles.killEmoticon}>¯\_(ツ)_/¯</Text>
                                <GameTagIcon name='kill' color="#ffffff" style={{ fontSize: 30 }} />
                            </LinearGradient>
                        }
                    </View>
                );
            } else {
                return (
                    <View style={[styles.rowStat]}>
                        <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#f74786', '#f88956']}>
                            <Text style={styles.legendasNumber}>{totalFucks}</Text>
                            <GameTagIcon name='fuck' color="#ffffff" style={{ fontSize: 30 }} />
                        </LinearGradient>
                        <LinearGradient style={[styles.statsContainerMaster]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#5797c2', '#be29bc']}>
                            <Text style={styles.legendasNumber}>{totalMarries}</Text>
                            <GameTagIcon name='marry' color="#ffffff" style={{ fontSize: 40 }} />
                        </LinearGradient>
                    </View>
                );
            }
        } else {
            if (!hideKill) {
                return (
                    <View style={[styles.rowStat]}>
                        <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#f74786', '#f88956']}>
                            <Text style={styles.legendasNumber}>{totalFucks}</Text>
                            <GameTagIcon name='fuck' color="#ffffff" style={{ fontSize: 30 }} />
                        </LinearGradient>
                        <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#5797c2', '#be29bc']}>
                            <Text style={styles.legendasNumber}>{totalMarries}</Text>
                            <GameTagIcon name='marry' color="#ffffff" style={{ fontSize: 30 }} />
                        </LinearGradient>
                        {renderKill &&
                            <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#00cbb3', '#004bb5']}>
                                <Text style={styles.legendasNumber}>{totalKills}</Text>
                                <GameTagIcon name='kill' color="#ffffff" style={{ fontSize: 30 }} />
                            </LinearGradient>
                        }
                        {!renderKill &&
                            <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#00cbb3', '#004bb5']}>
                                <Text style={styles.killEmoticon}>¯\_(ツ)_/¯</Text>
                                <GameTagIcon name='kill' color="#ffffff" style={{ fontSize: 30 }} />
                            </LinearGradient>
                        }
                    </View>
                );
            } else {
                return (
                    <View style={[styles.rowStat]}>
                        <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#f74786', '#f88956']}>
                            <Text style={styles.legendasNumber}>{totalFucks}</Text>
                            <GameTagIcon name='fuck' color="#ffffff" style={{ fontSize: 30 }} />
                        </LinearGradient>
                        <LinearGradient style={[styles.statsContainer]} start={{x:0, y:1}} end={{x:1, y:0}} colors={['#5797c2', '#be29bc']}>
                            <Text style={styles.legendasNumber}>{totalMarries}</Text>
                            <GameTagIcon name='marry' color="#ffffff" style={{ fontSize: 30 }} />
                        </LinearGradient>
                    </View>
                );
            }
        }
    }

    backgroundColor(type) {
        if (type == 'fuck') {
            return (
                <View>
                    <LinearGradient style={{ width: 500, height: 500, flex: 1, position: 'absolute', top: 0, left: 0 }} colors={['rgba(247,71,134,0.8)', 'rgba(248,137,86,1.0)']}></LinearGradient>
                </View>
            );
        } else if (type == 'marry') {
            return (
                <View>
                    <LinearGradient style={{ width: 500, height: 500, flex: 1, position: 'absolute', top: 0, left: 0 }} colors={['rgba(142,68,173,0.9)', 'rgba(52,73,94,1.0)']}></LinearGradient>
                </View>
            );
        } else {
            return (
                <View>
                    <LinearGradient style={{ width: 500, height: 500, flex: 1, position: 'absolute', top: 0, left: 0 }} colors={['rgba(66,66,73,0.8)', 'rgba(13,13,13,1.0)']}></LinearGradient>
                </View>
            );
        }
    }

    tagText(type) {
      if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.gender){
        if (type == 'fuck') {
            return (
                <Text style={[styles.statusText]}>{CONSTANTS.profileText(Meteor.user().profile.gender, 'fuck')}</Text>
            );
        } else if (type == 'marry') {
            return (
                <Text style={[styles.statusText]}>{CONSTANTS.profileText(Meteor.user().profile.gender, 'marry')}</Text>
            );
        } else {
            return (
                <Text style={[styles.statusText]}>{CONSTANTS.profileText(Meteor.user().profile.gender)}</Text>
            );
        }
      } else {
        <Text style={[styles.statusText]}></Text>
      }
    }

    viewShot() {
      var name = "";
      if (Meteor.user() && Meteor.user().profile && (Meteor.user().profile.first_name || Meteor.user().profile.user_name)) {
        name = Meteor.user().profile.first_name.toUpperCase() || Meteor.user().profile.user_name.toUpperCase();
      }
        return (
            <View ref={this.ref_profileView} collapsable={false} style={{ width: 500, height: 500, position: 'absolute', left: -10000 }} >
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View>
                        <Image style={{ width: 500, height: 500, flex: 1, position: 'absolute', top: 0, left: 0 }} source={{ uri: this.props.picture }} />
                    </View>
                    {this.backgroundColor(this.props.type)}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ width: 180, height: 180, borderRadius: 90, margin: 10 }} source={{ uri: this.props.picture }} />
                        <Text style={[styles.legendas, { fontFamily: 'Montserrat-Light' }]}>{name} {I18n.t('app.components.sharing.SocialSharing.isNow')}</Text>
                        {this.tagText(this.props.type)}
                        {this.statistics(this.props.type, this.props.fuck, this.props.marry, this.props.kill, this.props.renderKill, this.props.hideKill)}
                    </View>
                </View>
            </View>
        );
    }

    takeShot() {
        trackEvent('Share', 'Share_Profile');
        this.setState({ renderAgain: this.state.renderAgain + 1, loadingShare: true });
        captureRef(this.ref_profileView, {
            width: 500,
            height: 500,
            format: "jpg",
            quality: 1,
            result: "base64",
        }).then(
            uri => {
                let subject;
                if(Meteor.user() && Meteor.user().profile){
                    subject = 'FMK Status From ' + Meteor.user().profile.first_name || Meteor.user().profile.last_name;
                } else {
                    subject = '';
                }
                Meteor.call('saveSharePic', Meteor.user()._id, uri, (err, result) => {
                    let imgUrl ="https://fmk-images.ams3.digitaloceanspaces.com/share/" + result.name;
                    // let shareImageBase64 = {
                    //     title: "F*ck Marry Kill",
                    //     message: I18n.t('app.components.sharing.SocialSharing.shareImageMessage') + imgUrl,
                    //     url: 'Beat me if you can! ' + this.props.shareUrl,
                    //     subject: subject
                    // };
                    // Share.open(shareImageBase64);
                    this.setState({ image: imgUrl, loadingShare: false }, this.props.shareUserPic(imgUrl));
                });
            },
            error => {}
        );
    }

    render() {
        return (
            <View style={{ }} >
                <TouchableOpacity
                    disabled={this.state.loadingShare}
                    hitSlop={{ top: 30, left: 30, bottom: 30, right: 30 }}
                    onPress={() => {
                        if (this.props.shareChallenge) {
                          trackEvent('Challenge_your_friends', 'Click');
                        }
                        this.takeShot();
                    } }>
                    {this.props.shareChallenge ?
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4, opacity: 1, width: WIDTH * 0.8, height: HEIGHT * 0.08, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                            {this.state.loadingShare ?
                            <ActivityIndicator animating={this.state.loadingShare} color={'#ffffff'} size="large" />
                            :
                            <Text style={{ color: 'white', fontSize: WIDTH * 0.055 }}>{I18n.t('app.components.sharing.SocialSharing.challengeThem')}</Text>
                            }
                        </View>
                        :
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4, opacity: 1, width: WIDTH * 0.8, height: HEIGHT * 0.08, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                            {this.state.loadingShare || this.props.loadingShare ?
                                <ActivityIndicator animating={true} color={'#ffffff'} size="large" />
                                :
                                <Text style={[styles.legendas, { fontFamily: 'Montserrat-Bold', fontSize: 8, marginTop: 5, marginBottom: 1 }]}>{I18n.t('app.components.sharing.SocialSharing.share')}</Text>
                            }
                        </View>
                    }
                </TouchableOpacity>
                <View style={{ position: 'absolute', left: -1000 }}><Text>{this.state.renderAgain}</Text></View>
                {this.viewShot()}
            </View>
        );
    }
}
