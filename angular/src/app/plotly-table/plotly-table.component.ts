import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TweetsService } from '../services/tweets.service';

@Component({
  selector: 'app-plotly-table',
  templateUrl: './plotly-table.component.html',
  styleUrls: ['./plotly-table.component.scss']
})
export class PlotlyTableComponent implements OnInit {
  @Input() component: any;
  columnsToDisplay: string[] = ['user_screenname', 'trimmed_text', 'created_at'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
    constructor(public tweetsService: TweetsService) { }

  ngOnInit(): void {
    this.tweetsService.mostRecentTweets('m');    
  }

  ngAfterViewInit() {
    this.tweetsService.dataSource.sort = this.sort;
    this.table.dataSource = this.tweetsService.dataSource;
    console.log(this.tweetsService.dataSource.data);

  }
}
