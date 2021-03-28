import { gql } from 'graphql-request';

const CurrentUser = gql`{
  CurrentUser {
    id
    Name
    Email
    Permissions {
      Owns
      Permissions
      Rank
    }
  }
}`;


export {
  CurrentUser
}