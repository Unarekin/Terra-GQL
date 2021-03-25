import { GraphQLClient as reqclient, gql } from 'graphql-request';
import { map, pluck } from 'rxjs/operators';
import * as Queries from './Queries';
import * as Mutations from './Mutations';
import { from, Observable, throwError } from 'rxjs';

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

  public get IsAuthenticated(): boolean { return this.Token.length > 0; }

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

  /**
   * 
   * @param username 
   * @param password 
   */
  public async Authenticate(username: string, password: string): Promise<any> {

  }

  /**
   * 
   * @param filter 
   * @returns 
   */
  public async GetClusters(filter: any = null): Promise<any> {
    // return Observable.from(this.request(Queries.GetClusters, { filter }))
    return from(this.request(Queries.GetClusters, { filter }))
      .pipe(
        // map(console.log),
        map(res => {
          if (res.errors)
            throw new Error(res.errors[0].message);
          return res;
        }),
        pluck('Cluster')
      ).toPromise();
  }

  /**
   * 
   * @param criterion Either the name or ID of a cluster to retrieve
   * @returns 
   */
  public async GetCluster(criterion: string): Promise<any> {
    return from(this.request(Queries.GetClusters, { OR: [{ Name: criterion }, { id: criterion }] }))
      .pipe(
        map(res => {
          if (res.errors)
            throw new Error(res.errors[0].message);
          return res;
        }),
        pluck('Cluster'),
        map(res => res[0])
      ).toPromise();
  }
}