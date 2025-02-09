import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.scss'
})
export class ProfilesComponent {
    profileForm: FormGroup;
    dataSource = new MatTableDataSource<any>();
    displayedColumns: string[] = ['name', 'phone', 'email', 'location', 'profile'];
  
    constructor(private fb: FormBuilder, private http: HttpClient) {
      this.profileForm = this.fb.group({
        name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.required],
        location: ['', Validators.required],
        profile: ['', Validators.required],
  
      });
    }
  
    profiles = [
        {
          "name": "John Doe",
          "phone": "+1-555-123-4567",
          "email": "johndoe@example.com",
          "location": "New York, USA",
          "profile": "Software Engineer",
          "fileUrl": '#' 
        },
        {
          "name": "Jane Smith",
          "phone": "+1-555-987-6543",
          "email": "janesmith@example.com",
          "location": "San Francisco, USA",
          "profile": "Data Scientist",
          "fileUrl": '#' 
        },
        {
          "name": "Michael Brown",
          "phone": "+1-555-456-7890",
          "email": "michaelbrown@example.com",
          "location": "Chicago, USA",
          "profile": "Product Manager",
          "fileUrl": '#' 
        },
        {
          "name": "Emily Johnson",
          "phone": "+1-555-222-3333",
          "email": "emilyjohnson@example.com",
          "location": "Toronto, Canada",
          "profile": "UX Designer",
          "flieUrl": '#'
        },
        {
          "name": "David Wilson",
          "phone": "+44-20-7946-0123",
          "email": "davidwilson@example.co.uk",
          "location": "London, UK",
          "profile": "DevOps Engineer",
          "fileUrl": '#' 
        }
    ];
  
    ngOnInit(): void {
      this.dataSource.data = this.profiles;
    }
  
    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.profileForm.patchValue({ file });
      }
    }
  
    onSubmit() {
      console.log('Form Submitted', this.profileForm.value);
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
