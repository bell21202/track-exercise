import axios from 'axios';
import {AsyncStorage} from 'react-native';

const instance = axios.create({
    baseURL: 'http://48f5806bdf65.ngrok.io'
});

instance.interceptors.request.use(
    // called automatically everytime we make a request
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },

    // error case
    (err) => {
        return Promise.reject(err);
    } 
);

export default instance;

