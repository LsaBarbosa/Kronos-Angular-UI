import {Component, OnInit} from '@angular/core';
import {ButtonComponent} from '../../../common/button/button-menu/button.component';
import {AuthFormComponent} from "../../../common/auth-form/auth-form.component";
import {ButtonSubmitComponent} from "../../../common/button/button-submit/button-submit.component";
import {ErrorMessageComponent} from "../../../common/error-message/error-message.component";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from '@angular/router';
import {ApiService} from '../../../../services/api.service';
import {HttpResponse} from '@angular/common/http';
import {BaseAuthFormComponent} from '../../../common/BaseAuthFormComponent';
import {FieldLabelPipe} from '../../../../pipe/field-label.pipe';

@Component({
  selector: 'app-update-password',
  imports: [
    ButtonComponent,
    AuthFormComponent,
    ButtonSubmitComponent,
    ErrorMessageComponent,
    NgIf,
    ReactiveFormsModule,
    FieldLabelPipe
  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent extends BaseAuthFormComponent implements OnInit {

  updatePassword!: FormGroup;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: ApiService
  ) {
    super()
  }

  toggleShowOldPassword(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleShowNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ngOnInit() {
    this.updatePassword = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.formGroup = this.updatePassword;
  }

  onSubmit() {
    if (this.updatePassword.valid) {
      const payload = this.updatePassword.value;
      this.service.postData('/employee/password/update', payload)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            const status = response.status;
            // Mapeamento de status de sucesso
            if (status === 200 || status === 201) {
              this.alertMessage = 'Password alterado com sucesso!';
              this.alertType = 'success';
            } else {
              this.alertMessage = `Operação realizada com status ${status}.`;
              this.alertType = 'success';
            }
            this.router.navigate(['/home']);
          },
          error: (error) => {
            // Mapeamento de status de erro
            switch (error.status) {
              case 400:
                this.alertMessage = 'Password e Confirmação de Password não são iguais';
                break;
              case 500:
                this.alertMessage = 'Erro 500: Erro interno no servidor.';
                break;
              default:
                this.alertMessage = `Erro ${error.status}: Ocorreu um problema.`;
            }
            this.alertType = 'error';
          }
        });
    }
  }
}
