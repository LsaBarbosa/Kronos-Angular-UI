import { Routes } from '@angular/router';
import {ResetPasswordComponent} from './components/login/reset-password/reset-password.component';
import {LoginComponent} from './components/login/signin/login.component';
import {HomePageComponent} from './components/home-page/home/home-page.component';
import {TimeRecordsComponent} from './components/employee/time-records/time-records.component';
import {EmployeeComponent} from './components/employee/employee/employee.component';
import {UpdateDataComponent} from './components/employee/update-data/update-data/update-data.component';
import {UpdateEmailComponent} from './components/employee/update-data/update-email/update-email.component';
import {UpdatePasswordComponent} from './components/employee/update-data/update-password/update-password.component';
import {ManagerComponent} from './components/manager/management/manager.component';
import {CreateEmployeeComponent} from './components/manager/create-employee/create-employee.component';
import {FindEmployeeComponent} from './components/manager/find-employee/find-all/find-employee.component';

import {
  FindEmployeeByIdComponent
} from './components/manager/find-employee/find-employee-by-id/find-employee-by-id.component';
import {DetailsEmployeeComponent} from './components/manager/find-employee/details-employee/details-employee.component';
import {TimeRecordsByAdmComponent} from './components/manager/time-records/time-records-by-adm.component';

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
  { path: 'administracao', component: ManagerComponent },
  { path: 'historico-horas', component: TimeRecordsByAdmComponent },
  { path: 'buscar-colaborador', component: FindEmployeeComponent },
  { path: 'registrar-colaborador', component: CreateEmployeeComponent },
  { path: 'detalhes-colaborador', component: DetailsEmployeeComponent },
  { path: 'dados-colaborador', component: FindEmployeeByIdComponent },

];
