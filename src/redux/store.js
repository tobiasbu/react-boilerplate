import { createStore, applyMiddleware, Middleware } from 'redux';
import rootReducer, { initialState } from './reducers';

// Initialize the redux middleware
/**
 * @type {Middleware[]}
 */
const middleware = [];

/**
 * The Cashier App's store
 */
const store = createStore(rootReducer, initialState, applyMiddleware(...middleware));

window.ReduxStore = store;

export default store;
