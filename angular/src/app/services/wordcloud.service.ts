import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment as env} from "../../environments/environment";
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WordcloudService {
  private SERVER_URL = env.apiUrl || "http://localhost:5000/api/v1";

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param backgroundColor - background color of the image (optional)
   * @param periodFilter - Filter by period (optional)
   * @param dateFilter - Filter by specific date (optional)
   *
   * @returns a base64 url of an wordcloud png image
   */
  generateWordcloud(backgroundColor?: string, periodFilter?: string, dateFilter?: string): Observable<any> {
    let params = new HttpParams();

    if (backgroundColor) {
      params = params.set('backgroundcolor', backgroundColor);
    }

    if (dateFilter) {
      params = params.set('date', dateFilter);
    }

    if (periodFilter) {
      params = params.set('f', periodFilter);
    }

    return this.http.get<any>(`${this.SERVER_URL}/wordcloud`, {params});
  }
}
