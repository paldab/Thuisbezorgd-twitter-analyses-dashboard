import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TweetsService } from '../services/tweets.service';
import { AllTweetsDataSource, AllTweetsItem } from './all-tweets-datasource';

@Component({
  selector: 'app-all-tweets',
  templateUrl: './all-tweets.component.html',
  styleUrls: ['./all-tweets.component.scss']
})
export class AllTweetsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AllTweetsItem>;
  dataSource!: AllTweetsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'trimmed_text', 'user_screenname', 'created_at'];
  
  constructor(private tweetsService: TweetsService) { }

  ngOnInit() {
    this.dataSource = new AllTweetsDataSource(this.tweetsService);
  
    setTimeout(() => {
      let next: HTMLElement = document.querySelector("app-all-tweets button.mat-paginator-navigation-next") as HTMLElement;
      let prev: HTMLElement = document.querySelector("app-all-tweets button.mat-paginator-navigation-previous") as HTMLElement;
      next.click()
      prev.click()    
    }, 5000);
  
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
