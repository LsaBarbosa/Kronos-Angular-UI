import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'https://ponto-eletronico-kotlin.onrender.com';

  // Injeta o HttpClient no construtor para que possamos usá-lo nos métodos do serviço
  constructor(private http: HttpClient) {
  }

  /**
   * Realiza uma requisição GET para a URL fornecida.
   * @param url - O endpoint da API a ser chamado.
   * @returns Um Observable com a resposta da requisição.
   */
  getData(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  /**
   * Realiza uma requisição POST para a URL fornecida, enviando um payload.
   * @param url - O endpoint da API a ser chamado.
   * @param payload - Os dados a serem enviados no corpo da requisição.
   * @returns Um Observable com a resposta da requisição.
   */
  postData(url: string, payload: any): Observable<any> {
    return this.http.post<any>(url, payload);
  }

  /**
   * Realiza uma requisição PUT para a URL fornecida, atualizando os dados.
   * @param url - O endpoint da API a ser chamado.
   * @param payload - Os dados atualizados a serem enviados.
   * @returns Um Observable com a resposta da requisição.
   */
  updateData(url: string, payload: any): Observable<any> {
    return this.http.put<any>(url, payload);
  }

  /**
   * Realiza uma requisição DELETE para a URL fornecida.
   * @param url - O endpoint da API a ser chamado.
   * @returns Um Observable com a resposta da requisição.
   */
  deleteData(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }
}
