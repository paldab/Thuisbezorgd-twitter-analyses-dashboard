import { WordcloudService } from './../services/wordcloud.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-wordcloud',
  templateUrl: './wordcloud.component.html',
  styleUrls: ['./wordcloud.component.scss']
})
export class WordcloudComponent implements OnInit {
  constructor(private wordcloudService:WordcloudService) { }
  public wordcloudImg = this.getBase64Img();

  ngOnInit(): void {
  }

  public getBase64Img():string{
    this.wordcloudService.generateWordcloud().subscribe(img =>{
      console.log(img)
      return img
    })
    return "No Image!"
  }
}
