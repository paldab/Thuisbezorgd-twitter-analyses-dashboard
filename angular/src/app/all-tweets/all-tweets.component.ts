import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TweetsService } from '../services/tweets.service';
import { UtilsService } from '../services/utils.service';
import {FormGroup, FormControl} from '@angular/forms';


export interface AllTweetsItem {
  created_at: string;
  user_screenname: string;
  text: string;
  trimmed_text: string;
  id: number;
}

@Component({
  selector: 'app-all-tweets',
  templateUrl: './all-tweets.component.html',
  styleUrls: ['./all-tweets.component.scss']
})
export class AllTweetsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<AllTweetsItem>;
  filter: string ='';
  dataSource!: MatTableDataSource<AllTweetsItem>;
  spinnerLoading: boolean = false;
  req_succeeded: boolean = true;
  filterType!: string;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'trimmed_text', 'user_screenname', 'created_at'];

  campaignOne: FormGroup;
  campaignTwo: FormGroup;
  
  constructor(private tweetsService: TweetsService, public utilsService: UtilsService) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16))
    });

    this.campaignTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 15)),
      end: new FormControl(new Date(year, month, 19))
    });
   }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<AllTweetsItem>();
    this.getAllTweetsWeek();
  }

  search(filterValue: any) {

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.filter = this.filter;
  }

  getAllTweets() {
    this.spinnerLoading = true;
    
    this.tweetsService.all_tweets().subscribe(
      data => {
        console.log(data.length);
        this.dataSource.data = data
        this.filterType = 'alles'
      },
      err => {
        this.req_succeeded = err.ok
        console.error(err);
      }
    );    


    setTimeout(() => {
      if (this.req_succeeded == false) {
        this.spinnerLoading = true
      } else {
        this.spinnerLoading = false
      }
            
    }, 7000)
  }

  getAllTweetsToday() {
    this.spinnerLoading = true;
    
    this.tweetsService.all_tweets('d').subscribe(
      data => {
        this.dataSource.data = data
        this.filterType = 'vandaag'
      },
      err => {
        this.req_succeeded = err.ok
        console.error(err);
      }
    );    


    setTimeout(() => {
      if (this.req_succeeded == false) {
        this.spinnerLoading = true
      } else {
        this.spinnerLoading = false
      }
            
    }, 7000)
  }

  getAllTweetsWeek() {
    this.spinnerLoading = true;
    
    this.tweetsService.all_tweets('w').subscribe(
      data => {
        this.dataSource.data = data
        this.filterType = 'afgelopen week'

      },
      err => {
        this.req_succeeded = err.ok
        console.error(err);
      }
    );    


    setTimeout(() => {
      if (this.req_succeeded == false) {
        this.spinnerLoading = true
      } else {
        this.spinnerLoading = false
      }
            
    }, 7000)
  }

  getAllTweetsMonth() {
    this.spinnerLoading = true;
    
    this.tweetsService.all_tweets('m').subscribe(
      data => {
        this.dataSource.data = data
        this.filterType = 'afgelopen maand'

      },
      err => {
        this.req_succeeded = err.ok
        console.error(err);
      }
    );    


    setTimeout(() => {
      if (this.req_succeeded == false) {
        this.spinnerLoading = true
      } else {
        this.spinnerLoading = false
      }
            
    }, 7000)
  }

}
