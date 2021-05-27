import { gql } from "graphql-request";

const CreateCharacter = gql`
  mutation CreateCharacter(
    $Name: String!
    $Description: String
    $Species: ID!
    $Profession: ID!
    $Faith: ID
    $Features: [ID]
    $FPPs: [BasicWithQuantityInput]
    $Items: [BasicWithQuantityInput]
  ) {
    CreateFullCharacter(
      Name: $Name
      Description: $Description
      Species: $Species
      Profession: $Profession
      Faith: $Faith
      Features: $Features
      FPPs: $FPPs
      Items: $Items
    )
  }
`;

export { CreateCharacter };
