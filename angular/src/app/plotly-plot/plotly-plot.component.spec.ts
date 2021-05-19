import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyPlotComponent } from './plotly-plot.component';

describe('PlotlyPlotComponent', () => {
  let component: PlotlyPlotComponent;
  let fixture: ComponentFixture<PlotlyPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlotlyPlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotlyPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
