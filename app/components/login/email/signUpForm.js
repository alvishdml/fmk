import React, { Component } from "react";
import I18n from "../../../../config/i18n";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  AsyncStorage,
  TouchableHighlight,
  TextInput,
  AppRegistry,
  TouchableWithoutFeedback,
  StyleSheet,
  Switch,
  Linking,
  Image,
  ActivityIndicator,
  NativeModules
} from "react-native";
import DateTimePicker  from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
// import {DateTimePicker} from "react-native-ui-lib";
import { Actions, ActionConst } from "react-native-router-flux";
import Meteor, { Accounts } from "@meteorrn/core";
import styles from "../../../styles/styles";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { trackScreen, trackEvent } from "../../../utilities/Analytics";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Constants from "../../../utilities/Constants";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;
const buttonSizeHeight = height / 13;

const AppInstallSource = NativeModules.AppInstallSource;

const instaLoginStyle = StyleSheet.create({
  isGenderButtonNotPressed: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e5e5"
  },
  isGenderButtonPressed: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f77235"
  },
  smallMarginRight: {
    marginRight: 5
  },
  smallMarginLeft: {
    marginRight: 5
  },

  startPlayButtonAvailable: {
    height: buttonSizeHeight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f77235",
    marginBottom: 10
  },

  startPlayButtonUnavailable: {
    height: buttonSizeHeight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#aaa",
    marginBottom: 10
  },

  closeButton: {
    width: 30,
    height: 30,
    top: 30,
    right: 30,
    position: "absolute",
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100
  }
});

const now = new Date();

export default class EmailSignUp extends Component {
  constructor(props) {
    super(props);

    // TEST DATA
    // this.state = {
    //   email: props.navigationState.email || "test@playfmk.com",
    //   name: "Test User",
    //   password: props.navigationState.password || "test",
    //   gender: "male",
    //   over18: true,
    //   interestedInMale: false,
    //   interestedInFemale: true,
    //   termsAgree: true,
    //   startPlay: true,
    //   dateSelected: new Date("January 8 1992"),
    //   age: 27,
    //   userPicture: null
    // };
    this.state = {
      email: props.email || null,
      name: null,
      password: props.password || null,
      gender: null,
      over18: undefined,
      interestedInMale: false,
      interestedInFemale: false,
      termsAgree: false,
      startPlay: false,
      dateSelected: new Date(),
      age: null,
      userPicture: null,
      showDatePicker: false
    };
    this.femalePress = this.femalePress.bind(this);
    this.malePress = this.malePress.bind(this);
    this.interestedInFemale = this.interestedInFemale.bind(this);
    this.interestedInMale = this.interestedInMale.bind(this);
    this.termsValue = this.termsValue.bind(this);
    this.updatePlay = this.updatePlay.bind(this);
    this.choosePicture = this.choosePicture.bind(this);
    this.registerEmail = this.registerEmail.bind(this);
    this.autoLogin = this.autoLogin.bind(this);
  }

  componentDidMount() {
    trackScreen("Email_SignUp_Screen");
  }

  isValidEmail() {
    const { email } = this.state;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(
      String(email)
        .toLowerCase()
        .trim()
    );
  }

