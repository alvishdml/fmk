import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
  Text
} from 'react-native';
import Modal from 'react-native-modal';
// import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class LeloAdModal extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    openPopUp(value) {
        this.setState({ isOpen: value});
        trackScreenView('BOOKING AD MODAL')
    }

    render(){
        return (
            <Modal
            modalDidClose={() => { this.setState({ isOpen: false }); } }
            offset={0}
            hideCloseButton={false}
            backdropType= 'blur'
            open={this.state.isOpen}
            modalStyle={{ margin: 0, padding: 0, backgroundColor: '#F5F5F500'}}>
            <View style={{height: HEIGHT, width: WIDTH, backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => {this.setState({ isOpen: false }); trackEvent('Advertising', 'close top button', { label: "booking.com"}) }} style={{ height: HEIGHT * 0.09, width: WIDTH * 0.2, position: 'absolute',
                top: 0, left: 0}}>
                <Icon style={{backgroundColor: 'transparent' }} name={'close'} size={30} color={'black'}/>
            </TouchableOpacity>
            <Image style={{ height: HEIGHT * 0.5, width: WIDTH, justifyContent: 'center'}}  source={{ uri: 'https://playfmk.com/images/fmk_booking.png'}}/>
            <TouchableOpacity onPress={()=> {Linking.openURL('https://www.booking.com/?aid=1637050');  trackEvent('Advertising', 'Click', { label: "booking.com"})}} style={{ height: HEIGHT * 0.8, width: WIDTH, position: 'absolute',
            bottom: HEIGHT * 0.1, marginTop: HEIGHT * 0.8}} />
            <TouchableOpacity onPress={() => {this.setState({ isOpen: false }); trackEvent('Advertising', 'close top button', { label: "booking.com"})}} style={{height: HEIGHT * 0.08, width: WIDTH, position: 'absolute', display: 'flex', alignItems: 'center',
            bottom: 0}}>
                <Text style={{textDecorationLine: 'underline', color: 'black'}}>Maybe later</Text>
            </TouchableOpacity>
            </View>
            </Modal>
        );
    }
}
