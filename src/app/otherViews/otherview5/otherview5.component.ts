import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-otherview5',
  templateUrl: './otherview5.component.html',
  styleUrl: './otherview5.component.scss'
})
export class Otherview5Component {
    // State for filters
    selectedFilter: string | null = null;
    showMonthly = false;
    selectedQuarterYear: string | null = null;
    selectedMonth: string | null = null;
    selectedYear: string | null = null;
    candidateSelectionTable: any[] = [];
    start_date:string='';
    end_date: string = '';
  
    constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCandidateSelectionReport();
  }

  fetchCandidateSelectionReport(): void {
    const today = new Date();
    this.start_date = '2024-01-10'//today.toISOString().split('T')[0];  format YYYY-MM-DD

    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    this.end_date ='2024-12-13' //lastYear.toISOString().split('T')[0]; // format YYYY-MM-DD

    const apiUrl = `http://127.0.0.1:8000/api/reports/candidate-selection/?reportType=custom&start_date=${this.start_date}&end_date=${this.end_date}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (data) =>{ if (data && data.report && data.report.Custom) {
        this.candidateSelectionTable = data.report.Custom;
      } else {
        this.candidateSelectionTable = [];
      }
      console.log('API Data:', this.candidateSelectionTable);
    },
      error: (error) => {
        console.error('Error fetching candidate selection report:', error);
      }
    });
  }
    // Default table data
    defaultTable = [
      { lob: 'LOB1', cp: 'CP1', dm: 'DM1', count: 5, startDate: '2023-01-01', endDate: '2023-12-31' },
      { lob: 'LOB2', cp: 'CP2', dm: 'DM2', count: 3, startDate: '2023-02-01', endDate: '2023-11-30' }
    ];
  
    // Headers and data for filtered table
    tableHeaders: string[] = [];
    filteredTables: any[] = [];
  
     /* Dummy Data
  candidateSelectionTable = [
    { cp: 'CP1', lob: 'LOB1', dm: 'DM1', count: 10, startDate: '2023-01-01', endDate: '2023-12-31' },
    { cp: 'CP2', lob: 'LOB2', dm: 'DM2', count: 20, startDate: '2023-02-01', endDate: '2023-11-30' },
  ];*/
    // Month and year options
    months = [
      { name: 'January', value: '01' }, { name: 'February', value: '02' },
      { name: 'March', value: '03' }, { name: 'April', value: '04' },
      { name: 'May', value: '05' }, { name: 'June', value: '06' },
      { name: 'July', value: '07' }, { name: 'August', value: '08' },
      { name: 'September', value: '09' }, { name: 'October', value: '10' },
      { name: 'November', value: '11' }, { name: 'December', value: '12' }
    ];
  
    years: string[] = ['2022', '2023', '2024'];
  
    // Apply filters and update the filteredTable accordingly
    applyFilters(): void {
      this.filteredTables = []; // Reset filtered table
      this.tableHeaders = [];  // Reset table headers
  
      // Example logic for generating data based on filter
      if (this.selectedFilter === 'quarterly') {
        this.tableHeaders = ['Q1', 'Q2', 'Q3', 'Q4'];
        this.filteredTables = [
          { lob: 'LOB1', cp: 'CP1', dm: 'DM1', values: [10, 20, 30, 40] },
          { lob: 'LOB2', cp: 'CP2', dm: 'DM2', values: [15, 25, 35, 45] }
        ];
      } else if (this.selectedFilter === 'yearly') {
        this.tableHeaders = ['Year'];
        this.filteredTables = [
          { lob: 'LOB1', cp: 'CP1', dm: 'DM1', values: [100] },
          { lob: 'LOB2', cp: 'CP2', dm: 'DM2', values: [200] }
        ];
      } else if (this.selectedFilter === 'monthly' && this.showMonthly) {
        this.tableHeaders = this.months.map(month => month.name);
        this.filteredTables = [
          { lob: 'LOB1', cp: 'CP1', dm: 'DM1', values: [8, 12, 15, 20, 25, 18, 22, 19, 23, 16, 21, 24] },
          { lob: 'LOB2', cp: 'CP2', dm: 'DM2', values: [11, 14, 17, 13, 19, 15, 20, 18, 22, 14, 19, 21] }
        ];
      } else if (this.selectedFilter === 'monthly' && this.selectedMonth && this.selectedYear) {
        const monthName = this.months.find(m => m.value === this.selectedMonth)?.name || '';
        this.tableHeaders = [monthName + ' ' + this.selectedYear];
        this.filteredTables = [
          { lob: 'LOB1', cp: 'CP1', dm: 'DM1', values: [10] },
          { lob: 'LOB2', cp: 'CP2', dm: 'DM2', values: [15] }
        ];
      }
    }
  
    // Helper function to determine if any filter is applied
    isFilterApplied(): boolean {
      return this.filteredTables.length > 0;
    }
  }
  
