import {Routes} from '@angular/router';
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
import {TimeRecordsByAdmComponent} from './components/manager/time-records/time-records-by-adm.component';
import {AuthGuard} from './guards/auth.guard';
import {RoleGuard} from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'resetar-senha', component: ResetPasswordComponent },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'registro-de-horas', component: TimeRecordsComponent , canActivate: [AuthGuard]},
  { path: 'colaborador', component: EmployeeComponent, canActivate: [AuthGuard] },
  { path: 'alterar-dados', component: UpdateDataComponent, canActivate: [AuthGuard] },
  { path: 'alterar-email', component: UpdateEmailComponent, canActivate: [AuthGuard] },
  { path: 'alterar-senha', component: UpdatePasswordComponent, canActivate: [AuthGuard] },
  { path: 'administracao', component: ManagerComponent , canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'CTO', 'MANAGER'] }},
  { path: 'historico-horas', component: TimeRecordsByAdmComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'CTO', 'MANAGER'] } },
  { path: 'buscar-colaborador', component: FindEmployeeComponent , canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'CTO', 'MANAGER'] }},
  { path: 'registrar-colaborador', component: CreateEmployeeComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'CTO', 'MANAGER'] } },
  { path: 'dados-colaborador', component: FindEmployeeByIdComponent , canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'CTO', 'MANAGER'] }},

  { path: '**', redirectTo: '/login' } // Redireciona qualquer rota desconhecida para login


];
