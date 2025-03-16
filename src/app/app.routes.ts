import { Routes } from '@angular/router';
import {ResetPasswordComponent} from './login/reset-password/reset-password.component';
import {LoginComponent} from './login/signin/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'resetar-senha', component: ResetPasswordComponent },
];
