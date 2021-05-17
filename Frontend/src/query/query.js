import { gql } from "apollo-boost";

const getGroupInfo = gql`
  query ($_id: ID) {
    group(_id: $_id) {
      _id
      GroupName
      GroupMemberInfo {
        Accepted
        _id
        ID {
          _id
          Name
          Email
          UserProfilePic
        }
      }
    }
  }
`;

const getGroupTransactionInfo = gql`
  query ($_id: ID) {
    groupDetailInfo(_id: $_id) {
      TransactionDetail
      Amount
      GroupID {
        _id
        GroupName
      }
      MemberID {
        _id
        Name
      }
    }
  }
`;

export { getGroupInfo, getGroupTransactionInfo };
