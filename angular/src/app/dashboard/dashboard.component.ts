import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TweetsService } from '../services/tweets.service';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  name = window.sessionStorage.getItem('user_name')?.replace(/['"]+/g, '');
  req_succeeded: boolean = true;
  public realTime: any;

  constructor(private breakpointObserver: BreakpointObserver, private tweetsService: TweetsService) {
    this.mostRecentTweets();
  }
  public isHandset = false;
  createDate: string[] = [];
  tweetsADay: number[] = [];
  orderedTweetsArray = new Array();
  countable: number = 5;

  ngOnInit(): void {
    this.getAllTweets('w');
    }

  getAllTweets(periode: string){
    this.tweetsService.all_tweets(periode).subscribe(
      data => {
        let counter = 0;

        console.log(this.createDate.length);

        if (this.createDate.length > 0){
          this.createDate = [];
          this.tweetsADay = [];
        }
        for (let index = 1; index < data.length -1; index++) {
          if (data[index -1].created_at.substr(5, 7) !== data[index].created_at.substr(5, 7) ) {
          counter = counter + 1;
          this.createDate.push(data[index].created_at.substr(5,7));
          }
        }

        let teller = 0;

        for (let index = 0; index < this.createDate.length; index++) {
          let tweetscounter = 0;
          for (let index = 0; index < data.length; index++) {
            if(this.createDate[teller] === data[index].created_at.substr(5, 7)){
              tweetscounter = tweetscounter + 1;
            }
          }
          teller = teller + 1;
          this.tweetsADay[index] = tweetscounter;
        }
      },
      err => {
        this.req_succeeded = err.ok
        console.error(err);
      }
    );    

    this.realTime = this.getTimeLine()

    setTimeout(() => {
      if (this.req_succeeded == false) {
      } else {
      }
    }, 2000)
  }

  public getTimeLine(){
    const graphData = [
      {
        title: "Time",
        cols: 1,
        rows: 1,
        data: [
          { x: this.createDate, y: this.tweetsADay, type: 'bar' },
        ],
        layout: {width: 600, height: 400}
      }
    ];
    return of(graphData)
  }

  /** Based on the screen size, switch from standard to one column per row */
  public timeline = this.breakpointObserver.observe(['(min-width: 100px)']).pipe(
    map((state:BreakpointState) => {
    console.log(state);

    return [
      {
        title: "Time",
        cols: 1,
        rows: 1,
        data: [
          { x: this.createDate, y: this.tweetsADay, type: 'bar' },
        ],
        layout: {width: 600, height: 400}
      }
    ];

    })
  );  

mostRecentTweets(): any{
  this.tweetsService.all_tweets('x').subscribe(
    data => {
let teller = 0;
      for (let index = data.length; index > data.length - this.countable; index--) {
        this.orderedTweetsArray[teller] = data[index-1];
        teller = teller + 1;
        // console.log(index); 
      }

});
}

}
