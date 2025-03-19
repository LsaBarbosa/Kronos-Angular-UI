import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';
import {BaseAuthFormComponent} from '../../common/BaseAuthFormComponent';
import {AuthFormComponent} from '../../common/auth-form/auth-form.component';
import {ErrorMessageComponent} from '../../common/error-message/error-message.component';
import {FieldLabelPipe} from '../../../pipe/field-label.pipe';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgIf,
    AuthFormComponent,
    ErrorMessageComponent,
    FieldLabelPipe

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent extends BaseAuthFormComponent implements OnInit {
  // Utilizamos a propriedade 'formGroup' da classe base para o formulário de login

  loginForm!: FormGroup;
  showPassword: boolean = false;

  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(private formBuilder: FormBuilder,
              private service: ApiService,
              private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      cpf: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{11}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
      ]],
    });
    // Atribui o formulário criado à propriedade da classe base para reutilizar getErrorMessage
    this.formGroup = this.loginForm;
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // Verifica se o formulário é válido
    if (this.loginForm.valid) {
      // Obtém os dados do formulário para envio na requisição
      const payload = this.loginForm.value;

      // Realiza a chamada de login passando o payload e observando a resposta completa
      this.service.login('/authentication/login', payload, {observe: 'response'})
        .subscribe({
          // Em caso de sucesso
          next: (response: any) => {
            const token = response.body && response.body.token;
            if (token) {
              // Supondo que a resposta contenha a propriedade "token"
              // Armazena o token no localStorage para uso posterior
              localStorage.setItem('token', response.body.token);
              // Redireciona o usuário para o componente "/home"
              this.router.navigate(['/home']);
            }else {
              this.alertMessage = 'Token não encontrado na resposta.';
              this.alertType = 'error';
              setTimeout(() => { this.alertMessage = ''; }, 4000);
            }
          },
          // Em caso de erro, utiliza a estrutura solicitada
          error: (error) => {
            // Verifica se o payload de erro possui uma mensagem e a utiliza; senão, utiliza uma mensagem padrão
            // Atualiza a mensagem de alerta para exibição e define o tipo como 'error'
            this.alertMessage = error.error && error.error.error
              ? error.error.error
              : `Erro ${error.status}: Ocorreu um problema.`;
            this.alertType = 'error';
            // Limpa a mensagem após 4 segundos para que o alerta desapareça
            setTimeout(() => {
              this.alertMessage = '';
            }, 4000);
          }
        });
    } else {
      // Se o formulário não estiver válido, marca todos os campos como tocados para disparar as mensagens de erro de validação
      this.loginForm.markAllAsTouched();
    }
  }

  goToResetPassword() {
    this.router.navigate(['/resetar-senha']);
  }
}
