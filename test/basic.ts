import { expect, assert, should } from "chai";
import { GraphQLClient, gql } from "../src/";

describe.skip("Basic Requests", () => {
  let client: GraphQLClient = null;
  before("Creates library", () => {
    client = new GraphQLClient();
  });
});
