import React, { Component } from 'react';
import I18n from '../../../config/i18n';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Counter from './Counter'
import styles from '../../styles/styles';
import GameTagIcon from '../../font/customIcon';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import Meteor from '@meteorrn/core';
import { trackEvent } from '../../utilities/Analytics';

export default class StatBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      renderKill: false,
      renderRank: false,
      renderScoreChange: false,
      firstTime: true
    }
  }

  startAnimation(){
    if(this.refs["counter"])
    this.refs["counter"].startAnimation()
  }

  skipAnimation(){
    this.setState({renderRank: false, renderScoreChange: true, firstTime: false})
  }

  _changeIcon(type) {
    trackEvent('Profile', 'Click_' + type);
    switch (type) {
      case 'kill':
      if(!this.state.renderKill && !this.state.renderRank){
        this.setState({ renderKill: true, renderScoreChange: true, firstTime: false });
        this.props.mainPage.setState({ renderKill: true});
      } else {
        this.setState({ renderKill: false, renderScoreChange: false, renderRank: false, firstTime: false });
        this.props.mainPage.setState({ renderKill: false });
      }
      break;
      case 'fuck':

        Actions.whoVoted({typeSelected: 'fuck', showStats: this.props.showStats})

      break;
      case 'marry':

        Actions.whoVoted({typeSelected: 'marry', showStats: this.props.showStats})

      break;
      default:
    }
  }

  render() {
    const MAX_DURATION = 5000;

    let colors;
    if(this.props.type == "fuck"){
      colors = ['#f74786', '#f88956']
    } else if(this.props.type == "marry") {
      colors = ['#5797c2', '#be29bc']
    } else {
      colors = ['#00cbb3', '#004bb5']
    }

    let iconName = 'arrow-drop-down'
    if(this.props.rankDiff > 0){
      iconName = 'arrow-drop-up';
    }

    if(this.props.type == 'kill' && !this.state.renderKill && !this.state.renderRank){
      return(
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => {
            this._changeIcon(this.props.type);
          } }>
          <LinearGradient style={this.props.style} start={{x:0, y:1}} end={{x:1, y:0}} colors={colors}>
            <View style={styles.killStatsHidden}>
              <Text style={styles.killEmoticon}>¯\_(ツ)_/¯</Text>
              <Text style={styles.killEmoticonText}>{I18n.t('app.components.SettingsComponents.StatBox.tapToView0')}</Text>
              <GameTagIcon name={this.props.type} color="#ffffff" style={this.props.iconStyle} />
            </View>
          </LinearGradient>
        </TouchableOpacity>)

      } else {
        let startingVal
        let duration
        if(this.props.diff){
          startingVal = this.props.value - this.props.diff
          duration = Math.min(200*this.props.diff,MAX_DURATION)
        } else {
          startingVal = this.props.value
          duration = 0
        }

        return (
          <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => {
              this._changeIcon(this.props.type);
            } }>

            <LinearGradient style={this.props.style} start={{x:0, y:1}} end={{x:1, y:0}} colors={colors}>

              {(!this.state.renderRank && this.state.firstTime && this.props.value != '-') &&
                <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                  <Counter
                    ref='counter'
                    end={this.props.value}
                    start={startingVal}
                    time={duration}
                    digits={0}
                    easing="quintOut"               // Easing function name
                    onComplete={()=>{
                      this.setState({renderScoreChange: true, firstTime: false})
                    }}                 // Callback when the counter is completed
                    style={this.props.numberStyle}
                    />
                  <GameTagIcon name={this.props.type} color="#ffffff" style={this.props.iconStyle} />

                </View>}

                {(!this.state.renderRank && (!this.state.firstTime || this.props.value == '-')) &&
                  <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                    {this.props.type != 'kill' &&  <Text style={{fontFamily: 'Montserrat-light', color: '#E5E7E9',
                    fontSize:8, textAlign:'center'}}>{I18n.t('app.components.SettingsComponents.StatBox.tapToView')}</Text>}
                    <Text style={this.props.numberStyle} >{this.props.value}</Text>
                    <GameTagIcon name={this.props.type} color="#ffffff" style={this.props.iconStyle} />

                  </View>}


                  {(this.state.renderScoreChange && this.props.diff > 0) &&
                    <View style={{position:'absolute', top:0, right:4, flexDirection:'column'}}>
                      <Text style={{fontFamily: 'Montserrat-light', color:'#FFFFFF', fontSize:10, textAlign:'center'}}>+{this.props.diff}</Text>
                    </View>
                  }

                  {((this.state.renderScoreChange) && this.props.diff <= 0) &&
                    <View style={{position:'absolute', top:0, right:4, flexDirection:'column'}}>
                    </View>
                  }

                  {(this.state.renderRank && this.props.rankDiff != 0 && this.props.showStats) &&
                    <View >
                      <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center', flexGrow:1}}>
                        <Text style={{fontFamily: 'Montserrat-light', color:'#FFFFFF', fontSize:14, textAlign:'center'}}>Rank</Text>
                        <Text style={this.props.numberStyle}>{this.props.rank}</Text>
                      </View>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', position:'absolute', left: 0, right: 0, bottom:0}}>
                        <Text style={{fontFamily: 'Montserrat-light', color:'#FFFFFF', fontSize:10, textAlign:'center'}}>{this.props.rankDiff}</Text>
                        <Icon name={iconName} size={20} color={'#e3e6e8'} style={{textAlign: 'center'}}  />
                      </View>
                    </View>
                  }

                  {(this.state.renderRank && this.props.rankDiff == 0 && this.props.showStats) &&
                    <View >
                      <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center', flexGrow:1}}>
                        <Text style={{fontFamily: 'Montserrat-light', color:'#FFFFFF', fontSize:14, textAlign:'center'}}>{I18n.t('app.components.SettingsComponents.StatBox.rank')}</Text>
                        <Text style={this.props.numberStyle}>{this.props.rank}</Text>
                      </View>
                    </View>
                  }

                  {(this.state.renderRank && !this.props.showStats) &&
                    <View >
                      <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center', flexGrow:1}}>
                        <Text style={{fontFamily: 'Montserrat-light', color:'#FFFFFF', fontSize:14, textAlign:'center'}}>{I18n.t('app.components.SettingsComponents.StatBox.rank')}</Text>
                        <Text style={{fontFamily: 'Montserrat-light', color:'#FFFFFF', fontSize:11, margin:10, textAlign:'center'}}>
                        {I18n.t('app.components.SettingsComponents.StatBox.keepPlaying')}
                        </Text>
                      </View>
                    </View>
                  }
                </LinearGradient>
              </TouchableOpacity>
            );
          }
        }

      }
