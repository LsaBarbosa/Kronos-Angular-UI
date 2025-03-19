import {Component, OnInit} from '@angular/core';
import {ButtonComponent} from '../../../common/button/button-menu/button.component';
import {AuthFormComponent} from '../../../common/auth-form/auth-form.component';
import {ErrorMessageComponent} from '../../../common/error-message/error-message.component';
import {NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {ApiService} from "../../../../services/api.service";
import {BaseAuthFormComponent} from "../../../common/BaseAuthFormComponent";
import {HttpResponse} from "@angular/common/http";
import {ButtonSubmitComponent} from "../../../common/button/button-submit/button-submit.component";

@Component({
    selector: 'app-update-email',
  imports: [
    ButtonComponent,
    AuthFormComponent,
    ErrorMessageComponent,
    NgIf,
    ReactiveFormsModule,
    ButtonSubmitComponent
  ],
    templateUrl: './update-email.component.html',
    styleUrl: './update-email.component.css'
})
export class UpdateEmailComponent extends BaseAuthFormComponent implements OnInit {
    updateEmail!: FormGroup;

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
        this.updateEmail = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            confirmEmail: ['', [Validators.required, Validators.email]],
        });
        this.formGroup = this.updateEmail;
    }

    onSubmit() {
        if (this.updateEmail.valid) {
            const payload = this.updateEmail.value;
            this.service.postData('/employee/email/update', payload)
                .subscribe({
                    next: (response: HttpResponse<any>) => {
                        const status = response.status;
                        // Mapeamento de status de sucesso
                        if (status === 200 || status === 201) {
                            this.alertMessage = 'E-mail alterado com sucesso!';
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
                                this.alertMessage = 'E-mail e Confirmação de E-mail não são iguais';
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
