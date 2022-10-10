import React, { Component } from "react";
import I18n from "../../../../config/i18n";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  PixelRatio
} from "react-native";
import { Actions } from "react-native-router-flux";
import styles from "../../../styles/styles";
import _ from "lodash";
import Icon from "react-native-vector-icons/FontAwesome";
import { trackEvent } from "../../../utilities/Analytics";

const BD = require("../../../utilities/DAAsyncStorage");
const myBD = new BD();
const USER_TOKEN_KEY = "user_token";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const DPI = PixelRatio.get();
const APP_VERSION = "1.1.10";
const ONE_SIGNAL_TAGS = [
  "name",
  "first_name",
  "last_name",
  "birthday",
  "picture",
  "gender"
];

export class EmailLoginButton extends Component {
  constructor(props) {
    super(props);
    let screenSize = WIDTH * DPI;
    let small = false;
    if (screenSize <= 480) {
      small = true;
    }
    this.state = {
      small: small
    };
  }

  goToForm() {
    trackEvent("Email_SignIn", "Sign In Button");
    Actions.emailSignInForm();
  }

  render() {
    let customFontText = {};
    let customButtonSize = {};

    if (this.state.small) {
      customFontText.fontSize = 12;
      customButtonSize.width = 230;
      customButtonSize.height = 45;
    }

    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: 280,
            marginTop: 10,
            marginBottom: 10
          }}
        >
          <Text
            style={[
              {
                fontFamily: "Montserrat-Light",
                color: "black",
                backgroundColor: "transparent",
                fontSize: 12,
                margin: 0
              }
            ]}
          >
            OR
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.4}
          style={[
            styles.emailButton,
            customButtonSize,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignContent: 'center'
            }
          ]}
          onPress={this.goToForm}
        >
          <Icon
            style={{ backgroundColor: "transparent" }}
            name={"envelope"}
            size={18}
            color={"#fff"}
          />
          <Text
            style={[
              {
                fontFamily: "Montserrat-Light",
                color: "white",
                backgroundColor: "transparent",
                fontSize: 12,
                margin: 0,
                marginLeft: 10
              }
            ]}
          >
            Sign in with Email
            {/* {I18n.t("app.components.login.CustomLoginButton.signEmail")} */}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
