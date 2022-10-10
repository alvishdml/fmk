import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
// import icoMoonConfigAndroid from './icomoon/android/selection.json';
// import icoMoonConfigIOS from './icomoon/ios/selection.json';
import { Platform } from 'react-native';
import icoMoonConfig from './selection.json';

export default createIconSetFromIcoMoon(icoMoonConfig);
// const icons = Platform.OS == 'ios' ? createIconSetFromIcoMoon(icoMoonConfigIOS) : createIconSetFromIcoMoon(icoMoonConfigAndroid);
// export default icons;
