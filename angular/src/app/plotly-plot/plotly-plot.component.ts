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
  graphObj: any = {x: [], users: [], hashtags: []};

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
      let period: any = null;

      if (value.filter) {
        filter = value.filter;
      }

      if (value.period) {
        period = value.period;
      }

      switch (this.component.type.split(':')[1]) {
        case "sentiment":
          this.getSortedGroupedTweets(period, filter);
          break;

        case "timeline":
          this.getAllTweetsByFilter(period, filter);
          break;

        case "hashtag+user":
          this.getHashtagUsers(period, filter);
          break;
      }
    });
  }

  private getSortedGroupedTweets(periodFilter?: string, dateFilter?: string): void {
    this.tweetsService.groupedTweets(periodFilter, dateFilter).subscribe((data: any) => {
      data.delivery_data = JSON.parse(data.delivery_data)
      data.restaurant_data = JSON.parse(data.restaurant_data)
      data.remaining_data = JSON.parse(data.remaining_data)

      const {delivery_data, restaurant_data, remaining_data} = data

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


      const labels = ["Negatief", "Neutraal", "Positief"]

      const deliverySentiment = {
        x: labels,
        y: [deliveryStats.negCount, deliveryStats.neutralCount, deliveryStats.posCount],
        name: "Bezorging",
        type: 'bar',
        marker: {
          color: "#F5CF7A"
        }
      }
      const restaurantSentiment = {
        x: labels,
        y: [restaurantStats.negCount, restaurantStats.neutralCount, restaurantStats.posCount],
        name: "Restaurant",
        type: 'bar',
        marker: {
          color: "#8CCDB7"
        }
      }

      const remainingSentiment = {
        x: labels,
        y: [remainingStats.negCount, remainingStats.neutralCount, remainingStats.posCount],
        name: "Overig",
        type: 'bar',
        marker: {
          color: "#83C5DB"
        }
      }

      const mergedData = [restaurantSentiment, deliverySentiment, remainingSentiment]

      this.plot_data = {
        data: mergedData,
        layout: {autosize: true, barmode: 'stack'}
      }
    })
  }

  private getHashtagUsers(filter?: string, dateFilter?: string): void {
    this.tweetsService.users(filter, dateFilter).subscribe(
      payload => {
        let keys = Object.values(payload)
        this.graphObj = {x: [], users: [], hashtags: []};

        for (let index = 0; index < keys.length; index++) {
          this.graphObj.x.push(keys[index].created_at.substr(5, 7));
          this.graphObj.users.push(keys[index].user_id);
          this.graphObj.hashtags.push(keys[index].id);
        }
        let graphType = 'line';

        if (dateFilter || filter === 'd') {
          graphType = 'bar';
        }

        this.plot_data = {
          data: [
            {
              x: this.graphObj.x,
              y: this.graphObj.users,
              name: 'Gebruikers',
              type: graphType,
              marker: {
                color: '#009688'
              }
            },
            {
              x: this.graphObj.x,
              y: this.graphObj.hashtags,
              name: 'Hashtags',
              type: graphType,
              marker: {
                color: '#9c27b0'
              }
            }
          ],
          layout: {autosize: true}
        };
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

          this.tweetsService.orderedTweetsArray = filteredDates.slice(0, this.tweetsService.tweetLimit);
        }

        this.tweetsService.dataSource.data = this.tweetsService.orderedTweetsArray;

        if (filter == 'd') {
          // retrieve date from first entry and push it to the tweetDates array.
          this.tweetsService.tweetDates.push(data[0].created_at.substr(5, 7));
          // retrieve the length of data and push it to the amountOfTweets array.
          
          let amountOfTweets = {
            positive_count: 0, negative_count: 0, neutral_count: 0,
          }
        
          data.forEach(item => {
            switch (item.sentiment) {
              case "Positive":
                amountOfTweets.positive_count++;
                break;
              case "Negative":
                amountOfTweets.negative_count++;
                break;
              case "Neutral":
                amountOfTweets.neutral_count++;
                break;
            }
          });
          this.tweetsService.sentiment_obj.positive_array.push(amountOfTweets.positive_count);
          this.tweetsService.sentiment_obj.negative_array.push(amountOfTweets.negative_count);
          this.tweetsService.sentiment_obj.neutral_array.push(amountOfTweets.neutral_count);  
        }

        if (filter == 'm' || filter == 'w' || !filter) {
          // retrieve all created_at values and store them in an array.
          let tweetDates: string[] = data.map(tweet => tweet['created_at'].substr(5, 7));
          // filter unique dates out of the array.
          this.tweetsService.tweetDates = tweetDates.filter(this.tweetsService.unique);

          // foreach unique tweet date
          for (let i = 0; i < this.tweetsService.tweetDates.length; i++) {

            let amountOfTweets = {
              positive_count: 0, negative_count: 0, neutral_count: 0,
            }
            for (let j = 0; j < data.length; j++) {

              if (this.tweetsService.tweetDates[i] === data[j].created_at.substr(5, 7)) {
                
                switch (data[j].sentiment) {
                  case "Positive":
                    amountOfTweets.positive_count++;
                    break;
                  case "Negative":
                    amountOfTweets.negative_count++;
                    break;
                  case "Neutral":
                    amountOfTweets.neutral_count++;
                    break;
                }
              }
            }
              
            this.tweetsService.sentiment_obj.positive_array[i] = amountOfTweets.positive_count;
            this.tweetsService.sentiment_obj.negative_array[i] = amountOfTweets.negative_count;
            this.tweetsService.sentiment_obj.neutral_array[i] = amountOfTweets.neutral_count;  
          }
        }

        this.plot_data = {
          data: [{
            x: this.tweetsService.tweetDates,
            y: this.tweetsService.sentiment_obj.negative_array,
            type: 'bar',
            name: "Negatief",
            marker: {
              color: '#EE7B5F'
            }
          },
          {
            x: this.tweetsService.tweetDates,
            y: this.tweetsService.sentiment_obj.positive_array,
            type: 'bar',
            name: "Positief",
            marker: {
              color: '#47B383'
            }
          },
          {
            x: this.tweetsService.tweetDates,
            y: this.tweetsService.sentiment_obj.neutral_array,
            type: 'bar',
            name: "Neutraal",
            marker: {
              color: '#FFC910'
            }
          }],
          layout: {autosize: true}
        }        
      },
    );
  }

  filterByDate(event: any, type: string): void {
    if (type.split(':')[1] === 'timeline') {
      const selectedDate = new Date(event.points[0].x);
      selectedDate.setFullYear(new Date().getFullYear());

      this.router.navigate(['dashboard'], {
        queryParams: {
          filter: `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`
        }
      });
    }
  }

  filterByPeriod(periodFilter?: string): void {
    this.router.navigate(['dashboard'], {
      queryParams: {period: periodFilter}
    });
  }
}
