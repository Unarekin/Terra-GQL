import { assert } from "chai";
import { GraphQLClient } from "../src";

describe.skip("Retrieves Features", async () => {
  let client: GraphQLClient = null;
  before("Creates client", () => {
    client = new GraphQLClient();
  });

  it("By name", async () => {
    let feature = await client.GetFeature("Turtlepack");
    assert.isOk(feature, "Unable to query database.");
    assert.property(feature, "Name");
    assert.equal(feature.Name, "Turtlepack");
    assert.equal(feature.id, "dc57679d3d964ff0b08280acfff9f4ef");
  });
  it("By ID", async () => {
    let feature = await client.GetFeature("8993b5b84d9249ed89cf1f27de556218");
    assert.property(feature, "Name");
    assert.equal(feature.Name, "Heavy Gunner");
    assert.equal(feature.id, "8993b5b84d9249ed89cf1f27de556218");
  });
  it("All", async () => {
    let features = await client.GetFeatures();
    assert.isOk(features, "Unable to query database.");
    assert.isArray(
      features,
      `Expected features to be an array but received ${typeof features}`
    );
    assert.isAbove(features.length, 0, "GetFeatures returned no results.");
    assert.equal(
      features.length,
      422,
      `Expected 422 features, received ${features.length}`
    );
  });
  it("Filtered", async () => {
    let features = await client.GetFeatures({
      OR: [{ Name: "Mobility Mk1" }, { Name: "Lunge Mk1" }],
    });
    assert.isOk(features, "Unable to query database.");
    assert.isArray(
      features,
      `Expected features to be an array but received ${typeof features}`
    );
    assert.isAbove(features.length, 0, "GetFeatures returned no results.");
    assert.equal(
      features.length,
      2,
      `Expected 2 features, received ${features.length}`
    );

    features = await client.GetFeatures({ Name: "Nonexistent Feature" });
    assert.isOk(features, "Unable to query database.");
    assert.isOk(features, "Unable to query database.");
    assert.isArray(
      features,
      `Expected features to be an array but received ${typeof features}`
    );
    assert.equal(
      features.length,
      0,
      `Expected query to return no features, but received ${features.length}`
    );
  });
});

/*
  describe("Retrieves species", async () => {

    it("All", async () => {
      let species = await client.GetSpecies();
      assert.isOk(species, "Unable to query database.");
      assert.isArray(species, `Expected species to be array but received ${typeof (species)}`);
      assert.isAbove(species.length, 0, "GetSpecies returned no results.");
      assert.equal(species.length, 14, `Expected 14 species, received ${species.length}`);
    });
    it("Filtered", async () => {
      let species = await client.GetSpecies({ OR: [{ Name: "Aegur" }, { Name: "Atloxl" }] });
      assert.isOk(species, "Unable to query database.");
      assert.isArray(species, `Expected species to be an array, but received ${typeof (species)}`);
      assert.equal(species.length, 2, `Expected 2 species, received ${species.length}`);
    });
  })
  */
