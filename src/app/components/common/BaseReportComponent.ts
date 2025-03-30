// src/app/components/common/base-report.component.ts


import {ReportContent, ReportResponse} from '../../interfaces/report.interfaces';

export abstract class BaseReportComponent {
  selectedDates: Date[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  reportData: ReportResponse | null = null;
  paginatedData: ReportContent[] = [];
  referenceTime: string = '07:30'; // Formato HH:mm
  balance: string | null = null; // Para armazenar o saldo retornado


  employeeName: string = '';
  employeeCompany: string = '';
  employeeSurname: string = '';
  employeeCpf: string = '';

  // Configuração da paginação
  currentPage: number = 0;
  pageSize: number = 5;
}
