import { gql } from 'graphql-request';

const GetClusters = gql`query Cluster($filter:_ClusterFilter){
  Cluster(filter:$filter){
    id
	  Name
	}
}`;


export { GetClusters };