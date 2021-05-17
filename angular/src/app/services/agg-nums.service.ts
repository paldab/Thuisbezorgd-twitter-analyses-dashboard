import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment as env} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AggNumsService {
  private SERVER_URL = env.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getData(type: string) {    
    return this.httpClient.get(`${this.SERVER_URL}/agg-numbers?t=${type}`)
  }
}
