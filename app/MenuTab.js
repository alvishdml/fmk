import React from "react";
import PropTypes from 'prop-types';
import I18n from "../config/i18n";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  Image,
  ActivityIndicator
} from "react-native";
import NotificationCounter from "./utilities/NotificationCounter";
import Icon from "./font/customIcon";
import styles from "./styles/styles";
import * as Animatable from "react-native-animatable";
import Meteor from "@meteorrn/core";
import Animations from "./Animations";
import { trackEvent } from "./utilities/Analytics";
var BD = require("./utilities/DAAsyncStorage");
var myBD = new BD();

let width = Dimensions.get("window").width;
let dpi = PixelRatio.get();

let screenSize = width * dpi;
let iconSize = 24;
let textSize = 12;
if (screenSize <= 480) {
  iconSize = 20;
  textSize = 10;
}

const AnimatedIcon = Animatable.createAnimatableComponent(Icon);

var createReactClass = require('create-react-class');
const MenuTab = createReactClass({
  tabIcons: [],

  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array
  },

  getInitialState: function() {
    return { activeTab: this.props.activeTab };
  },

  componentWillMount() {
    Animatable.initializeRegistryWithDefinitions({
      glow: Animations.glow
    });
    this.setState({ isNotificating: false, index: "", count: 0, factor: 10 });
    NotificationCounter.setTabBar(this);
    Meteor.call("unreadNotifications", Meteor.user()._id, (err, result) => {
      if (!err) {
        this.checkNotification(result);
      }
    });
  },

  componentWillUnmount() {
    // Avoids bugs related to showing a notification when the component is already unmounted
    NotificationCounter.setTabBar(undefined);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  },

  componentDidMount() {
    this._isMounted = true;
    this.props.emitter.addListener(
      "stopSharingCombination",
      this._stopSharingCombination
    );
    this.props.emitter.addListener(
      "pulseShareCombination",
      this._pulseShareCombination
    );
    this.props.emitter.addListener(
      "stopPulseShareCombination",
      this._stopPulseShareCombination
    );
    //this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
    this.timeout = setInterval(
      function() {
        this.refreshNotification();
      }.bind(this),
      10000
    );
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.profileTab == true) {
      this.setState({ activeTab: 0 });
    } else {
      this.setState({ activeTab: nextProps.activeTab });
    }
  },

  componentWillUnmount() {
    this._isMounted = false;
  },

  _pulseShareCombination() {
    if (this._isMounted) {
      this.setState({ animated: true });
    }
  },

  _stopPulseShareCombination() {
    this.setState({ animated: false });
  },

  setAnimationValue({ value }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = value - i >= 0 && value - i <= 1 ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress)
        }
      });
    });
  },

  _stopSharingCombination() {
    this.setState({ sharingCombination: false });
  },

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const RED = 63 + (204 - 63) * progress;
    const GREEN = 66 + (204 - 66) * progress;
    const BLUE = 67 + (204 - 67) * progress;
    return `rgb(${RED}, ${GREEN}, ${BLUE})`;
  },

  renderNotificationCounter(i) {
    if (i == 2 && this.state.isNotificating && this.state.index != 2) {
      var tabNum = 3;
      if (this.props.tabs) {
        tabNum = this.props.tabs.length;
      }
      return (
        <View
          style={{
            height: 16,
            width: 16,
            borderRadius: 8,
            backgroundColor: "#F76371",
            position: "absolute",
            top: 0,
            right: width / tabNum - width / (tabNum * 2) - 20,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-Light",
              color: "#fff",
              fontSize: 10
            }}
          >
            {this.state.count}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  },

  checkNotification(n) {
    if (this._isMounted) {
      if (parseInt(n) > 0) {
        this.setState({ isNotificating: true, count: n });
      } else {
        this.setState({ isNotificating: false, count: 0 });
      }
    }
  },

  refreshNotification() {
    if (Meteor.user()) {
      Meteor.call("unreadNotifications", Meteor.user()._id, (err, result) => {
        if (!err) {
          this.checkNotification(result);
        }
      });
    } else {
      setTimeout(this.refreshNotification, 500);
    }
  },

  newNotification() {
    let aux = this.state.count + 1;
    this.checkNotification(aux);
  },

  subtractNotification() {
    let aux = this.state.count - 1;
    this.checkNotification(aux);
  },

  _shareCombination() {
    this.props.emitter.emit("shareCombination");
    this.setState({ sharingCombination: true });
  },

  render() {
    if (this.props.tabs.length == 4) {
      this.state.factor = 15;
    }
    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((tab, i) => {
          if (this.state.activeTab === i && tab == "selection") {
            if (this.state.sharingCombination) {
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab]}
                  onPress={() => {}}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: 60,
                      width: width / 3,
                      paddingBottom: 0,
                      paddingTop: 5,
                      backgroundColor: "transparent"
                    }}
                  >
                    <ActivityIndicator
                      animating={true}
                      color={"#000000"}
                      size="small"
                    />
                  </View>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab]}
                onPress={() => {
                  this._shareCombination();
                  trackEvent("Game_Screen", "Click_AskHelp");
                }}
              >
                {this.state.animated ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: 60,
                      width: width / 3,
                      paddingBottom: 0,
                      backgroundColor: "transparent"
                    }}
                  >
                    <Animatable.View
                      style={{ paddingTop: 5 }}
                      animation="swing"
                      easing="ease-out"
                      iterationCount="infinite"
                    >
                      <AnimatedIcon
                        name={"share"}
                        size={iconSize}
                        animation="glow"
                        iterationCount="infinite"
                        duration={7000}
                      />
                    </Animatable.View>
                    <Text style={{ fontSize: textSize }}>
                      {I18n.t("app.MenuTab.askForHelpIcon")}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: 60,
                      width: width / 3,
                      paddingBottom: 0,
                      paddingTop: 5,
                      backgroundColor: "transparent"
                    }}
                  >
                    <AnimatedIcon
                      name={"share"}
                      size={iconSize}
                      animation="glow"
                      iterationCount="infinite"
                      duration={7000}
                    />
                    <Text style={{ fontSize: textSize }}>
                      {I18n.t("app.MenuTab.askForHelpIcon")}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          } else if (this.state.activeTab !== i && tab == "selection") {
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => {
                  this.props.goToPage(i);
                }}
                style={[styles.tab]}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 60,
                    width: width / 3
                  }}
                >
                  <Icon
                    name={tab}
                    size={30}
                    color={"#F76371"}
                    ref={icon => {
                      this.tabIcons[i] = icon;
                    }}
                  />
                </View>
                {this.renderNotificationCounter(i)}
              </TouchableOpacity>
            );
          } else if (tab == "monetization") {
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => {
                  this.props.goToPage(i);
                }}
                style={[styles.tab]}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 60,
                    width: width / 3
                  }}
                >
                  <Image
                    resizeMode={"contain"}
                    source={{
                      uri:
                        this.state.activeTab === i
                          ? "https://playfmk.com/images/premiumBlack.png"
                          : "https://playfmk.com/images/premiumGray.png"
                    }}
                    style={{ height: 30, width: 30, resizeMode: "contain" }}
                    ref={icon => {
                      this.tabIcons[i] = icon;
                    }}
                  />
                </View>
                {this.renderNotificationCounter(i)}
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => {
                  this.props.goToPage(i);
                }}
                style={[styles.tab]}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 60,
                    width: width / 3
                  }}
                >
                  <Icon
                    name={tab}
                    size={30}
                    color={
                      this.state.activeTab === i
                        ? "rgb(63,66,67)"
                        : "rgb(204,204,204)"
                    }
                    ref={icon => {
                      this.tabIcons[i] = icon;
                    }}
                  />
                </View>
                {this.renderNotificationCounter(i)}
              </TouchableOpacity>
            );
          }
        })}
      </View>
    );
  }
});

export default MenuTab;
