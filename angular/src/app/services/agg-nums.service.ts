import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment as env} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AggNumsService {
  private SERVER_URL = env.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getData(type: string) {
    const params = new HttpParams().set('t', type);

    return this.httpClient.get(`${this.SERVER_URL}/agg-numbers`, {params});
  }
}
