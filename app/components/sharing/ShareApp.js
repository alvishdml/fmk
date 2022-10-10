import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import ReactNative, {
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  ViewPagerAndroid,
  Platform,
} from 'react-native';
import styles from '../../styles/styles';
import Share, { ShareSheet, Button } from 'react-native-share';
import branch from 'react-native-branch';
import Meteor from '@meteorrn/core';
import { trackEvent } from '../../utilities/Analytics';

const FBSDK = require('react-native-fbsdk-next');
const {
  AppInviteDialog,
} = FBSDK;

export default class ShareApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      shareUrl: 'http://www.playfmk.com'
    }
    this.loadBranch()
  }

  async loadBranch(){
    branchUniversalObject = await branch.createBranchUniversalObject(
      'content/12345', // canonical identifier
      {
        title: 'Play F*ck Marry Kill',
        contentImageUrl: 'http://www.playfmk.com/images/preview.png',
        contentDescription: I18n.t('app.components.sharing.ShareApp.contentDescription'),
        metadata: {
          user_id: Meteor.user()._id
        }
      }
    )

    let linkProperties = {
      feature: 'share',
      channel: 'facebook',
      campaign: 'InviteFriendsApp'
    }

    let controlParams = {
    }

    let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
    this.setState({shareUrl: url})
  }

  onCancel() {
    this.setState({ visible: false });
  }

  onOpen(estado) {
    this.setState({ visible: estado });
  }

  render() {
    let twitterDialog = {
      title: "F*ck Marry Kill",
      message: "Install F*ck Marry Kill App Now!",
      url: this.state.shareUrl,
    }

    return (
      <ShareSheet visible={this.state.visible} style={{backgroundColor: 'yellow'}} onCancel={this.onCancel.bind(this)}>

        <Button icon='facebook'
          onPress={() => {
            this.onCancel();
            setTimeout(() => {
              let inviteOnFacebook = {
                applinkUrl: this.state.shareUrl,
                previewImageUrl: 'http://playfmk.com/images/feature.jpg',
              };
              AppInviteDialog.canShow(inviteOnFacebook).then(
                function (canShow) {
                  if (canShow) {
                    return AppInviteDialog.show(inviteOnFacebook, (error, result) => {

                    });
                  }
                }
              ).then(
                function (result) {
                  if (result.isCancelled) {
                    trackEvent('Invite', 'Friends_Cancelled', { label: 'Facebook' });
                  } else {
                    trackEvent('Invite', 'Friends_Success', { label: 'Facebook' });
                  }
                },
                function (error) {
                  trackEvent('Invite', 'Friends_Error', { label: 'Facebook' });
                }
              );
            }, 300);
          } }>
          Facebook
        </Button>
        <Button icon='twitter'
          onPress={() => {
            this.onCancel();
            setTimeout(() => {
              Share.shareSingle(
                Object.assign(twitterDialog, {
                  "social": "twitter"
                })
              ).then(
                function (result) {
                  if (result.message == 'OK') {
                    trackEvent('Invite', 'Friends_Success', { label: 'Twitter' });
                  } else {
                    trackEvent('Invite', 'Friends_Cancelled/Error', { label: 'Twitter' });
                  }
                }
              );
            }, 300);
          } }>
          Twitter
        </Button>
        <Button icon='whatsapp'
          onPress={() => {
            this.onCancel();
            setTimeout(() => {
              let shareOptions = {
                url: this.state.shareUrl,
                subject: "Share Link" //  for email
              };
              Share.shareSingle(
                Object.assign(shareOptions, {
                  "social": "whatsapp"
                })
              ).then(
                function (result) {
                  if (result.message == 'OK') {
                    trackEvent('Invite', 'Friends_Success', { label: 'Twitter' });
                  } else {
                    trackEvent('Invite', 'Friends_Cancelled/Error', { label: 'Twitter' });
                  }
                },
              );
            }, 300);
          } }>
          WhatsApp
        </Button>
        <Button icon='envelope'
          onPress={() => {
            this.onCancel();
            setTimeout(() => {
              let shareOptions = {
                url: this.state.shareUrl,
                subject: I18n.t('app.components.sharing.ShareApp.twitterDialogMessage')
              };
              Share.shareSingle(
                Object.assign(shareOptions, {
                  "social": "email"
                })
              ).then(
                function (result) {
                  if (result.message == 'OK') {
                    trackEvent('Invite', 'Friends_Success', { label: 'Email' });
                  } else {
                    trackEvent('Invite', 'Friends_Cancelled/Error', { label: 'Email' });
                  }
                },
              );
            }, 300);
          } }>
          Email
        </Button>
      </ShareSheet>
    );
  }
}
