import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {NgIf} from '@angular/common';
import {BaseAuthFormComponent} from '../../common/BaseAuthFormComponent';
import {AuthFormComponent} from '../../common/auth-form/auth-form.component';
import {ErrorMessageComponent} from '../../common/error-message/error-message.component';
import {HttpResponse} from '@angular/common/http';
import {ButtonSubmitComponent} from "../../common/button/button-submit/button-submit.component";

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    AuthFormComponent,
    ErrorMessageComponent,
    ButtonSubmitComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent extends BaseAuthFormComponent implements OnInit {
  resetPassword!: FormGroup;

  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: ApiService
  ) {
    super()
  }

  ngOnInit() {
    this.resetPassword = this.formBuilder.group({
      cpf: ['', [Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]],
      email: ['', [Validators.required, Validators.email]],
    });
    this.formGroup = this.resetPassword;
  }

  onSubmit(){
    if (this.resetPassword.valid) {
      const payload =  this.resetPassword.value;
      this.service.postPublicData('/employee/password/reset', payload, { responseType: 'text' })
        .subscribe({
          next: (response: HttpResponse<any> | any) => {
            // Caso o endpoint não retorne status, consideramos sucesso (status 200)
            const status = response.status ? response.status : 200;
            if ([200, 201, 204].includes(status)) {
              this.alertMessage = 'Password enviado para E-mail com sucesso!';
              this.alertType = 'success';
            } else {
              this.alertMessage = `Operação realizada com status ${status}.`;
              this.alertType = 'success';
            }
            // Exibe a mensagem de sucesso por 3 segundos antes de redirecionar para a página de login.
            setTimeout(() => {
              this.router.navigate(['/login']);
              this.alertMessage = '';
            }, 3000);
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
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
