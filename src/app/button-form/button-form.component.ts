import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-button-form',
  imports: [],
  templateUrl: './button-form.component.html',
  styleUrl: './button-form.component.css'
})
export class ButtonFormComponent {
  // Define se o formulário está inválido (para desabilitar o botão)
  @Input() formInvalid: boolean = true;
  // Texto exibido no botão de submit
  @Input() submitText: string = 'Entrar';
  // Texto exibido no link
  @Input() linkText: string = 'Login';

  // Emite um evento quando o link for clicado
  @Output() linkClicked = new EventEmitter<void>();
}
