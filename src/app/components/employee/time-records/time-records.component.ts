import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCalendar } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
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
    ButtonComponent,
    NgClass
  ],
  templateUrl: './time-records.component.html',
  styleUrls: ['./time-records.component.css']
})
export class TimeRecordsComponent implements OnInit {
  selectedDates: Date[] = [];
  referenceMinutes: string = '08:00';
  errorMessage: string = '';
  loading: boolean = false;
  reportData: ReportResponse | null = null;
  paginatedData: ReportContent[] = [];
  referenceTime: string = '00:00'; // Formato HH:mm
  balance: string | null = null; // Para armazenar o saldo retornado

  // Configuração da paginação
  currentPage: number = 0;
  pageSize: number = 5;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  /**
   * Método chamado quando uma data é selecionada no calendário
   */
  dateSelected(date: Date | null): void {
    if (!date) return; // Se a data for null, não faz nada

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
   * Chama o endpoint /time/search/report e atualiza os dados paginados
   */
  searchReport(): void {
    if (this.selectedDates.length === 0) {
      this.errorMessage = 'Selecione pelo menos uma data.';
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

    const endpoint = `/time/search/report?startDate=${startDateStr}&endDate=${endDateStr}&referenceMinutes=${this.referenceMinutes}`;

    this.apiService.getData(endpoint).subscribe({
      next: (data: ReportResponse) => {
        this.reportData = data;
        this.currentPage = 0; // Reinicia a paginação ao buscar novos dados
        this.updatePaginatedData(); // Atualiza os dados da primeira página
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao carregar os dados.';
        this.loading = false;
      }
    });
  }

  fetchBalance(): void {
    if (this.selectedDates.length === 0) {
      this.errorMessage = 'Selecione pelo menos uma data.';
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

    // Converte o time HH:mm para minutos
    const referenceMinutes = this.convertTimeToMinutes(this.referenceTime);

    this.loading = true;
    this.errorMessage = '';
    this.balance = null; // Reseta o saldo antes da requisição

    const endpoint = `/time/search/balance?startDate=${startDateStr}&endDate=${endDateStr}&referenceMinutes=${referenceMinutes}`;

    this.apiService.getData(endpoint).subscribe({
      next: (data) => {
        this.balance = data.balance; // Armazena o saldo retornado pela API
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao carregar o saldo.';
        this.loading = false;
      }
    });
  }

  /**
   * Converte o tempo no formato HH:mm para minutos
   */
  convertTimeToMinutes(time: string): number {
    if (!time) return 0; // Se não houver valor, retorna 0

    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    return (hours * 60) + minutes;
  }

  /**
   * Define se o saldo é positivo ou negativo para colorir corretamente
   */
  isPositiveBalance(): boolean {
    if (!this.balance) return false;

    // Extrai as horas e minutos do saldo retornado (ex: "157:43")
    const [hours, minutes] = this.balance.split(':').map(num => parseInt(num, 10));

    // Converte para minutos totais
    const totalMinutes = (hours * 60) + minutes;

    return totalMinutes >= 0; // Se for positivo, retorna true
  }

  /**
   * Retorna o total de páginas
   */
  get totalPages(): number {
    if (!this.reportData?.content) return 1;
    return Math.ceil(this.reportData.content.length / this.pageSize);
  }
}
