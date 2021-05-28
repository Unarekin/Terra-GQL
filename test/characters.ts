import { assert } from "chai";
import { GraphQLClient } from "../src";
import { Character } from "../src/interfaces";
import { GetCharacterById } from "../src/Queries";

const USERNAME = "erica@blackspork.com";
const PASSWORD = "";

describe("Characters", async () => {
  let client: GraphQLClient = null;

  let TestCharacter: Character = {
    id: "",
    Name: "Test Character",
    Description: "A test character, from TerraGQL unit tests.",
    Created: new Date(),
    HP: 5,
    MaxHP: 5,
    Features: [],
    ClusterFPPs: [],
    Items: [],
    Species: "bddc0b97172344c7878c15c1f59f1f3a",
    Profession: "1fe8e1107cc041bdb2ed9645f0f431f1",
  };

  before("Creates client", async () => {
    client = new GraphQLClient();
  });

  it("Cannot create a character while not authenticated", async () => {
    try {
      let id = await client.CreateCharacter({
        Name: TestCharacter.Name,
        Description: TestCharacter.Description,
        Species: TestCharacter.Species,
        Faith: TestCharacter.Faith,
        Profession: TestCharacter.Profession,
        Features: TestCharacter.Features.map((feature) => feature.id),
        FPPs: TestCharacter.ClusterFPPs.map((item) => ({
          id: item.Cluster,
          quantity: item.FPP,
        })),
      });
      throw new Error("Expected CreateCharacter to throw an error.");
    } catch (err) {}
  });

  it("Can create character", async () => {
    await client.Authenticate(USERNAME, PASSWORD);
    TestCharacter.id = await client.CreateCharacter({
      Name: TestCharacter.Name,
      Description: TestCharacter.Description,
      Species: TestCharacter.Species,
      Faith: TestCharacter.Faith,
      Profession: TestCharacter.Profession,
      Features: TestCharacter.Features.map((feature) => feature.id),
      FPPs: TestCharacter.ClusterFPPs.map((item) => ({
        id: item.Cluster,
        quantity: item.FPP,
      })),
    });
    assert.isOk(TestCharacter.id);
    await client.Logout();
  });

  describe("Retrieves Character", async () => {
    describe("By ID", async () => {
      it("Throws on invalid ID", async () => {
        try {
          await client.Authenticate(USERNAME, PASSWORD);
          let char = await client.GetCharacterById("Invalid ID");
          throw new Error(
            "Expected GetCharacterById to throw an error with invalid ID."
          );
        } catch (err) {
        } finally {
          await client.Logout();
        }
      });
      it("Retrieves proper character", async () => {
        await client.Authenticate(USERNAME, PASSWORD);
        let character = await client.GetCharacterById(TestCharacter.id);
        assert.isOk(character);
        assert.equal(character.Name, TestCharacter.Name);
        assert.equal(character.Faith, TestCharacter.Faith);
        await client.Logout();
      });
    });
    describe("By Current User", async () => {
      it("Throws when not logged in.", async () => {
        try {
          let characters = client.GetCharactersForCurrentUser();
        } catch (err) {}
      });
      it("Returns character", async () => {
        try {
          await client.Authenticate(USERNAME, PASSWORD);
          let characters = await client.GetCharactersForCurrentUser();
          assert.isOk(characters);
          assert.isArray(characters);
          assert.isAbove(characters.length, 0);
          let character = characters[0];
          assert.equal(character.Name, TestCharacter.Name);
        } finally {
          await client.Logout();
        }
      });
    });
    describe.skip("By Filter", async () => {
      it("Returns none with invalid filter", async () => {});
      it("Only returns characters with permission", async () => {});
      it("Retrieves characters", async () => {});
    });
  });
});
