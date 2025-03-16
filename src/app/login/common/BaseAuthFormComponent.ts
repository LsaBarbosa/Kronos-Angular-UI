// base-auth-form.component.ts
import { FormGroup } from '@angular/forms';

/**
 * Classe base que contém métodos e propriedades comuns para formulários de autenticação.
 */
export abstract class BaseAuthFormComponent {
  // A propriedade formGroup deve ser definida nos componentes filhos
  formGroup!: FormGroup;

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
    if (control.hasError('required')) {
      return `${controlName.toUpperCase()} é obrigatório.`;
    }
    if (controlName === 'cpf' && control.hasError('pattern')) {
      return 'CPF inválido. Informe 11 dígitos';
    }
    // O componente filho pode sobrescrever este método para tratar outros casos
    return '';
  }
}
