// src/app/models/report.interfaces.ts

export interface ReportContent {
  id: number;
  startWorkTime: string;
  endWorkTime: string;
  startWorkDate: string;
  endWorkDate: string;
  timeWorked: string;
  edited?: boolean; // opcional, pois pode não estar presente em todos os casos
}

export interface ReportPage {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface ReportResponse {
  content: ReportContent[];
  page: ReportPage;
}
