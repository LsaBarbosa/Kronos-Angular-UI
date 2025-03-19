import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRecordsComponent } from './time-records.component';

describe('TimeRecordsComponent', () => {
  let component: TimeRecordsComponent;
  let fixture: ComponentFixture<TimeRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
