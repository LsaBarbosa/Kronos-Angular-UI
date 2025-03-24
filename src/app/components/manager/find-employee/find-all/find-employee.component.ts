import {Component, OnInit} from '@angular/core';
import {ButtonComponent} from '../../../common/button/button-menu/button.component';
import {ApiService} from '../../../../services/api.service';
import {HttpHeaders} from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ErrorMessageComponent} from '../../../common/error-message/error-message.component';


interface Employee {
  id: string;
  name: string;
  surname: string;
  position: string;
}

interface Page {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

interface EmployeeResponse {
  content: Employee[];
  page: Page;
}

@Component({
  selector: 'app-find-employee',
  imports: [
    ButtonComponent,
    NgIf,
    NgForOf,
    FormsModule,
    ErrorMessageComponent
  ],
  templateUrl: './find-employee.component.html',
  styleUrl: './find-employee.component.css'
})

export class FindEmployeeComponent implements OnInit {
  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  displayedEmployees: Employee[] = [];
  errorMessage: string = '';
  loading: boolean = true;
  copyMessage: string = ''; // Armazena a mensagem temporária

  filterName: string = '';
  filterPosition: string = '';

  currentPage: number = 0;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(private service: ApiService) {
  }

  ngOnInit(): void {
    this.loadEmployees(0);
  }

  loadEmployees(page: number): void {

    this.loading = true;
    this.errorMessage = ''
    this.service.getData(`/employee/search/adm/all`).subscribe({
      next: (data: EmployeeResponse) => {
        this.allEmployees = data.content;
        this.filteredEmployees = this.allEmployees;
        this.totalPages = Math.ceil(this.allEmployees.length / this.itemsPerPage);
        this.updateDisplayedEmployees();
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Erro ao carregar os dados dos funcionários.';
        this.loading = false;
      }
    });
  }

  updateDisplayedEmployees(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedEmployees();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedEmployees();
    }
  }

  copyId(id: string): void {
    navigator.clipboard.writeText(id)
      .then(() => {
        this.copyMessage = `ID copiado com sucesso!`;
        setTimeout(() => this.copyMessage = '', 3000); // Limpa a mensagem após 3s
      })
      .catch(error => {
        console.error("Erro ao copiar ID:", error);
      });
  }

  showCopiedMessage(id: string): void {
    alert(`ID ${id} copiado com sucesso!`);
  }


  filterEmployees(): void {
    // Reseta para a primeira página sempre que o filtro for aplicado
    this.currentPage = 0;
    const nameFilter = this.filterName.toLowerCase();
    const positionFilter = this.filterPosition.toLowerCase();

    this.filteredEmployees = this.allEmployees.filter(employee =>
      employee.name.toLowerCase().includes(nameFilter) &&
      employee.position.toLowerCase().includes(positionFilter)
    );
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    this.updateDisplayedEmployees();
  }

}
