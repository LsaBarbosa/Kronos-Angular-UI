import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-checkin-checkout',
  imports: [
    MatButton
  ],
  templateUrl: './checkin-checkout.component.html',
  styleUrl: './checkin-checkout.component.css'
})
export class CheckinCheckoutComponent {
  constructor(private service: ApiService) {
  }
  checkin():void{
    this.service.postData('/employee/checkin',null)
  }
  checkout():void{
    this.service.postData('/employee/checkout',null)
  }

}
