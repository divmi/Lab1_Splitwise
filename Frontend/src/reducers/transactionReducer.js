import * as aType from "../actions/actionTypes";
const defaultState = {
  transaction: [],
  groupName: [],
  count: "",
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case aType.Load_Transaction:
      return {
        ...state,
        transaction: action.payload.transaction,
        count: action.payload.transactionCount,
        groupName: [
          ...new Set(
            action.payload.transaction.map((x) => x.GroupID.GroupName)
          ),
        ],
      };
    default:
      return state;
  }
}
