import { authHeader } from '../_helpers';
import { appConstants } from '../_constants'
export const userService = {
    login,
    logout,
    getAll
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
    };
    return fetch(appConstants.API_HOST + '/auth/login', requestOptions)
        .then(response => {
            if (!response.ok) { 
                return Promise.reject(response.statusText);
            }

            return response.json();
        })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET'
    };

    // console.log("enoueza el juego " + appConstants.API_HOST+ '/users');
    // return fetch(appConstants.API_HOST + '/users', requestOptions);
    return fetch(appConstants.API_HOST + '/users', requestOptions)
        .then(response => {
            if (!response.ok) { 
                return Promise.reject(response.statusText);
            }

            return response.json();
        });
}

function handleResponse(response) {
    console.log("aqui eso");
    if (!response.ok) { 
        return Promise.reject(response.statusText);
    }

    return response.json();
}