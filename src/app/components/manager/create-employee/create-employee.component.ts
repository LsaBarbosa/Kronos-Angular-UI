import {Component, OnInit} from '@angular/core';
import {ButtonComponent} from '../../common/button/button-menu/button.component';
import {AuthFormComponent} from '../../common/auth-form/auth-form.component';
import {NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';
import {BaseAuthFormComponent} from '../../common/BaseAuthFormComponent';
import {FieldLabelPipe} from '../../../pipe/field-label.pipe';
import {NgxCurrencyDirective} from 'ngx-currency';
import {ErrorMessageComponent} from '../../common/error-message/error-message.component';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-create-employee',
  imports: [
    ButtonComponent,
    AuthFormComponent,
    NgIf,
    ReactiveFormsModule,
    FieldLabelPipe,
    NgxCurrencyDirective,
    ErrorMessageComponent
  ],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.css'
})
export class CreateEmployeeComponent extends BaseAuthFormComponent implements OnInit {
// Utilizamos a propriedade 'formGroup' da classe base para o formulário de login
  createForm!: FormGroup;

  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  showPassword: boolean = false;
  showPasswords: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private service: ApiService,
              private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', [
        Validators.required
      ]],
      surname: ['', [Validators.required]],
      cpf: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{11}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
      ]],
      passwords: ['', [
        Validators.required,
        Validators.minLength(8),
      ]],
      position: ['', [
        Validators.required
      ]],
      salary: ['', []],
      role: ['', [
        Validators.required,
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
    });
    // Atribui o formulário criado à propriedade da classe base para reutilizar getErrorMessage
    this.formGroup = this.createForm;
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleShowPasswords(): void {
    this.showPasswords = !this.showPasswords;
  }

  onSubmit() {
    if (this.createForm.valid) {
      const payload = this.createForm.value;
      this.service.postData('/employee/create', payload)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            const status = response.status;
            if (status === 200 || status === 201) {
              this.alertMessage = 'Colaborador criado com sucesso!';
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
  }
}
