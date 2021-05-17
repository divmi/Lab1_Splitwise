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

const addGroup = gql`
  mutation addGroup($data: Object) {
    addGroup(data: $data) {
      status
      message
    }
  }
`;
export { loginMutation, signUpMutation, addGroup };
