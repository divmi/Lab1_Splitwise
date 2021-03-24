import * as aType from "../actions/actionTypes";
const defaultState = {
  authFlag: false,
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case aType.Update_Profile:
      return {
        ...state,
        authFlag: action.payload,
      };
    default:
      return state;
  }
}
