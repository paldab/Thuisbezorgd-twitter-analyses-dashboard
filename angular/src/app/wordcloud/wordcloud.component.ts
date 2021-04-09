import { WordcloudService } from './../services/wordcloud.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-wordcloud',
  templateUrl: './wordcloud.component.html',
  styleUrls: ['./wordcloud.component.scss']
})
export class WordcloudComponent implements OnInit {
  public wordcloudImg = ""
  constructor(private wordcloudService:WordcloudService) { 

  }

  ngOnInit(): void {
    this.getBase64Img()
  }

  /**
   * grabs the base64 url and format the string into a img-src tag
   */
  public getBase64Img(){
    let imgUrl;
    const base64ImgTemplate:string = "data:image/png;base64,"
    this.wordcloudService.generateWordcloud().subscribe(data => {
      const {image} = data
      imgUrl = image

      this.wordcloudImg += `${base64ImgTemplate}${imgUrl}`
    })
  }
}