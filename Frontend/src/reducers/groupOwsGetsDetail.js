import * as aType from "../actions/actionTypes";
const defaultState = {
  owsGetDetail: [],
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case aType.Load_OwsGets_Detail:
      return {
        ...state,
        owsGetDetail: action.payload,
      };
    default:
      return state;
  }
}
