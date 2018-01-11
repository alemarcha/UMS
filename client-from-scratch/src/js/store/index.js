import { createStore, applyMiddleware } from 'redux';  
import rootReducer from "../reducers/index";
import reduxThunk from 'redux-thunk';  

//Redux Thunk teaches Redux to recognize special kinds of actions that are in fact functions
const store = createStore(
    rootReducer,
    applyMiddleware(reduxThunk)
);

export default store;