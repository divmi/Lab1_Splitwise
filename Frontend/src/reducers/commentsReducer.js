import * as aType from "../actions/actionTypes";
const defaultState = {
  authFlag: false,
  commentsFromDB: [],
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case aType.Reset_Success_Flag:
      console.log("Reset happened");
      return {
        ...state,
        authFlag: false,
      };
    case aType.Insert_Comments:
      console.log("Insert Comment : ");
      return {
        ...state,
        authFlag: action.payload,
      };
    case aType.Delete_Comments:
      console.log("Delete Comment: ");
      return {
        ...state,
        authFlag: true,
      };
    case aType.Get_Comments:
      console.log("Get_Comments: ");
      return {
        ...state,
        commentsFromDB: action.payload[0].comments,
      };
    default:
      return state;
  }
}
