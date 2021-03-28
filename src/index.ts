import { GraphQLClient as reqclient, gql } from 'graphql-request';
import { map, pluck, tap } from 'rxjs/operators';
import * as Queries from './Queries';
import * as Mutations from './Mutations';
import { from, Observable, throwError } from 'rxjs';

// Re-export for ease-of-import
export { gql } from 'graphql-request';

export class GraphQLClient {
  // #region Properties (5)

  private _client: reqclient = null;
  private _currentUser: any = {
    id: null,
    Name: null,
    Email: null,
    Permissions: {
      Permissions: [],
      Owns: [],
      Rank: null
    },

    hasPermission: function (perm: string): boolean { return this.Permissions.Permissions.includes(perm); },
    refresh: null
  }

  private _endpoint: string = "";
  private _getToken: () => string = () => "";

  public BearerToken: string = "";

  // #endregion Properties (5)

  // #region Constructors (1)

  /**
   * Creates a GraphQL client.
   * @param endpoint The URI to which to connect.
   * @param getToken A function to retrieve an authorization token, if applicable.
   */
  constructor(endpoint: string = "http://localhost:8080/graphql", authToken: string | (() => string) = null) {
    // Bindings
    Object.keys(this)
      .filter((key: string) => this[key] && this[key].bind)
      .forEach((key: string) => { this[key] = this[key].bind(this); });

    this._client = new reqclient(endpoint);
    this._endpoint = endpoint;

    if (authToken && typeof (authToken) === "string")
      this.Token = authToken;
    else if (authToken && typeof (authToken) === "function")
      this._getToken = authToken;

    // Bind CurrentUser function contexts
    Object.keys(this._currentUser)
      .filter((key: string) => this._currentUser[key] && this._currentUser[key].bind)
      .forEach((key: string) => { this._currentUser[key] = this._currentUser[key].bind(this._currentUser); })
      ;
    this._currentUser.refresh = this.RefreshCurrentUser.bind(this);
  }

  // #endregion Constructors (1)

  // #region Public Accessors (4)

  public get CurrentUser() { return this._currentUser; }

  public get IsAuthenticated(): boolean { return this.Token.length > 0; }

  /** Authorization bearer token */
  public get Token(): string { return this._getToken(); }

  public set Token(val: string) { this._getToken = () => val; }

  // #endregion Public Accessors (4)

  // #region Public Methods (6)

  /**
   * Authenticates against the server, storing an authentication token and our current user.
   * @param username 
   * @param password 
   */
  public async Authenticate(username: string, password: string): Promise<boolean> {
    let token = await from(this.request(Mutations.Authenticate, { email: username, password }))
      .pipe(
        map(res => {
          if (res.errors)
            throw new Error(res.errors[0].message);
          return res;
        }),
        pluck('AuthenticateUser')
      ).toPromise();
    this.Token = token as string;

    await this.RefreshCurrentUser();

    return true;
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

  /** */
  public async Logout() {
    return this.request(Mutations.LogOut)
      .then((res) => {
        this.Token = "";
        return res;
      });
  }

  /**
   * Queries the server for our current user, caching the results.
   */
  public async RefreshCurrentUser(): Promise<any> {
    let user = await from(this.request(Queries.CurrentUser))
      .pipe(
        tap(res => {
          if (res.errors)
            throw new Error(res.errors[0].message);
        }),
        pluck('CurrentUser')
      ).toPromise();

    // Quick dupe, preserving the original object reference.
    Object.keys(user)
      .forEach((key: string) => {
        this._currentUser[key] = user[key];
      });
    return this.CurrentUser;
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

  // #endregion Public Methods (6)
}