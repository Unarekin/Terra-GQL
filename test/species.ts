import { assert } from "chai";
import { GraphQLClient } from "../src";

describe.skip("Species", async () => {
  let client: GraphQLClient = null;
  before("Creates client", () => {
    client = new GraphQLClient();
  });

  describe("Retrieves species", async () => {
    it("By name", async () => {
      let species = await client.GetSpecies("Aegur");
      assert.isOk(species, "Unable to query database.");
      assert.property(species, "Name");
      assert.equal(species.Name, "Aegur");
      assert.equal(species.id, "08b452ec432d475883179463b75dde87");
    });
    it("By ID", async () => {
      let species = await client.GetSpecies("27030152b9ff44fbb07fd05f92e7b051");
      assert.isOk(species, "Unable to query database.");
      assert.property(species, "Name");
      assert.equal(species.Name, "Atloxl");
      assert.equal(species.id, "27030152b9ff44fbb07fd05f92e7b051");
    });
    it("All", async () => {
      let species = await client.GetSpecies();
      assert.isOk(species, "Unable to query database.");
      assert.isArray(
        species,
        `Expected species to be array but received ${typeof species}`
      );
      assert.isAbove(species.length, 0, "GetSpecies returned no results.");
      assert.equal(
        species.length,
        14,
        `Expected 14 species, received ${species.length}`
      );
    });
    it("Filtered", async () => {
      let species = await client.GetSpecies({
        OR: [{ Name: "Aegur" }, { Name: "Atloxl" }],
      });
      assert.isOk(species, "Unable to query database.");
      assert.isArray(
        species,
        `Expected species to be an array, but received ${typeof species}`
      );
      assert.equal(
        species.length,
        2,
        `Expected 2 species, received ${species.length}`
      );
    });
  });
});
