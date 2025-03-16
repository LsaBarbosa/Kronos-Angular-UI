import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent {
  // Título a ser exibido no formulário (ex: "Kronos Tech Solution" ou "Recuperar Senha")
  @Input() title: string = '';

  // Formulário a ser usado (login, reset, etc.)
  @Input() formGroup!: FormGroup;

  // Emite um evento quando o formulário é submetido
  @Output() submitEvent = new EventEmitter<void>();

  onSubmit() {
    this.submitEvent.emit();
  }
}
