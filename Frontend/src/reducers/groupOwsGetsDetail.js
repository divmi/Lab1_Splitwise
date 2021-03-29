import * as aType from "../actions/actionTypes";
const defaultState = {
  owsGetDetail: [],
  groupMemberName: [],
};

export default function (state = defaultState, action) {
  console.log("control came here");
  switch (action.type) {
    case aType.Load_OwsGets_Detail:
      return {
        ...state,
        owsGetDetail: action.payload,
      };
    case aType.Load_Group_Member_Name:
      return {
        ...state,
        groupMemberName: action.payload,
      };
    default:
      return state;
  }
}
