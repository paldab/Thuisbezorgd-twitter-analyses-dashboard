import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {environment as env} from "../../environments/environment";
import { AllTweetsItem } from '../all-tweets/all-tweets.component';


@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  private SERVER_URL = env.apiUrl;

  constructor(private httpClient: HttpClient) { }

  all_tweets(filter = '*'): Observable<AllTweetsItem[]> {    
    return this.httpClient.get<AllTweetsItem[]>(`${this.SERVER_URL}/all-tweets?f=${filter}`)
  }

}