import { Component } from '@angular/core';
import {ButtonComponent} from '../../button/button.component';

@Component({
  selector: 'app-employee',
  imports: [
    ButtonComponent
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

}