  updatePlay() {
    var startplay =
      this.state.name &&
      this.isValidEmail() &&
      this.state.password &&
      this.state.over18 &&
      this.state.gender &&
      (this.state.interestedInFemale || this.state.interestedInMale) &&
      this.state.termsAgree;
    this.setState({ startPlay: startplay });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.interestedInMale != this.state.interestedInMale ||
      prevState.interestedInFemale != this.state.interestedInFemale ||
      prevState.termsAgree != this.state.termsAgree
    ) {
      this.updatePlay();
    }
  }

  interestedInFemale() {
    this.setState({ interestedInFemale: !this.state.interestedInFemale });
  }

  interestedInMale() {
    this.setState({ interestedInMale: !this.state.interestedInMale });
  }

  malePress() {
    this.setState({ gender: "male" });
    this.updatePlay();
  }

  femalePress() {
    this.setState({ gender: "female" });
    this.updatePlay();
  }

  termsValue(value) {
    this.setState({ termsAgree: !this.state.termsAgree });
  }

  showPicker = async (event, date) => {
    try {
      // const { action, year, month, day } = await DateTimePickerAndroid.open({
      //   // Use `new Date()` for current date.
      //   // May 25 2020. Month 0 is January.
      //   date: this.state.dateSelected ? this.state.dateSelected : now,
      //   maxDate: now,
      //   mode: "spinner"
      // });
        // Selected year, month (0-11), day
        // var dateborn = new Date(year, month, day);
        var age = now.getFullYear() - date.getFullYear();
        if (age == 18 && month <= now.getMonth()) {
          //console.log( now.getFullYear() - year );
          this.setState({ over18: true });
          this.updatePlay();
        } else if (now.getFullYear() - date.getFullYear() > 18) {
          this.setState({ over18: true });
          this.updatePlay();
        } else {
          this.setState({ over18: false });
          this.updatePlay();
        }
        this.setState({
          dateSelected: date,
          age: age,
          showDatePicker: false,
        });

    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  choosePicture() {
    const options = {
      title: "Select Photo",
      storageOptions: {
        skipBackup: true,
        path: "images"
      },
      quality: 0.9,
      maxWidth: 800,
      maxHeight: 800
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    launchImageLibrary(options, response => {
      console.log(response, 'lllllll');
      if (response.didCancel) {
        trackEvent("Email_SignUp", "Custom_photo_cancel");
      } else if (response.error) {
        trackEvent("Email_SignUp", "Custom_photo_error");
      } else {
        const source = { uri: response.assets[0].uri };
        this.setState({ userPicture: source.uri }, () => {
          if (this.state.missingPhoto) {
            this.registerEmail();
          }
        });
      }
    });
  }

  autoLogin() {
    const { email, password } = this.state;
    Meteor.loginWithPassword(email.toLowerCase().trim(), password, (err) => {
      if (!err) {
        this.setState({ registering: false }, () => {
          Actions.mainPage({
            idUser: Meteor.user()._id,
            initialPage: 1,
            type: ActionConst.RESET
          });
        });
      } else {
        setTimeout(() => {
          this.autoLogin();
        }, 1000);
      }
    });
  }

  registerEmail() {
    const {
      userPicture,
      name,
      email,
      password,
      gender,
      interestedInMale,
      interestedInFemale,
      dateSelected,
      age,
      registering
    } = this.state;

    if (!userPicture && !this.state.missingPhoto) {
      trackEvent("Email_SignUp", "Missing photo alert");
      this.setState({ missingPhoto: true });
      return;
    }

    if (!registering) {
      trackEvent("Email_SignUp", "Try Register");
      this.setState({ registering: true, missingPhoto: false }, async () => {
        let interested_in = interestedInMale ? "male" : "female";
        if (interestedInMale && interestedInFemale) {
          interested_in = "both";
        }
        const birthday = `${dateSelected.getMonth() +
          1}/${dateSelected.getDate()}/${dateSelected.getFullYear()}`;
        const installSource = null //await AppInstallSource.installSource();
        Accounts.createUser(
          {
            email: email.toLowerCase().trim(),
            password,
            name: name.trim(),
            custom_picture: userPicture,
            gender,
            interested_in,
            birthday,
            age,
            origin: installSource
          },
          err => {
            if (!err) {
              trackEvent("Email_SignUp", "Register Success");
              trackEvent('Sign_up', 'Sign_up_email');
              this.autoLogin();
            } else {
              trackEvent("Email_SignUp", "Register Error");
              if (err.reason === "Email already exists.") {
                this.setState({ registering: false, error: true });
              } else {
                this.setState({ registering: false, error: true });
              }
            }
          }
        );
      });
    }
  }

  render() {
    const CONSTANTS = new Constants();
    return (
      <LinearGradient style={{ flex: 1 }} colors={["#fafafa", "#ececec"]}>
        <TouchableOpacity
          style={instaLoginStyle.closeButton}
          onPress={() => {
            Actions.login({});
          }}
        >
          <Icon
            style={{ backgroundColor: "transparent" }}
            name={"close"}
            size={20}
            color={"#fff"}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginLeft: 50,
            marginRight: 50,
            backgroundColor: "transparent"
          }}
        >
          <View
            style={{
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 0
            }}
          >
            <TouchableOpacity
              onPress={this.choosePicture}
              style={{
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {this.state.userPicture ? (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Image
                      source={{ uri: this.state.userPicture }}
                      style={{
                        width: 75,
                        height: 75,
                        borderRadius: 75
                      }}
                    />
                    <Text style={{ color: "#000" }}>
                      {/* {I18n.t(
                    "app.components.login.InstagramOnBoarding.signInInstagram"
                  )} */}
                      Change your photo
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <FontAwesomeIcon
                      style={{
                        backgroundColor: "transparent"
                      }}
                      name={"user-circle"}
                      size={70}
                      color={"#f77235"}
                    />
                    <Text
                      style={{
                        color: "#000",
                        fontSize: 12
                      }}
                    >
                      {/* {I18n.t(
                    "app.components.login.InstagramOnBoarding.signInInstagram"
                  )} */}
                      Upload your photo
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: "#5c5c5c",
              fontSize: 12
            }}
          >
            NAME:
          </Text>
          <TextInput
            autoComplete="username"
            style={{ height: buttonSizeHeight / 1.4 }}
            onChangeText={name =>
              this.setState({ name }, () => this.updatePlay())
            }
            value={this.state.name}
          />
          <Text
            style={{
              color: "#5c5c5c",
              fontSize: 12,
              marginTop: 5
            }}
          >
            EMAIL:
          </Text>
          <TextInput
            style={{ height: buttonSizeHeight / 1.4 }}
            autoComplete="email"
            onChangeText={email =>
              this.setState({ email }, () => this.updatePlay())
            }
            value={this.state.email}
          />
          {this.state.errorUserExists && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                textAlign: "right",
                alignSelf: "flex-end"
              }}
            >
              This email already exists, please sign in
            </Text>
          )}
          <Text
            style={{
              color: "#5c5c5c",
              fontSize: 12,
              marginTop: 5
            }}
          >
            PASSWORD:
          </Text>
          <TextInput
            secureTextEntry
            style={{ height: buttonSizeHeight / 1.4 }}
            onChangeText={password =>
              this.setState({ password }, () => this.updatePlay())
            }
            value={this.state.password}
          />
          <Text
            style={{
              color: "#5c5c5c",
              marginBottom: 5,
              fontSize: 12
            }}
          >
            {I18n.t("app.components.login.InstagramOnBoarding.date")}
          </Text>
          <View
            style={{
              height: buttonSizeHeight,
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
             {this.state.showDatePicker && <DateTimePicker
                  value={this.state.dateSelected}
                  mode={'date'}
                  display={'spinner'}
                  onChange={this.showPicker}
                  onC
              /> }
            <TouchableOpacity
              onPress={() => this.setState({showDatePicker: true})}
              style={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#e5e5e5"
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {this.state.dateSelected
                  ? this.state.dateSelected.getMonth() +
                    1 +
                    "/" +
                    this.state.dateSelected.getFullYear()
                  : "MM/YYY"}
              </Text>
            </TouchableOpacity>
            {/* {!this.state.over18 && this.state.over18 != undefined && (
              <Icon
                style={{ marginVertical: 22, backgroundColor: "transparent" }}
                name={"close"}
                size={25}
                color={"#ff0000"}
              />
            )}
            {this.state.over18 && (
              <Icon
                style={{ marginVertical: 22, backgroundColor: "transparent" }}
                name={"check"}
                size={25}
                color={"#00d85b"}
              />
            )} */}
          </View>

          {!this.state.over18 && this.state.over18 != undefined && (
            <Text
              style={{
                fontSize: 10,
                fontWeight: "600",
                color: "red",
                alignSelf: "flex-end"
              }}
            >
              {I18n.t("app.components.login.InstagramOnBoarding.atLeast18")}
            </Text>
          )}
          <Text
            style={{
              color: "#5c5c5c",
              marginTop: 5,
              marginBottom: 5,
              fontSize: 12
            }}
          >
            {I18n.t("app.components.login.InstagramOnBoarding.myGender")}
          </Text>

          <View
            style={{
              height: buttonSizeHeight,
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.malePress}
              style={[
                instaLoginStyle.smallMarginRight,
                this.state.gender == "male"
                  ? instaLoginStyle.isGenderButtonPressed
                  : instaLoginStyle.isGenderButtonNotPressed
              ]}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: this.state.gender == "male" ? "#fff" : "#5c5c5c"
                }}
              >
                {I18n.t("app.components.login.InstagramOnBoarding.male")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={this.femalePress}
              style={[
                instaLoginStyle.smallMarginLeft,
                this.state.gender == "female"
                  ? instaLoginStyle.isGenderButtonPressed
                  : instaLoginStyle.isGenderButtonNotPressed
              ]}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: this.state.gender == "female" ? "#fff" : "#5c5c5c"
                }}
              >
                {I18n.t("app.components.login.InstagramOnBoarding.female")}
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: "#5c5c5c",
              marginTop: 5,
              marginBottom: 5,
              fontSize: 12
            }}
          >
            {I18n.t("app.components.login.InstagramOnBoarding.interested")}
          </Text>

          <View
            style={{
              height: buttonSizeHeight,
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.interestedInMale}
              style={[
                instaLoginStyle.smallMarginRight,
                this.state.interestedInMale
                  ? instaLoginStyle.isGenderButtonPressed
                  : instaLoginStyle.isGenderButtonNotPressed
              ]}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: this.state.interestedInMale ? "#fff" : "#5c5c5c"
                }}
              >
                {I18n.t("app.components.login.InstagramOnBoarding.male")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={this.interestedInFemale}
              style={[
                instaLoginStyle.smallMarginLeft,
                this.state.interestedInFemale
                  ? instaLoginStyle.isGenderButtonPressed
                  : instaLoginStyle.isGenderButtonNotPressed
              ]}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: this.state.interestedInFemale ? "#fff" : "#5c5c5c"
                }}
              >
                {I18n.t("app.components.login.InstagramOnBoarding.female")}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: buttonSizeHeight / 1.25,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Switch
              style={{ height: buttonSizeHeight }}
              onValueChange={value => this.termsValue(value)}
              value={this.state.termsAgree}
            />
            <Text style={{ fontSize: 12 }}>
              {I18n.t("app.components.login.InstagramOnBoarding.iAgree0")}{" "}
              <Text
                style={{ fontWeight: "bold", textDecorationLine: "underline" }}
                onPress={() => {
                  Linking.openURL("https://playfmk.com/terms.html");
                  trackEvent("Email_SignUp_Screen", "Click_Terms");
                }}
              >
                {I18n.t("app.components.login.InstagramOnBoarding.iAgree1")}
              </Text>
            </Text>
          </View>
          {this.state.error && (
            <Text
              style={{
                color: "red",
                marginTop: 5,
                fontSize: 12,
                textAlign: "center",
                alignSelf: "center"
              }}
            >
              Something went wrong. Please contact-us at hello@playfmk.com
            </Text>
          )}
          <TouchableOpacity
            onPress={this.registerEmail}
            style={
              this.state.startPlay && !this.state.registering
                ? instaLoginStyle.startPlayButtonAvailable
                : instaLoginStyle.startPlayButtonUnavailable
            }
            disabled={!this.state.startPlay && !this.state.registering}
          >
            {this.state.registering ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ fontWeight: "bold", color: "#fff" }}>
                {I18n.t(
                  "app.components.login.InstagramOnBoarding.startPlaying"
                )}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <Modal
          modalDidClose={() => {
            this.setState({ missingPhoto: false });
          }}
          offset={0}
          hideCloseButton={false}
          backdropType="blur"
          open={this.state.missingPhoto}
          containerStyle={{
            alignItems: "center"
          }}
          modalStyle={{
            padding: 0,
            width: width / 1.25,
            backgroundColor: "#3f3f3f"
          }}
        >
          <LinearGradient
            style={{
              flexGrow: 1,
              padding: 20,
              borderRadius: 5
            }}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={[
              CONSTANTS.colors1[0],
              CONSTANTS.colors[0],
              CONSTANTS.colors1[1],
              CONSTANTS.colors[1],
              CONSTANTS.colors1[2]
            ]}
          >
            <View
              style={{
                flexGrow: 1,
                justifyContent: "space-around"
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 30
                }}
              >
                NO PICTURE SELECTED
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 15,
                  marginBottom: 40,
                  lineHeight: 25
                }}
              >
                For the best experience it's recommended that you add a photo to
                your profile. This will increase the chances of getting matches.
              </Text>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <TouchableOpacity
                  onPress={this.choosePicture}
                  style={{
                    justifyContent: "center",
                    paddingLeft: 30,
                    paddingRight: 30,
                    paddingTop: 10,
                    paddingBottom: 10,
                    marginBottom: 15,
                    backgroundColor: "#fafafa",
                    borderRadius: 4
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "#151515"
                    }}
                  >
                    CHOOSE PHOTO
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.registerEmail}
                  style={{
                    justifyContent: "center",
                    padding: 5
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: "center",
                      color: "#fff"
                    }}
                  >
                    CONTINUE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Modal>
      </LinearGradient>
    );
  }
}
