import { Injectable } from '@angular/core';
import {BASE_URL} from "../utils/constants";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GistService {

  constructor(private httpClient: HttpClient) { }

  getListOfPublicGistsByUsername(username: string): Observable<any> {
    return this.httpClient.get<any>(BASE_URL + '/users/' + username + '/gists');
  }

  getListOfForks(forksUrl: string): Observable<any> {
    return this.httpClient.get<any>(forksUrl);
  }
}
