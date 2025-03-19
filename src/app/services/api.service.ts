import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'https://ponto-eletronico-kotlin.onrender.com';

  // Método privado para criar os headers com o token salvo no localStorage.
  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {headers: new HttpHeaders({'Authorization': `Bearer ${token}`})}
  };

  // Injeta o HttpClient no construtor para que possamos usá-lo nos métodos do serviço
  constructor(private http: HttpClient) {
  }

  getData(url: string, options: any = {}): Observable<any> {
    return this.http.get<any>(this.baseUrl + url, { ...this.getHeaders(), ...options });
  }

  postData(url: string, payload: any, options: any = {}): Observable<any> {
    return this.http.post<any>(this.baseUrl + url, payload, { ...this.getHeaders(), ...options });
  }

  updateData(url: string, payload: any, options: any = {}): Observable<any> {
    return this.http.put<any>(this.baseUrl + url, payload, { ...this.getHeaders(), ...options });
  }

  deleteData(url: string, options: any = {}): Observable<any> {
    return this.http.delete<any>(this.baseUrl + url, { ...this.getHeaders(), ...options });
  }

  /**
   * Realiza uma requisição POST para a URL fornecida, enviando um payload.
   * @param url - O endpoint da API a ser chamado.
   * @param payload - Os dados a serem enviados no corpo da requisição.
   * @returns Um Observable com a resposta da requisição.
   */
  // login(url: string, payload: any): Observable<any> {
  //   return this.http.post<any>(this.baseUrl + url, payload);
  // }
  login(url: string, payload: any, options: any = {}): Observable<any> {
    return this.http.post<any>(this.baseUrl + url, payload, {...options });
  }
}
