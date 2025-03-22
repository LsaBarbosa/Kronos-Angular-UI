import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRecordsByAdmComponent } from './time-records-by-adm.component';

describe('TimeRecordsComponent', () => {
  let component: TimeRecordsByAdmComponent;
  let fixture: ComponentFixture<TimeRecordsByAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeRecordsByAdmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeRecordsByAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
