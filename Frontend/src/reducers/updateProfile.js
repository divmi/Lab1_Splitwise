import * as aType from "../actions/actionTypes";
const defaultState = {
  authFlag: false,
  image: "",
};

export default function (state = defaultState, action) {
  console.log("payload received: " + action.payload);
  switch (action.type) {
    case aType.Update_Profile:
      return {
        ...state,
        authFlag: action.payload,
      };
    case aType.Reset_Success_Flag:
      return {
        authFlag: false,
      };
    default:
      return state;
  }
}
