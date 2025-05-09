import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sows',
  templateUrl: './sows.component.html',
  styleUrl: './sows.component.scss'
})
export class SowsComponent {
  jdForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['role', 'jd'];

  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  pages: number[] = [];
  totalPages = 0;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.jdForm = this.fb.group({
      role: ['', Validators.required],
      // jd: ['', Validators.required],

    });
  }

  sows = [
    { role: 'Network Administrator', jd: 'Network_Administrator.pdf', fileUrl: '#' },
    { role: 'System Analyst', jd: 'System_Analyst.pdf', fileUrl: '#' },
    { role: 'Database Administrator', jd: 'Database_Administrator.pdf', fileUrl: '#' }
  ];

  ngOnInit(): void {
    this.dataSource.data = this.sows;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.jdForm.patchValue({ file });
    }
  }

  onSubmit() {
    console.log('Form Submitted', this.jdForm.value);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onCancel(): void {
    this.jdForm.reset();
  
    const fileInput = document.getElementById('jd') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  
  updateDisplayedDemands() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    //const currentdemands= this.allDemands.slice(startIndex, endIndex);
    //this.dataSource.data = currentdemands;
  }
  
  updatePages() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = [];
  
    for (let i = 1; i <= Math.min(3, this.totalPages); i++) {
      this.pages.push(i);
    }
    if (this.totalPages > 3) {
      this.pages.push(-1); // ellipsis
      this.pages.push(this.totalPages);
    }
  }
  
  onPageSizeChange() {
    this.currentPage = 1;  // Reset to the first page
    this.updatePages();    // Update the pages based on new page size
    this.updateDisplayedDemands();
    // Fetch new data based on the updated page size and current page
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedDemands();
      // Fetch new data based on the updated page
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedDemands();
      // Fetch new data based on the updated page
    }
  }
  
  goToPage(page: number) {
    if (page === -1) {
      // If page is ellipsis, do nothing
      return;
    }
    this.currentPage = page;
    this.updateDisplayedDemands();
    // Fetch new data based on the current page and page size
  }
}
