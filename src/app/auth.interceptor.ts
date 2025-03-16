// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
// Este interceptor adiciona o header de autorização com o prefixo "Bearer " para todas as requisições,
// exceto para a chamada de login.
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Se a requisição for para o endpoint de login, não adiciona o header Authorization.
    if (req.url.includes('/authentication/login')) {
      return next.handle(req);
    }

    // Recupera o token do localStorage.
    const token = localStorage.getItem('token');
    console.log('Token recuperado:', token); // Log para depuração

    // Se o token existir, garante que ele comece com "Bearer " e clona a requisição com o header
    if (token) {
      const formattedToken = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;

      const authReq = req.clone({
        headers: req.headers.set('Authorization', formattedToken)
      });
      return next.handle(authReq);
    }

    // Se não houver token, apenas encaminha a requisição sem alterações.
    return next.handle(req);
  }
}
