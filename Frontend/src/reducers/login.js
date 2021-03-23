import * as aType from "../actions/actionTypes";
const defaultState = {
  user: {},
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case aType.Login_USER:
      return {
        ...state,
        user: action.payload,
      };
    case aType.Logout_USER:
      return {};
    default:
      return state;
  }
}
