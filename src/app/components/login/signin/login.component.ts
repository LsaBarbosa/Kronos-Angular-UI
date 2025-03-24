import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';
import {BaseAuthFormComponent} from '../../common/BaseAuthFormComponent';
import {AuthFormComponent} from '../../common/auth-form/auth-form.component';
import {ErrorMessageComponent} from '../../common/error-message/error-message.component';
import {FieldLabelPipe} from '../../../pipe/field-label.pipe';
import {ButtonSubmitComponent} from "../../common/button/button-submit/button-submit.component";
import {TogglePasswordComponent} from '../../common/toggle-password/toggle-password.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, // Permite o uso de formulários reativos
    NgIf, // Diretiva para condicionar exibição de elementos no HTML
    AuthFormComponent, // Componente de formulário customizado
    ErrorMessageComponent, // Componente para exibir mensagens de erro
    FieldLabelPipe, // Pipe para formatar rótulos de erro
    ButtonSubmitComponent,
    TogglePasswordComponent,
    // Componente para o botão de envio
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent extends BaseAuthFormComponent implements OnInit {
  loginForm!: FormGroup; // Declaração do formulário
  showPassword: boolean = false; // Define se a senha será exibida em texto ou ocultada

  alertMessage: string = ''; // Mensagem de alerta exibida ao usuário
  alertType: 'success' | 'error' = 'success'; // Tipo do alerta: sucesso ou erro

  constructor(private formBuilder: FormBuilder,
              private service: ApiService,
              private router: Router) {
    super(); // Chama o construtor da classe base BaseAuthFormComponent
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      cpf: ['', [
        Validators.required, // CPF é obrigatório
        Validators.pattern('^[0-9]{11}$') // Aceita apenas números e exatamente 11 dígitos
      ]],
      password: ['', [
        Validators.required, // Senha é obrigatória
        Validators.minLength(8) // Mínimo de 8 caracteres
      ]]
    });

    this.formGroup = this.loginForm; // Atribui o formulário à propriedade da classe base
  }

  /**
   * Método chamado quando o formulário é enviado.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      const payload = this.loginForm.value; // Captura os valores do formulário

      this.service.login('/authentication/login', payload, {observe: 'response'})
        .subscribe({
          next: (response: any) => {
            const token = response.body?.token;
            if (token) {
              localStorage.setItem('token', token); // Armazena o token no localStorage
              this.router.navigate(['/home']); // Redireciona para a home
            } else {
              this.alertMessage = 'Token não encontrado na resposta.';
              this.alertType = 'error';
              setTimeout(() => { this.alertMessage = ''; }, 4000);
            }
          },
          error: (error) => {
            this.alertMessage = error.error?.error || `Erro ${error.status}: Ocorreu um problema.`;
            this.alertType = 'error';
            setTimeout(() => { this.alertMessage = ''; }, 4000);
          }
        });
    } else {
      this.loginForm.markAllAsTouched(); // Marca todos os campos como tocados para exibir mensagens de erro
    }
  }

  /**
   * Redireciona o usuário para a tela de recuperação de senha.
   */
  goToResetPassword() {
    this.router.navigate(['/resetar-senha']);
  }
}
