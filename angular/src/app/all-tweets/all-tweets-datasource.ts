import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { TweetsService } from '../services/tweets.service';
import { MatTableDataSource } from '@angular/material/table';

// TODO: Replace this with your own data model type
export interface AllTweetsItem {
  created_at: string;
  user_screenname: string;
  text: string;
  trimmed_text: string;
  id: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: AllTweetsItem[] = [
  {id: 1, text: 'Hydrogen', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 2, text: 'Helium', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 3, text: 'Lithium', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 4, text: 'Beryllium', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 5, text: 'Boron', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 6, text: 'Carbon', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 7, text: 'Nitrogen', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 8, text: 'Oxygen', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 9, text: 'Fluorine', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 10, text: 'Neon', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 11, text: 'Sodium', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 12, text: 'Magnesium', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 13, text: 'Aluminum', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 14, text: 'Silicon', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 15, text: 'Phosphorus', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 16, text: 'Sulfur', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 17, text: 'Chlorine', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 18, text: 'Argon', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 19, text: 'Potassium', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
  {id: 20, text: 'Calcium', user_screenname: '@Henk', created_at: '28/03/2021', trimmed_text: 'trimmed text...'},
];

/**
 * Data source for the AllTweets view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AllTweetsDataSource extends MatTableDataSource<AllTweetsItem> {

  spinnerLoading: boolean = false;
  req_succeeded: boolean = true;

  constructor(private tweetsService: TweetsService) {
    super();
    // this.data = EXAMPLE_DATA;
    this.getAllTweets();
  }

  getAllTweets() {
    this.spinnerLoading = true;
    
    this.tweetsService.all_tweets().subscribe(
      data => {
        this.data = data
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

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  // connect(): Observable<AllTweetsItem[]> {
  //   // Combine everything that affects the rendered data into one update
  //   // stream for the data-table to consume.
  //   const dataMutations = [
  //     observableOf(this.data),
  //     this.paginator.page,
  //     this.sort.sortChange
  //   ];

  //   return merge(...dataMutations).pipe(map(() => {
  //     return this.getPagedData(this.getSortedData([...this.data]));
  //   }));
  // }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  // private getPagedData(data: AllTweetsItem[]) {
  //   const startIndex = super.paginator?.pageIndex * super.paginator?.pageSize;
  //   return data.splice(startIndex, super.paginator?.pageSize);
  // }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  // private getSortedData(data: AllTweetsItem[]) {
  //   if (!super.sort?.active || super.sort?.direction === '') {
  //     return data;
  //   }

  //   return data.sort((a, b) => {
  //     const isAsc = super.sort?.direction === 'asc';
  //     switch (super.sort?.active) {
  //       case 'user_screenname': return compare(a.user_screenname, b.user_screenname, isAsc);
  //       case 'trimmed_text': return compare(a.trimmed_text, b.trimmed_text, isAsc);
  //       case 'id': return compare(+a.id, +b.id, isAsc);
  //       default: return 0;
  //     }
  //   });
  // }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
// function compare(a: string | number, b: string | number, isAsc: boolean) {
//   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
// }
