import * as aType from "../actions/actionTypes";
const defaultState = {
  groupInfo: [],
};

export default function (state = defaultState, action) {
  console.log("control came here");
  switch (action.type) {
    case aType.Load_GroupName:
      return {
        ...state,
        groupInfo: action.payload,
      };
    default:
      return state;
  }
}
