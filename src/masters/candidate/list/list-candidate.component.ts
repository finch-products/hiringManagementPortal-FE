import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from '../../../app/services/http.service';
import { Candidate } from '../../../interfaces/candidate.interface';
import { CandidateService } from '../../../app/services/candidate.service';
@Component({
  selector: 'app-list-candidate',
  templateUrl: './list-candidate.component.html',
  styleUrl: './list-candidate.component.scss'
})
export class ListCandidateComponent {
  candidates: any[] = [];
  displayedColumns: string[] = ['cdm_emp_id', 'cdm_name', 'cdm_email', 'cdm_phone', 'cdm_location', 'cdm_profile', 'cdm_keywords'];
  dataSource = new MatTableDataSource<Candidate>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private httpService: HttpService,private CandidateService: CandidateService) { }

  ngOnInit() {
    this.fetchCandidates();
    this.CandidateService.candidates$.subscribe(candidates => {
      this.dataSource.data = candidates;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  fetchCandidates(): void {
    this.httpService.getCandidate().subscribe({
      next: (data) => {
        this.CandidateService.setInitialData(data);
      },
      error: (err) => console.error('Error fetching Candidates', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
