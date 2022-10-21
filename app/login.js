import React, { Component } from "react";
import I18n from "../config/i18n";
import {
  View,
  Image,
  ImageBackground,
  Text,
  StatusBar,
  Dimensions,
  PixelRatio,
  Platform
} from "react-native";
import { CustomLoginButton } from "./components/login/CustomLoginButton";
import { InstagramCustomLoginButton } from "./components/login/CustomLoginInstagramButton";
import { EmailLoginButton } from "./components/login/email/button";
import LinearGradient from "react-native-linear-gradient";
import Constants from "./utilities/Constants";
import Swiper from "react-native-swiper";
import GameTagIcon from "./font/customIcon";
import Icon from "react-native-vector-icons/Entypo";
import styles from "./styles/styles";
import { trackScreen, trackEvent } from "./utilities/Analytics";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;
let dpi = PixelRatio.get();
let screenName = "First_Screen";
const SLIDER_TEXT =
  Platform.OS == "ios"
    ? I18n.t("app.login.sliderTextIos")
    : I18n.t("app.login.sliderTextNotIos");

export default class Login extends Component {
  constructor(props) {
    super(props);
    let screenSize = width * dpi;
    let small = false;
    if (screenSize <= 480) {
      small = true;
    }
    this.state = {
      small: small,
      isiOS: Platform.OS == "ios" ? true : false
    };
  }

  componentDidMount() {
    trackScreen("Login_Screen");
  }

  _onMomentumScrollEnd(e) {
    console.log(e);
  }

