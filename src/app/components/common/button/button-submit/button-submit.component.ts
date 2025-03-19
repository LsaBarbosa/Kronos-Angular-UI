import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-button-submit',
  imports: [],
  templateUrl: './button-submit.component.html',
  styleUrl: './button-submit.component.css'
})
export class ButtonSubmitComponent {

  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' = 'submit';
}
