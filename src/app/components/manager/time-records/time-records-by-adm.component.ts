import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCalendar} from '@angular/material/datepicker';
import {MatButton} from '@angular/material/button';
import {ApiService} from '../../../services/api.service';
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
  ], templateUrl: './time-records-by-adm.component.html',
  styleUrl: './time-records-by-adm.component.css'
})
export class TimeRecordsByAdmComponent extends BaseReportComponent implements OnInit {
  passwords: string = '';
  employeeIdTarget: string = '';

  // Variáveis para edição
  isEditing: boolean = false;
  editTimeRecord: ReportContent | null = null;
  editStartWorkTime: string = '';
  editEndWorkTime: string = '';
  editStartWorkDate: string = '';
  editEndWorkDate: string = '';
  editedRecords: Set<number> = new Set(); // IDs dos registros editados


  constructor(private apiService: ApiService) {
    super();
  }

  ngOnInit(): void {
  }

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


  isPositiveBalance(): boolean {
    if (!this.balance) return false;

    // Extrai as horas e minutos do saldo retornado (ex: "157:43")
    const [hours, minutes] = this.balance.split(':').map(num => parseInt(num, 10));

    // Converte para minutos totais
    const totalMinutes = (hours * 60) + minutes;

    return totalMinutes >= 0; // Se for positivo, retorna true
  }

  /**
   * Converte o tempo no formato HH:mm para minutos
   */
  convertTimeToMinutes(time: string): number {
    if (!time) return 0; // Se não houver valor, retorna 0

    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    return (hours * 60) + minutes;
  }

