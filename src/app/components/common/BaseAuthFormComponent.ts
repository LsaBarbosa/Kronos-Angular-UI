// base-auth-form.component.ts
import { FormGroup } from '@angular/forms';

/**
 * Classe base que contém métodos e propriedades comuns para formulários de autenticação.
 */
export abstract class BaseAuthFormComponent {
  // A propriedade formGroup deve ser definida nos componentes filhos
  formGroup!: FormGroup;

  // 🔹 Mapeamento de nomes amigáveis para os campos
  private fieldLabels: { [key: string]: string } = {
    password: 'Senha',
    cpf: 'CPF',
    email: 'E-mail',
    confirmEmail: 'Confirmação de E-mail',
    confirmPassword: 'Confirmação de Senha',
    oldPassword: 'Senha antiga',
    newPassword: 'Nova Senha'
    ,
  };

  /**
   * Retorna a mensagem de erro adequada para um controle de formulário.
   * @param controlName - Nome do controle (ex.: 'cpf', 'password', 'email').
   * @returns A mensagem de erro a ser exibida ou uma string vazia se não houver erro.
   */
  getErrorMessage(controlName: string): string {
    const control = this.formGroup.get(controlName);
    if (!control || !control.touched || control.valid) {
      return '';
    }

    // 🔹 Obtém o rótulo amigável do campo (se existir, senão mantém o nome original)
    const fieldLabel = this.fieldLabels[controlName] || controlName.toUpperCase();

    if (control.hasError('required')) {
      return `${fieldLabel} é obrigatório.`;
    }
    if (controlName === 'cpf' && control.hasError('pattern')) {
      return `${fieldLabel} inválido. Informe 11 dígitos.`;
    }

    return '';
  }
}
