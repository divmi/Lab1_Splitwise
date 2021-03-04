import * as action from "./actionTypes";

export function UserState(payload) {
  console.log("dispatching the action");
  return { type: action.Login_USER, payload };
}
