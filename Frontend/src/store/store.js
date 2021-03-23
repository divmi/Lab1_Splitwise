import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import register from "../reducers/register";
import login from "../reducers/login";
import thunk from "redux-thunk";

const initialState = {};

//const middleware = [thunk];

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      login,
      register,
    }),
    initialState,
    storeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
