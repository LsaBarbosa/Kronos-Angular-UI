import { Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { ApiService } from '../../../services/api.service';
import { ButtonComponent } from '../../common/button/button-menu/button.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportContent } from '../../../interfaces/report.interfaces';
import { BaseReportComponent } from '../../common/BaseReportComponent';

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

  formatMinutesToTime(totalMinutes: number): string {
    const sign = totalMinutes < 0 ? '-' : '';
    totalMinutes = Math.abs(totalMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}h`;
  }

  getDayOfWeek(dateString: string): string {
    // Formato esperado: yyyy-MM-dd
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day); // month - 1 pois os meses começam em 0
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    return days[date.getDay()];
  }

  fetchEmployeeData(callback: () => void): void {
    this.apiService.getData(`/employee/search/adm/${this.employeeIdTarget}`).subscribe({
      next: (employeeData) => {
        this.employeeName = employeeData.name;
        this.employeeSurname = employeeData.surname;
        this.employeeCpf = employeeData.cpf;
        this.employeeCompany = employeeData.company?.nameCompany || '';
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
          reportData.content = this.fillMissingDays(reportData.content, startDate, endDate);
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
    doc.text(`Relatório detalhado de horas`, 70, 10);
    doc.text(`Empresa: ${this.employeeCompany}`, 10, 30);
    doc.text(`Colaborador: ${this.employeeName} ${this.employeeSurname}`, 10, 40);
    doc.text(`CPF: ${this.employeeCpf}`, 10, 50);
  
    if (this.balance !== null) {
      doc.text(`Saldo de Horas: ${this.balance}`, 10, 60);
    }
  
    const formatDateToShort = (dateStr: string | null): string => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0].slice(-2)}`;
      }
      return dateStr;
    };
  
    if (this.reportData) {
      // 🔹 Ordena registros por data e hora
      this.reportData.content.sort((a, b) => {
        const aDateTime = new Date(`${a.startWorkDate}T${a.startWorkTime || '00:00'}`);
        const bDateTime = new Date(`${b.startWorkDate}T${b.startWorkTime || '00:00'}`);
        return aDateTime.getTime() - bDateTime.getTime();
      });
  
      const referenceMinutes = this.convertTimeToMinutes(this.referenceTime);
  
      // 🔹 Agrupa por data
      const groupedByDate = new Map<string, { registros: ReportContent[], totalMinutos: number }>();
      this.reportData.content.forEach(record => {
        const date = record.startWorkDate;
        const minutos = this.convertTimeToMinutes(record.timeWorked || '00:00');
  
        if (!groupedByDate.has(date)) {
          groupedByDate.set(date, { registros: [], totalMinutos: 0 });
        }
  
        const grupo = groupedByDate.get(date)!;
        grupo.registros.push(record);
        grupo.totalMinutos += minutos;
      });
  
      const sortedDates = Array.from(groupedByDate.keys()).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
  
      doc.text(`Dados detalhados`, 80, 75);
  
      autoTable(doc, {
        head: [['Data', 'Dia', 'Jornada', 'Saldo Diário', 'Registros']],
        body: sortedDates.map(date => {
          const grupo = groupedByDate.get(date)!;
          const saldo = grupo.totalMinutos - referenceMinutes;
        
          const registrosFormatados = grupo.registros.length > 0
          ? grupo.registros.map(r => {
              const statusIcon = r.edited ? '  (Editado ADM)' : '  (Original)';
              return `${r.startWorkTime || '--:--'} → ${r.endWorkTime || '--:--'} ${statusIcon}`;
            }).join('\n')
          : 'Folga';
        
        
          return [
            formatDateToShort(date),
            this.getDayOfWeek(date),
            grupo.totalMinutos > 0 ? this.formatMinutesToTime(grupo.totalMinutos) : 'Folga',
            grupo.totalMinutos > 0 ? this.formatMinutesToTime(saldo) : 'Folga',
            registrosFormatados
          ];
        }),        
        startY: 80,
        didParseCell: function (data) {
          if (data.section === 'body' && data.column.index === 3) {
            const value = data.cell.text[0];
            data.cell.styles.textColor = value.startsWith('-') ? [255, 0, 0] : [0, 128, 0];
          }
          if (data.section === 'body' && data.column.index === 4) {
            const lines = data.cell.text.join('\n');
            if (lines.includes('EDIT')) {
              data.cell.styles.textColor = [255, 165, 0]; // Amarelo (laranja claro)
            } else if (lines.includes('OK')) {
              data.cell.styles.textColor = [0, 128, 0]; // Verde
            }
          }
        }
      });
    }
  
    // Nome do arquivo
    doc.save(`relatorio_${this.employeeName}_${this.employeeSurname}.pdf`);
  }
  

  openEditModal(record: ReportContent): void {
    this.isEditing = true;
    // Clona os dados para evitar alteração direta do registro exibido
    this.editTimeRecord = { ...record };
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
    this.apiService.deleteData('/time/adm/delete', { body: payload }).subscribe({
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

  private fillMissingDays(records: any[], startDate: Date, endDate: Date): any[] {
    const filledRecords = [];
  
    // Função para normalizar a data, zerando horas, minutos e segundos
    const normalizeDate = (date: Date): number => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    };
  
    // Converte os registros para incluir uma data normalizada
    const recordsWithNormalizedDate = records.map(record => {
      const parts = record.startWorkDate.split('-');
      const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return {
        ...record,
        normalizedDate: normalizeDate(dateObj)
      };
    });
  
    // Percorre o intervalo de datas
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const normalizedCurrent = normalizeDate(d);
  
      // Encontra todos os registros para o dia atual
      const recordsForDay = recordsWithNormalizedDate.filter(r => r.normalizedDate === normalizedCurrent);
  
      if (recordsForDay.length > 0) {
        recordsForDay.forEach(r => filledRecords.push(r));
      } else {
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;
  
        filledRecords.push({
          id: formattedDate, // Identificador fictício
          startWorkDate: formattedDate,
          startWorkTime: '',
          endWorkDate: formattedDate,
          endWorkTime: '',
          timeWorked: 'Folga',
          edited: false
        });
      }
    }
  
    return filledRecords;
  }  

  groupByDate(records: ReportContent[]): any[] {
    const groupedMap = new Map<string, ReportContent[]>();
  
    for (const record of records) {
      const dateKey = record.startWorkDate;
      if (!groupedMap.has(dateKey)) {
        groupedMap.set(dateKey, []);
      }
      groupedMap.get(dateKey)!.push(record);
    }
  
    const groupedArray = [];
  
    for (const [date, recordsOfDay] of groupedMap.entries()) {
      const totalMinutes = recordsOfDay.reduce((sum, r) => sum + this.convertTimeToMinutes(r.timeWorked), 0);
      const formattedWorked = this.formatMinutesToTime(totalMinutes);
  
      const saldoMinutos = totalMinutes - this.convertTimeToMinutes(this.referenceTime);
      const saldoFormatado = this.formatMinutesToTime(saldoMinutos);
  
      groupedArray.push({
        date,
        day: this.getDayOfWeek(date),
        totalWorked: formattedWorked,
        saldo: saldoFormatado,
        registros: recordsOfDay,
        edited: recordsOfDay.some(r => r.edited)
      });
    }
  
    return groupedArray;
  }
  
}
