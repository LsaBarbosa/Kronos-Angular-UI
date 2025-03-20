import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindEmployeeByIdComponent } from './find-employee-by-id.component';

describe('FindEmployeeByIdComponent', () => {
  let component: FindEmployeeByIdComponent;
  let fixture: ComponentFixture<FindEmployeeByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindEmployeeByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindEmployeeByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
