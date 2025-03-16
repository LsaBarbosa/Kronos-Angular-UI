import { Routes } from '@angular/router';
import {ResetPasswordComponent} from './login/reset-password/reset-password.component';
import {LoginComponent} from './login/signin/login.component';
import {HomePageComponent} from './home-page/home-page.component';
import {TimeRecordsComponent} from './employee/time-records/time-records.component';
import {EmployeeComponent} from './employee/employee/employee.component';
import {UpdateDataComponent} from './employee/update-data/update-data/update-data.component';
import {UpdateEmailComponent} from './employee/update-data/update-email/update-email.component';
import {UpdatePasswordComponent} from './employee/update-data/update-password/update-password.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'resetar-senha', component: ResetPasswordComponent },
  { path: 'registro-de-horas', component: TimeRecordsComponent },
  { path: 'colaborador', component: EmployeeComponent },
  { path: 'alterar-dados', component: UpdateDataComponent },
  { path: 'alterar-email', component: UpdateEmailComponent },
  { path: 'alterar-senha', component: UpdatePasswordComponent },

];
