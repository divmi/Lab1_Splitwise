//import * as ActionTypes from "../actions/actionTypes";
import * as aType from "../actions/actionTypes";
const defaultState = {
  registerUserData: [],
};

export default function (state = defaultState, action) {
  if (action.type == aType.REGISTER_USER) {
    console.log("processing in reducer from register user");
    return Object.assign({}, state, {
      registerUserData: state.registerUserData.concat(action.payload),
    });
  }
  return state;
}
