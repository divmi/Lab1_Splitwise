import * as aType from "../actions/actionTypes";
const defaultState = {
  allUser: [],
  authFlag: false,
  createGroupError: ""
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case aType.Load_AllUser:
      return {
        ...state,
        allUser: action.payload,
        authFlag: false
      };
    case aType.Create_Group:
      return {
        ...state,
        authFlag: action.payload,
        createGroupError: ""
      };
    case aType.Reset_Success_Flag:
      console.log("Reset happened");
      return {
        ...state,
        authFlag: false
      };
    case aType.Error:
      console.log("Reset happened");
      return {
        ...state,
        createGroupError: "Group is already registered"
      };
    default:
      return state;
  }
}
