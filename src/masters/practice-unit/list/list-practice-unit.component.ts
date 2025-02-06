import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { PracticeUnit } from '../../../interfaces/practice-unit.interface';
import { PracticeUnitService } from '../../../app/services/practice-unit.service';

@Component({
  selector: 'app-list-practice-unit',
  templateUrl: './list-practice-unit.component.html',
  styleUrl: './list-practice-unit.component.scss'
})
export class ListPracticeUnitComponent {
  displayedColumns: string[] = ['practice_unit_name', 'practice_unit_sales', 'practice_unit_delivery', 'practice_unit_solution'];
  dataSource = new MatTableDataSource<PracticeUnit>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private practiceUnitService: PracticeUnitService) { }

  ngOnInit() {
    this.fetchPracticeUnits();
    this.practiceUnitService.practiceUnits$.subscribe(units => {
      this.dataSource.data = units;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  fetchPracticeUnits() {
    this.http.get<PracticeUnit[]>('http://64.227.145.117/api/practice-unit-master/').subscribe({
      next: (data) => {
        // this.dataSource.data = data;
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.practiceUnitService.setInitialData(data); 
      },
      error: (error) => console.error('Error fetching practice units:', error)
    });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['newRecord'] && changes['newRecord'].currentValue) {
  //     this.addNewPracticeUnit(changes['newRecord'].currentValue);
  //   }
  // }

  // addNewPracticeUnit(newRecord: PracticeUnit) {
  //   this.dataSource.data = [...this.dataSource.data, newRecord]; // Append new record
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
