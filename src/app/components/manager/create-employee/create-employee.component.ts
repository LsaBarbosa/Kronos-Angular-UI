import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import {TogglePasswordComponent} from '../../common/toggle-password/toggle-password.component';

@Component({
  selector: 'app-create-employee',
  imports: [
    ButtonComponent,
    AuthFormComponent,
    NgIf,
    ReactiveFormsModule,
    FieldLabelPipe,
    NgxCurrencyDirective,
    ErrorMessageComponent,
    TogglePasswordComponent
  ],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.css'
})
export class CreateEmployeeComponent extends BaseAuthFormComponent implements OnInit {
// Utilizamos a propriedade 'formGroup' da classe base para o formulário de login
  createForm!: FormGroup;

  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  showPasswordsManager: boolean = false;
  showPasswords: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private service: ApiService,
              private router: Router,
              private cdr: ChangeDetectorRef // 🔹 Injeta ChangeDetectorRef para forçar atualização da view
  ) {
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
      passwords: ['', [
        Validators.required,
        Validators.minLength(8),
      ]],
      passwordsManager: ['', [
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

  onSubmit() {
    if (this.createForm.valid) {
      const formValues = this.createForm.value;

      const payload = {
        passwordsManager: formValues.passwordsManager,
        employeeDto: {
          name: formValues.name,
          surname: formValues.surname,
          salary: formValues.salary,
          position: formValues.position,
          email: formValues.email,
          cpf: formValues.cpf,
          passwords: formValues.passwords,
          role: formValues.role
        }
      };

      this.service.postData('/employee/adm/register', payload).subscribe({
        next: (response: HttpResponse<any>) => {
          this.alertMessage = 'Colaborador criado com sucesso!';
          this.alertType = 'success';
          this.cdr.detectChanges(); // 🔹 Garante que a UI seja atualizada

          // Reseta o formulário após sucesso
          this.createForm.reset();

          setTimeout(() => {
            this.alertMessage = '';
            this.cdr.detectChanges(); // 🔹 Garante atualização da UI após remover a mensagem
            this.router.navigate(['/administracao']);
          }, 4000);
        },
        error: (error) => {
          this.alertMessage = error.error?.error || `Erro ${error.status}: Ocorreu um problema.`;
          this.alertType = 'error';
          this.cdr.detectChanges(); // 🔹 Garante que a mensagem apareça

          setTimeout(() => {
            this.alertMessage = '';
            this.cdr.detectChanges(); // 🔹 Atualiza a UI após esconder a mensagem
          }, 4000);
        }
      });
    }
  }

}
