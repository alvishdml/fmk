import Alert from './Alert';
import I18n from '../../config/i18n';
import Geocoder from 'react-native-geocoder';
import Meteor from '@meteorrn/core';
import { PermissionsAndroid } from 'react-native';
const BD = require('../utilities/DAAsyncStorage');
const myBD = new BD();
import { trackEvent } from '../utilities/Analytics';

export default class Location {
  watchID = null;

  static async requestLocationPermissions(success, error) {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        success();
      } else {
        // error('Location permission denied');
      }
    } catch (err) {
      // error(err);
    }
  }

  static getCurrentLocation() {
    if (Meteor.user()) {
      Location.requestLocationPermissions(() => {
        this.watchID = navigator.geolocation.getCurrentPosition((position) => {
          console.log(position, 'geolocation')
          let initialPosition = JSON.stringify(position);
          myBD.criarItem('COORDS', position.coords.longitude + '|' + position.coords.latitude, () => {});
          console.log(position.coords.longitude, position.coords.latitude, 'ioooppoopopopoppo');
          Meteor.call('changeUserLocation', Meteor.user()._id, position.coords.longitude, position.coords.latitude)
          return true;
        },
        (error) => {
          if (error == 'No available location provider.') {
            myBD.buscarItem('COORDS', (coords) => {
              if (!coords){
                myBD.criarItem('COORDS', 0 + '|' + 0, () => {});
                //trackEvent('Alerts','Alert_GPS_Activate');
                Alert.showAlert('', I18n.t('app.utilities.Constants.alertGpsOff'), 'gps')
              }
            });
          }
        });
      }, () => {
        Alert.showAlert('', I18n.t('app.utilities.Constants.alertGpsOff'), 'gps')
      });
    }
  }

  static getCurrentLocationSilent() {
    if (Meteor.user()) {
      Location.requestLocationPermissions(() => {
        this.watchID = navigator.geolocation.getCurrentPosition((position) => {
          console.log(position, 'geolocation')
          let initialPosition = JSON.stringify(position);
          myBD.criarItem('COORDS', position.coords.longitude + '|' + position.coords.latitude, () => {});
          Meteor.call('changeUserLocation', Meteor.user()._id, position.coords.longitude, position.coords.latitude);
          return true;
        },
        (error) => {
          if (error == 'No available location provider.') {
            myBD.buscarItem('COORDS', (coords) => {
              if (!coords){
                myBD.criarItem('COORDS', 0 + '|' + 0, () => {
                  return true;
                });
              } else {
                return false;
              }
            });
          } else {
            return false;
          }
        });
      }, () => {
        return false;
      });
    }
  }

  static checkGpsStatusSlider(slider, showAlert) {
    if(Meteor.user()) {
      Location.requestLocationPermissions(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          let initialPosition = JSON.stringify(position);
          slider.setState({disabled: false, color1:'#fff', color2: '#008B8B'});
          myBD.criarItem('COORDS', position.coords.longitude + '|' + position.coords.latitude, () => {});
          Meteor.call('changeUserLocation', Meteor.user()._id, position.coords.longitude, position.coords.latitude);
        },
        (error) => {
          if(error == 'No available location provider.'){
            if(showAlert){

              Alert.showAlert('', 'Your GPS signal is turned off. To use the location filter you need to turn on the GPS in your settings', 'gps')
            }
            slider.setState({disabled: true, color1:'#afb6b6', color2: '#afb6b6'});
            myBD.buscarItem('COORDS', (coords) => {
              if(!coords){
                myBD.criarItem('COORDS', 0 + '|' + 0, () => {});
              }
            });
          }else if(error == 'Location request timed out'){
            Alert.showAlert('', 'Increase your GPS signal for better tracking on settings.', 'weakGps')
          }
        }, { enableHighAccuracy: false, timeout: 25000, maximumAge: 3600000 });
      }, () => {
        // slider.setState({disabled: true, color1:'#afb6b6', color2: '#afb6b6'});
        // Alert.showAlert('', 'Your GPS signal is turned off. To use the location filter you need to turn on the GPS in your settings', 'gps')
      });
    }
  }

  // not being used
  static startWatcher() {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let lastPosition = JSON.stringify(position);
      if (lastPosition) {
        // Meteor.call('changeUserLocation', Meteor.user()._id, position.coords.longitude, position.coords.latitude)
      }
    },
    (error) => { console.log('Watcher Error:',error) }, { enableHighAccuracy: false });
  }

  static getLocation(coords) {
    Geocoder.geocodePosition(coords).then(res => {
      Alert.showAlert('Teste', res[1].formattedAddress, 'o');
    })
    .catch(err => console.log(err));
  }

  static stopWatcher() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  static getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = Location.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = Location.deg2rad(lon2-lon1);
    var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(Location.deg2rad(lat1)) * Math.cos(Location.deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

  static deg2rad(deg) {
  return deg * (Math.PI/180)
}
}
