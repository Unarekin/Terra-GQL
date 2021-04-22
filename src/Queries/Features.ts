import { gql } from "graphql-request";

const GetFeatures = gql`
  query Feature($filter: _FeatureFilter) {
    Feature(filter: $filter) {
      id
      Name
      Description
    }
  }
`;

export { GetFeatures };
