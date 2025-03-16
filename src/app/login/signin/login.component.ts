import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';
import {BaseAuthFormComponent} from '../common/BaseAuthFormComponent';
import {AuthFormComponent} from '../common/auth-form/auth-form.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgIf,
    AuthFormComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent extends BaseAuthFormComponent implements OnInit {
  // Utilizamos a propriedade 'formGroup' da classe base para o formulário de login

  loginForm!: FormGroup;
  showPassword: boolean = false;

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
    if (this.loginForm.valid) {
      const payload = this.loginForm.value;
      this.service.postData('/authentication/login', payload)
        .subscribe({
          next: (response) => {
            // Supondo que a resposta contenha uma propriedade "token"
            // Armazena o token no localStorage para uso posterior
            localStorage.setItem('token', response.token);
            // Redireciona o usuário para o componente "/dashboard"
            this.router.navigate(['/home']);
          }
        })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  goToResetPassword(){
    this.router.navigate(['/resetar-senha']);
  }
}
