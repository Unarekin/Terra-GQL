import { assert } from "chai";
import { GraphQLClient } from "../src";

describe("Characters", async () => {
  let client: GraphQLClient = null;
  before("Creates client", () => {
    client = new GraphQLClient();
  });

  it("Cannot create a character with not authenticated", async () => {});
});
