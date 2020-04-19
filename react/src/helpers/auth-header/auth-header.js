import cookie from 'react-cookies';

export const authHeader = () => {
    let token = cookie.load('user') ? cookie.load('user')['token'] : false;
    return token ? {'Authorization': 'Bearer ' + token} : {};
};