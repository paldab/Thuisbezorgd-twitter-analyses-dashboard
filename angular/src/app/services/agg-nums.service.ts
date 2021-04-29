import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import {environment as env} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AggNumsService {
  private SERVER_URL = env.apiUrl;

  constructor(private httpClient: HttpClient) { }

  get_data(type: string) {    
    return this.httpClient.get(`${this.SERVER_URL}/agg-numbers?t=${type}`).pipe(take(1))
  }
}
