import {Component, OnInit} from '@angular/core';
import {ButtonComponent} from '../../common/button/button.component';
import {AuthFormComponent} from '../../common/auth-form/auth-form.component';
import {NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';
import {BaseAuthFormComponent} from '../../common/BaseAuthFormComponent';

@Component({
  selector: 'app-create-employee',
  imports: [
    ButtonComponent,
    AuthFormComponent,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.css'
})
export class CreateEmployeeComponent extends BaseAuthFormComponent implements OnInit {
// Utilizamos a propriedade 'formGroup' da classe base para o formulário de login

  createForm!: FormGroup;
  showPassword: boolean = false;

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
      surame: ['', [
        Validators.required
      ]],
      cpf: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{11}$')
      ]],
      password: ['', [
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

  onSubmit() {
    if (this.createForm.valid) {
      const payload = this.createForm.value;
      this.service.postData('/employee/create', payload)
        .subscribe({
          next: (response) => {
            return response;
          }
        })
    } else {
      this.createForm.markAllAsTouched();
    }
  }
}
