import { gql } from "graphql-request";

const characterProperties: string = `
  Name
  Description
  Species {
    id
  }
  Profession {
    id
  }
  Faith {
    id
  }
  Features {
    id
  }
`;

const GetCharacters = gql`query Character($filter: _CharacterFilter) {
  Character(filter:$Filter) {
    ${characterProperties}
  }
}`;

const GetCharacterById = gql`query Character($id: ID!) {
  Character(id: $id) {
    ${characterProperties}
  }
}`;

const GetCharactersForUser = gql`query Characters($user: ID!) {
  User(id:$user) {
    Characters {
      ${characterProperties}
    }
  }
}`;

export { GetCharacters, GetCharacterById, GetCharactersForUser };
