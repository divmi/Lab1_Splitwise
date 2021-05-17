import { gql } from "apollo-boost";

const getGroupInfo = gql`
  query ($_id: ID) {
    group(_id: $id) {
      _id
      GroupName
      GroupMemberInfo {
        Accepted
        _id
        ID {
          Name
          Email
          UserProfilePic
        }
      }
    }
  }
`;

export { getGroupInfo };
