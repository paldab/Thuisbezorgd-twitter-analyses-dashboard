import { Component, Input, OnInit } from '@angular/core';
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

  array1: any[] = []
  array2: any[] = []







  _plot_data: any = undefined;
  sentimentArray: any[] = []

  public get plot_data() {
    return this._plot_data;
  }

  public set plot_data(data) {
    this._plot_data = data;
  }

  constructor(private tweetsService: TweetsService) { }

  ngOnInit(): void {

    switch(this.component.type.split(':')[1]) {
      case "grouped":
        this.getGroupedCount();
        break;

      case "hashtag":
        this.getHashtags();
        break;

      case "sentiment":
        this.getSentimentCount();
        break;

      case "timeline":
        this.getAllTweetsByFilter('m');
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


  private getHashtags(): void {
    this.tweetsService.users().subscribe(
      userdata => {
        console.log(userdata)
        const hoi = Object.values(userdata);
       
        
        for (let index = 0; index < hoi.length; index++) {
          this.array1.push(hoi[index].created_at);
          this.array2.push(hoi[index].user_screenname);          
        }
      

      }
      );

      

        this.plot_data = {
          data: [
              {
                x: this.array1,
                y: this.array2,
                name: 'Users',
                type: 'line',
                marker: {
                  color: '#ff9800'
                }
              }
          ],
          layout: {width: 600, height: 400}
        }
      
  }

  getAllTweetsByFilter(filter: string): void {
    console.log(filter);

    this.tweetsService.tweetDates = [];
    this.tweetsService.amountOfTweets = [];

    this.tweetsService.allTweets(filter).subscribe(
      data => {
        // retrieve 5 tweets from data.
        for (let i = 0; i < this.tweetsService.tweetLimit; i++) {
          this.tweetsService.orderedTweetsArray[i] = data[i];
        }
        // Set data to datasource
        this.tweetsService.dataSource.data = this.tweetsService.orderedTweetsArray;

        if(filter == 'd') {
          // retrieve date from first entry and push it to the tweetDates array.
          this.tweetsService.tweetDates.push(data[0].created_at.substr(5, 7));
          // retrieve the length of data and push it to the amountOfTweets array.
          this.tweetsService.amountOfTweets.push(data.length);
        }

        if(filter == 'm' || filter == 'w') {
          // retrieve all created_at values and store them in an array.
          let tweetDates: string[] = data.map(tweet => tweet['created_at'].substr(5, 7));
          // filter unique dates out of the array.
          this.tweetsService.tweetDates = tweetDates.filter(this.tweetsService.unique);
          
          // foreach unique tweet date
          for (let i = 0; i < this.tweetsService.tweetDates.length; i++) {
            let totalTweets = 0;
            for (let j = 0; j < data.length; j++) {
              if (this.tweetsService.tweetDates[i] === data[j].created_at.substr(5, 7)) {
                totalTweets++;
              }
            }
            this.tweetsService.amountOfTweets[i] = totalTweets;
          }
        }

        this.plot_data = {
          data: [{
            x: this.tweetsService.tweetDates,
            y: this.tweetsService.amountOfTweets,
            type: 'bar',
            marker: {
              color: '#ff9800'
            }
          }],
          layout: {width: 300, height: 300}
        }
      },
    );
  }
}