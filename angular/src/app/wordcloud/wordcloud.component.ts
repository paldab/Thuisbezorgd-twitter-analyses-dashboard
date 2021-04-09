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

  public getBase64Img(){
    let imgUrl;
    const base64ImgTemplate:string = "data:image/png;base64,"
    this.wordcloudService.generateWordcloud().subscribe(data => {
      const {img} = data
      imgUrl = img

      this.wordcloudImg += `${base64ImgTemplate}${imgUrl}`
    })
  }
}

interface Wordcloud {
  img:string;
}