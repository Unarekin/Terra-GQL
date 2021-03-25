import { gql } from 'graphql-request';

const GetClusters = gql`{
  Cluster($filter:filter) {
    Cluster(filter:$filter) {
      id
      Name
      Description
      FeatureCount
    }
  }
}`;


export { GetClusters };