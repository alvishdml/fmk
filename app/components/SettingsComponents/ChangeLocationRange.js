import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
    View,
    Text,
    Dimensions,
    AppState,
    TouchableWithoutFeedback
} from 'react-native';
import styles from '../../styles/styles';
import Location from '../../utilities/Location';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { trackEvent } from '../../utilities/Analytics';

var BD = require('../../utilities/DAAsyncStorage');
var myBD = new BD();

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class ChangeLocationRange extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: 600,
            range: 6371 * 1000,
            disabled: false,
            color1: '#fff',
            color2: '#008B8B'
        }

        // this._handleAppStateChange = this._handleAppStateChange.bind(this);
        this.checkGpsStatus = this.checkGpsStatus.bind(this);
    }

    UNSAFE_componentWillMount() {
        // AppState.addEventListener('change', this._handleAppStateChange);
        myBD.buscarItem('COORDS', (coords) => {
            if (coords) {
                var bd_coords = coords.split('|');
                myBD.buscarItem('rangeCache', (item) => {
                    if (bd_coords[0] != 0 && bd_coords[1] != 0) {
                        if(Number(item)/1000 == 6371){
                            this.setState({ text: 600, range: Number(item), disabled: false, color1:'#fff', color2: '#008B8B'});
                        }else{
                            this.setState({ text: Number(item)/1000 , range: Number(item), disabled: false, color1:'#fff', color2: '#008B8B'});
                        }
                    } else {
                        this.setState({ text: 600 , range: 6371 * 1000, disabled: true, color1:'#afb6b6', color2: '#afb6b6' });
                    }
                });
            } else {
                myBD.buscarItem('rangeCache', (item) => {
                    this.setState({ text: 600 , range: 6371 * 1000, disabled: true, color1:'#afb6b6', color2: '#afb6b6'});
                });
            }
        });
    }

    componentDidMount(){
        setTimeout(()=>{
            Location.checkGpsStatusSlider(this, false)
        }, 3000)
    }

    componentWillUpdate() {
        myBD.buscarItem('updateRangeCache', (item) => {
             if (item == 'true') {
                myBD.buscarItem('rangeCache', (item) => {
                    if (item !== this.state.range.toString()) {
                        if(Number(item / 1000) == 6000){
                            this.setState({
                                text: 600,
                                range: item,
                            });
                        }else{
                            this.setState({
                                text: Number(item / 1000),
                                range: item,
                            });
                        }
                        myBD.criarItem('updateRangeCache', '', () => { });
                    }
                });
            }
        });
    }

    checkGpsStatus() {
        // this.props.mainPage.lockSwipeTabs();
        Location.checkGpsStatusSlider(this, true)
    }

    // _handleAppStateChange(currentAppState) {
    //     if (currentAppState === 'active') {
    //         this.checkGpsStatus();
    //     }
    // }

    maxLocationRange() {
        if (this.state.text == 600) {
            return (
                <Text style={[styles.subtituloSettings, { fontFamily: 'Montserrat-Regular', fontSize: 13 }]}> {I18n.t('app.components.SettingsComponents.ChangeLocationRange.worldWide')} </Text>
            );
        } else {
            return (
                <Text style={[styles.subtituloSettings, { fontFamily: 'Montserrat-Regular', fontSize: 13 }]}>{this.state.text} Km</Text>
            );
        }
    }

    setLocationRange(value) {
        console.log(value, 'ppoieguigw');
        // this.props.mainPage.lockSwipeTabs();
        if (!this.state.disabled) {
                this.setState({
                    text: Number(value),
                    range: value * 1000,
                });
        } else {
            myBD.buscarItem('COORDS', (coords) => {
                if (coords) {
                    var bd_coords = coords.split('|');
                    myBD.buscarItem('rangeCache', (item) => {
                        if (bd_coords[0] != 0 && bd_coords[1] != 0) {
                            this.setState({ text: Number(item)/1000 , range: Number(item)});
                        }
                    });
                }else{
                    this.setState({ text: 600, range: 6371 * 1000 });
                }
            });
        }
    }
    setLocationRangeFinish(value) {
        trackEvent('Settings_Profile','slider_location', value);
        // this.props.mainPage.unlockSwipeTabs();
        if (!this.state.disabled) {
            if (value == 600) {
                this.setState({text: 600});
                let rangeMeters = 6371*1000;
                myBD.criarItem('rangeCache', rangeMeters.toString(), () => { });
                this.props.mainPage.changeGender();
            }else{
                let rangeMeters = value*1000;
                myBD.criarItem('rangeCache', rangeMeters.toString(), () => { });
                this.props.mainPage.changeGender();
            }
        }
    }

    render() {
        return (
            <View >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5  }} >
                    <Text style={[styles.subtituloSettings, { fontFamily: 'Montserrat-Regular', fontSize: 13 }]}>{I18n.t('app.components.SettingsComponents.ChangeLocationRange.location')}</Text>
                    {this.maxLocationRange()}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, marginLeft: 20 }}  >
                    <MultiSlider
                        min={30}
                        max={600}
                        selectedStyle={{ backgroundColor: this.state.color2 }}
                        unselectedStyle={{ backgroundColor: this.state.color1 }}
                        markerStyle={{height: 20, width: 20, borderRadius: 10, backgroundColor: this.state.color2}}
                        containerStyle={{ height: 30, marginTop: 10, paddingTop: 5, paddingBottom: 5 }}
                        trackStyle={{ height: 4 }}
                        touchDimensions={{ height: 800, width: 800, borderRadius: 5000, slipDisplacement: 1000 }}
                        onValuesChangeStart={this.checkGpsStatus}
                        onValuesChange={(value) => this.setLocationRange(value)}
                        onValuesChangeFinish={(value) => this.setLocationRangeFinish(value)}
                        sliderLength={width - 90}
                        values={[this.state.text]}
                        />
                </View>
            </View>
        );
    }
}
