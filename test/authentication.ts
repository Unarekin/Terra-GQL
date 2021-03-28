import { assert } from 'chai';
import { GraphQLClient } from '../src';

const USERNAME = "erica@blackspork.com";
const PASSWORD = "Ecuipe97!";

describe("Authentication", () => {
  let client: GraphQLClient = null;
  before("Creates client", () => { client = new GraphQLClient(); });

  it("Cannot fetch current user while logged out", async () => {
    try {
      let user = await client.CurrentUser();
      throw new Error("Expected CurrentUser() to throw error.");
    } catch (err) { }
  });

  it("Cannot log out while not logged in", async () => {
    try {
      await client.Logout();
      throw new Error("Expected Logout() to throw error.");
    } catch (err) { }
  })

  it("Can authenticate", async () => {
    await client.Authenticate(USERNAME, PASSWORD);
    assert.isTrue(client.IsAuthenticated, `Expected isAuthenticated to be true, but returned ${client.IsAuthenticated}`);
    assert.isOk(client.Token, `Client does not have stored token.`);
  });

  it("Can get current user", async () => {
    assert.isOk(client.CurrentUser, "Client does not have a CurrentUser set.");
    assert.property(client.CurrentUser, "Email", "Expected CurrentUser to have an Email property.");
    assert.equal(client.CurrentUser.Email, USERNAME, `Expected CurrentUser email to be ${USERNAME}, but found ${client.CurrentUser.Email}`);
  });

  it("Can check permissions", async () => {
    assert.isOk(client.CurrentUser, "Expected client to have a CurrentUser");
    assert.property(client.CurrentUser, "hasPermission", "Expected CurrentUser to have a hasPermission() function.");
    assert.isFunction(client.CurrentUser.hasPermission, `CurrentUser.hasPermission expected to be a function, but is ${typeof (client.CurrentUser.hasPermission)}`);
    assert.isTrue(client.CurrentUser.hasPermission("ACCESS_ADMIN"), "Expected CurrentUser to have ACCESS_ADMIN permission.");
    assert.isFalse(client.CurrentUser.hasPermission("UNKNOWN_PERMISSION"), "Expected CurrentUser to NOT have UNKNOWN_PERMISSION permission.");
  });

  it("Can refresh current user", async () => {
    await client.CurrentUser.refresh();
    await client.RefreshCurrentUser();
  })


  it("Can log out", async () => {
    await client.Logout();
    assert.isFalse(client.IsAuthenticated, `Expected IsAuthenticated to false, but received ${client.IsAuthenticated}`);
    assert.notOk(client.Token, `Client seems to be retaining login token.`);
  });
})