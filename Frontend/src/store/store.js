import { createStore, combineReducers } from "redux";
import { register } from "../reducers/register";
import { login } from "../reducers/login";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      register: register,
      login: login,
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};
