import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindEmployeeComponent } from './find-employee.component';

describe('FindEmployeeComponent', () => {
  let component: FindEmployeeComponent;
  let fixture: ComponentFixture<FindEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
