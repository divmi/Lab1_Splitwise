import * as aType from "../actions/actionTypes";
const defaultState = {
  userinfo: {},
};

export const login = (state = defaultState, action) => {
  if (action.type == aType.Login_USER) {
    console.log("processing in reducer");
    return Object.assign({}, state, {
      userinfo: action.payload,
    });
  } else if (action.type == aType.Logout_USER) {
    return Object.assign({}, state, {
      userinfo: null,
    });
  }
  return state;
};
