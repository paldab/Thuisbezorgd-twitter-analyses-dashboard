import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-plotly-table',
  templateUrl: './plotly-table.component.html',
  styleUrls: ['./plotly-table.component.scss']
})
export class PlotlyTableComponent implements OnInit {
  @Input() component: any;

  constructor() { }

  ngOnInit(): void {
  }

}
