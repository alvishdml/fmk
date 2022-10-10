import { Platform } from 'react-native';
const isiOS = Platform.OS == 'ios';

export default class NewMatchManager {

    constructor(gameScene) {
        this.ids = [];
        this.matchTypes = [];
        this.matchIds = [];
        this.count = 0;//numero de pessoas no array
        this.gameScene = gameScene
    }

    addUser(id, matchType, matchId) {
        if(!isiOS || matchType !== 'kill') { //so we don't show kill matches on iOS
            this.ids.push(id);
            this.matchTypes.push(matchType);
            this.matchIds.push(matchId);
            this.count++;
        }
    }

    nextUser(toChat) {
        if(this.count > 0 && !toChat) {
            this.count--;
            this.gameScene.newMatch(this.matchTypes[this.count], this.ids[this.count], this.matchIds[this.count], this);
        }
    }
}
