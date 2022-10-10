import AsyncStorage from '@react-native-async-storage/async-storage';

class DAAsyncStorage {

    async buscarItem(key,callback) {
        var item
        try {
            item = await AsyncStorage.getItem(key);
        } catch (e) {
            console.log(e);
        } finally {
            callback(item);
        }
    }

    async criarItem(key,val,callback) {
        try {
            await AsyncStorage.setItem(key,val);
        } catch (e) {
            console.log(e);
        } finally {
            callback();
        }
    }

    async apagarItem(key,val,callback) {
        try {
            await AsyncStorage.removeItem(key,val);
        } catch (e) {
            console.log(e);
        } finally {
            callback();
        }
    }

    async updateItem(key, val, callback){
        try {
            await AsyncStorage.mergeItem(key,val);
        } catch (e) {
            console.log(e);
        } finally {
            callback();
        }
    }

    async apagarTudo(callback) {
        var keys
        try {
            keys = await AsyncStorage.getAllKeys();
            await AsyncStorage.multiRemove(keys);
        } catch (e) {
            console.log(e);
        } finally {
            callback(keys);
        }
    }

    async buscarTodosItens(callback) {
        var keys;
        var itens;
        try {
            keys = await AsyncStorage.getAllKeys();
            itens = await AsyncStorage.multiGet(keys);
            return itens;
        } catch (e) {
            console.log(e);
        } finally {
            callback(itens, keys);
        }
    }
}

module.exports = DAAsyncStorage;
