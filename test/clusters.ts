import { assert } from "chai";
import { GraphQLClient, gql } from "../src";

describe.skip("Clusters", () => {
  let client: GraphQLClient = null;
  before("Creates client", () => {
    client = new GraphQLClient();
  });

  describe("Retrieves clusters", async () => {
    it("By name", async () => {
      let res = await client.GetCluster("Combat");
      assert.isOk(res);
      assert.property(res, "id");
      assert.equal(res.id, "89b97b7036c54366a19eff86a658b604");
    });

    it("By id", async () => {
      let res = await client.GetCluster("89b97b7036c54366a19eff86a658b604");
      assert.isOk(res);
      assert.property(res, "Name");
      assert.equal(res.Name, "Combat");
    });

    it("All", async () => {
      let res = await client.GetClusters();
      assert.isOk(res, "Could not query database.");
      assert.isArray(res, "Query did not return array.");
      assert.isAbove(res.length, 0, "Query returned no clusters.");
      assert.equal(
        res.length,
        6,
        `Expected 6 clusters, received ${res.length}`
      );
    });

    it("Filtered", async () => {
      let res = await client.GetClusters({
        OR: [{ Name: "Combat" }, { Name: "Support" }],
      });
      // return from(this.request(Queries.GetClusters, { OR: [{ Name: criterion }, { id: criterion }] }))
      assert.isOk(res, "Could not query database.");
      assert.isArray(res, "Query did not return array.");
      assert.isAbove(res.length, 0, "Query returned no clusters.");
      assert.equal(
        res.length,
        2,
        `Expected 6 clusters, received ${res.length}`
      );
    });
  });
});
