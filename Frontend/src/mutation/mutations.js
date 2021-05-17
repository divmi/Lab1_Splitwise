import { gql } from "apollo-boost";

const loginMutation = gql`
  mutation login($email: String, $password: String) {
    login(email: $email, password: $password) {
      token
      _id
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
  mutation addGroup($data: Object) {
    addGroup(data: $data) {
      status
      message
    }
  }
`;
export { loginMutation, signUpMutation, addGroup, addTransactionMutation };
