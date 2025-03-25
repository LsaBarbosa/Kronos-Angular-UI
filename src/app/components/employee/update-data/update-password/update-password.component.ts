import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import {TogglePasswordComponent} from '../../../common/toggle-password/toggle-password.component';

@Component({
  selector: 'app-update-password',
  imports: [
    ButtonComponent,
    AuthFormComponent,
    ButtonSubmitComponent,
    ErrorMessageComponent,
    NgIf,
    ReactiveFormsModule,
    FieldLabelPipe,
    TogglePasswordComponent
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
    private service: ApiService,
  private cdr: ChangeDetectorRef // 🔹 Força a detecção de mudanças

) {
    super()
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
      this.service.updateData('/employee/password/update', payload)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.alertMessage = 'Senha alterada com sucesso!';
            this.alertType = 'success';

            this.cdr.detectChanges(); // 🔹 Força o Angular a atualizar a view

            setTimeout(() => {
              this.alertMessage = '';
              this.router.navigate(['/home']); // 🔹 Agora só navega APÓS a mensagem ser exibida
            }, 4000);
          },
          error: (error) => {
            this.alertMessage = error.error?.error || `Erro ${error.status}: Ocorreu um problema.`;
            this.alertType = 'error';

            this.cdr.detectChanges(); // 🔹 Garante que a UI atualize a mensagem

            setTimeout(() => {
              this.alertMessage = '';
            }, 4000);
          }
        });
    }
  }
}
