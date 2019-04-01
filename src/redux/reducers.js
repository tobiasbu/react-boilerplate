import { combineReducers, ReducersMapObject } from 'redux';

function navigationReducer(state, action) {

}

function shaftReducer(state, action) {

}

/**
 * @type {ReducersMapObject}
 */
const reducers = {
  navigation: navigationReducer,
  shaft: shaftReducer,
};

/*
 * InitialState of the app
 */
export const initialState = {
  navigation: '/',
  shaft: {},
};

const rootReducer = combineReducers(reducers);
export default rootReducer;