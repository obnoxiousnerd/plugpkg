import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

type UIDReq = { uid: string };

type GetAccessTokenRes = { token: string };
export type UserScopesRes = {
  scopes: {
    name: string;
    role: 'owner' | 'can-write';
  }[];
  /**
   * Will be present if user has no scopes
   */
  message?: string;
};
export type CreateScopeReq = {
  scope: string;
  uid: string;
  writeAccessUIDs: string[];
};
export type CreateScopeRes = {
  name: string;
  owner: string;
  writeAccessUsers: string[];
};

/**
 * Service to talk to the PlugPKG REST API based on Firebase Cloud Functions.
 */
@Injectable({
  providedIn: 'root',
})
export class RestService {
  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}
  getAccessToken(req: UIDReq): Promise<GetAccessTokenRes> {
    const res = this.http.get<GetAccessTokenRes>(`/api/tokens/${req.uid}`, {
      responseType: 'json',
      withCredentials: true,
    });
    return res.toPromise();
  }
  getUserScopes(uid: string): Promise<UserScopesRes> {
    const res = this.http.get(`/api/users/scopes/${uid}`, {
      responseType: 'json',
      withCredentials: true,
    });
    return res.toPromise() as Promise<UserScopesRes>;
  }
  /**
   * Create a scope
   */
  async createScope({
    scope,
    uid,
    writeAccessUIDs,
  }: CreateScopeReq): Promise<boolean> {
    const request = this.http
      .post(`/api/scopes/${scope}`, { uid, writeAccessUIDs })
      .toPromise() as Promise<HttpResponse<unknown>>;
    const res = await request;
    if (res.status === 201) return true;
    else return false;
  }
  /**
   * API that gets documents from Firestore and saves us some reads
   * @param url The path of the document
   * @param fromServer Whether get a fresh copy from server or not
   */
  getDocFromFirestore<T = unknown>(
    url: string,
    fromServer?: boolean
  ): Observable<firebase.firestore.DocumentSnapshot<T>> {
    const obs: Observable<firebase.firestore.DocumentSnapshot<
      T
    >> = new Observable((sub) => {
      this.db
        .doc(url)
        .ref.get({ source: !fromServer ? 'cache' : 'server' })
        .then((doc: firebase.firestore.DocumentSnapshot<T>) => sub.next(doc))
        .catch((e) => {
          if (e.code === 'unavailable' && !fromServer) {
            this.db
              .doc(url)
              .ref.get()
              .then((doc: firebase.firestore.DocumentSnapshot<T>) =>
                sub.next(doc)
              )
              .catch((e) => {
                throw e;
              });
          }
        });
    });
    return obs;
  }
}
