import { Routes } from '@angular/router';
import {ResetPasswordComponent} from './login/reset-password/reset-password.component';
import {LoginComponent} from './login/signin/login.component';
import {HomePageComponent} from './home-page/home-page.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'resetar-senha', component: ResetPasswordComponent },
];
