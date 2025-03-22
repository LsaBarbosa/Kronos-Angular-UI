import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCalendar} from '@angular/material/datepicker';
import {MatButton} from '@angular/material/button';
import {ApiService} from '../../../services/api.service';
import {ButtonComponent} from '../../common/button/button-menu/button.component';

interface ReportContent {
  id: number;
  startWorkTime: string;
  endWorkTime: string;
  startWorkDate: string;
  endWorkDate: string;
  timeWorked: string;
}

interface ReportPage {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

interface ReportResponse {
  content: ReportContent[];
  page: ReportPage;
}

@Component({
  selector: 'app-time-records',
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    DatePipe,
    MatNativeDateModule,
    MatCalendar,
    MatButton,
    ButtonComponent
  ],  templateUrl: './time-records-by-adm.component.html',
  styleUrl: './time-records-by-adm.component.css'
})
export class TimeRecordsByAdmComponent implements OnInit {

  selectedDates: Date[] = [];
  employeeIdTarget: string = '';
  passwords: string = '';
  referenceMinutes: string = '08:00';
  errorMessage: string = '';
  loading: boolean = false;
  reportData: ReportResponse | null = null;
  paginatedData: ReportContent[] = [];


  // Configuração da paginação
  currentPage: number = 0;
  pageSize: number = 5;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  dateSelected(date: Date | null): void {
    if (!date) return;

    const time = date.getTime();
    const index = this.selectedDates.findIndex(d => d.getTime() === time);

    if (index >= 0) {
      this.selectedDates.splice(index, 1); // Remove se já estiver na lista
    } else {
      this.selectedDates.push(date); // Adiciona se ainda não foi selecionada
    }

    this.selectedDates.sort((a, b) => a.getTime() - b.getTime()); // Ordena as datas
  }

  /**
   * Define a classe CSS para destacar as datas selecionadas no calendário
   */
  dateClass = (date: Date): string => {
    return this.selectedDates.some(d => d.getTime() === date.getTime()) ? 'selected-date' : '';
  };

  /**
   * Atualiza os dados da página atual
   */
  updatePaginatedData() {
    if (!this.reportData?.content) {
      this.paginatedData = [];
      return;
    }
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.reportData.content.slice(start, end);
  }

  /**
   * Navegação entre as páginas
   */
  nextPage() {
    if (this.reportData && (this.currentPage + 1) * this.pageSize < this.reportData.content.length) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  /**
   * Chama o endpoint `/time/search/adm/report`
   */
  searchReport(): void {
    if (this.selectedDates.length === 0) {
      this.errorMessage = 'Selecione pelo menos uma data.';
      return;
    }

    if (!this.employeeIdTarget.trim() || !this.passwords.trim()) {
      this.errorMessage = 'Informe o ID do funcionário e a senha.';
      return;
    }

    const sortedDates = this.selectedDates.slice().sort((a, b) => a.getTime() - b.getTime());
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    const formatDate = (date: Date): string => {
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    this.loading = true;
    this.errorMessage = '';
    this.reportData = null;

    // Construindo a URL com query parameters
    const endpoint = `/time/search/adm/report?employeeIdTarget=${this.employeeIdTarget}&passwords=${this.passwords}&startDate=${startDateStr}&endDate=${endDateStr}`;

    this.apiService.getData(endpoint).subscribe({
      next: (data: ReportResponse) => {
        this.reportData = data;
        this.currentPage = 0;
        this.updatePaginatedData();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao carregar os dados.';
        this.loading = false;
      }
    });
  }

  /**
   * Retorna o total de páginas
   */
  get totalPages(): number {
    if (!this.reportData?.content) return 1;
    return Math.ceil(this.reportData.content.length / this.pageSize);
  }
}
