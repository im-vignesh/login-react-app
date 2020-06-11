import * as actionTypes from './actionTypes';
import axios from 'axios';
import login_axios from '../../login-axios';
import querystring from 'querystring';

export const fetchGithubDetailsStart = () => {
    return {
        type: actionTypes.FETCH_GITHUB_DETAILS_START
    };
};

export const fetchGithubDetailsFail = (error) => {
    return {
        type: actionTypes.FETCH_GITHUB_DETAILS_FAIL,
        error: error
    };
};

export const fetchGithubDetailsSuccess = (username) => {
    return {
        type: actionTypes.FETCH_GITHUB_DETAILS_SUCCESS,
        username: username
    };
};

export const fetchGithubDetails = () => {
    return dispatch => {
        dispatch(fetchGithubDetailsStart());
        const access_token = localStorage.getItem("access_token");
        const options = {
            "headers":{
                "Authorization": 'token ' + access_token 
            }
        }
        axios.get("https://api.github.com/user",options).then(res=>{
            console.log(res)
            localStorage.setItem("username",res.data.login);
            dispatch(fetchGithubDetailsSuccess(res.data.name));
        }).catch( err => {
            dispatch(fetchGithubDetailsFail(err.response.data));
        })
    }
}    

export const fetchLinkedInDetailsStart = () => {
    return {
        type: actionTypes.FETCH_LINKEDIN_DETAILS_START
    };
};

export const fetchLinkedInDetailsSuccess = (username) => {
    return {
        type: actionTypes.FETCH_LINKEDIN_DETAILS_SUCCESS,
        username: username
    };
};

export const fetchLinkedInDetailsFail = (error) => {
    return {
        type: actionTypes.FETCH_LINKEDIN_DETAILS_FAIL,
        error: error
    };
};

export const fetchLinkedInDetails = () =>{
    return dispatch => {
        dispatch(fetchLinkedInDetailsStart());
        const access_token = localStorage.getItem("access_token");
        const options = {
            "headers":{
                "Authorization": 'Bearer ' + access_token 
            }
        }
        axios.get("https://cors-anywhere.herokuapp.com/https://api.linkedin.com/v2/me",options).then(res=>{
            console.log(res)
            dispatch(fetchLinkedInDetailsSuccess(res.data.localizedFirstName))
        }).catch( err => {
            dispatch(fetchLinkedInDetailsFail(err.response.data))
        })
    }
}

export const UpdateUserInfoStart = () => {
    return {
        type: actionTypes.UPDATE_USER_INFO_START
    };
};

export const UpdateUserInfoSuccess = (res) => {
    return {
        type: actionTypes.UPDATE_USER_INFO_SUCCESS,
        id: res.id,
        username: res.name,
        email: res.email_id,
        setPassword: res.set_password
    };
};

export const UpdateUserInfoFail = (error) => {
    return {
        type: actionTypes.UPDATE_USER_INFO_FAIL,
        error: error
    };
};

export const UpdateUserInfo = () => {
    return dispatch => {
        dispatch(UpdateUserInfoStart());
        const signed_in_via = localStorage.getItem("signed_in_via");
        const access_token = localStorage.getItem("access_token");
        let options = null;
        let data = null;
        switch(signed_in_via){
            case "github":
                const username = localStorage.getItem("username")
                options = {
                    "headers":{
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": access_token
                    }
                }
                data = {
                    "medium":signed_in_via,
                    "username": username
                }
                break;
            case "linkedin":
                options = {
                    "headers":{
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Bearer " + access_token
                    }
                }
                data = {
                    "medium":signed_in_via
                }
                break;
            default:
                break;
        }
        login_axios.post("/login", querystring.stringify(data),options).then(res=>{
            dispatch(UpdateUserInfoSuccess((res.data)));
            console.log("Updated Successfully")
        }).catch(err=>{
            dispatch(UpdateUserInfoFail(err.response.data))
            console.log("Update Failed")
        });
    }
}

export const SetPasswordStart = () => {
    return {
        type: actionTypes.SET_PASSWORD_START
    };
};

export const SetPasswordSuccess = (res) => {
    return {
        type: actionTypes.SET_PASSWORD_SUCCESS,
        error: null
    };
};

export const SetPasswordFail = (error) => {
    return {
        type: actionTypes.SET_PASSWORD_FAIL,
        error: error
    };
};

export const setPassword = (email, password) => {
    return dispatch => {
        dispatch(SetPasswordStart());
        console.log("Email,Cccc",email,password)
        if(email==="" || email===null){
            dispatch(SetPasswordFail("Email is not associated with your account. Email is required to set a password"));
            return
        }
        if(password===""){
            dispatch(SetPasswordFail("Please enter password"));
            return
        }
        const options = {
            "headers":{
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }
        const data = {
            "mail_id": email,
            "password": password
        }
        login_axios.put("/user/set_password",querystring.stringify(data),options).then(res=>{
            dispatch(SetPasswordSuccess());
        }).catch(err=>{
            dispatch(SetPasswordFail(err.response.data));
        });
    }
}

export const SetPhoneNumberStart = () => {
    return {
        type: actionTypes.SET_MOBILE_NO_START
    };
};

export const SetPhoneNumberSuccess = (res) => {
    return {
        type: actionTypes.SET_MOBILE_NO_SUCCESS,
        error: null
    };
};

export const SetPhoneNumberFail = (error) => {
    return {
        type: actionTypes.SET_PASSWORD_FAIL,
        error: error
    };
};

export const setMobileNumber = (id, phoneNumber) => {
    return dispatch => {
        dispatch(SetPhoneNumberStart());
        const options = {
            "headers":{
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }
        const data = {
            "id": id,
            "phone_number": phoneNumber
        }
        login_axios.put("/user/set_mobile_number",querystring.stringify(data),options).then(res=>{
            dispatch(SetPhoneNumberSuccess());
        }).catch(err=>{
            dispatch(SetPhoneNumberFail(err.response.data));
        });
    }
}