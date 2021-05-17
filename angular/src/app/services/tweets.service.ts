import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import {environment as env} from "../../environments/environment";
import { AllTweetsItem } from '../all-tweets/all-tweets.component';


@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  private SERVER_URL = env.apiUrl;

  orderedTweetsArray: any = new Array();
  usedChar: string = 'm';
  countable: number = 5;
  dataSource!: MatTableDataSource<any>;
  createDate: string[] = [];
  tweetsADay: number[] = [];

  constructor(private httpClient: HttpClient) {
      this.dataSource = new MatTableDataSource<any>();
   }

  all_tweets(filter?: string): Observable<AllTweetsItem[]> {
    return this.httpClient.get<AllTweetsItem[]>(`${this.SERVER_URL}/tweet?f=${filter}`);
  }
  grouped_tweets() {
    return this.httpClient.get(`${this.SERVER_URL}/tweet/subject-count`);
  }

  dateFiltered_tweets(startDate = '*', endDate= '*'): Observable<AllTweetsItem[]> {
    return this.httpClient.get<AllTweetsItem[]>(`${this.SERVER_URL}/tweet/date?s=${startDate}&e=${endDate}`);
  }

  getSentimentCount(){
    return this.httpClient.get(`${this.SERVER_URL}/tweet/sentiment`);
  }

  loadMoreTweetsButton(): void {
    this.countable = this.countable + 5;
    this.mostRecentTweets(this.usedChar);
  }

  mostRecentTweets(char: string): any {
    this.all_tweets(char).subscribe(
      data => {
        let teller = 0;
        for (let index = 0; index < this.countable; index++) {
          this.orderedTweetsArray[teller] = data[index];
          teller = teller + 1;
        }

        console.log(this.orderedTweetsArray);
        
        // Set data to datasource and assign MatSort to the datasource
        this.dataSource.data = this.orderedTweetsArray;

        // console.log(this.orderedTweetsArray);
      });
  }

}