  fetchEmployeeData(callback: () => void): void {
    this.apiService.getData(`/employee/search/adm/${this.employeeIdTarget}`).subscribe({
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

    if (!this.employeeIdTarget.trim() || !this.passwords.trim()) {
      this.errorMessage = 'Informe o ID do funcionário e a senha.';
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

    // Converte o time HH:mm para minutos
    const referenceMinutes = this.convertTimeToMinutes(this.referenceTime);

    this.loading = true;
    this.errorMessage = '';

    // 🔹 Passo 1: Buscar os dados do colaborador antes de gerar o PDF
    this.fetchEmployeeData(() => {
      // 🔹 Passo 2: Buscar o relatório de horas
      const reportEndpoint = `/time/search/adm/report?employeeIdTarget=${this.employeeIdTarget}&passwords=${this.passwords}&startDate=${startDateStr}&endDate=${endDateStr}&referenceMinutes=${referenceMinutes}`;

      this.apiService.getData(reportEndpoint).subscribe({
        next: (reportData) => {
          this.reportData = reportData;
          this.currentPage = 0;
          this.updatePaginatedData();

          // 🔹 Passo 3: Buscar o saldo de horas
          const balanceEndpoint = `/time/search/adm/balance?employeeIdTarget=${this.employeeIdTarget}&passwords=${this.passwords}&startDate=${startDateStr}&endDate=${endDateStr}&referenceMinutes=${referenceMinutes}`;

          this.apiService.getData(balanceEndpoint).subscribe({
            next: (balanceData) => {
              this.balance = balanceData.balance;
              this.loading = false;

              // 🔹 Passo 4: Gerar o PDF com todas as informações
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

    // Cabeçalho com os dados do colaborador
    doc.text(`Colaborador: ${this.employeeName} ${this.employeeSurname}`, 10, 10);
    doc.text(`CPF: ${this.employeeCpf}`, 10, 20);

    // Relatório de Horas com a coluna Status
    if (this.reportData) {
      doc.text(`Relatório de Horas`, 10, 30);
      autoTable(doc, {
        head: [['Início', 'Término', 'Jornada', 'Registro']],
        body: this.reportData.content.map(item => [
          `${item.startWorkDate} ${item.startWorkTime}`,
          `${item.endWorkDate} ${item.endWorkTime}`,
          item.timeWorked,
          item.edited ? 'Editado por ADM' : 'Original'
        ]),
        startY: 40
      });
    }

    // Exibe o saldo de horas na parte inferior do PDF
    if (this.balance !== null) {
      doc.text(`Saldo de Horas`, 10, doc.internal.pageSize.height - 40);
      doc.text(`Horas Totais: ${this.balance}`, 10, doc.internal.pageSize.height - 30);
    }

    // Salva o PDF com um nome baseado no nome do colaborador
    doc.save(`relatorio_${this.employeeName}_${this.employeeSurname}.pdf`);
  }


  openEditModal(record: ReportContent): void {
    this.isEditing = true;
    // Clona os dados para evitar alteração direta do registro exibido
    this.editTimeRecord = {...record};
    this.editStartWorkTime = record.startWorkTime;
    this.editEndWorkTime = record.endWorkTime;
    this.editStartWorkDate = record.startWorkDate;
    this.editEndWorkDate = record.endWorkDate;
  }

  closeEditModal(): void {
    this.isEditing = false;
    this.editTimeRecord = null;
  }

  /**
   * Atualiza o registro editado enviando os novos dados para o backend.
   */
  updateTimeRecord(): void {
    if (!this.editTimeRecord) return;

    // Função para converter data de "yyyy-MM-dd" para "dd-MM-yyyy"
    const formatDate = (date: string): string => {
      const parts = date.split('-');
      if (parts.length !== 3) return date;
      const [year, month, day] = parts;
      return `${day}-${month}-${year}`;
    };

    const payload = {
      employeeIdTarget: this.employeeIdTarget,
      passwords: this.passwords,
      timeRecordId: this.editTimeRecord.id,
      updateTimeRecordDto: {
        id: this.editTimeRecord.id,
        startWorkDate: formatDate(this.editStartWorkDate),
        startWorkTime: this.editStartWorkTime,
        endWorkDate: formatDate(this.editEndWorkDate),
        endWorkTime: this.editEndWorkTime
      }
    };

    console.log('Payload para update:', payload);
    this.apiService.updateData('/time/adm/update', payload).subscribe({
      next: (updatedRecord) => {
        console.log('Resposta do update:', updatedRecord);
        this.closeEditModal();
        // Atualiza o registro na lista da página atual
        const index = this.paginatedData.findIndex(item => item.id === updatedRecord.id);
        if (index !== -1) {
          this.paginatedData[index] = updatedRecord;
        }
        // Marca o registro como editado (para exibir o status "Editado")
        this.editedRecords.add(updatedRecord.id);
        this.generateCompleteReport()
      },
      error: (err) => {
        console.error('Erro ao atualizar:', err);
        this.errorMessage = 'Erro ao atualizar o registro.';
      }
    });
  }

  /**
   * Novo método para deletar um registro.
   * Utiliza o endpoint /time/adm/delete e envia o payload conforme o backend espera.
   */
  deleteTimeRecord(): void {
    if (!this.editTimeRecord) return;

    const payload = {
      employeeIdTarget: this.employeeIdTarget,
      passwords: this.passwords,
      timeRecordId: this.editTimeRecord.id
    };

    console.log('Payload para delete:', payload);
    // Nota: Para enviar um corpo na requisição DELETE, usamos a opção { body: payload }
    this.apiService.deleteData('/time/adm/delete', {body: payload}).subscribe({
      next: (response) => {
        console.log('Resposta do delete:', response);
        // Remove o registro da lista de dados paginados e do relatório geral
        const index = this.paginatedData.findIndex(item => item.id === this.editTimeRecord!.id);
        if (index !== -1) {
          this.paginatedData.splice(index, 1);
        }
        if (this.reportData) {
          this.reportData.content = this.reportData.content.filter(item => item.id !== this.editTimeRecord!.id);
        }
        this.closeEditModal();
        this.generateCompleteReport()
      },
      error: (err) => {
        console.error('Erro ao deletar:', err);
        this.errorMessage = 'Erro ao deletar o registro.';
      }
    });
  }


  pasteId(): void {
    navigator.clipboard.readText()
      .then(text => {
        this.employeeIdTarget = text;
      })
      .catch(error => {
        console.error('Erro ao colar ID:', error);
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
