import * as actionTypes from './actionTypes';
import axios from 'axios';
import login_axios from '../../login-axios';
import querystring from 'querystring';
import 'dotenv/config';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (res) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        id: res.id,
        idToken: res.token,
        username: res.name,
        email: res.email_id,
        setPassword: res.set_password
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const auth = (emailid, password) => {
    return dispatch => {
        if(emailid === "" && password===""){
            dispatch(authFail("Please enter Email ID/Password"))
            return
        } else if (emailid === "" && password !== ""){
            dispatch(authFail("Please enter Email ID"))
            return
        } else if(emailid !== "" && password === ""){
            dispatch(authFail("Please enter Password"))
            return
        }
        dispatch(authStart());
        const options = {
            "headers":{
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }
        const data = {
            "medium":"basicauth",
            "emailid": emailid,
            "password": password
        }
        login_axios.post("/login",querystring.stringify(data), options).then(res=> {
            localStorage.setItem("signed_in_via", "basicauth");
            localStorage.setItem("userdata", JSON.stringify(res.data))
            dispatch(authSuccess(res.data));
        }).catch(err=>{
            dispatch(authFail(err.response.data));
        });
    }
}

export const authViaTwitterStart = () => {
    return {
        type: actionTypes.AUTH_TWITTER_START
    };
};

export const authViaTwitterSuccess = (token) => {
    return {
        type: actionTypes.AUTH_TWITTER_SUCCESS,
        idToken: token
    };
};

export const authViaTwitterFail = (error) => {
    return {
        type: actionTypes.AUTH_TWITTER_FAIL,
        error: error
    };
};

export const authViaTwitter = () => {
    return dispatch => {
        // dispatch(authViaTwitterStart())
        // const tw = new loginWithTwitter({
        //     consumerKey: 'yeK5x9Y3itMvbB09ISPGJvs1c',
        //     consumerSecret: 'yLa7c0vCPNWoYzR3lC2QGyQ2hs1K9PTGa5H6Mdfyb1m5otj6q6',
        //     callbackUrl: 'http//localhst:3001/login'
        // })
        // tw.login((err, tokenSecret, url)=>{
        //     if(err){
        //         dispatch(authViaTwitterFail(err.response.data))
        //     }
        //     window.location(url)
        // })
    }
}

export const authViaGithubStart = () => {
    return {
        type: actionTypes.AUTH_GITHUB_START
    };
};

export const authViaGithubSuccess = (token) => {
    return {
        type: actionTypes.AUTH_GITHUB_SUCCESS,
        idToken: token
    };
};

export const authViaGithubFail = (error) => {
    return {
        type: actionTypes.AUTH_GITHUB_FAIL,
        error: error
    };
};

export const authViaGithub = (code) => {
    return dispatch => {
        dispatch(authViaGithubStart())
        var data = {
            "client_id":process.env.REACT_APP_GITHUB_CLIENT_ID,
            "client_secret":process.env.REACT_APP_GITHUB_CLIENT_SECRET,
            "code":code
        }
        const options = {
            "headers":{
                "Access-Control-Allow-Origin":"*",
                "Accept": "application/json"
            }
        }
        axios.post("https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token",data,options).then(
            res => {
                authViaGithubSuccess(res.data.access_token)
                localStorage.setItem("signed_in_via", "github");
                localStorage.setItem("access_token",res.data.access_token);
                localStorage.setItem("token_type", res.data.token_type);
                window.opener.location="https://login-app-react-web.herokuapp.com/home"
                window.self.close();
            }
        ).catch( err => {
            dispatch(authViaGithubFail(err.response.data))
        });
    }
}

export const authViaLinkedInStart = () => {
    return {
        type: actionTypes.AUTH_LINKEDIN_START
    };
};

export const authViaLinkedInSuccess = (token) => {
    return {
        type: actionTypes.AUTH_LINKEDIN_SUCCESS,
        idToken: token
    };
};

export const authViaLinkedInFail = (error) => {
    return {
        type: actionTypes.AUTH_LINKEDIN_FAIL,
        error: error
    };
};

export const authViaLinkedIn = (code) => {
    return dispatch => {
        dispatch(authViaLinkedInStart())
        var data = {
            "grant_type":"authorization_code",
            "code":code,
            "redirect_uri": "https://login-app-react-web.herokuapp.com/login?medium=linkedin",
            "client_id":process.env.REACT_APP_LINKED_IN_CLIENT_ID,
            "client_secret":process.env.REACT_APP_LINKED_IN_CLIENT_SECRET
        }
        const options = {
            "headers":{
                "Access-Control-Allow-Origin":"*",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        axios.post("https://cors-anywhere.herokuapp.com/https://www.linkedin.com/oauth/v2/accessToken",querystring.stringify(data),options).then(
            res => {
                dispatch(authViaLinkedInSuccess(res.data.access_token))
                localStorage.setItem("signed_in_via", "linkedin");
                localStorage.setItem("access_token",res.data.access_token);
                localStorage.setItem("expires_in", res.data.expires_in);
                window.opener.location="https://login-app-react-web.herokuapp.com/home"
                window.self.close();
            }
        ).catch( err => {
            dispatch(authViaLinkedInFail(err.response.data))
        });
    }
}

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('signed_in_via');
    localStorage.removeItem('token_type');
    localStorage.removeItem('username');
    localStorage.removeItem('userdata');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('access_token');
        const signedInVia = localStorage.getItem("signed_in_via");
        if (signedInVia === "basicauth"){
            const userdata = localStorage.getItem("userdata")
            dispatch(authSuccess(JSON.parse(userdata)));
            return;
        } 
        if (!token) {
            logout();
        } else {
            dispatch(authSuccess(token));
        }   
    }
};