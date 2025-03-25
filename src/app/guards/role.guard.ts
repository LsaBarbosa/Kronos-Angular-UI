import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    // Pega as roles permitidas definidas na rota
    const allowedRoles = route.data['roles'] as string[];

    // Verifica se o usuário tem uma das roles permitidas
    if (this.authService.hasRole(allowedRoles)) {
      return true; // Permite o acesso
    } else {
      // Se não tiver permissão, redireciona para a página inicial ou de acesso negado
      this.router.navigate(['/home']);
      return false;
    }
  }
}
