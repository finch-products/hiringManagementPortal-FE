import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss'
})
export class OthersComponent {
  jdForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['role', 'jd'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.jdForm = this.fb.group({
      role: ['', Validators.required],
      // jd: ['', Validators.required],

    });
  }

  others = [
    { role: 'Network Administrator', jd: 'Network_Administrator.pdf', fileUrl: '#' },
    { role: 'System Analyst', jd: 'System_Analyst.pdf', fileUrl: '#' },
    { role: 'Database Administrator', jd: 'Database_Administrator.pdf', fileUrl: '#' }
  ];

  ngOnInit(): void {
    this.dataSource.data = this.others;
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
}
