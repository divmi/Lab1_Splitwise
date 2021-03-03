import * as ActionTypes from "./actionTypes";

export const registerUser = (name, email, password) => ({
  type: ActionTypes.REGISTER_USER,
  payload: {
    name,
    email,
    password,
  },
});
