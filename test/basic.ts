import { expect, assert, should } from 'chai';
import { GraphQLClient, gql } from '../src/';

describe("Basic Requests", () => {
  let client: GraphQLClient = null;
  before("Creates library", () => {
    client = new GraphQLClient();
  });

  describe("Unauthenticated", () => {
    it("Retrieves Clusters", async () => {
      let res = await client.request(gql`{ Cluster { id, Name }}`);
      assert.isOk(res, "Did not receive response from server.");
      assert.property(res, "Cluster", "Expected response to have 'Cluster' property.");
      assert.isArray(res['Cluster'], "Expected response Cluster property to be an array.");
      assert.isAbove(res['Cluster'].length, 0, "Request did not return any results.");
    });
  });
})