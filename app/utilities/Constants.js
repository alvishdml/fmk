import I18n from '../../config/i18n';
export default class Constants {

    constructor() {
        this.state = ['fuck', 'marry', 'kill'];
    }

    get states() {
        return this.state;
    }

    get colors() {
        return ['#f74786', '#5797c2', '#00cbb3', '#424949', '#411744' ];
    }

    get colors1() {
        return ['#f88956', '#be29bc', '#004bb5', '#424949', '#1d2e47' ];
    }

    profileText(gender, type) {
        switch (type) {
            case 'fuck':
                return this.profileFuckText(gender);
                break;
            case 'marry':
                return this.profileMarryText(gender);
                break;
            case 'kill':
                return this.profileKillText(gender);
                break;
            default:
                return this.profileNeutralText(gender);
        }
    }

    profileFuckText(gender) {
        if (gender == 'female') {
            return I18n.t('app.utilities.Constants.profileFuckTextFemale');
        } else {
            return I18n.t('app.utilities.Constants.profileFuckTextMale');
        }
    }

    profileMarryText(gender) {
        phrase = '{0} Material'
        if (gender == 'female') {
            return phrase.replace('{0}', I18n.t('app.utilities.Constants.profileMarryTextFemale'));
        } else {
            return phrase.replace('{0}', I18n.t('app.utilities.Constants.profileMarryTextMale'));
        }
    }

    profileKillText(gender) {
        return I18n.t('app.utilities.Constants.profileKillText');
    }

    profileNeutralText(gender) {
        return I18n.t('app.utilities.Constants.profileNeutralText');
    }

    newMatchText(matchType, yourGender, otherGender) {
        switch(matchType) {
            case 'fuck':
                return this.newMatchFuckText(otherGender);
                break;
            case 'marry':
                return this.newMatchMarryText(otherGender, yourGender);
                break;
            case 'kill':
                return this.newMatchKillText();
                break;
            default:
                return 'Unknow match type';
        }
    }

    newMatchFuckText(gender) {
        let str,
            phrase = I18n.t('app.utilities.Constants.newMatchFuckText0'),
            phrase1 = I18n.t('app.utilities.Constants.newMatchFuckText1');
        if (gender == 'female') {
            str = phrase.replace('{0}', I18n.t('app.utilities.Constants.newMatchFuckGenderFemale'));
        } else {
            str = phrase.replace('{0}', I18n.t('app.utilities.Constants.newMatchFuckGenderMale'));
        }

        return [str.toUpperCase() + phrase1.toUpperCase()];
    }

    newMatchMarryText(otherGender, yourGender){
        let str0,
            str1,
            phrase0 = I18n.t('app.utilities.Constants.newMatchMarryText0'),
            phrase1 = I18n.t('app.utilities.Constants.newMatchMarryText1');
        if (otherGender == 'female') {
            str0 = phrase0.replace('{1}', I18n.t('app.utilities.Constants.newMatchMarryGenderFemale0'));
            str1 = phrase1.replace('{0}', I18n.t('app.utilities.Constants.newMatchMarryGenderFemale1'));
        } else {
            str0 = phrase0.replace('{1}', I18n.t('app.utilities.Constants.newMatchMarryGenderMale0'));
            str1 = phrase1.replace('{0}', I18n.t('app.utilities.Constants.newMatchMarryGenderMale1'));
        }

        if (yourGender == 'male') {
            str0 = str0.replace('{0}', I18n.t('app.utilities.Constants.newMatchMarryGenderMale0'));
        } else {
            str0 = str0.replace('{0}', I18n.t('app.utilities.Constants.newMatchMarryGenderFemale0'));
        }

        return ['',str0.toUpperCase() + str1.toUpperCase()];
    }

    newMatchKillText(){
        return [I18n.t('app.utilities.Constants.newMatchKillText').toUpperCase()];
    }

    get fromPlaystore(){
        return 'playStore'
    }

    get fromLazeeva(){
        return 'Lazeeva'
    }
}
