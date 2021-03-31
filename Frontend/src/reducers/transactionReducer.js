import * as aType from "../actions/actionTypes";
const defaultState = {
  transaction: [],
  groupName: [],
};

export default function (state = defaultState, action) {
  console.log("control came here");
  switch (action.type) {
    case aType.Load_Transaction:
      return {
        ...state,
        transaction: action.payload,
        groupName: [...new Set(action.payload.map((x) => x.GroupID.GroupName))],
      };
    default:
      return state;
  }
}
