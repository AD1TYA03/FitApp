import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUser = async () =>{
    const user  = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) :null;
}

export const getToken = async ()=>{
    return await AsyncStorage.getItem('authToken');
}

export const logout = async ()=>{
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('authToken');
}