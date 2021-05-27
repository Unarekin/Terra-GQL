import { assert } from "chai";
import { GraphQLClient } from "../src";

describe("Professions", async () => {
  let client: GraphQLClient = null;
  before("Creates client", () => (client = new GraphQLClient()));

  describe("Retrieves professions", async () => {
    it("By name", async () => {
      let profession = await client.GetProfession("Agriculturalist");
      assert.isOk(profession, "Unable to query database.");
      assert.property(profession, "Name");
      assert.equal(
        profession.Name,
        "Agriculturalist",
        `Expected profession name to be Agriculturalist, received ${profession.Name}`
      );
      assert.equal(
        profession.id,
        "ed558796858047e3a8c06893f67461d6",
        `Expected profession id to be ed558796858047e3a8c06893f67461d6, received ${profession.id}`
      );
    });
    it("By id", async () => {
      let profession = await client.GetProfession(
        "1fe8e1107cc041bdb2ed9645f0f431f1"
      );
      assert.isOk(profession, "Unable to query database.");
      assert.property(profession, "Name");
      assert.equal(
        profession.Name,
        "Engineer",
        `Expected profession name to be Engineer, received ${profession.Name}`
      );
      assert.equal(
        profession.id,
        "1fe8e1107cc041bdb2ed9645f0f431f1",
        `Expected profession id to be 1fe8e1107cc041bdb2ed9645f0f431f1, received ${profession.id}`
      );
    });
    it("All", async () => {
      let professions = await client.GetProfessions();
      assert.isOk(professions, "Unable to query database.");
      assert.isArray(
        professions,
        `Expected GetProfessions to return an array, received ${typeof professions}`
      );
      assert.equal(
        professions.length,
        10,
        `Expected to receive 10 professions, received ${professions.length}`
      );
    });
    it("Filtered", async () => {
      let professions = await client.GetProfessions({
        OR: [{ Name: "Medical Professional" }, { Name: "Navigator" }],
      });
      assert.isOk(professions, "Unable to query database.");
      assert.isArray(
        professions,
        `Expected GetProfessions to return array, received ${typeof professions}`
      );
      assert.equal(
        professions.length,
        2,
        `Expected GetProfessions to return 2 items, received ${professions.length}`
      );
    });
  });
});
