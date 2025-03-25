import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  // Método para obter o token do localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para decodificar o token JWT e obter as informações do usuário
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token); // Decodifica o token
      return decodedToken.role || null; // Retorna a role (caso exista no token)
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  // Método para verificar se o usuário tem uma role permitida
  hasRole(allowedRoles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? allowedRoles.includes(userRole) : false;
  }

  // Método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Método para logout (remover token)
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
