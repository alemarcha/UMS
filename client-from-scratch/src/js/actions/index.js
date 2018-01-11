import { AUTH_USER,  
    AUTH_ERROR,
    UNAUTH_USER,
    PROTECTED_TEST,
    ADD_ARTICLE } from "../constants/action-types";

const API_URL = 'http://localhost:3000/api';
const CLIENT_ROOT_URL = 'http://localhost:8080';

export function errorHandler(dispatch, error, type) {  
    let errorMessage = '';
  
    if (error.data.error) {
      errorMessage = error.data.error;
    } else if (error.data) {
      errorMessage = error.data;
    } else {
      errorMessage = error;
    }
  
    if (error.status === 401) {
      dispatch({
        type: type,
        payload: 'You are not authorized to do this. Please login and try again.'
      });
      logoutUser();
    } else {
      dispatch({
        type: type,
        payload: errorMessage
      });
    }
}
export function loginUser({ email, password }) {  
    return function(dispatch) {
        axios.post(`${API_URL}/auth/login`, { email, password })
        .then(response => {
            cookie.save('token', response.data.token, { path: '/' });
            dispatch({ type: AUTH_USER });
            browserHistory.push(`${CLIENT_ROOT_URL}/dashboard`);
        })
        .catch((error) => {
            console.log(error);
            errorHandler(dispatch, error.response, AUTH_ERROR)
        });
    }
}

export function protectedTest() {  
    console.log("ahi");
    return function(dispatch) {
      console.log("Vamos");
      axios.get(`${API_URL}/protected`, {
        headers: { 'Authorization': cookie.load('token') }
      })
      .then(response => {
        console.log(response);
        dispatch({
          type: PROTECTED_TEST,
          payload: response.data.content
        });
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR)
      });
    }
}

export const addArticle = article => ({ type: ADD_ARTICLE, payload: article });