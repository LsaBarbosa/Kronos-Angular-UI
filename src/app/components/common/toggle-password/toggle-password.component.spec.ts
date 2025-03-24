import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TogglePasswordComponent } from './toggle-password.component';

describe('TogglePasswordComponent', () => {
  let component: TogglePasswordComponent;
  let fixture: ComponentFixture<TogglePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TogglePasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TogglePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
