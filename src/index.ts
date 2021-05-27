import { GraphQLClient as reqclient, gql } from "graphql-request";
import { map, pluck, tap } from "rxjs/operators";
import { from, iif, Observable, throwError } from "rxjs";

import * as Queries from "./Queries";
import * as Mutations from "./Mutations";
import { Character, Feature } from "./interfaces";

// Re-export for ease-of-import
export { gql } from "graphql-request";

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
      Rank: null,
    },

    hasPermission: function (perm: string): boolean {
      return this.Permissions.Permissions.includes(perm);
    },
    refresh: null,
  };

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
  constructor(
    endpoint: string = "http://localhost:8080/graphql",
    authToken: string | (() => string) = null
  ) {
    // Bindings
    Object.keys(this)
      .filter((key: string) => this[key] && this[key].bind)
      .forEach((key: string) => {
        this[key] = this[key].bind(this);
      });

    this._client = new reqclient(endpoint);
    this._endpoint = endpoint;

    if (authToken && typeof authToken === "string") this.Token = authToken;
    else if (authToken && typeof authToken === "function")
      this._getToken = authToken;

    // Bind CurrentUser function contexts
    Object.keys(this._currentUser)
      .filter(
        (key: string) => this._currentUser[key] && this._currentUser[key].bind
      )
      .forEach((key: string) => {
        this._currentUser[key] = this._currentUser[key].bind(this._currentUser);
      });
    this._currentUser.refresh = this.RefreshCurrentUser.bind(this);
  }

  // #endregion Constructors (1)

  // #region Public Accessors (4)

  public get CurrentUser() {
    return this._currentUser;
  }

  public get IsAuthenticated(): boolean {
    return this.Token.length > 0;
  }

  /** Authorization bearer token */
  public get Token(): string {
    return this._getToken();
  }

  public set Token(val: string) {
    this._getToken = () => val;
  }

  // #endregion Public Accessors (4)

  // #region Public Methods (11)

  /**
   * Authenticates against the server, storing an authentication token and our current user.
   * @param username
   * @param password
   */
  public async Authenticate(
    username: string,
    password: string
  ): Promise<boolean> {
    let token = await from(
      this.request(Mutations.Authenticate, { email: username, password })
    )
      .pipe(
        map((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
          return res;
        }),
        pluck("AuthenticateUser")
      )
      .toPromise();
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
    return from(
      this.request(Queries.GetClusters, {
        filter: { OR: [{ Name: criterion }, { id: criterion }] },
      })
    )
      .pipe(
        map((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
          return res;
        }),
        pluck("Cluster", "0")
      )
      .toPromise();
  }

  /**
   * Retrieves a feature by a given name or id
   * @param criterion
   * @returns Promise<Feature>
   */
  public async GetFeature(criterion: string): Promise<Feature> {
    return from(
      this.request(Queries.GetFeatures, {
        filter: { OR: [{ Name: criterion }, { id: criterion }] },
      })
    )
      .pipe(
        map((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
          return res;
        }),
        pluck("Feature", "0")
      )
      .toPromise();
  }

  /**
   * Retrieves a list of features that match a given filter
   * @param filter
   * @returns Promise<Feature[]>
   */
  public async GetFeatures(filter: any = null): Promise<Feature[]> {
    return from(this.request(Queries.GetFeatures, { filter }))
      .pipe(
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("Feature")
      )
      .toPromise();
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
        map((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
          return res;
        }),
        pluck("Cluster")
      )
      .toPromise();
  }

  /**
   *
   * @param criterion
   * @returns
   */
  public async GetFaith(criterion: string) {
    return from(
      this.request(Queries.GetFaiths, {
        filter: { OR: [{ id: criterion }, { Name: criterion }] },
      })
    )
      .pipe(
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("Faith"),
        map((res) => res[0])
      )
      .toPromise();
  }

  /**
   *
   * @param filter
   * @returns
   */
  public async GetFaiths(filter?) {
    return from(this.request(Queries.GetFaiths, { filter }))
      .pipe(
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("Faith")
      )
      .toPromise();
  }

  /**
   *
   * @param criterion
   * @returns
   */
  public async GetProfession(criterion: string) {
    return from(
      this.request(Queries.GetProfessions, {
        filter: { OR: [{ Name: criterion }, { id: criterion }] },
      })
    )
      .pipe(
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("Profession"),
        map((res) => res[0])
      )
      .toPromise();
  }

  /**
   *
   * @param filter
   * @returns
   */
  public async GetProfessions(filter?) {
    return from(this.request(Queries.GetProfessions, { filter }))
      .pipe(
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("Profession")
      )
      .toPromise();
  }

  /** Retrieves a character by ID. */
  public async GetCharacterById(id: string): Promise<Character> {
    return from(this.request(Queries.GetCharacterById, { id }))
      .pipe(
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("Character", "0")
      )
      .toPromise();
  }

  /** Retrieves characters by filter criteria */
  public async GetCharacters(filter: any): Promise<Character[]> {
    return from(this.request(Queries.GetCharacters, { filter }))
      .pipe(
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("Character")
      )
      .toPromise();
  }

  /** Retrieves all characters for a given user. */
  public async GetCharactersForUser(user: string): Promise<Character[]> {
    return from(this.request(Queries.GetCharactersForUser, { user }))
      .pipe(
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("User", "Character")
      )
      .toPromise();
  }

  public async GetCharactersForCurrentUser(): Promise<Character[]> {
    return from(
      this.request(Queries.GetCharactersForUser, { user: this.CurrentUser.id })
    )
      .pipe(
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("User", "0", "Characters")
      )
      .toPromise();
  }

  /** Create a character **/
  public async CreateCharacter(
    data: {
      Name: string;
      Description?: string;
      Species: string;
      Profession: string;
      Faith?: string;
      Features: string[];
      FPPs: { id: string; quantity: number }[];
    },
    Items?: { id: string; quantity: number }[]
  ): Promise<string> {
    return from(this.request(Mutations.CreateCharacter, data))
      .pipe(
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("CreateFullCharacter")
      )
      .toPromise() as Promise<string>;
  }

  /**
   *
   * @param filter
   */
  public async GetSpecies(filter?: string | object): Promise<any | any[]> {
    let criteria = {};
    let retSingle: boolean = false;

    if (typeof filter === "string") {
      criteria = { OR: [{ Name: filter }, { id: filter }] };
      retSingle = true;
    } else if (filter) {
      criteria = filter;
    }
    return from(this.request(Queries.GetSpecies, { filter: criteria }))
      .pipe(
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("Species"),
        map((res) => {
          if (retSingle) return res[0];
          else return res;
        })
      )
      .toPromise();
  }

  /** */
  public async Logout() {
    return this.request(Mutations.LogOut).then((res) => {
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
        tap((res) => {
          if (res.errors) throw new Error(res.errors[0].message);
        }),
        pluck("CurrentUser")
      )
      .toPromise();

    // Quick dupe, preserving the original object reference.
    Object.keys(user).forEach((key: string) => {
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
    if (token) headers.authorization = `Bearer ${token}`;
    return this._client.request(query, params, headers);
  }

  // #endregion Public Methods (11)
}
