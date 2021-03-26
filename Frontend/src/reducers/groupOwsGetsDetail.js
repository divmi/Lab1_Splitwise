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

// export const calculateMemberSpecificTable = (state) => {
//   if (state.groupMemberName.length > 0) {
//      state.groupMemberName.map((memberName) => {
//       let sum = 0;
//       let sumOws = 0;
//       let memberDetail = state.owsGetDetail.filter(
//         (x) => x.MemberGets == memberName.Email
//       );
//       if (memberDetail.length > 0) {
//         memberDetail.map((member) => {
//           sum = sum + member.Amount;
//         });
//       }
//       let memberOws = this.props.owsGetDetail.filter(
//         (x) => x.MemberOws == memberName.Email
//       );
//       if (memberOws.length > 0) {
//         memberOws.map((member) => {
//           sumOws = sumOws + -member.Amount;
//         });
//       }
//       if (
//         memberName.UserProfilePic == "" ||
//         memberName.UserProfilePic == null
//       ) {
//         memberName.UserProfilePic = "./assets/userIcon.png";
//       }
//       this.setState({
//         memberWithAmountList: [
//           ...this.state.memberWithAmountList,
//           {
//             Name: memberName.Name,
//             Amount: sum + sumOws,
//             UserProfilePic: memberName.UserProfilePic,
//           },
//         ],
//       });
//       console.log("processing over");
//     });
//   }
// };
