import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment as env} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AggNumsService {
  private SERVER_URL = env.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getData(type: string, periodFilter?: string, dateFilter?: string) {
    let params = new HttpParams().set('t', type);

    if (dateFilter) {
      params = params.set('date', dateFilter);
    }

    if (periodFilter) {
      params = params.set('f', periodFilter);
    }

    return this.httpClient.get(`${this.SERVER_URL}/agg-numbers`, {params});
  }
}
