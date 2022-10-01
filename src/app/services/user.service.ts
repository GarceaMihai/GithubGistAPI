import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getAvatar(avatar_url: string): Observable<Blob> {
    return this.httpClient.get<Blob>(avatar_url, {responseType: 'blob' as 'json'});
  }
}
