import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {environment as env} from "../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WordcloudService {
  private SERVER_URL = env.apiUrl || "http://localhost:5000/api/v1";

  constructor(private http: HttpClient) { }

/**
 * 
 * @param backgroundColor optional background color of the image
 * @returns a base64 url of an wordcloud png image
 */
  generateWordcloud(backgroundColor?: string): Observable<any>{
    if (backgroundColor === undefined){
      return this.http.get<any>(`${this.SERVER_URL}/wordcloud`)
    }
    return this.http.get<any>(`${this.SERVER_URL}/wordcloud?backgroundcolor=${backgroundColor}`)
  }
}
