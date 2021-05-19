import { Component, Input, OnInit } from '@angular/core';
import { AggNumsService } from '../services/agg-nums.service';

@Component({
  selector: 'app-agg-number',
  templateUrl: './agg-number.component.html',
  styleUrls: ['./agg-number.component.scss']
})
export class AggNumberComponent implements OnInit {
  @Input() component: any;
  _num_data: any = undefined;

  public get num_data() {
    return this._num_data;
  }

  public set num_data(data) {
    this._num_data = data;
  }

  constructor(private aggNumsService: AggNumsService) {}

  ngOnInit(): void {
    this.aggNumsService.getData(this.component?.selector).subscribe((data: any) => {
      this.num_data = data[0];
    });
  }
}
