import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-password',
  template: `
    <button type="button" class="toggle-btn" (click)="togglePassword()" aria-label="Mostrar ou ocultar senha">
      <span class="material-icons">
        {{ showPassword ? 'visibility' : 'visibility_off' }}
      </span>
    </button>
  `,
  styleUrls: ['./toggle-password.component.css']
})
export class TogglePasswordComponent {
  @Input() showPassword: boolean = false;
  @Output() toggle = new EventEmitter<boolean>();

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.toggle.emit(this.showPassword);
  }
}
