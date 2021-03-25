import { expect, assert, should } from 'chai';
import { GraphQLClient } from '../src/';

describe("Basic Tests", () => {
  let client: GraphQLClient = null;
  before("Creates library", () => {
    client = new GraphQLClient();
  });
})