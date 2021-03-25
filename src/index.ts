import { GraphQLClient as reqclient, gql } from 'graphql-request';
import { pluck } from 'rxjs/operators';

// Re-export for ease-of-import
export { gql } from 'graphql-request';

export class GraphQLClient {

  private _client: reqclient = null;
  private _endpoint: string = "";

  /** Authorization bearer token */
  public get Token(): string { return this._getToken(); }
  public set Token(val: string) { this._getToken = () => val; }

  private _getToken: () => string = () => "";

  public BearerToken: string = "";


  /**
   * Creates a GraphQL client.
   * @param endpoint The URI to which to connect.
   * @param getToken A function to retrieve an authorization token, if applicable.
   */
  constructor(endpoint: string = "http://localhost:8080/graphql", authToken: string | (() => string) = null) {
    this._client = new reqclient(endpoint);
    this._endpoint = endpoint;

    if (authToken && typeof (authToken) === "string")
      this.Token = authToken;
    else if (authToken && typeof (authToken) === "function")
      this._getToken = authToken;
  }



  /**
   * Low(ish)-level query wrapper.
   * @param query The query/mutation to run.
   * @param params Any variables to be passed to the query.
   * @returns A promise that resolves with the results of the query.
   */
  public async request(query: string, params: any = {}): Promise<any> {
    let headers: any = {};
    // let token = localStorage.getItem("gql_auth_token");
    let token: string = this._getToken();
    if (token)
      headers.authorization = `Bearer ${token}`;
    return this._client.request(query, params, headers);
  }
}