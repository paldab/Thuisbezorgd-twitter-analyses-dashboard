import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { TweetsService } from '../services/tweets.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  name = window.sessionStorage.getItem('user_name')?.replace(/['"]+/g, '');
  req_succeeded: boolean = true;

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {
            title: "A Fancy Plott",
            cols: 1,
            rows: 1,
            data: [
              { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
              { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
            ],
            layout: {width: 600, height: 400}
          },
          {
            title: "A Fancy Plot",
            cols: 1,
            rows: 1,
            data: [
              { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'blue'} },
              { x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: [2, 5, 3, 6, 4, 7, 8, 10, 9, 4], type: 'bar' },
            ],
            layout: {width: 600, height: 400}
          }
          // {
          //   title: 'Card 2',
          //   cols: 1,
          //   rows: 1
          // },
          // {
          //   title: 'Card 3',
          //   cols: 1,
          //   rows: 1
          // },
          // {
          //   title: 'Card 4',
          //   cols: 1,
          //   rows: 1
          // }
        ];
      }

      // return [{
      //     title: 'Card 1',
      //     cols: 2,
      //     rows: 1
      //   },
        // {
        //   title: 'Card 2',
        //   cols: 1,
        //   rows: 1
        // },
        // {
        //   title: 'Card 3',
        //   cols: 1,
        //   rows: 2
        // },
        // {
        //   title: 'Card 4',
        //   cols: 1,
        //   rows: 1
        // }
      // ];

      return [
        {
          title: "A Fancy Plott",
          cols: 1,
          rows: 1,
          data: [
            { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
            { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
          ],
          layout: {width: 600, height: 400}
        },
        {
          title: "A Fancy Plot",
          cols: 1,
          rows: 1,
          data: [
            { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'blue'} },
            { x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: [2, 5, 3, 6, 4, 7, 8, 10, 9, 4], type: 'bar' },
          ],
          layout: {width: 600, height: 400}
        }
        // {
        //   title: 'Card 2',
        //   cols: 1,
        //   rows: 1
        // },
        // {
        //   title: 'Card 3',
        //   cols: 1,
        //   rows: 1
        // },
        // {
        //   title: 'Card 4',
        //   cols: 1,
        //   rows: 1
        // }
      ];
    })
  );  
  constructor(private breakpointObserver: BreakpointObserver, private tweetsService: TweetsService) {}

  createDate: string[] = [];
  tweetsADay: number[] = [];

  ngOnInit(): void {
    // console.log(this.cards);
    this.getAllTweetsMonth();
    
  }




  getAllTweetsMonth() {
    this.tweetsService.all_tweets('x').subscribe(
      data => {
        console.log(data);
        console.log(data[0].created_at.substr(0, 17))
        let counter = 0;
        for (let index = 1; index < data.length -1; index++) {
          if (data[index -1].created_at.substr(5, 7) !== data[index].created_at.substr(5, 7) ) {
          counter = counter + 1;
          console.log(data[index].created_at);
          this.createDate.push(data[index].created_at.substr(5,7));
          }
        }

        console.log(this.createDate);


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

          console.log(this.createDate);
          console.log(this.tweetsADay);
        

      },
      err => {
        this.req_succeeded = err.ok
        console.error(err);
      }
    );    


    setTimeout(() => {
      if (this.req_succeeded == false) {
      } else {
      }
            
    }, 7000)
  }














  /** Based on the screen size, switch from standard to one column per row */
  timeline = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
    
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






}
