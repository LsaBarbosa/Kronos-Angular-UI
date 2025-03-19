import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {CurrencyPipe, NgIf} from '@angular/common';
import {HttpHeaders} from '@angular/common/http';
import {ButtonComponent} from '../../common/button/button-menu/button.component';
import {CheckinCheckoutComponent} from '../checkin-checkout/checkin-checkout.component';

interface Company{
nameCompany:string;
}
interface Employee{
  name: string;
  surname: string;
  salary: number;
  email: string;
  position: string;
  role: string;
  company: Company;
}

@Component({
  selector: 'app-home-page',
  imports: [
    CurrencyPipe,
    NgIf,
    ButtonComponent,
    CheckinCheckoutComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
 employee: Employee| null = null;
  errorMessage: string = '';

 constructor(private service:ApiService) {
 }
 ngOnInit(): void {
   const token = localStorage.getItem('token');
   const headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
   this.service.getData('/employee/search/id').subscribe({
     next: (data:Employee) => {
       this.employee = data;
     },
     error: (error) => {
       console.error(error);
       this.errorMessage = 'Erro ao carregar os dados.';
     }
   })
 }
}
