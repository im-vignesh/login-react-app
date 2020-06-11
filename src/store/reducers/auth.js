import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    id: null,
    token: null,
    error: null,
    loading: false,
    username:null,
    email:null,
    setPassword:null,
    authRedirectPath: '/'
};

const authStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true } );
};

const authSuccess = (state, action) => {
    return updateObject( state, {
        id: action.id,
        token: action.token,
        username:action.username,
        email:action.email,
        setPassword: action.setPassword,
        error: null,
        loading: false,
        authRedirectPath: '/home'
     } );
};

const authFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const authLogout = (state, action) => {
    return updateObject(state, { 
        id: null,
        token: null,
        username:null,
        email:null,
        setPassword:null, 
        authRedirectPath:'/'});
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.AUTH_GITHUB_START: return authStart(state, action);
        case actionTypes.AUTH_GITHUB_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_GITHUB_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LINKEDIN_START: return authStart(state, action);
        case actionTypes.AUTH_LINKEDIN_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_LINKEDIN_FAIL: return authFail(state, action);
        case actionTypes.AUTH_BASICAUTH_START: return authStart(state, action);
        case actionTypes.AUTH_BASICAUTH_FAIL : return authSuccess(state, action);
        case actionTypes.AUTH_BASICAUTH_SUCCESS: return authFail(state, action);
        // case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state,action);
        default:
            return state;
    }
};

export default reducer;