import { Routes } from '@angular/router';
import {RecoveryPasswordComponent} from './login/recovery-password/recovery-password.component';
import {LoginComponent} from './login/signin/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'resetar-senha', component: RecoveryPasswordComponent },
];