  render() {
    let constants = new Constants();

    let customFrames = {};
    let marginBottomText = {};
    let logoMarginTop = {};

    if (this.state.small) {
      customFrames.width = 150;
      customFrames.height = 330;
      marginBottomText.marginBottom = 40;
      logoMarginTop.marginTop = 5;
    }

    let margin_bottom = Platform.OS == "ios" ? 10 : -20;

    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          flexDirection: "column"
        }}
      >
        <ImageBackground
          source={require("../images/Group11.png")}
          style={{ width: width, flex: 0.55, overflow: "visible" }}
        >
          <LinearGradient
            style={styles.swipePageContainer}
            colors={[
              constants.colors1[0] + "CC",
              constants.colors[0] + "CC",
              constants.colors1[1] + "CC",
              constants.colors[1] + "CC",
              constants.colors1[2] + "CC",
              "#0009"
            ]}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Swiper
                height={height / 2}
                loop={true}
                autoplay={true}
                autoplayTimeout={500}
                showsButtons={true}
                nextButton={
                  <View
                    style={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                      borderRadius: 100,
                      height: 40,
                      width: 40,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Icon
                      style={{ backgroundColor: "transparent" }}
                      name={"chevron-thin-right"}
                      size={20}
                      color={"#3f3f3f"}
                    />
                  </View>
                }
                prevButton={
                  <View
                    style={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                      borderRadius: 100,
                      height: 40,
                      width: 40,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Icon
                      style={{ backgroundColor: "transparent" }}
                      name={"chevron-thin-left"}
                      size={20}
                      color={"#3f3f3f"}
                    />
                  </View>
                }
                dot={<View />}
                activeDot={<View />}
              >
                <View style={[styles.swipePageContainer, {}]}>
                  <View
                    style={[
                      {
                        justifyContent: "center",
                        alignItems: "center"
                      },
                      logoMarginTop
                    ]}
                  >
                    <GameTagIcon
                      name="fuck"
                      color="#ffffff"
                      style={{ fontSize: 80, marginBottom: margin_bottom }}
                    />
                    <GameTagIcon
                      name="marry"
                      color="#ffffff"
                      style={{ fontSize: 80 }}
                    />
                    <GameTagIcon
                      name="kill"
                      color="#ffffff"
                      style={{ fontSize: 80 }}
                    />
                    <Text
                      style={[
                        styles.swipePageText,
                        {
                          fontFamily: "Montserrat-Light",
                          margin: 14,
                          fontSize: 10
                        }
                      ]}
                    >
                      {I18n.t("app.login.swipePage0Text")}
                    </Text>
                  </View>
                </View>
                <View style={styles.swipePageContainer}>
                  <View style={styles.swipePageTextContainer}>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage3Text0")}
                    </Text>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage3Text1")}
                    </Text>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage3Text2")}
                    </Text>
                  </View>
                  {/* {this.state.isiOS &&
                    <Image style={[{ height: 330, width: 150 }, customFrames]} source={{uri: 'https://app.playfmk.com/images/Screenmobilematch@1x.png'}} />
                  } */}
                  {!this.state.isiOS && (
                    <Image
                      style={[{ height: height / 2.75 }, customFrames]}
                      resizeMode="contain"
                      source={require("../images/Screenmobilematch.png")}
                    />
                  )}
                </View>
                <View style={styles.swipePageContainer}>
                  <View style={styles.swipePageTextContainer}>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage4Text0")}
                    </Text>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage4Text1")}
                    </Text>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage4Text2")}
                    </Text>
                  </View>
                  {this.state.isiOS && (
                    <Image
                      style={[{ height: height / 2.75 }, customFrames]}
                      resizeMode="contain"
                      source={require("../images/ios_Screenmobilechat.png")}
                    />
                  )}
                  {!this.state.isiOS && (
                    <Image
                      style={[{ height: height / 2.75 }, customFrames]}
                      resizeMode="contain"
                      source={require("../images/android_Screenmobilechat.png")}
                    />
                  )}
                </View>
                <View style={[styles.swipePageContainer]}>
                  <View
                    style={[styles.swipePageTextContainer, { marginTop: 0 }]}
                  >
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage1Text0")}
                    </Text>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage1Text1")}
                    </Text>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage1Text2")}
                    </Text>
                  </View>
                  {this.state.isiOS && (
                    <Image
                      style={[{ height: height / 2.75 }, customFrames]}
                      resizeMode="contain"
                      source={require("../images/ios_Screenmobilegame.png")}
                    />
                  )}
                  {!this.state.isiOS && (
                    <Image
                      style={[{ height: height / 2.75 }, customFrames]}
                      resizeMode="contain"
                      source={require("../images/android_Screenmobilegame.png")}
                    />
                  )}
                </View>
                <View style={[styles.swipePageContainer]}>
                  <View
                    style={[styles.swipePageTextContainer, { marginTop: 0 }]}
                  >
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage2Text0")}
                    </Text>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage2Text1")}
                    </Text>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage2Text2")}
                    </Text>
                  </View>
                  {this.state.isiOS && (
                    <Image
                      style={[{ height: height / 2.75 }, customFrames]}
                      resizeMode="contain"
                      source={require("../images/ios_Screenmobilegame.png")}
                    />
                  )}
                  {!this.state.isiOS && (
                    <Image
                      style={[{ height: height / 2.75 }, customFrames]}
                      resizeMode="contain"
                      source={require("../images/android_Screenmobilegame.png")}
                    />
                  )}
                </View>

                <View style={styles.swipePageContainer}>
                  <View style={styles.swipePageTextContainer}>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage5Text0")}
                    </Text>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage5Text1")}
                    </Text>
                    <Text style={[styles.swipePageText, { fontSize: 15 }]}>
                      {I18n.t("app.login.swipePage5Text2")}
                    </Text>
                  </View>
                  {this.state.isiOS && (
                    <Image
                      style={[{ height: height / 2.75 }, customFrames]}
                      resizeMode="contain"
                      source={require("../images/ios_Screenmobileperfil.png")}
                    />
                  )}
                  {!this.state.isiOS && (
                    <Image
                      style={[{ height: height / 2.75 }, customFrames]}
                      resizeMode="contain"
                      source={require("../images/android_Screenmobileperfil.png")}
                    />
                  )}
                </View>
              </Swiper>
            </View>
          </LinearGradient>
          </ImageBackground>
        <View
          style={{ flex: 0.45, justifyContent: "center", alignItems: "center" }}
        >
          <CustomLoginButton marginBottomText={marginBottomText} />
          {/* <InstagramCustomLoginButton marginBottomText={marginBottomText} /> */}
          <EmailLoginButton marginBottomText={marginBottomText} />
          <Text
            style={{
              textAlign: "center",
              marginTop: 5,
              marginHorizontal: 15,
              fontSize: 13
            }}
          >
            {I18n.t("app.login.loginPageText")}
          </Text>
          <Text
            style={{ textAlign: "center", marginHorizontal: 15, fontSize: 13 }}
          >
            Let's have fun! 😃
          </Text>
        </View>
      </View>
    );
  }
}
