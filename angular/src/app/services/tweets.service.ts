import {HttpClient} from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Observable, of} from 'rxjs';
import {environment as env} from "../../environments/environment";
import {AllTweetsItem} from '../all-tweets/all-tweets.component';


@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  private SERVER_URL = env.apiUrl;

  orderedTweetsArray: any = new Array();
  tweetLimit: number = 5;
  dataSource!: MatTableDataSource<any>;
  tweetDates: string[] = [];
  amountOfTweets: number[] = [];

  constructor(private httpClient: HttpClient) {
    this.dataSource = new MatTableDataSource<any>();
  }

  allTweets(filter?: string): Observable<AllTweetsItem[]> {
    if (!filter) {
      return this.httpClient.get<AllTweetsItem[]>(`${this.SERVER_URL}/tweet`);
    }

    return this.httpClient.get<AllTweetsItem[]>(`${this.SERVER_URL}/tweet?f=${filter}`);
  }

  groupedTweets(dateFilter?: string) {
    if (!dateFilter) {
      return this.httpClient.get(`${this.SERVER_URL}/tweet/subject-count`);
    }

    return this.httpClient.get(`${this.SERVER_URL}/tweet/subject-count?date=${dateFilter}`);
  }

  dateFilteredTweets(startDate = '*', endDate = '*'): Observable<AllTweetsItem[]> {
    return this.httpClient.get<AllTweetsItem[]>(`${this.SERVER_URL}/tweet/date?s=${startDate}&e=${endDate}`);
  }

  getSentimentCount() {
    return this.httpClient.get(`${this.SERVER_URL}/tweet/sentiment`);
  }

  unique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }
}
