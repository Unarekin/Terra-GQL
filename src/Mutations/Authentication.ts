import { gql } from 'graphql-request';

const Authenticate = gql`mutation AuthenticateUser($email:String!, $password:String!){
  AuthenticateUser(email:$email,password:$password)
}`;

const LogOut = gql`mutation {
  LogoutCurrentUser
}`;

const CurrentUser = gql`{
  CurrentUser {
    id
    Name
    Email
  }
}`;


export {
  Authenticate,
  LogOut,
  CurrentUser
};