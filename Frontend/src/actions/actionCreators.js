import * as ActionTypes from "./actionTypes";

export function RegisterUser(payload) {
  console.log("dispatching the action for Register User");
  return { type: ActionTypes.REGISTER_USER, payload };
}
