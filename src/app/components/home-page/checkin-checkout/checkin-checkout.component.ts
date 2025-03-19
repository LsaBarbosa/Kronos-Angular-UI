import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {ApiService} from '../../../services/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpResponse} from '@angular/common/http';
import {ErrorMessageComponent} from '../../common/error-message/error-message.component';

@Component({
  selector: 'app-checkin-checkout',
  imports: [
    MatButton,
    ErrorMessageComponent
  ],
  templateUrl: './checkin-checkout.component.html',
  styleUrl: './checkin-checkout.component.css'
})
export class CheckinCheckoutComponent {
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(private service: ApiService, private snackBar: MatSnackBar) {
  }

  checkin(): void {
    this.service.postData('/time/checkin', null, {observe: 'response'})
      .subscribe({
        next: (response: HttpResponse<any>) => {
          const status = response.status;
          if (status === 200 || status === 201) {
            this.alertMessage = 'Check-in realizado com sucesso!';
            this.alertType = 'success';
          } else {
            this.alertMessage = `Operação realizada com status ${status}.`;
            this.alertType = 'success';
          }
          // Limpa a mensagem após 4 segundos
          setTimeout(() => {
            this.alertMessage = '';
          }, 4000);
        },
        error: (error) => {
          const errorMsg = error.error && error.error.error
            ? error.error.error
            : `Erro ${error.status}: Ocorreu um problema.`;
          this.alertMessage = errorMsg;
          this.alertType = 'error';
          // Limpa a mensagem após 4 segundos
          setTimeout(() => {
            this.alertMessage = '';
          }, 4000);
        }
      });
  }

  checkout(): void {
    this.service.postData('/time/checkout', null, {observe: 'response'})
      .subscribe({
        next: (response: HttpResponse<any>) => {
          const status = response.status;
          if (status === 200 || status === 201) {
            this.alertMessage = 'Check-out realizado com sucesso!';
            this.alertType = 'success';
          } else {
            this.alertMessage = `Operação realizada com status ${status}.`;
            this.alertType = 'success';
          }
          setTimeout(() => {
            this.alertMessage = '';
          }, 4000);
        },
        error: (error) => {
          const errorMsg = error.error && error.error.error
            ? error.error.error
            : `Erro ${error.status}: Ocorreu um problema.`;
          this.alertMessage = errorMsg;
          this.alertType = 'error';
          setTimeout(() => {
            this.alertMessage = '';
          }, 4000);
        }
      });
  }

}

