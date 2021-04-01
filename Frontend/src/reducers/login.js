import * as aType from "../actions/actionTypes";
const defaultState = {
  user: {},
  Currency: "",
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case aType.Login_USER:
      console.log(action.payload);
      return {
        ...state,
        user: action.payload,
        Currency: action.payload.Currency,
      };
    case aType.Logout_USER:
      return {};
    case aType.REGISTER_USER:
      return {
        ...state,
        user: action.payload,
        Currency: action.payload.Currency,
      };
    default:
      return state;
  }
}
