import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import register from "../reducers/register";
import login from "../reducers/login";
import updateProfile from "../reducers/updateProfile";
import transaction from "../reducers/transactionReducer";
import groupOwsGetsDetail from "../reducers/groupOwsGetsDetail";
import thunk from "redux-thunk";

const initialState = {};

//const middleware = [thunk];

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      login,
      register,
      updateProfile,
      transaction,
      groupOwsGetsDetail,
    }),
    initialState,
    storeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
