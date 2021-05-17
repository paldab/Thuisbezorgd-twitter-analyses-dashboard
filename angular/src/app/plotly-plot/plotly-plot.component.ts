import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TweetsService } from '../services/tweets.service';
import { sentiment } from '../interfaces/layout'
@Component({
  selector: 'app-plotly-plot',
  templateUrl: './plotly-plot.component.html',
  styleUrls: ['./plotly-plot.component.scss']
})
export class PlotlyPlotComponent implements OnInit {
  @Input() component: any;
  
  req_succeeded: any;
  
  groupedTweetsKeys!: string[];
  groupedTweetsVals!: any[];


  _plot_data: any = undefined;
  sentimentArray: any[] = []

  public get plot_data() {
    return this._plot_data;
  }

  public set plot_data(data) {
    this._plot_data = data;
  }

  constructor(private tweetsService: TweetsService) {
    this.tweetsService.mostRecentTweets('m');
  }

  ngOnInit(): void {

    switch(this.component.type.split(':')[1]) {
      case "grouped":
        this.getGroupedCount();
        break;

      case "sentiment":
        this.getSentimentCount();
        break;

      case "timeline":
        this.getAllTweetsMonth();
        break;
    }
  }
    
  private getSentimentCount(){
    this.tweetsService.getSentimentCount().subscribe(
      sentimentData =>{
        const parsedData = JSON.parse(sentimentData.toString())
        const {data} = parsedData
        const sentimentNames: any = []
        const sentimentValues: any = []
        
        data.forEach((row: sentiment) =>{
          let {sentiment, values} = row
          sentimentNames.push(sentiment)
          sentimentValues.push(values)
        })
        this.sentimentArray.push(sentimentNames, sentimentValues)
        this.plot_data = {
          data: [
            {
              x: this.sentimentArray[0],
              y: this.sentimentArray[1],
              type: 'bar',
              marker: {
                color: '#ff9800'
              }
            },
          ],
          layout: {width: 600, height: 400}
        }
      }
    )
  }

  private getGroupedCount(): void {
    this.tweetsService.groupedTweets().subscribe(
      data => {
        this.groupedTweetsKeys = Object.keys(data);
        this.groupedTweetsVals = Object.values(data);

        this.plot_data = {
          data: [
            {
              x: this.groupedTweetsKeys,
              y: this.groupedTweetsVals,
              type: 'bar',
              marker: {
                color: '#ff9800'
              }
            },
          ],
          layout: {width: 600, height: 400}
        }
      }
    );
  }


  getAllTweetsMonth(): void {
    this.tweetsService.mostRecentTweets('m');
    this.tweetsService.usedChar = 'm';
    this.tweetsService.countable = 5;

    this.tweetsService.createDate.length = 0;
    this.tweetsService.tweetsADay.length = 0;
    this.tweetsService.allTweets('m').subscribe(
      data => {
        let counter = 0;
        for (let index = 1; index < data.length - 1; index++) {
          if (data[index - 1].created_at.substr(5, 7) !== data[index].created_at.substr(5, 7)) {
            counter = counter + 1;
            this.tweetsService.createDate.push(data[index].created_at.substr(5, 7));
          }
        }
        let teller = 0;
        for (let index = 0; index < this.tweetsService.createDate.length; index++) {
          let tweetscounter = 0;
          for (let index = 0; index < data.length; index++) {
            if (this.tweetsService.createDate[teller] === data[index].created_at.substr(5, 7)) {
              tweetscounter = tweetscounter + 1;
            }
          }
          teller = teller + 1;
          this.tweetsService.tweetsADay[index] = tweetscounter;
        }
        this.plot_data = {
          data: [{
            x: this.tweetsService.createDate,
            y: this.tweetsService.tweetsADay,
            type: 'bar',
            marker: {
              color: '#ff9800'
            }
          }],
          layout: {width: 300, height: 300}
        }
      },
      err => {
        this.req_succeeded = err.ok;
        console.error(err);
      }
    );
  }

  getAllTweetsDay(): void {
    this.tweetsService.mostRecentTweets('d');
    this.tweetsService.usedChar = 'd';
    this.tweetsService.countable = 5;

    this.tweetsService.createDate.length = 0;
    this.tweetsService.tweetsADay.length = 0;
    this.tweetsService.allTweets('d').subscribe(
      data => {
        console.log(data);
        let counter = 0;
        for (let index = 0; index < 1; index++) {
          counter = counter + 1;
          console.log(data[index].created_at);
          this.tweetsService.createDate.push(data[index].created_at.substr(5, 7));
        }
        let teller = 0;
        for (let index = 0; index < this.tweetsService.createDate.length; index++) {
          let tweetscounter = 0;
          for (let index = 0; index < data.length; index++) {
            if (this.tweetsService.createDate[teller] === data[index].created_at.substr(5, 7)) {
              tweetscounter = tweetscounter + 1;
            }
          }
          teller = teller + 1;
          this.tweetsService.tweetsADay[index] = tweetscounter;
        }

        this.plot_data = {
          data: [{
            x: this.tweetsService.createDate,
            y: this.tweetsService.tweetsADay,
            type: 'bar',
            marker: {
              color: '#ff9800'
            }
          }],
          layout: {width: 300, height: 300}
        }
      },
      err => {
        this.req_succeeded = err.ok;
      }
    );
  }

  getAllTweetsWeek(): void {
    this.tweetsService.mostRecentTweets('w');
    this.tweetsService.usedChar = 'w';
    this.tweetsService.countable = 5;

    this.tweetsService.createDate.length = 0;
    this.tweetsService.tweetsADay.length = 0;
    this.tweetsService.allTweets('w').subscribe(
      data => {
        console.log(data);
        console.log(data[0].created_at.substr(0, 17));
        let counter = 0;
        for (let index = 1; index < data.length - 1; index++) {
          if (data[index - 1].created_at.substr(5, 7) !== data[index].created_at.substr(5, 7)) {
            counter = counter + 1;
            console.log(data[index].created_at);
            this.tweetsService.createDate.push(data[index].created_at.substr(5, 7));
          }
        }
        let teller = 0;
        for (let index = 0; index < this.tweetsService.createDate.length; index++) {
          let tweetscounter = 0;
          for (let index = 0; index < data.length; index++) {
            if (this.tweetsService.createDate[teller] === data[index].created_at.substr(5, 7)) {
              tweetscounter = tweetscounter + 1;
            }
          }
          teller = teller + 1;
          this.tweetsService.tweetsADay[index] = tweetscounter;
        }

        this.plot_data = {
          data: [{
            x: this.tweetsService.createDate,
            y: this.tweetsService.tweetsADay,
            type: 'bar',
            marker: {
              color: '#ff9800'
            }
          }],
          layout: {width: 300, height: 300}
        }
      },
      err => {
        this.req_succeeded = err.ok;
        console.error(err);
      }
    );
  }
}
