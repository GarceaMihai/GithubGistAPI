import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClient) { }

  getFileContent(rawUrl: string): Observable<any> {
    return this.httpClient.get(rawUrl, {responseType: 'text'});
  }
}
