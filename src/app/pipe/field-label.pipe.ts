import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldLabel'
})
export class FieldLabelPipe implements PipeTransform {
  private labels: { [key: string]: string } = {
    password: 'Senha',
    cpf: 'CPF',
    email: 'E-mail'
  };

  transform(value: string): string {
    return this.labels[value] || value; // Se não encontrar no dicionário, retorna o próprio valor
  }
}
