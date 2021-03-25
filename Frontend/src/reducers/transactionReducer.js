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
        transaction: state.transaction.concat(action.payload),
        groupName: action.payload.map((x) => x.GroupName),
      };
    default:
      return state;
  }
}
