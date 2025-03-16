import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {NgIf} from '@angular/common';
import {BaseAuthFormComponent} from '../common/BaseAuthFormComponent';
import {AuthFormComponent} from '../common/auth-form/auth-form.component';

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    AuthFormComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent extends BaseAuthFormComponent implements OnInit {
  resetPassword!: FormGroup;

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
      this.service.postData('/password/reset',payload)
        .subscribe({
          next: () => {
            this.router.navigate(['/login']);
          }
        })
    }
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
