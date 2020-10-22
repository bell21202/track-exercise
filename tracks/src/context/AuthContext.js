import createDataContext from './createDataContext';
import trackerApi from '../api/tracker';
import {AsyncStorage} from 'react-native';
import {navigate} from '../navigationRef';

// called by the dispatch function
// Rules for updating object inside a reducer: return a brand new object and never modify the state value
const authReducer = (state, action) => {
    switch(action.type) {
        case 'add_error':
            return {...state, errorMessage: action.payload };
        case 'signin':
            // 'zero' out state object too
            return {errorMessage: '', token: action.paylod};
        case 'clear_error_message':
            return {...state, errorMessage: ''};
        case 'signout':
            return {token: null, error: ''};
        default:
            return state;
    }
};

const tryLocalSignin = dispatch => async () => {
    const token = await AsyncStorage.getItem('token');
    if(token) {
        dispatch({type: 'signin', payload: token});
        navigate('TrackList');
    } else {
        navigate('Signup');
    };
};

const clearErrorMessage = dispatch => () => {
    console.log("inside of clear message");
    dispatch({type: 'clear_error_message'});
};

const signup = dispatch => async ({email, password}) => {
    try 
    {
        const response = await trackerApi.post('/signup', {email,password});
        await AsyncStorage.setItem('token',response.data.token); // this can definitely be a const value
        dispatch({type: 'signin', payload: response.data.token});
        navigate('TrackList');
    }    
    catch(err) 
    {
        dispatch({type: 'add_error', payload: 'Something went wrong with sign up'})
    } 
};

const signin = (dispatch) => async ({email, password}) => {
       try{
           const response = await trackerApi.post('/signin', {email, password});
           await AsyncStorage.setItem('token',response.data.token);
           dispatch({tyupe: 'signin', payload: response.data.token});
           navigate('TrackList');
       }catch(err) {
           dispatch({type: 'add_error', payload: 'Something went wrong with sign in'});
       }
    }


const signout = (dispatch) => async () => {
    await AsyncStorage.removeItem('token');
    dispatch({type: 'signout'});
    navigate('loginFlow');
};


export const {Provider, Context} = createDataContext(authReducer, {signin, signout, signup, clearErrorMessage, tryLocalSignin}, {token: null,  errorMessage: ''});