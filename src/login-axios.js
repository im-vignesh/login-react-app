import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://login-app-api-server.herokuapp.com'
});


export default instance;