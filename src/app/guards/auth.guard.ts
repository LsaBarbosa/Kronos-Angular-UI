import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    // Verifica se há um token salvo no localStorage
    const token = localStorage.getItem('token');

    if (token) {
      return true; // Permite acesso à rota
    } else {
      // Se não houver token, redireciona para a página de login
      this.router.navigate(['/login']);
      return false; // Bloqueia o acesso à rota protegida
    }
  }
}
