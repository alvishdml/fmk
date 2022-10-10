export default class Alert {

    static setAlert(alert) {
        this.alert = alert;
    }

    static showAlert(titulo, conteudo, tipo, param, matchId, gameView) {
        if (this.alert) {
            this.alert.showModal(titulo, conteudo, tipo, param, matchId, gameView);
        }
    }
}

Alert.alert = 'cenas';
