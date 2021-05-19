import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyTableComponent } from './plotly-table.component';

describe('PlotlyTableComponent', () => {
  let component: PlotlyTableComponent;
  let fixture: ComponentFixture<PlotlyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlotlyTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotlyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
