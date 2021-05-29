import {Component, Input, OnInit} from '@angular/core';
import {TweetsService} from '../services/tweets.service';
import {sentiment} from '../interfaces/layout'
import {ActivatedRoute, Router} from "@angular/router";

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

  constructor(private tweetsService: TweetsService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(value => {
      let filter: any = null;

      if (value.filter) {
        filter = value.filter;
      }

      switch (this.component.type.split(':')[1]) {
        case "grouped":
          this.getGroupedCount(filter);
          break;

        case "sentiment":
          this.getSortedGroupedTweets();
          break;

        case "timeline":
          this.getAllTweetsByFilter(undefined, filter);
          break;
      }
    });
  }

  private getSentimentCount(): void {
    this.tweetsService.getSentimentCount().subscribe(
      sentimentData => {
        const parsedData = JSON.parse(sentimentData.toString())
        const {data} = parsedData
        const sentimentNames: any = []
        const sentimentValues: any = []

        data.forEach((row: sentiment) => {
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

  private getSortedGroupedTweets(): void {
    this.tweetsService.groupedTweets().subscribe((data: any) => {
      data.delivery_data = JSON.parse(data.delivery_data)
      data.restaurant_data = JSON.parse(data.restaurant_data)
      data.remaining_data = JSON.parse(data.remaining_data)

      const {delivery_data, restaurant_data, remaining_data} = data
      console.log(data);

      let deliveryStats = {
        negCount: 0,
        posCount: 0,
        neutralCount: 0
      }

      let restaurantStats = {
        negCount: 0,
        posCount: 0,
        neutralCount: 0
      }

      let remainingStats = {
        negCount: 0,
        posCount: 0,
        neutralCount: 0
      }

      delivery_data.forEach((row: any) => {
        if (row.sentiment == "Negative") {
          deliveryStats.negCount++;
        }
        if (row.sentiment == "Positive") {
          deliveryStats.posCount++;
        }
        if (row.sentiment == "Neutral") {
          deliveryStats.neutralCount++;
        }
      })

      restaurant_data.forEach((row: any) => {
        if (row.sentiment == "Negative") {
          restaurantStats.negCount++;
        }
        if (row.sentiment == "Positive") {
          restaurantStats.posCount++;
        }
        if (row.sentiment == "Neutral") {
          restaurantStats.neutralCount++;
        }
      })

      remaining_data.forEach((row: any) => {
        if (row.sentiment == "Negative") {
          remainingStats.negCount++;
        }
        if (row.sentiment == "Positive") {
          remainingStats.posCount++;
        }
        if (row.sentiment == "Neutral") {
          remainingStats.neutralCount++;
        }
      })


      const labels = ["Negative", "Neutral", "Positive"]

      const deliverySentiment = {
        x: labels,
        y: [deliveryStats.negCount, deliveryStats.neutralCount, deliveryStats.posCount],
        name: "Delivery",
        type: 'bar'
      }
      const restaurantSentiment = {
        x: labels,
        y: [restaurantStats.negCount, restaurantStats.neutralCount, restaurantStats.posCount],
        name: "Restaurant",
        type: 'bar'
      }

      const remainingSentiment = {
        x: labels,
        y: [remainingStats.negCount, remainingStats.neutralCount, remainingStats.posCount],
        name: "Overig",
        type: 'bar'
      }

      const mergedData = [restaurantSentiment, deliverySentiment, remainingSentiment]

      // plot the graph
      this.plot_data = {
        data: mergedData,
        layout: {width: 600, height: 400, barmode: 'stack'}
      }
    })
  }

  private getGroupedCount(dateFilter?: string): void {
    this.tweetsService.groupedTweets(dateFilter).subscribe(
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

  getAllTweetsByFilter(filter?: string, dateFilter?: string): void {
    this.tweetsService.tweetDates = [];
    this.tweetsService.amountOfTweets = [];

    this.tweetsService.allTweets(filter).subscribe(
      data => {
        this.tweetsService.orderedTweetsArray = data.slice(0, this.tweetsService.tweetLimit);

        // Set data to datasource
        if (dateFilter) {
          const filteredDates = data.filter((tweet: any) => {
            const filterDate = new Date(dateFilter);
            const entryDate = new Date(tweet.created_at);

            return filterDate.getDate() === entryDate.getDate() && filterDate.getMonth() === entryDate.getMonth()
              && filterDate.getFullYear() === entryDate.getFullYear();
          });

          // TODO: Fix ?filter=2021-4-27 display all tweets if lesser than limit
          this.tweetsService.orderedTweetsArray = filteredDates.slice(0, this.tweetsService.tweetLimit);
        }

        this.tweetsService.dataSource.data = this.tweetsService.orderedTweetsArray;

        if (filter == 'd') {
          // retrieve date from first entry and push it to the tweetDates array.
          this.tweetsService.tweetDates.push(data[0].created_at.substr(5, 7));
          // retrieve the length of data and push it to the amountOfTweets array.
          this.tweetsService.amountOfTweets.push(data.length);
        }

        if (filter == 'm' || filter == 'w' || !filter) {
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

  filterByDate(event: any, type: string): void {
    if (type.split(':')[1] === 'timeline') {
      const selectedDate = new Date(event.points[0].x);
      selectedDate.setFullYear(new Date().getFullYear());

      this.router.navigate(['dashboard'], {
          queryParams:
            {filter: `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`}
        }
      );
    }
  }
}
