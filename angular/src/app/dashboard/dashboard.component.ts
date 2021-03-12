import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() title!: string | undefined;

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
  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    console.log(this.cards);
    
  }
}
