import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EpicApiService {
  readonly #apiBaseUrl = 'http://localhost:5005';

  constructor(private _http: HttpClient) {
  }

  makeTestCallToEpicApi(idToken: string | undefined) {
    if (!idToken) {
      throw new Error("ID token is missing");
    }
    const headers = new HttpHeaders({
      'Accept': '*/*',
      'Authorization': `Bearer ${idToken}`
    });
    return this._http.get(`${this.#apiBaseUrl}/Test`, {headers});
  }

}
