import { gql } from 'graphql-request';

const GetFaiths = gql`query Faith($filter:_FaithFilter) {
  Faith(filter:$filter) {
    id
    Name
    Description
  }
}`;

export {
  GetFaiths
};