import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import {
    View,
    Text,
    Image,
    Dimensions,
} from 'react-native';
import styles from '../../styles/styles';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { trackEvent } from '../../utilities/Analytics';

const BD = require('../../utilities/DAAsyncStorage');
const myBD = new BD();

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class GenderAge extends Component {

    constructor(props) {
        super(props);
        this.state = {
            minAgeValue: 18,
            maxAgeValue: 60,
            color1: '#fff',
            color2: '#008B8B'
        }
    }

    componentWillMount() {
        myBD.buscarItem('age3', (item) => {
            if (item) {
                var values = item.split(',');
                if (values[0] < 57) {
                    this.setState({minAgeValue: Number(values[0]), maxAgeValue: Number(values[1])});
                } else {
                    this.setState({minAgeValue: Number(18), maxAgeValue: Number(values[1])});
                }
            }
        });
    }

    maxAgeSetting() {
        if (this.state.maxAgeValue == 60) {
            return (
                <Text style={[styles.subtituloSettings, { fontFamily: 'Montserrat-Regular', fontSize: 13 }]}>{this.state.minAgeValue} - {this.state.maxAgeValue} + </Text>
            );
        } else {
            return (
                <Text style={[styles.subtituloSettings, { fontFamily: 'Montserrat-Regular', fontSize: 13 }]}>{this.state.minAgeValue} - {this.state.maxAgeValue}</Text>
            );
        }
    }

    startSlider() {
        this.props.mainPage.lockSwipeTabs();
    }

    setAgeRange (values) {
        // this.props.mainPage.lockSwipeTabs();
        if (values[1] - values[0] >= 3) {
            this.setState({
                minAgeValue: values[0],
                maxAgeValue: values[1],
            });
        }
    }

    setAgeRangeFinish(values) {
        trackEvent('Settings_Profile','slider_age', values);
        // this.props.mainPage.unlockSwipeTabs();
        if (values[0] > 21) {
            if (values[1] - values[0] >= 3) {
                myBD.criarItem('age3', values.toString() , () => {});
                this.props.mainPage.changeGender();
            } else {
                this.setState({
                    minAgeValue: values[1] - 3,
                    maxAgeValue: values[1]
                });
            }
        } else {
            if (values[1] - values[0] >= 3) {
                myBD.criarItem('age3', values.toString() , () => {});
                this.props.mainPage.changeGender();
            } else {
                this.setState({
                    minAgeValue: values[0],
                    maxAgeValue: values[0] + 3
                });
            }
        }
    }

    render() {
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 5 }} >
                    <Text style={[styles.subtituloSettings, { fontFamily: 'Montserrat-Regular', fontSize: 13 }]}>{I18n.t('app.components.SettingsComponents.ChangeAge.age')}</Text>
                    {this.maxAgeSetting() }
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, marginLeft: 20 }} >
                    <MultiSlider
                        min={18}
                        max={60}
                        markerStyle={{ width: 20, height: 20, borderRadius: 10, backgroundColor: this.state.color2 }}
                        selectedStyle={{ backgroundColor: '#008B8B' }}
                        unselectedStyle={{ backgroundColor: '#FFFFFF'}}
                        containerStyle={{ height: 30, marginTop: 10, paddingTop: 5, paddingBottom: 5 }}
                        trackStyle={{ height: 4 }}
                        touchDimensions={{ height:8500, width: 800, borderRadius: 5000, slipDisplacement: 1000 }}
                        sliderLength={WIDTH - 90}
                        // onValuesChangeStart={this.startSlider.bind(this)}
                        onValuesChange={(values) => this.setAgeRange(values)}
                        onValuesChangeFinish={(values) => this.setAgeRangeFinish(values) }
                        values={[this.state.minAgeValue,this.state.maxAgeValue]}
                        />
                </View>
            </View>
        );
    }
}
