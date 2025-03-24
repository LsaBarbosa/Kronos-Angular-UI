import {Component, Input} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-error-message',
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {
  @Input() message: string= '';
  @Input() type: "success"| 'error' = 'success';


}
