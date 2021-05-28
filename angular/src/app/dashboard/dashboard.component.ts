import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Layout, IconLayout } from '../interfaces/layout';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  name: any = undefined;
  layout: Layout[] = [];
  components: any = undefined;

  

  constructor(private breakpointObserver: BreakpointObserver) {

    setTimeout(() => { 
      this.name = window.sessionStorage.getItem('user_name')?.replace(/['"]+/g, '');
    }, 4000);
  }

  ngOnInit(): void {
    let topTweeterLayout: IconLayout = {
      title: 'Top Tweeter',
      type: 'agg-numbers',
      icon: 'star',
      selector: 't_t',
      class: 'primary',
      cols: 4,
      rows: 4,
      show: true,
    }
    let tweetUsersLayout: IconLayout = {
      title: 'Gebruikers',
      type: 'agg-numbers',
      selector: 'u',
      icon: 'group',
      class: 'teal',
      cols: 4,
      rows: 4,
      show: true,
    }
    let tweetsLayout: IconLayout = {
      title: 'Tweets',
      type: 'agg-numbers',
      selector: 'twt',
      icon: 'chat',
      class: 'blue',
      cols: 4,
      rows: 4,
      show: true,
    }
    let hashtagsLayout: IconLayout = {
      title: 'Hashtags',
      type: 'agg-numbers',
      selector: 'h',
      icon: 'tag',
      class: 'purple',
      cols: 4,
      rows: 4,
      show: true,
    }
    let wordcloudLayout: Layout = {
      title: 'Wordcloud van de dag',
      type: 'wordcloud',
      cols: 4,
      rows: 14,
      show: true,
    }
    let timelineLayout: Layout = {
      title: 'Timeline tweets',
      type: 'plotly-plot:timeline',
      enableButtons: true,
      cols: 4,
      rows: 14,
      show: true,
      layout: {width: 600, height: 400}
    }
    let last5TweetsLayout: Layout = {
      title: 'Laatste 5 tweets',
      type: 'plotly-table',
      cols: 4,
      rows: 14,
      show: true,
    }
    let groupedTweetsLayout: Layout = {
      title: 'Grouped tweets',
      type: 'plotly-plot:grouped',
      enableButtons: false,
      cols: 4,
      rows: 14,
      show: true,
      layout: {width: 600, height: 400}
    }
    let sentimentTweetsLayout: Layout = {
      title: 'Sentiment tweets',
      type: 'plotly-plot:sentiment',
      enableButtons: false,
      cols: 4,
      rows: 14,
      show: true,
      layout: {width: 600, height: 400}
    }
    let hashtagAndUsersLayout: Layout = {
      title: 'Hashtags + users',
      type: 'plotly-plot:hashtag',
      enableButtons: false,
      cols: 4,
      rows: 14,
      show: true,
      layout: {width: 600, height: 400}
    }
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
          topTweeterLayout,
          tweetUsersLayout,
          tweetsLayout,
          hashtagsLayout,
          wordcloudLayout,
          timelineLayout,
          last5TweetsLayout,
          groupedTweetsLayout,
          sentimentTweetsLayout,
          hashtagAndUsersLayout,
        ];

        if (xs == breakpointer.matches) {
          // this.layout[6].show = false;
          return this.layout;
        }

        if (s == breakpointer.matches) {
          // this.layout[6].show = false;
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

          this.layout[7].cols = this.layout[8].cols = 2;
          this.layout[7].rows = this.layout[8].rows = 13;
          this.layout[7].layout = this.layout[8].layout = {
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

          this.layout[4].cols = 2;
          this.layout[4].rows = 16;


          this.layout[5].cols = 2;
          this.layout[5].rows = 16;

          this.layout[5].layout = {
            width: 600,
            height: 400,
          };

          this.layout[7].cols = this.layout[8].cols = 2;
          this.layout[7].rows = this.layout[8].rows = 16;

          this.layout[7].layout = this.layout[8].layout = {
            width: 600,
            height: 400,
          };

          this.layout[6].cols = 4;
          this.layout[6].rows = 16;

          return this.layout;
        }
        return [];
      })
    );
  }
}