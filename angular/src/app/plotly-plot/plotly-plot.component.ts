import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-plotly-plot',
  templateUrl: './plotly-plot.component.html',
  styleUrls: ['./plotly-plot.component.scss']
})
export class PlotlyPlotComponent implements OnInit {
  @Input() component: any;

  constructor() { }

  ngOnInit(): void {
  }

}
