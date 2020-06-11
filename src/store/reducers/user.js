import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    id:null,
    username:null,
    email:null,
    setPassword:null    ,
    error: null,
    loading: false,
    loading_message:null
};

const fetchDetailSuccess = (state, action) => {
    return updateObject( state, {
        username:action.username,
        error: null,
        loading: false,
        loading_message:null
     });
};

const fetchDetailStart = (state, action) => {
    return updateObject(state, {
        loading:true,
        error: null,
        loading_message:"Fetching Details..."
    });
}

const fetchDetailFail = (state, action) => {
    return updateObject(state, {
        loading:false,
        error: action.error,
        loading_message:null
    });
}
const updateUserInfoSuccess = (state, action) => {
    return updateObject( state, {
        error: null,
        id:action.id,
        username:action.username,
        email:action.email,
        setPassword: action.setPassword,
        loading: false,
        loading_message:null
     });
};

const updateUserInfoStart = (state, action) => {
    return updateObject(state, {
        loading:true,
        error: null,
        loading_message:"Updating User Info..."
    });
}

const updateUserInfoFail = (state, action) => {
    return updateObject(state, {
        loading:false,
        error: action.error,
        loading_message:null
    });
}

const setPasswordStart = (state, action) => {
    return updateObject(state, {
        loading:true,
        error: null
    });
}

const setPasswordSuccess = (state, action) => {
    return updateObject(state,{
        loading:false
    });
}
const setPasswordFail = (state, action) => {
    return updateObject(state, {
        loading:false,
        error: action.error
    });
}
const setMobileNumberStart = (state, action) => {
    return updateObject(state, {
        loading:true,
        error: null
    });
}

const setMobileNumberSuccess = (state, action) => {
    return updateObject(state,{
        loading:false
    });
}
const setMobileNumberFail = (state, action) => {
    return updateObject(state, {
        loading:false,
        error: action.error
    });
}
const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.FETCH_GITHUB_DETAILS_START: return fetchDetailStart(state, action);
        case actionTypes.FETCH_GITHUB_DETAILS_SUCCESS: return fetchDetailSuccess(state, action);
        case actionTypes.FETCH_GITHUB_DETAILS_FAIL: return fetchDetailFail(state, action);
        case actionTypes.FETCH_LINKEDIN_DETAILS_START: return fetchDetailStart(state, action);
        case actionTypes.FETCH_LINKEDIN_DETAILS_SUCCESS: return fetchDetailSuccess(state, action);
        case actionTypes.FETCH_LINKEDIN_DETAILS_FAIL: return fetchDetailFail(state, action);
        case actionTypes.UPDATE_USER_INFO_START: return updateUserInfoStart(state, action);
        case actionTypes.UPDATE_USER_INFO_FAIL: return updateUserInfoFail(state, action);
        case actionTypes.UPDATE_USER_INFO_SUCCESS: return updateUserInfoSuccess(state, action);
        case actionTypes.SET_PASSWORD_START: return setPasswordStart(state, action);
        case actionTypes.SET_PASSWORD_SUCCESS: return setPasswordSuccess(state, action);
        case actionTypes.SET_PASSWORD_FAIL: return setPasswordFail(state,action);
        case actionTypes.SET_MOBILE_NO_START: return setMobileNumberStart(state,action);
        case actionTypes.SET_MOBILE_NO_SUCCESS: return setMobileNumberSuccess(state,action);
        case actionTypes.SET_MOBILE_NO_FAIL: return setMobileNumberFail(state,action);
        default: return state;
    }
}

export default reducer;