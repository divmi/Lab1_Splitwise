import { gql } from "apollo-boost";

const loginMutation = gql`
  mutation login($email: String, $password: String) {
    login(email: $email, password: $password) {
      token
      _id
      Name
      Email
      Currency
      ContactNo
      Timezone
      Language
      UserProfilePic
      status
      message
    }
  }
`;

const signUpMutation = gql`
  mutation signUp($name: String, $email: String, $password: String) {
    signUp(name: $name, email: $email, password: $password) {
      token
      _id
      Name
      Email
      Currency
      ContactNo
      Timezone
      Language
      UserProfilePic
      status
      message
    }
  }
`;
const updateProfileMutation = gql`
  mutation updateProfile(
    $_id: ID
    $Name: String
    $Email: String
    $Currency: String
    $Timezone: String
    $Language: String
    $ContactNo: String
    $UserProfilePic: String
  ) {
    updateProfile(
      _id: $_id
      Name: $Name
      Email: $Email
      Currency: $Currency
      Timezone: $Timezone
      Language: $Language
      ContactNo: $ContactNo
      UserProfilePic: $UserProfilePic
    ) {
      status
    }
  }
`;

const addTransactionMutation = gql`
  mutation insertTransaction(
    $transactionDetail: String
    $amount: Float
    $groupID: ID
    $memberID: ID
  ) {
    insertTransaction(
      transactionDetail: $transactionDetail
      amount: $amount
      groupID: $groupID
      memberID: $memberID
    ) {
      status
    }
  }
`;
const addGroup = gql`
  mutation addGroup(
    $GroupName: String
    $GroupProfilePicture: String
    $GroupCreatedBy: ID
    $GroupMemberInfo: [ID]
  ) {
    addGroup(
      GroupName: $GroupName
      GroupProfilePicture: $GroupProfilePicture
      GroupCreatedBy: $GroupCreatedBy
      GroupMemberInfo: $GroupMemberInfo
    ) {
      status
    }
  }
`;

const editGroup = gql`
  mutation editGroup(
    $GroupName: String
    $GroupProfilePicture: String
    $GroupMemberInfo: [ID]
  ) {
    editGroup(
      GroupName: $GroupName
      GroupProfilePicture: $GroupProfilePicture
      GroupMemberInfo: $GroupMemberInfo
    ) {
      status
    }
  }
`;
const settleUp = gql`
  mutation addGroup(
    $MemberID: ID
    $Amount: Float
    $SettleUpWith: ID
    $GroupID: [ID]
  ) {
    addGroup(
      MemberID: $MemberID
      Amount: $Amount
      SettleUpWith: $SettleUpWith
      GroupID: $GroupID
    ) {
      status
    }
  }
`;

export {
  loginMutation,
  signUpMutation,
  addGroup,
  addTransactionMutation,
  updateProfileMutation,
  settleUp,
  editGroup
};
