import * as aType from "../actions/actionTypes";
const defaultState = {
  allUser: [],
  authFlag: false,
};

export default function (state = defaultState, action) {
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
    case aType.Reset_Success_Flag:
      console.log("Reset happened");
      return {
        ...state,
        authFlag: false,
      };
    default:
      return state;
  }
}
