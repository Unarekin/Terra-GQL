import { gql } from 'graphql-request';

const GetSpecies = gql`query Species($filter:_SpeciesFilter) {
  Species(filter:$filter) {
    id
    Name
    Description
  }
}`;

export { GetSpecies };