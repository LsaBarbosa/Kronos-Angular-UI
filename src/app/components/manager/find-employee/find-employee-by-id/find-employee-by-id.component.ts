import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {CurrencyPipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonComponent} from '../../../common/button/button-menu/button.component';
import {NgxCurrencyDirective} from 'ngx-currency';

interface Employee {
  id: string;
  name: string;
  surname: string;
  salary: number;
  position: string;
  cpf: string;
  role: string;
  email: string;
  company: Company;
}

interface Company {
  nameCompany: string;
}

@Component({
  selector: 'app-find-employee-by-id',
  imports: [
    CurrencyPipe,
    FormsModule,
    NgIf,
    ButtonComponent,
    NgxCurrencyDirective
  ],
  templateUrl: './find-employee-by-id.component.html',
  styleUrl: './find-employee-by-id.component.css'
})
export class FindEmployeeByIdComponent implements OnInit {

  id: string = ''; // ID informado pelo usuário para busca
  employee: Employee | null = null;
  editedEmployee: Employee | null = null; // Armazena os dados para edição
  errorMessage: string = '';
  updateMessage: string = '';
  loading: boolean = false;
  updateLoading: boolean = false;
  isEditing: boolean = false;

  constructor(private service: ApiService) {}

  ngOnInit(): void {
    // Se necessário, pode realizar alguma ação na inicialização.
  }

  searchEmployee(): void {
    if (!this.id.trim()) {
      this.errorMessage = 'Informe um ID válido.';
      this.employee = null;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.employee = null;
    this.updateMessage = '';

    const endpoint = `/employee/search/adm/${this.id}`;


    this.service.getData(endpoint).subscribe({
      next: (data: Employee) => {
        this.employee = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Erro ao carregar os dados.';
        this.loading = false;
      }
    });
  }

  enableEdit(): void {
    if (this.employee) {
      // Cria uma cópia dos dados atuais para edição
      this.editedEmployee = { ...this.employee };
      this.isEditing = true;
      this.updateMessage = '';
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedEmployee = null;
  }

  pasteId(): void {
    navigator.clipboard.readText()
      .then(text => {
        this.id = text;
      })
      .catch(error => {
        console.error('Erro ao colar ID:', error);
      });
  }

  updateEmployee(): void {
    if (!this.editedEmployee) return;

    this.updateLoading = true;
    this.errorMessage = '';
    this.updateMessage = '';

    const endpoint = `/employee/adm/update`;


    // Monta o payload de acordo com o exemplo fornecido
    const payload = {
      employeeId: this.editedEmployee.id,
      employeeCpfTarget: this.editedEmployee.cpf,
      updateEmployeeDto: {
        name: this.editedEmployee.name,
        surname: this.editedEmployee.surname,
        salary: this.editedEmployee.salary,
        position: this.editedEmployee.position,
        role: this.editedEmployee.role,
        email: this.editedEmployee.email
      }
    };

    this.service.updateData(endpoint, payload).subscribe({
      next: (data) => {
        // Atualiza os dados e desativa o modo de edição
        this.employee = { ...this.editedEmployee! };
        this.isEditing = false;
        this.editedEmployee = null;
        this.updateMessage = 'Dados atualizados com sucesso!';
        this.updateLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Erro ao atualizar os dados.';
        this.updateLoading = false;
      }
    });
  }
}
