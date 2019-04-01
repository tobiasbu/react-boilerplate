import { combineReducers } from 'redux';

function navigationReducer() {
  return '/';
}

function shaftReducer() {
  return {};
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
