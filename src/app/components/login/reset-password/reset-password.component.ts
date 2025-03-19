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
      this.service.postData('/employee/password/reset',payload)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            const status = response.status;
            // Mapeamento de status de sucesso
            if (status === 200 || status === 201) {
              this.alertMessage = 'Password enviado para E-mail com sucesso!';
              this.alertType = 'success';
            } else {
              this.alertMessage = `Operação realizada com status ${status}.`;
              this.alertType = 'success';
            }
            this.router.navigate(['/login']);
              setTimeout(() => {
                this.alertMessage = '';
              }, 3000);
          },
          error: (error) => {
            // Mapeamento de status de erro
            switch (error.status) {
              case 401:
                this.alertMessage = 'Cpf ou E-mail inválidos';
                break;
              case 500:
                this.alertMessage = 'Erro 500: Erro interno no servidor.';
                break;
              default:
                this.alertMessage = `Erro ${error.status}: Ocorreu um problema.`;
            }
            this.alertType = 'error';
            setTimeout(() => {
              this.alertMessage = '';
            }, 3000);
          }
        });
    }
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
