import * as aType from "../actions/actionTypes";
const defaultState = {
  transactionDetail: [],
  authFlag: false,
  comments: [],
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case aType.Load_GroupBased_Transaction:
      return {
        ...state,
        transactionDetail: action.payload,
      };
    case aType.Reset_Success_Flag:
      console.log("Reset happened");
      return {
        ...state,
        authFlag: false,
      };
    case aType.Insert_Group_Transaction:
      console.log("Insert_Group_Transaction : ");
      return {
        ...state,
        authFlag: true,
      };
    case aType.Insert_Comments:
      console.log("Insert Comment : ");
      return {
        ...state,
        comments: action.payload,
      };
    case aType.Delete_Comments:
      console.log("Delete Comment: ");
      return {
        ...state,
        authFlag: true,
      };
    default:
      return state;
  }
}
