import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggNumberComponent } from './agg-number.component';

describe('AggNumberComponent', () => {
  let component: AggNumberComponent;
  let fixture: ComponentFixture<AggNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
