import * as aType from "../actions/actionTypes";
const defaultState = {
  user: {},
  Currency: "",
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case aType.Login_USER:
      return {
        ...state,
        user: action.payload,
        Currency: action.payload[0].Currency,
      };
    case aType.Logout_USER:
      return {};
    default:
      return state;
  }
}
