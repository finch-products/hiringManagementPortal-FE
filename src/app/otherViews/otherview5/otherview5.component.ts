import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../services/http.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
    isFilterApplied:boolean=false;
    reporttype: string= '';
    
  
    constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.fetchCandidateSelectionReport();
  }
  getDisplayedColumns(): string[] {
    if (this.isFilterApplied) {
      return ['clientPartner', 'lob', 'deliveryManager', ...this.tableHeaders];
    } else {
      return ['clientPartner', 'lob', 'deliveryManager', 'count', 'startDate', 'endDate'];
    }
  }
  fetchCandidateSelectionReport(): void {
    // Dynamic date assignment 
     const today = new Date();
     const lastYear = new Date();
     lastYear.setFullYear(today.getFullYear() - 1);
     this.start_date = lastYear.toISOString().split('T')[0]; // format YYYY-MM-DD
     this.end_date = today.toISOString().split('T')[0]; // format YYYY-MM-DD
  
  
    // Now call the API with start_date and end_date properly passed
    this.httpService.getcandidateselectioncustomreport(this.start_date, this.end_date).subscribe({
      next: (data:any) => {
        if (data && data.report && data.report.Custom) {
          this.candidateSelectionTable = data.report.Custom;
        } else {
          this.candidateSelectionTable = [];
        }
        console.log('API Data:', this.candidateSelectionTable);
      },
      error: (error:any) => {
        console.error('Error fetching candidate selection report:', error);
      }
    });
  }
    // Headers and data for filtered table
    tableHeaders: string[] = [];
    filteredTables: any[] = [];

    // Month and year options
    months = [
      { name: 'January', value: '01' }, { name: 'February', value: '02' },
      { name: 'March', value: '03' }, { name: 'April', value: '04' },
      { name: 'May', value: '05' }, { name: 'June', value: '06' },
      { name: 'July', value: '07' }, { name: 'August', value: '08' },
      { name: 'September', value: '09' }, { name: 'October', value: '10' },
      { name: 'November', value: '11' }, { name: 'December', value: '12' }
    ];
  
    years: string[] = ['2022', '2023', '2024','2025'];

    onQuarterYearChange() {
      this.selectedYear = null;
      this.selectedMonth = null;
      this.showMonthly = false;
      this.reporttype='quarterly';
      this.selectedFilter='Quaterly data';
      this.applyFilters();
    }
    
    onYearChange() {
      this.selectedQuarterYear = null;
      this.showMonthly = false;
      this.selectedFilter='Yearly data';
      this.selectedMonth = null;
      this.reporttype='yearly';
      this.applyFilters();
    }
    
    onMonthlyCheckboxChange() {
      if (this.showMonthly) {
        this.selectedMonth = null;
        this.selectedFilter='monthly data';
        this.reporttype='monthly';
        this.selectedQuarterYear = null; // Clear quarterly if monthly is selected
      }
      this.applyFilters();
    }
    
    onMonthChange() {
      this.selectedQuarterYear = null;
      this.showMonthly = false;
      this.selectedFilter='weekly data';
      this.reporttype='weekly';
      this.applyFilters();
    }
    
  
    //Apply filters and update the filteredTable accordingly
    applyFilters(): void {
      this.isFilterApplied=true;
      this.filteredTables = []; // Reset filtered table
      this.tableHeaders = [];  // Reset table headers

     // Prioritize Monthly if checkbox + year selected
  if (this.showMonthly && this.selectedYear) {
    this.httpService.getcandidateselectionreports(this.selectedYear,this.reporttype).subscribe(response => {
      console.log(this.selectedYear);
      const data = response.report.monthlyClientSelects;
      this.tableHeaders =  ['January','February', 'March','April', 'May', 'June', 'July', 'August','September', 'October','November', 'December'];
      this.filteredTables = data.map((item:any)=> ({
        lob: item.lob,
        cp: item.clientPartner,
        dm: item.deliveryManager,
        values: [
          item.January, item.February, item.March, item.April, item.May, item.June,
          item.July, item.August, item.September, item.October, item.November, item.December
        ]
      }));
    });
    return;
  }

   // Weekly filter (if year and month selected)
   if (this.selectedYear && this.selectedMonth) {
    this.httpService.getcandidateselectionweeklyreport(this.selectedYear,this.selectedMonth).subscribe(response => {
      console.log(this.selectedYear);
      const data = response.report.weeklyClientSelects;
      if (data.length > 0) {
        // Dynamically extract week keys from first object
        const weekKeys = Object.keys(data[0]).filter(key => key.startsWith('week'));
  
        // Set dynamic headers like ['W1', 'W2', 'W3', ...] based on extracted keys
        this.tableHeaders = weekKeys.map(week => week.replace('week', 'W'));  // ['W1', 'W2', ...]
  
      this.filteredTables = data.map((item:any)=> ({
        lob: item.lob,
        cp: item.clientPartner,
        dm: item.deliveryManager,
        values: weekKeys.map(weekKey => item[weekKey]) 
      }));
    }});
    return;
  }
  
   // Quarterly filter (if selected)
   if (this.selectedQuarterYear) {
    this.httpService.getcandidateselectionreports(this.selectedQuarterYear,this.reporttype).subscribe(response => {
      console.log(this.selectedQuarterYear);
      const data = response.report.quarterlyClientSelects;
      this.tableHeaders = ['Q1', 'Q2', 'Q3', 'Q4'];
      this.filteredTables = data.map((item:any)=> ({
        lob: item.lob,
        cp: item.clientPartner,
        dm: item.deliveryManager,
        values: [item.Q1, item.Q2, item.Q3, item.Q4]
      }));
    });
    return;
  }

     // Yearly filter (if selected and not monthly or quarterly)
  if (this.selectedYear) {
    this.httpService.getcandidateselectionreports(this.selectedYear,this.reporttype).subscribe(response => {
      console.log(this.selectedYear);
      const data = response.report.yearlyClientSelects;
      this.tableHeaders = ['Total count'];
      this.filteredTables = data.map((item:any)=> ({
        lob: item.lob,
        cp: item.clientPartner,
        dm: item.deliveryManager,
        values: [item.totalCount]
      }));
    });
    return;
}
 // If nothing is selected
 this.isFilterApplied = false;

  } 
  resetFilters(): void {
    this.selectedQuarterYear = null;
    this.selectedYear = null;
    this.selectedMonth = null;
    this.showMonthly = false;
    this.isFilterApplied = false;
    this.filteredTables = [];
  }
  // Add these new methods to your component class
toggleQuarterDropdown() {
  // This will be handled by mat-autocomplete
}

onQuarterYearSelected(event: MatAutocompleteSelectedEvent) {
  this.selectedQuarterYear = event.option.value;
  this.onQuarterYearChange();
}

toggleYearDropdown() {
  // This will be handled by mat-autocomplete
}

onYearSelected(event: MatAutocompleteSelectedEvent) {
  this.selectedYear = event.option.value;
  this.onYearChange();
}

toggleMonthDropdown() {
  // This will be handled by mat-autocomplete
}

onMonthSelected(event: MatAutocompleteSelectedEvent) {
  this.selectedMonth = event.option.value;
  this.onMonthChange();
}
}