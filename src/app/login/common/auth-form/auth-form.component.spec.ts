import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonFormComponent } from './auth-form.component';

describe('ButtonFormComponent', () => {
  let component: ButtonFormComponent;
  let fixture: ComponentFixture<ButtonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
