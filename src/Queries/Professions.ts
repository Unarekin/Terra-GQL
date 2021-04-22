import { gql } from 'graphql-request';

const GetProfessions = gql`query Profession($filter:_ProfessionFilter) {
  Profession(filter:$filter) {
    id
    Name
    Description
  }
}`;

export { GetProfessions };