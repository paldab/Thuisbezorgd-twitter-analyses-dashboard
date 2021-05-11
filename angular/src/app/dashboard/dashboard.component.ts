import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {TweetsService} from '../services/tweets.service';
import {AggNumsService} from '../services/agg-nums.service';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  req_succeeded = true;
  name: any = undefined;
  num_data: any = undefined;
  layout: any = [];
  components: any = undefined;
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private breakpointObserver: BreakpointObserver, private tweetsService: TweetsService,
              private aggNumsService: AggNumsService) {
    this.countGroupedTweets();
    this.getSentimentCount()
    this.get_num_data('twt-t_t-h-u');
    this.mostRecentTweets('m');

    setTimeout(() => {
      this.name = window.sessionStorage.getItem('user_name')?.replace(/['"]+/g, '');
    }, 4000);
  }

  createDate: string[] = [];
  tweetsADay: number[] = [];
  orderedTweetsArray = new Array();
  countable = 5;
  usedChar = 'm';
  groupedTweetsKeys: string[] = [];
  groupedTweetsVals: number[] = [];
  sentimentArray: any[] = []

  columnsToDisplay: string[] = ['user_screenname', 'trimmed_text', 'created_at'];

  ngOnInit(): void {
    this.getAllTweetsMonth();
  }

  getAllTweetsMonth(): void {
    this.mostRecentTweets('m');
    this.usedChar = 'm';
    this.countable = 5;

    this.createDate.length = 0;
    this.tweetsADay.length = 0;
    this.tweetsService.all_tweets('m').subscribe(
      data => {
        let counter = 0;
        for (let index = 1; index < data.length - 1; index++) {
          if (data[index - 1].created_at.substr(5, 7) !== data[index].created_at.substr(5, 7)) {
            counter = counter + 1;
            this.createDate.push(data[index].created_at.substr(5, 7));
          }
        }
        let teller = 0;
        for (let index = 0; index < this.createDate.length; index++) {
          let tweetscounter = 0;
          for (let index = 0; index < data.length; index++) {
            if (this.createDate[teller] === data[index].created_at.substr(5, 7)) {
              tweetscounter = tweetscounter + 1;
            }
          }
          teller = teller + 1;
          this.tweetsADay[index] = tweetscounter;
        }
      },
      err => {
        this.req_succeeded = err.ok;
        console.error(err);
      }
    );
  }

  getAllTweetsDay(): void {
    this.mostRecentTweets('d');
    this.usedChar = 'd';
    this.countable = 5;

    this.createDate.length = 0;
    this.tweetsADay.length = 0;
    this.tweetsService.all_tweets('d').subscribe(
      data => {
        console.log(data);
        let counter = 0;
        for (let index = 0; index < 1; index++) {
          counter = counter + 1;
          console.log(data[index].created_at);
          this.createDate.push(data[index].created_at.substr(5, 7));
        }
        let teller = 0;
        for (let index = 0; index < this.createDate.length; index++) {
          let tweetscounter = 0;
          for (let index = 0; index < data.length; index++) {
            if (this.createDate[teller] === data[index].created_at.substr(5, 7)) {
              tweetscounter = tweetscounter + 1;
            }
          }
          teller = teller + 1;
          this.tweetsADay[index] = tweetscounter;
        }
      },
      err => {
        this.req_succeeded = err.ok;
      }
    );
  }

  getAllTweetsWeek(): void {
    this.mostRecentTweets('w');
    this.usedChar = 'w';
    this.countable = 5;

    this.createDate.length = 0;
    this.tweetsADay.length = 0;
    this.tweetsService.all_tweets('w').subscribe(
      data => {
        console.log(data);
        console.log(data[0].created_at.substr(0, 17));
        let counter = 0;
        for (let index = 1; index < data.length - 1; index++) {
          if (data[index - 1].created_at.substr(5, 7) !== data[index].created_at.substr(5, 7)) {
            counter = counter + 1;
            console.log(data[index].created_at);
            this.createDate.push(data[index].created_at.substr(5, 7));
          }
        }
        let teller = 0;
        for (let index = 0; index < this.createDate.length; index++) {
          let tweetscounter = 0;
          for (let index = 0; index < data.length; index++) {
            if (this.createDate[teller] === data[index].created_at.substr(5, 7)) {
              tweetscounter = tweetscounter + 1;
            }
          }
          teller = teller + 1;
          this.tweetsADay[index] = tweetscounter;
        }
      },
      err => {
        this.req_succeeded = err.ok;
        console.error(err);
      }
    );
  }

  /** Based on the screen size, switch from standard to one column per row */
  get_num_data(keyword: string) {
    // twt-t_t-h-u
    this.aggNumsService.get_data(keyword).subscribe(
      data => {
        return this.num_data = data;

      },
      () => {
      },
      () => {
        this.components = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small,
          Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).pipe(
          map((breakpointer) => {
            const indexes = Object.keys(breakpointer.breakpoints);
            const xs = breakpointer.breakpoints[indexes[0]];
            const s = breakpointer.breakpoints[indexes[1]];
            const m = breakpointer.breakpoints[indexes[2]];
            const l = breakpointer.breakpoints[indexes[3]];
            const xl = breakpointer.breakpoints[indexes[4]];

            // console.log(this.num_data);

            this.layout = [
              {
                title: 'Top Tweeter',
                type: 'agg-numbers',
                icon: 'star',
                class: 'primary',
                value: this.num_data[0],
                cols: 4,
                rows: 4,
                show: true,

              },
              {
                title: 'Gebruikers',
                type: 'agg-numbers',
                icon: 'group',
                class: 'teal',
                value: this.num_data[3],
                cols: 4,
                rows: 4,
                show: true,

              },
              {
                title: 'Tweets',
                type: 'agg-numbers',
                icon: 'chat',
                class: 'blue',
                value: this.num_data[1],
                cols: 4,
                rows: 4,
                show: true,

              },
              {
                title: 'Hashtags',
                type: 'agg-numbers',
                icon: 'tag',
                class: 'purple',
                value: this.num_data[2],
                cols: 4,
                rows: 4,
                show: true,

              },
              {
                title: 'Wordcloud van de dag',
                type: 'wordcloud',
                cols: 4,
                rows: 14,
                show: true,

              },
              {
                title: 'Timeline tweets',
                type: 'plotly-plot',
                enableButtons: true,
                cols: 4,
                rows: 14,
                show: true,

                data: [
                  {
                    x: this.createDate,
                    y: this.tweetsADay,
                    type: 'bar',
                    marker: {
                      color: '#ff9800'
                    }
                  },
                ],
                layout: {width: 300, height: 300}

              },
              {
                title: 'Laatste 5 tweets',
                type: 'plotly-table',
                cols: 4,
                rows: 14,
                show: true,
              },
              {
                title: 'Grouped tweets',
                type: 'plotly-plot',
                enableButtons: false,
                cols: 4,
                rows: 14,
                show: true,
                data: [
                  {
                    x: this.groupedTweetsKeys,
                    y: this.groupedTweetsVals,
                    type: 'bar',
                    // marker: {
                    //   color: '#ff9800'
                    // }
                  },
                ],
                layout: {width: 300, height: 300}
              },
              {
                title: 'Sentiment tweets',
                type: 'plotly-plot',
                enableButtons: false,
                cols: 4,
                rows: 14,
                show: true,
                data: [
                  {
                    x: this.sentimentArray[0],
                    y: this.sentimentArray[1],
                    type: 'bar',
                    // marker: {
                    //   color: '#ff9800'
                    // }
                  },
                ],
                layout: {width: 300, height: 300}
              },
            ];

            if (xs == breakpointer.matches) {
              this.layout[6].show = false;
              return this.layout;
            }

            if (s == breakpointer.matches) {
              this.layout[6].show = false;
              return this.layout;
            }

            if (m == breakpointer.matches) {
              return this.layout;
            }

            if (l == breakpointer.matches) {

              this.layout[0].cols = this.layout[1].cols = this.layout[2].cols = this.layout[3].cols = 1;
              this.layout[0].rows = this.layout[1].rows = this.layout[2].rows = this.layout[3].rows = 4;


              this.layout[4].cols = 2;
              this.layout[4].rows = 13;

              this.layout[5].cols = 2;
              this.layout[5].rows = 13;
              this.layout[5].layout = {
                width: 500,
                height: 300,
              };

              this.layout[7].cols = 2;
              this.layout[7].rows = 13;
              this.layout[7].layout = {
                width: 500,
                height: 300,
              };

              this.layout[6].cols = 4;
              this.layout[6].rows = 13;

              return this.layout;
            }

            if (xl == breakpointer.matches) {
              this.layout[0].cols = this.layout[1].cols = this.layout[2].cols = this.layout[3].cols = 1;
              this.layout[0].rows = this.layout[1].rows = this.layout[2].rows = this.layout[3].rows = 6;

              this.layout[4].cols = 1;
              this.layout[4].rows = 16;


              this.layout[5].cols = 1;
              this.layout[5].rows = 16;

              this.layout[5].layout = {
                width: 600,
                height: 400,
              };

              this.layout[7].cols = 1;
              this.layout[7].rows = 16;

              this.layout[7].layout = {
                width: 600,
                height: 400,
              };

              this.layout[6].cols = 2;
              this.layout[6].rows = 16;

              return this.layout;
            }
            return [];
          })
        );
      }
    );
  }


  
  private getSentimentCount(){
    this.tweetsService.getSentimentCount().subscribe(sentimentData =>{
      const parsedData = JSON.parse(sentimentData.toString())
      const {data} = parsedData
      const sentimentNames:string[] = []
      const sentimentValues:number[] = []
      
      data.forEach((row: sentiment) =>{
        let {sentiment, values} = row
        sentimentNames.push(sentiment)
        sentimentValues.push(values)
      })
      this.sentimentArray.push(sentimentNames, sentimentValues)
      console.log(this.sentimentArray);
      
    })
  }

  private countGroupedTweets(): void {
    this.tweetsService.grouped_tweets().subscribe(
      data => {
        this.groupedTweetsKeys = Object.keys(data);
        this.groupedTweetsVals = Object.values(data);

        const graphLayout = {
          title: 'Grouped tweets',
          type: 'plotly-plot',
          cols: 1,
          rows: 16,
          show: true,
          data: [
            {
              x: this.groupedTweetsKeys,
              y: this.groupedTweetsVals,
              type: 'bar',
            },
          ],
          layout: {width: 600, height: 400}
        };

        this.layout[7] = graphLayout;
      }
    );
  }

  mostRecentTweets(char: string): any {
    this.tweetsService.all_tweets(char).subscribe(
      data => {
        let teller = 0;
        for (let index = 0; index < this.countable; index++) {
          this.orderedTweetsArray[teller] = data[index];
          teller = teller + 1;
        }

        // Set data to datasource and assign MatSort to the datasource
        this.dataSource.data = this.orderedTweetsArray;
        this.dataSource.sort = this.sort;

        // console.log(this.orderedTweetsArray);
      });
  }


  loadMoreTweetsButton(): void {
    this.countable = this.countable + 5;
    this.mostRecentTweets(this.usedChar);
  }
}

interface sentiment{
    label: number;
    sentiment: string;
    values: number
}