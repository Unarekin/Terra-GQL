import { assert } from 'chai';
import { GraphQLClient } from '../src';

const USERNAME = "erica@blacksporkl.com";
const PASSWORD = "Ecuipe97!";

describe("Authentication", () => {
  let client: GraphQLClient = null;
  before("Creates client", () => { client = new GraphQLClient(); });

  it("Can authenticate", async () => {
    await client.Authenticate(USERNAME, PASSWORD);
    assert.isTrue(client.IsAuthenticated);
    assert.isOk(client.Token);
  })
})