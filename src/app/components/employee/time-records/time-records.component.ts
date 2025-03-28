import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCalendar } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import {ButtonComponent} from '../../common/button/button-menu/button.component';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {ReportContent, ReportResponse} from '../../../interfaces/report.interfaces';
import {BaseReportComponent} from '../../common/BaseReportComponent';

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
export class TimeRecordsComponent extends BaseReportComponent implements OnInit {

  constructor(private apiService: ApiService) {
    super();
  }

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

  /**
   * Converte o tempo no formato HH:mm para minutos
   */
  convertTimeToMinutes(time: string): number {
    if (!time) return 0; // Se não houver valor, retorna 0

    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    return (hours * 60) + minutes;
  }

  /**
   * Busca os dados do colaborador pelo token
   */
  fetchEmployeeData(callback: () => void): void {
    this.apiService.getData('/employee/search/id').subscribe({
      next: (employeeData) => {
        this.employeeName = employeeData.name;
        this.employeeSurname = employeeData.surname;
        this.employeeCpf = employeeData.cpf;
        callback(); // Chama a função de geração de PDF após buscar os dados
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao carregar os dados do colaborador.';
      }
    });
  }

  /**
   * Gera um PDF com o relatório de horas e saldo juntos
   */
  generateCompleteReport(): void {
    if (this.selectedDates.length === 0) {
      this.errorMessage = 'Selecione pelo menos uma data.';
      return;
    }
    if (!this.referenceTime.trim()) {
      this.errorMessage = 'Informe os minutos de referência.';
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
    const referenceMinutes = this.convertTimeToMinutes(this.referenceTime);
    this.loading = true;
    this.errorMessage = '';
    // Passo 1: Buscar os dados do colaborador
    this.fetchEmployeeData(() => {
      // Passo 2: Buscar o relatório de horas
      const reportEndpoint = `/time/search/report?startDate=${startDateStr}&endDate=${endDateStr}&referenceMinutes=${referenceMinutes}`;
      this.apiService.getData(reportEndpoint).subscribe({
        next: (reportData) => {
          this.reportData = reportData;
          this.currentPage = 0;
          this.updatePaginatedData();
          // Passo 3: Buscar o saldo de horas
          const balanceEndpoint = `/time/search/balance?startDate=${startDateStr}&endDate=${endDateStr}&referenceMinutes=${referenceMinutes}`;
          this.apiService.getData(balanceEndpoint).subscribe({
            next: (balanceData) => {
              this.balance = balanceData.balance;
              this.loading = false;
              // Passo 4: Gerar o PDF com todas as informações
              this.generatePdfDocument();
            },
            error: (err) => {
              console.error(err);
              this.errorMessage = 'Erro ao carregar o saldo.';
              this.loading = false;
            }
          });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erro ao carregar o relatório de horas.';
          this.loading = false;
        }
      });
    });
  }

  /**
   * Cria o documento PDF com todas as informações
   */
  generatePdfDocument(): void {
    const doc = new jsPDF();
    doc.text(`Colaborador: ${this.employeeName} ${this.employeeSurname}`, 10, 10);
    doc.text(`CPF: ${this.employeeCpf}`, 10, 20);
    if (this.reportData) {
      doc.text(`Relatório de Horas`, 10, 30);
      autoTable(doc, {
        head: [['Início', 'Término', 'Jornada', 'Registro']],
        body: this.reportData.content.map(item => [
          `${item.startWorkDate} ${item.startWorkTime}`,
          `${item.endWorkDate} ${item.endWorkTime}`,
          item.timeWorked,
          item.edited ? 'Editado por Adm' : 'Original'
        ]),
        startY: 40
      });
    }
    if (this.balance !== null) {
      doc.text(`Saldo de Horas`, 10, doc.internal.pageSize.height - 40);
      doc.text(`Horas Totais: ${this.balance}`, 10, doc.internal.pageSize.height - 30);
    }
    doc.save(`relatorio_${this.employeeName}_${this.employeeSurname}.pdf`);
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
