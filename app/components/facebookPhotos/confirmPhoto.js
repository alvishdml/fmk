import React, { Component } from "react";
import I18n from "../../../config/i18n";
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  PanResponder,
  Animated,
  TextInput,
  Keyboard,
  BackAndroid,
  Image
} from "react-native";
import { Actions } from "react-native-router-flux";
import Constants from "../../utilities/Constants";
import Meteor from "@meteorrn/core";
import styles from "../../styles/styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ImageCrop } from "react-native-image-cropper";
import ImageResizer from "react-native-image-resizer";
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from "react-native-fs";
import CustomAlert from "../../utilities/Alert";
import Header from "./confirmPhotos/Header.js";
import Footer from "./confirmPhotos/Footer.js";
import Bio from "./confirmPhotos/Bio.js";
import PhotoSlide from "./confirmPhotos/PhotoSlide.js";
import { trackScreen, trackEvent } from "../../utilities/Analytics";

const BD = require("../../utilities/DAAsyncStorage");
const myBD = new BD();

const bios = "";
const randomBio = 1;
const placeholder = "";

export default class ConfirmPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      about: Meteor.user().profile.about,
      newBio: "",
      image: "",
      image2: "",
      offset: new Animated.ValueXY({ x: 0, y: 0 }),
      firstTime: props.firstTime,
      edit: false,
      currentPic: this.props.urlPhoto,
      newPhoto: false,
      key: Math.random(),
      mainPicIndex: 0,
      textColor: "black",
    };

    this.ref_photoCropperArea = React.createRef(null);
    this.ref_cropper = React.createRef(null);
  }

  componentDidMount() {
    trackScreen("Edit_Profile");
    //this._setMoveHandler();
    Meteor.call(
      "getIndex",
      Meteor.user()._id,
      function (err, res) {
        if (!err) {
          if (typeof this.setState === "function") {
            this.setState({ mainPicIndex: res, key: Math.random() });
          }
        }
      }.bind(this)
    );
  }

  UNSAFE_componentWillMount() {
    /* this._sliderResponder = PanResponder.create({

      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {

        this.state.offset.setOffset({ x: this.state.offset.x._value, y: this.state.offset.y._value });
        this.state.offset.setValue({ x: 0, y: 0 });

      },

      onPanResponderMove: Animated.event([null, { dy: this.state.offset.y }]),

      onPanResponderRelease: (e, { vx, vy }) => {
        // console.log('here');
        this.state.offset.flattenOffset();
        this._checkMoveHandler();
      }
    }); */
  }

  _checkMoveHandler() {
    if (this.ref_photoCropperArea) {
      this.ref_photoCropperArea.current._component.measure(
        (fx, fy, width, height, px, py) => {
          if (py > 210 || py < 10) {
            if (py > 210) {
              this.state.offset.setValue({ x: 0, y: 55 });
            } else {
              this.state.offset.setValue({ x: 0, y: -91 });
            }
          }
        }
      );
      var yposition = this.state.offset.y._value;
      myBD.criarItem("windowPosition", `${yposition}`, () => { });
    }
  }

  _setMoveHandler() {
    if (Meteor.user().profile.custom_picture_translateY) {
      let offset = Meteor.user().profile.custom_picture_translateY;
      myBD.buscarItem("windowPosition", windowPosition => {
        if (windowPosition) {
          this.state.offset.setValue({ x: 0, y: parseFloat(windowPosition) });
        } else {
          this.state.offset.setValue({ x: 0, y: 75 - offset });
        }
      });
    }
  }

  changePicture(photo, index) {
    this.setState({
      currentPic: photo,
      newPhoto: true,
      key: Math.random(),
      mainPicIndex: index
    });
    // console.log(index);
  }

  capture() {
    if (
      this.props.new_photo ||
      this.state.newPhoto ||
      (this.props.firstTime && !Meteor.user().profile.picture_silhouette)
    ) {
      /* if(this.refs && this.refs['photoCropperArea']){
        this.refs['photoCropperArea']._component.measure((fx, fy, width, height, px, py) => {
          let translateY = Dimensions.get('window').width - 60 - py;
          if (translateY > 150) {
            translateY = 150;
          } else if (translateY < 30) {
            translateY = 10;
          }

          if (py !== 0) {
            trackEvent('Change Photo', 'Crop');
          }

          //Meteor.call('savePhotoTranslationY', Meteor.user()._id, 60);
        });
      } */

      RNFetchBlob.config({
          // add this option that makes response data to be stored as a file,
          // this is much more performant.
          fileCache : true,
        })
        .fetch('GET', this.state.currentPic, {})
        .then( res => {

          let path = res.path();
          // let base64 = res.base64()

          let resizedImage = "";
          //console.log('crop');
          ImageResizer.createResizedImage(path, 480, 480, "JPEG", 70)
            .then(response => {
              //resizeImageUri is the URI of the new image that can now be displayed, uploaded...
              //console.log(resizedImageUri);
              // var img = (resizedImageUri.replace('file:/', ''));
              let img = response.uri;
              trackEvent("Edit_Profile", "Choose_photo");
              RNFS.readFile(img, "base64").then(file => {
                resizedImage = "data:image/png;base64," + file;

                Meteor.call(
                  "saveCroppedPhoto",
                  Meteor.user()._id,
                  resizedImage
                );

                if (this.state.newBio) {
                  Meteor.call(
                    "changeUserAbout",
                    Meteor.user()._id,
                    this.state.newBio
                  );
                }

                Actions.mainPage({ editProfile: true });
                if (this.state.newBio != Meteor.user().profile.Bio) {
                  this.props.profile.changeAbout(this.state.newBio);
                }
                this.props.profile.changePicture(resizedImage);
              });
            })
            .catch(err => {
              // Oops, something went wrong. Check that the filename is correct and
              // inspect err to get more details.
              console.log('error = ', err)

              trackEvent("Edit_Profile", "Error");
              Actions.mainPage({ editProfile: true });
              return Alert.alert(
                "Unable to resize the photo",
                "Try again later"
              );
            });
        })
        .catch( (errorMessage, statusCode) => {
          console.log(errorMessage);
          trackEvent("Edit_Profile", "Error");
        } )
        
    }
    else {
      Actions.mainPage({ editProfile: true });
    }

      // if (this.ref_cropper) {
      //   this.ref_cropper.current.crop().then(base64 => {
      //   });
      // }
      // } else {
      //   if (this.ref_photoCropperArea) {
      //     this.ref_photoCropperArea.current._component.measure(
      //       (fx, fy, width, height, px, py) => {
      //         let translateY = Dimensions.get("window").width - 60 - py;
      //         if (translateY > 150) {
      //           translateY = 150;
      //         } else if (translateY < 75) {
      //           translateY = translateY - 10;
      //           if (translateY < 0) {
      //             translateY = 0;
      //           }
      //         }
      //         if (py !== 0) {
      //           //trackEvent('Change Photo', 'Crop');
      //         }
      //         //Meteor.call('savePhotoTranslationY', Meteor.user()._id, 60);

      //         if (this.state.newBio) {
      //           Meteor.call(
      //             "changeUserAbout",
      //             Meteor.user()._id,
      //             this.state.newBio
      //           );
      //         }
      //         if (this.state.newBio != Meteor.user().profile.Bio) {
      //           this.props.profile.changeAbout(this.state.newBio);
      //         }

      //         this.setState = {
      //           edit: true
      //         };
      //         Actions.mainPage({ editProfile: true, newBio: this.state.newBio });
      //       }
      //     );
      //   }
      // }
  }

  _keyboardDidShow() {
    this.setState({ textColor: "white" });
  }

  _keyboardDidHide() { }

  render() {
    let limitedWidth = Dimensions.get("window").width;
    let desiredHeightOverlay = (Dimensions.get("window").height - 40) / 3;
    let heightOverlayMasks = (limitedWidth - desiredHeightOverlay) / 2;

    // Calculate the x and y transform from the pan value
    let [translateY] = [this.state.offset.y];
    // Calculate the transform property and set it as a value for our style which we add below to the Animated.View component
    let imageStyle = { transform: [{ translateY }] };
    return (
      <View style={[styles.container2, { backgroundColor: "#fff" }]}>
        <Header
          currentPic={this.state.currentPic}
          index={this.state.mainPicIndex}
          urlPhoto={this.state.currentPic}
          profile={this.props.profile}
          confirmPage={this}
          toPop={this.props.toPop}
          firstTime={false} //{this.state.firstTime}
        />
        <View
          style={{ flex: 1, backgroundColor: "#fff", alignItems: "center" }}
        >
          {/* {!this.state.edit && this.state.currentPic && (
            <ImageCrop
              ref={this.ref_cropper}
              image={this.state.currentPic}
              cropHeight={limitedWidth}
              cropWidth={limitedWidth}
              zoom={0}
              maxZoom={100}
              minZoom={0}
              panToMove={true}
              pinchToZoom={true}
              quality={1.0}
              key={Math.random()}
            />
          )} */}
          {!this.state.edit && this.state.currentPic && (
            <Image
              source={{ uri: this.state.currentPic }}
              style={{ width: limitedWidth, height: limitedWidth }}
            />
          )}

          {!this.state.edit && !this.state.currentPic && (
            <Image
              source={{ uri: this.props.urlPhoto }}
              style={{ width: limitedWidth, height: limitedWidth }}
            />
          )}
          {/* <Animated.View
            pointerEvents={"box-none"}
            style={[
              imageStyle,
              {
                position: "absolute",
                bottom: Dimensions.get("window").height - 180,
                left: 0,
                backgroundColor: "transparent",
                width: limitedWidth,
                height: heightOverlayMasks + 500,
                borderBottomWidth: 5,
                borderBottomColor: "rgba(255,255,255,1)",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-end"
              }
            ]}
          >
            <View
              style={{
                backgroundColor: "black",
                position: "absolute",
                bottom: 0,
                height: Dimensions.get("window").height,
                opacity: 0.6,
                width: Dimensions.get("window").width
              }}
            />
            <Text
              style={{
                width: Dimensions.get("window").width,
                textAlign: "left",
                marginTop: 0,
                paddingTop: 5,
                position: "absolute",
                bottom: 0,
                backgroundColor: "transparent",
                marginLeft: -5
              }}
            >
              {" "}
              <Text
                style={{
                  backgroundColor: "rgba(255,255,255,1)",
                  marginLeft: -10,
                  fontFamily: "Montserrat-Regular",
                  fontSize: 15,
                  fontWeight: "bold",
                  color: this.state.textColor
                }}
              >
                {I18n.t(
                  "app.components.facebookPhotos.confirmPhoto.profilePicture"
                )}{" "}
              </Text>
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              imageStyle,
              {
                position: "absolute",
                top: limitedWidth - heightOverlayMasks - 215,
                left: 0,
                backgroundColor: "transparent",
                width: limitedWidth,
                height: 5,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-end"
              }
            ]}
            pointerEvents={"auto"}
            ref={this.ref_photoCropperArea}
          />
          <Animated.View
            pointerEvents={"box-none"}
            style={[
              imageStyle,
              {
                position: "absolute",
                top: limitedWidth - heightOverlayMasks - 20,
                left: 0,
                backgroundColor: "transparent",
                width: limitedWidth,
                height: 800,
                borderTopWidth: 5,
                borderTopColor: "rgba(255,255,255,1)",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-end"
              }
            ]}
          >
            <View
              style={{
                backgroundColor: "black",
                position: "absolute",
                height: Dimensions.get("window").height,
                opacity: 0.6,
                width: Dimensions.get("window").width
              }}
            />
            <View>
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  color: this.state.textColor,
                  fontSize: 15,
                  fontWeight: "bold",
                  backgroundColor: "rgba(255,255,255,1)",
                  paddingRight: 2,
                  paddingLeft: 2,
                  paddingBottom: 2
                }}
              >
                {" "}
                {I18n.t(
                  "app.components.facebookPhotos.confirmPhoto.otherSeeYou"
                )}{" "}
              </Text>
            </View>
          </Animated.View> */}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
              width: Dimensions.get("window").width
            }}
          >
            <PhotoSlide
              firstTime={this.state.firstTime}
              changePicture={this.changePicture.bind(this)}
              currentPic={this.state.currentPic}
              mainPicIndex={this.state.mainPicIndex}
              profile={this.props.profile}
            />
            <Bio confirmPage={this} />
          </View>
        </View>
      </View>
    );
  }
}
