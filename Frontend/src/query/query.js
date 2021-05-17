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

const getMemberName = gql`
  query ($_id: ID) {
    groupMemberName(_id: $_id) {
      GroupMemberInfo {
        _id
        ID {
          Name
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
      Time
    }
  }
`;
const getOwsGetsDetail = gql`
  query ($_id: ID) {
    owsGetDetail(_id: $_id) {
      _id
      MemberOws {
        Name
        Email
      }
      MemberGets {
        Name
        Email
      }
      GroupID {
        GroupName
      }
      Amount
    }
  }
`;

export {
  getGroupInfo,
  getGroupTransactionInfo,
  getOwsGetsDetail,
  getMemberName
};
