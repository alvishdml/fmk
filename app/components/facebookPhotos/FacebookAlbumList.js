import React, { Component } from "react";
import I18n from "../../../config/i18n";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from "react-native";
import ListView from 'deprecated-react-native-listview';
import { Actions } from "react-native-router-flux";
import Meteor from "@meteorrn/core";
import {launchImageLibrary} from "react-native-image-picker";
import styles from "../../styles/styles";
import FBPhotoHeader from "./FBPhotoHeader";
import { trackEvent } from "../../utilities/Analytics";
const FBSDK = require("react-native-fbsdk-next");
const { GraphRequest, GraphRequestManager, AccessToken } = FBSDK;

var key = 0;

export default class FacebookPhotos extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(["row 1", "row 2"]),
      hasPhotos: false,
      isLoading: true,
      instagramToken: null,
      facebookToken: null,
      length: 0
    };

    this.customPhoto = this.customPhoto.bind(this);
    this.instagramPhotos = this.instagramPhotos.bind(this);
    this.facebookPhotos = this.facebookPhotos.bind(this);
  }

  componentWillMount() {
    Meteor.call("getFacebookToken", Meteor.user()._id, (err, result) => {
      this.setState(
        {
          facebookToken: result
        },
        () => {
          this.getPhotos();
        }
      );
    });

    Meteor.call("getInstagramToken", Meteor.user()._id, (err, result) => {
      this.setState(
        {
          instagramToken: result
        },
        () => {
          this.getPhotos();
        }
      );
    });
  }

  getPhotos() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    let fbAlbuns = [];
    AccessToken.getCurrentAccessToken()
      .then(res => {
        // console.log(this.state.facebookToken);
        let token = res == null ? this.state.facebookToken : res.accessToken;
        // let token = this.state.facebookToken;
        const responseCallback = (error, result) => {
          // console.log(error,result,token);
          if (!error) {
            fbalbuns = result.data;
            if (result.data.length > 0) {
              fbAlbuns = result.data;
              this.setState({
                dataSource: ds.cloneWithRows(result.data),
                hasPhotos: true,
                isLoading: false,
                length: result.data.length
              });

              if (this.state.instagramToken) {
                fbAlbuns.unshift({
                  name: "Instagram Photos",
                  type: "instagram"
                });
                this.setState({
                  dataSource: ds.cloneWithRows(fbAlbuns)
                });
              }

              fbAlbuns.unshift({ name: "Upload From Phone", type: "custom" });
              this.setState({ dataSource: ds.cloneWithRows(fbAlbuns) });
            } else {
              this.setState({
                isLoading: false
              });
            }
          } else {
            var fbAlbuns = [];
            if (this.state.instagramToken) {
              fbAlbuns.unshift({ name: "Instagram Photos", type: "instagram" });
              this.setState({
                dataSource: ds.cloneWithRows(fbAlbuns),
                hasPhotos: true,
                isLoading: false
              });
            }

            fbAlbuns.unshift({ name: "Upload From Phone", type: "custom" });
            this.setState({
              dataSource: ds.cloneWithRows(fbAlbuns),
              isLoading: false,
              hasPhotos: true
            });
          }
        };

        const profileRequest = new GraphRequest(
          "/me/albums",
          null,
          // { accessToken: token },
          responseCallback
        );

        // Start the graph request.
        new GraphRequestManager().addRequest(profileRequest).start();
      })
      .catch(error => {
        console.log(error);
      });
  }

  facebookPhotos(id) {
    trackEvent("Edit_Profile", "Click_album_fb");
    Actions.albumPage({
      idAlbum: id,
      profile: this.props.profile,
      addPhoto: this.props.photoList.bind(this)
    });
  }

  instagramPhotos() {
    trackEvent("Edit_Profile", "Click_album_insta");
    Actions.instagramAlbumPhotoPage({
      profile: this.props.profile,
      addPhoto: this.props.photoList.bind(this)
    });
  }

  customPhoto() {
    trackEvent("Edit_Profile", "Custom_photo_choose");
    // More info on all the options is below in the API Reference... just some common use cases shown here
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
      if (response.didCancel) {
        trackEvent("Edit_Profile", "Custom_photo_cancel");
      } else if (response.error) {
        trackEvent("Edit_Profile", "Custom_photo_error");
      } else {
        this.setState({ isLoading: true }, () => {
          const source = { uri: "data:image/jpeg;base64," + response.data };
          Meteor.call(
            "saveCustomPic",
            Meteor.user()._id,
            source.uri,
            (err, res) => {
              if (!err) {
                const { url } = res;
                const urlPhoto = `https://fmk-images.ams3.digitaloceanspaces.com/custompictures/${url}`;
                this.props.photoList({ uri: urlPhoto });
                Actions.confirmPhoto({
                  urlPhoto,
                  profile: this.props.profile,
                  toPop: 2,
                  new_photo: true
                });
                this.setState({ isLoading: false });
              }
            }
          );
        });
      }
    });
  }

  renderRow(rowData) {
    if (rowData.id) {
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center"
          }}
          elevation={5}
          onPress={() => {
            this.facebookPhotos(rowData.id);
          }}
        >
          <Text
            style={{
              color: "#aeb7b7",
              fontSize: 15,
              fontFamily: "Montserrat-Bold"
            }}
          >
            {rowData.name}
          </Text>
          <Image
            style={{ width: 25, height: 25, marginLeft: 10 }}
            source={require("../../../images/facebook.png")}
          />
        </TouchableOpacity>
      );
    } else if (rowData.type === "instagram") {
      return (
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          elevation={5}
          onPress={this.instagramPhotos}
        >
          <Text
            style={{
              color: "#aeb7b7",
              fontSize: 15,
              fontFamily: "Montserrat-Bold"
            }}
          >
            {rowData.name}
          </Text>
          <Image
            style={{ width: 25, height: 25, marginLeft: 10 }}
            source={require("../../../images/instagram.png")}
          />
        </TouchableOpacity>
      );
    } else if (rowData.type === "custom") {
      return (
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          elevation={5}
          onPress={this.customPhoto}
        >
          <Text
            style={{
              color: "#aeb7b7",
              fontSize: 15,
              fontFamily: "Montserrat-Bold"
            }}
          >
            {rowData.name}
          </Text>
          <View
            style={{
              width: 25,
              height: 25,
              marginLeft: 10,
              backgroundColor: "#404848",
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#fff", fontSize: 8, fontWeight: "900" }}>
              NEW
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderSeparator() {
    key++;
    return (
      <View style={{ flex: 1, alignItems: "center" }} key={key}>
        <View
          style={{
            backgroundColor: "#aeb7b7",
            width: 300,
            height: 1,
            margin: 10,
            marginLeft: 20,
            marginRight: 20
          }}
        />
      </View>
    );
  }

  render() {
    if (!this.state.isLoading) {
      if (this.state.hasPhotos) {
        return (
          <View style={[styles.container2, { backgroundColor: "#fff" }]}>
            <FBPhotoHeader titulo={"Albums"} />
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
              renderSeparator={this.renderSeparator}
              style={{ marginTop: 30 }}
            />
          </View>
        );
      } else {
        return (
          <View style={{ flexGrow: 1 }}>
            <FBPhotoHeader titulo={"Albums"} />
            <View
              style={[
                styles.loadingPageFix,
                { flex: 1, backgroundColor: "#fff" }
              ]}
            >
              <Text
                style={{
                  color: "#aeb7b7",
                  fontSize: 25,
                  fontFamily: "Montserrat-Bold"
                }}
              >
                {I18n.t(
                  "app.components.facebookPhotos.FacebookAlbumList.noPhotos"
                )}
              </Text>
              <Text
                style={{
                  color: "#aeb7b7",
                  fontSize: 13,
                  fontFamily: "Montserrat-Bold"
                }}
              >
                {I18n.t(
                  "app.components.facebookPhotos.FacebookAlbumList.reasons"
                )}
              </Text>
              <Text
                style={{
                  color: "#aeb7b7",
                  fontSize: 13,
                  fontFamily: "Montserrat-Bold"
                }}
              >
                {I18n.t(
                  "app.components.facebookPhotos.FacebookAlbumList.usePhoto"
                )}
              </Text>
            </View>
          </View>
        );
      }
    } else {
      return (
        <View>
          <FBPhotoHeader titulo={"Albums"} />
          <View
            style={[
              styles.loadingPageFix,
              { height: 480, backgroundColor: "#fff" }
            ]}
          >
            <ActivityIndicator
              animating={true}
              color={"#aeb7b7"}
              style={{ transform: [{ scale: 1.8 }] }}
              size="large"
            />
          </View>
        </View>
      );
    }
  }
}
