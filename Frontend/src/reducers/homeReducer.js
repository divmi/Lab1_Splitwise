import * as aType from "../actions/actionTypes";
const defaultState = {
  groupInfo: [],
  userAmountDetails: [],
  authFlag: false,
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case aType.Load_GroupName:
      return {
        ...state,
        groupInfo: action.payload,
      };
    case aType.Edit_Group:
      return {
        ...state,
        groupInfo: action.payload,
        authFlag: true,
      };
    case aType.Load_Transaction_Per_User:
      return {
        ...state,
        userAmountDetails: action.payload,
      };
    case aType.Reset_Success_Flag:
      return {
        ...state,
        authFlag: false,
      };
    case aType.Logout_USER:
      return {};
    default:
      return state;
  }
}
