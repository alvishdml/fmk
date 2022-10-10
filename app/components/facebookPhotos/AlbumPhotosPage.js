import React, { Component } from "react";
import I18n from "../../../config/i18n";
import { Text, View, ActivityIndicator } from "react-native";
import ListView from 'deprecated-react-native-listview';
import styles from "../../styles/styles";
import FBPhotoHeader from "./FBPhotoHeader";
import PhotoComponent from "./PhotoComponent";
const FBSDK = require("react-native-fbsdk-next");
const { GraphRequest, GraphRequestManager, AccessToken } = FBSDK;

export default class AlbumPhotosPage extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      isLoading: true,
      dataSource: ds.cloneWithRows(["row 1", "row 2"]),
      hasPhotos: false
    };
  }

  componentDidMount() {
    this.getPhotos(this.props.idAlbum);
  }

  getPhotos(idAlbum) {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    AccessToken.getCurrentAccessToken().then(res => {
      if (res) {
        token = res;
        const responseCallback = (error, result) => {
          if (!error) {
            if (result.data.length > 0) {
              this.setState({
                isLoading: false,
                dataSource: ds.cloneWithRows(result.data),
                hasPhotos: true
              });
            } else {
              this.setState({
                isLoading: false
              });
            }
          }
        };

        const profileRequestParams = {
          fields: {
            string: "albums{name, photos{picture}}"
          }
        };

        const profileRequestConfig = {
          httpMethod: "GET",
          version: "v2.7",
          accessToken: token.accessToken
        };

        const profileRequest = new GraphRequest(
          `/${idAlbum}/photos`,
          null,
          responseCallback
        );

        // Start the graph request.
        new GraphRequestManager().addRequest(profileRequest).start();
      }
    });
  }

  renderRow(rowData) {
    return (
      <View style={[styles.item, { alignItems: "center" }]}>
        <PhotoComponent
          idPhoto={rowData.id}
          name={rowData.name}
          profile={this.props.profile}
          addPhoto={this.props.addPhoto.bind(this)}
        />
      </View>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <FBPhotoHeader titulo={"Photos"} />
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
    } else {
      if (this.state.hasPhotos) {
        return (
          <View style={[styles.container2, { backgroundColor: "#fff" }]}>
            <FBPhotoHeader titulo={"Photos"} />
            <ListView
              contentContainerStyle={styles.list}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
            />
          </View>
        );
      } else {
        return (
          <View style={{ flex: 1 }}>
            <FBPhotoHeader
              titulo={I18n.t(
                "app.components.facebookPhotos.AlbumPhotosPage.titulo"
              )}
            />
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
                  "app.components.facebookPhotos.AlbumPhotosPage.noPhotos"
                )}
              </Text>
              <Text
                style={{
                  color: "#aeb7b7",
                  fontSize: 25,
                  fontFamily: "Montserrat-Bold"
                }}
              >
                {I18n.t(
                  "app.components.facebookPhotos.AlbumPhotosPage.thisAlbum"
                )}
              </Text>
            </View>
          </View>
        );
      }
    }
  }
}
