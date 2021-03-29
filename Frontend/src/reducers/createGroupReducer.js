import * as aType from "../actions/actionTypes";
const defaultState = {
  allUser: [],
  authFlag: false,
};

export default function (state = defaultState, action) {
  console.log("control came here");
  switch (action.type) {
    case aType.Load_AllUser:
      return {
        ...state,
        allUser: action.payload,
        authFlag: false,
      };
    case aType.Create_Group:
      return {
        ...state,
        authFlag: action.payload,
      };
    default:
      return state;
  }
}
