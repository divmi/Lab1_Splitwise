import * as ActionTypes from "../actions/actionTypes";
export const initialState = {
  name: "",
  email: "",
  password: "",
};

export const register = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REGISTER_USER:
      var userInfo = action.payload;
      userInfo.name = action.payload.name;
      userInfo.email = action.payload.email;
      userInfo.password = action.payload.password;
      return state.concat(userInfo);
    default:
      return state;
  }
};
