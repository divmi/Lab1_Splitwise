import * as aType from "../actions/actionTypes";
const defaultState = {
  groupInfo: [],
  userAmountDetails: [],
};

export default function (state = defaultState, action) {
  console.log("control came here");
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
      };
    case aType.Load_Transaction_Per_User:
      return {
        ...state,
        userAmountDetails: action.payload,
      };
    default:
      return state;
  }
}
