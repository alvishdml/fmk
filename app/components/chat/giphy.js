import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../utilities/Constants';

var API_KEY = '&api_key=kIXQGCpwjiaFa';
var API_GIPHY_URL = 'https://api.giphy.com/v1/gifs'
var API_LIMIT = '&limit=30'

var menuElems = ['Random', 'Trending'];

export default class giphy extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            search: 'random',
        }
        this.renderImage = this.renderImage.bind(this);
        this.searchGIF = this.searchGIF.bind(this);
    }

    componentDidMount() {
        this.updateGifs(this.state.search);
        this.props.chat.setState({giphyComponent: this});
    }

    searchGIF(value){
        this.setState({search: value});
        this.updateGifs(value);
    }

    renderImage(image) {
        var imageUrl = image.images.fixed_height.url;
        var imageWidth = parseInt(image.images.fixed_height.width);
        return (
            <View renderToHardwareTextureAndroid={true}>
                <TouchableOpacity style={[styles.row, {marginLeft: 2, marginRight:2, width: imageWidth/2, height: 100, justifyContent: 'flex-start' }]} onPress={() => {this.props.sendGiphy.onSend(imageUrl, true)}}>
                    <Image
                        style={{width: imageWidth/2, height: 100}}
                        source={{ uri: imageUrl }}>
                    </Image>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let constants = new Constants();
        return (
            <View style={[styles.container, {backgroundColor:'#fff', alignItems: 'flex-start'}]}>
                <Image source={require('../../../images/powered_by_giphy.png')} style={{ width: 100, height: 10, flex: 1, position:'absolute', bottom: 5, right: 5 }} />
                <ListView
                    horizontal={true}
                    contentContainerStyle={styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderImage}
                    keyboardShouldPersistTaps="always"
                    />
            </View>
        );
    }

    updateList(list) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list.data)
        });
    }

    updateGifs(query) {
        var url = '';
        if (query === '/trending') {
            url = API_GIPHY_URL + endpoint + API_LIMIT + API_KEY;
        } else {
            var offset = '&offset=10' + Math.floor(Math.random() * (10 - 0 + 1));
            url = API_GIPHY_URL + '/search?q=' + query + API_LIMIT + API_KEY + offset;
        }
        fetch(url)
        .then((res) => {
            this.updateList(JSON.parse(res._bodyInit));
        }).catch((err) => {});
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    menuText: {
        marginLeft: 25,
        color: '#fff'
    },
});
