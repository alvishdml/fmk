import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image
} from 'react-native';
import Meteor from '@meteorrn/core';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Alert from '../../utilities/Alert';
import InAppBilling from 'react-native-billing';
import branch from 'react-native-branch'
import firebase from '../../utilities/Firebase';
import { trackScreen, trackEvent } from '../../utilities/Analytics';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class VipModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            reason: "",
            masgTitle: "",
            msgCopy: "",
            msgPercentage: "",
            isOpen: false,
            prices: ['','', ''],
            selected: 1,
            popular: true
        }
    }

    componentWillMount(){
        this.loadBranch()
    }

    async loadBranch(){
      branchUniversalObject = await branch.createBranchUniversalObject(
        'content/12345', // canonical identifier
        {
          title: I18n.t('app.components.monetization.MonetizationSlideShowTab.loadBranchTitle'),
          contentImageUrl: 'http://www.playfmk.com/images/preview.png',
          contentDescription: I18n.t('app.components.monetization.MonetizationSlideShowTab.loadBranchDesc'),
          metadata: {
            user_id: Meteor.user()._id
          }
        }
      )
    }

    openPopUp(value) {
        trackScreen('Free_Features_Screen');
        this.setState({ isOpen: value});
    }

    render(){
      let isSubscribed = false;
        if (Meteor.user().profile.subscription != undefined){
          isSubscribed = Meteor.user().profile.subscription
        }
        return (
            <Modal
            onDismiss={() => { this.setState({ isOpen: false }); } }
            offset={0}
            hideCloseButton={false}
            backdropType= 'blur'
            isVisible={this.state.isOpen}
            style={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500'}}>
              <View style={styles.mainView}>
                <LinearGradient style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5, width: WIDTH-80, height: HEIGHT * 0.50, position: 'absolute', top: 0, left: 0, alignItems: 'center', justifyContent:'center' }} colors={['#2FB161', '#9BD95E']}>
                  <Text style={{ fontFamily: 'Montserrat-Light',  color: '#fff', fontSize: 30, marginTop:20, textAlign:'center' }}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteTitle')}<Text style={{fontFamily: 'Montserrat-Bold'}}> 1</Text> {I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteSecondTitle')}</Text>
                  <Text style={{ fontFamily: 'Montserrat-Light',  color: '#fff', fontSize: 30, textAlign:'center' }}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteThirdTitle')}</Text>
                  <Image
                  resizeMode="contain" resizeMethod="resize" source={{uri: 'https://fmk-images.ams3.digitaloceanspaces.com/defaults/referpic.png'}}
                  style={{ height: WIDTH * 0.5, width: WIDTH * 0.64, marginRight: 10, marginLeft: 15 }}
                  />
                </LinearGradient>
                <Text style={{ fontFamily: 'Montserrat-Light',  color: '#424242', fontSize: WIDTH < 400 ? 14 :16, marginTop:HEIGHT * 0.5, textAlign:'center', width: WIDTH * 0.7 }}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteDesc0')}</Text>
                <Text style={{ fontFamily: 'Montserrat-Bold',  color: 'black', fontSize: WIDTH < 400 ? 14 :16, textAlign:'center', width: WIDTH * 0.7 }}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteDesc1')}</Text>
                <TouchableOpacity style={{width: WIDTH-130, height: 50, backgroundColor: '#4EBB60', alignItems: 'center', justifyContent:'center', marginTop:HEIGHT * 0.04, marginBottom:HEIGHT * 0.06 }}
                onPress={async function(){
                  let shareOptions = {
                          messageHeader: I18n.t('app.components.monetization.MonetizationSlideShowTab.shareOptionsHeader'),
                          messageBody: I18n.t('app.components.monetization.MonetizationSlideShowTab.shareOptionsBody')
                        }

                        let linkProperties = {
                          feature: 'share',
                          channel: 'facebook',
                          campaign: 'referralApp'
                        }

                        let controlParams = {}

                        let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
                        trackEvent('Free_Features_Screen','Click_Invite_Friends');
                        if(completed){
                          trackEvent('Referral', channel)
                        } else {
                          trackEvent('Referral', "Canceled")
                        }
                        return true;
                      }
                  }>
                    <Text style={{fontFamily: 'Montserrat-Light', color:'white', fontSize:WIDTH * 0.028, fontWeight:'400' }}>{I18n.t('app.components.monetization.MonetizationSlideShowTab.inviteCTA')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.setState({isOpen:false}); trackEvent('Free_Features_Screen','Click_Maybe_Later');}}>
                  <Text style={{fontFamily: 'Montserrat-Light', color:'#353535', textDecorationLine:'underline', fontSize:12 }}>{I18n.t('app.components.monetization.ActivateBoost.maybeLater')}</Text>
                </TouchableOpacity>
              </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create ({
    mainView:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: HEIGHT * 0.83 ,
        marginRight: 40,
        marginLeft: 40,
        borderRadius: 5,
        position: 'relative'
    },
    activateButton: {
        width: 400,
        height: 100,
    }
 })
