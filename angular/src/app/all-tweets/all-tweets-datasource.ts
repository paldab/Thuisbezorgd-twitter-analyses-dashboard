import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface AllTweetsItem {
  created_at: string;
  user: string;
  text: string;
  id: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: AllTweetsItem[] = [
  {id: 1, text: 'Hydrogen', user: '@Henk', created_at: '28/03/2021'},
  {id: 2, text: 'Helium', user: '@Henk', created_at: '28/03/2021'},
  {id: 3, text: 'Lithium', user: '@Henk', created_at: '28/03/2021'},
  {id: 4, text: 'Beryllium', user: '@Henk', created_at: '28/03/2021'},
  {id: 5, text: 'Boron', user: '@Henk', created_at: '28/03/2021'},
  {id: 6, text: 'Carbon', user: '@Henk', created_at: '28/03/2021'},
  {id: 7, text: 'Nitrogen', user: '@Henk', created_at: '28/03/2021'},
  {id: 8, text: 'Oxygen', user: '@Henk', created_at: '28/03/2021'},
  {id: 9, text: 'Fluorine', user: '@Henk', created_at: '28/03/2021'},
  {id: 10, text: 'Neon', user: '@Henk', created_at: '28/03/2021'},
  {id: 11, text: 'Sodium', user: '@Henk', created_at: '28/03/2021'},
  {id: 12, text: 'Magnesium', user: '@Henk', created_at: '28/03/2021'},
  {id: 13, text: 'Aluminum', user: '@Henk', created_at: '28/03/2021'},
  {id: 14, text: 'Silicon', user: '@Henk', created_at: '28/03/2021'},
  {id: 15, text: 'Phosphorus', user: '@Henk', created_at: '28/03/2021'},
  {id: 16, text: 'Sulfur', user: '@Henk', created_at: '28/03/2021'},
  {id: 17, text: 'Chlorine', user: '@Henk', created_at: '28/03/2021'},
  {id: 18, text: 'Argon', user: '@Henk', created_at: '28/03/2021'},
  {id: 19, text: 'Potassium', user: '@Henk', created_at: '28/03/2021'},
  {id: 20, text: 'Calcium', user: '@Henk', created_at: '28/03/2021'},
];

/**
 * Data source for the AllTweets view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AllTweetsDataSource extends DataSource<AllTweetsItem> {
  data: AllTweetsItem[] = EXAMPLE_DATA;
  paginator!: MatPaginator;
  sort!: MatSort;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<AllTweetsItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: AllTweetsItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: AllTweetsItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'text': return compare(a.text, b.text, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
