import { assert } from 'chai';
import { GraphQLClient, gql } from '../src';

describe("Clusters", () => {
  let client: GraphQLClient = null;
  before("Creates client", () => {
    client = new GraphQLClient();
  });

  it("Fetches clusters", async () => {
    let res = await GraphQLClient.GetClusters();
    assert.isOk(res, "Unable to query database.");
    assert.property(res, "data", "Unable to query database.");
    assert.notProperty(res, "errors", `Query returned errors: ${res.errors[0].message}`);
    assert.property(res.data, "Clusters", "Query response did not include Clusters.");
    assert.isArray(res.data.Clusters, "Response clusters is not an array.");
    assert.isAbove(res.data.Clusters.length, 0, "Response returned no clusters.");
  })
});