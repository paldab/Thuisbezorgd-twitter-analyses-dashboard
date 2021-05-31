import {WordcloudService} from './../services/wordcloud.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'wordcloud',
  templateUrl: './wordcloud.component.html',
  styleUrls: ['./wordcloud.component.scss']
})
export class WordcloudComponent implements OnInit {
  public wordcloudImg = '';

  constructor(private wordcloudService: WordcloudService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(value => {
      let filter: any = null;
      let period: any = null;

      if (value.filter) {
        filter = value.filter;
      }

      if (value.period) {
        period = value.period;
      }

      this.getBase64Img(period, filter);
    });
  }

  /**
   * grabs the base64 url and format the string into a img-src tag
   */
  public getBase64Img(periodFilter?: string, dateFilter?: string): void {
    let imgUrl;
    const base64ImgTemplate: string = 'data:image/png;base64,';
    this.wordcloudService.generateWordcloud('white', periodFilter, dateFilter).subscribe(data => {
      const {image} = data;
      imgUrl = image;

      this.wordcloudImg = `${base64ImgTemplate}${imgUrl}`;
    });
  }
}
