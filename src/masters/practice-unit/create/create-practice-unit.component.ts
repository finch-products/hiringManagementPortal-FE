import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PracticeUnitService } from '../../../app/services/practice-unit.service';

@Component({
  selector: 'app-create-practice-unit',
  templateUrl: './create-practice-unit.component.html',
  styleUrls: ['./create-practice-unit.component.scss']
})
export class CreatePracticeUnitComponent implements OnInit {
  practiceUnitForm: FormGroup;


  constructor(private fb: FormBuilder, private http: HttpClient, private practiceUnitService: PracticeUnitService) {
    this.practiceUnitForm = this.fb.group({
      practice_unit_name: ['', Validators.required],
      practice_unit_sales: ['', Validators.required],
      practice_unit_delivery: ['', Validators.required],
      practice_unit_solution: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.practiceUnitForm.valid) {
      this.http.post('http://127.0.0.1:8000/api/practice-unit-master/', this.practiceUnitForm.value).subscribe({
        next: (response) => {
          console.log('Practice Unit added:', response);
          this.practiceUnitService.addPracticeUnit(response); // Send to list component
          this.practiceUnitForm.reset();
        },
        error: (error) => console.error('Error adding practice unit:', error)
      });
    }
  }


  ngOnInit() { }
}
