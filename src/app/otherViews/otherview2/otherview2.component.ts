import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-otherview2',
  templateUrl: './otherview2.component.html',
  styleUrl: './otherview2.component.scss'
})
export class Otherview2Component {
  displayedColumns: string[] = ['select', 'demandId', 'client', 'LOB', 'BU', 'PU','SPOC','status','createdDate','lastUpdated'];
  dataSource1!: MatTableDataSource<any>;
  displayedColumns2: string[] = ['select', 'LOB', 'CP', 'DM', 'M1-WK1', 'M1-WK2', 'M1-WK3', 'M1-WK4', 'M2-WK1', 'M2-WK2', 'M2-WK3', 'M2-WK4'];
  dataSource2 = new MatTableDataSource<any>;

  ngOnInit(): void {
      this.dataSource1 = new MatTableDataSource(this.demandData);
      this.dataSource2 = new MatTableDataSource(this. weeklyClientData);
  }
  
demandData = [
    { demandId: 'Cell', client: 'Cell', LOB: 'Cell', BU: 'Cell', PU: 'Cell', SPOC: 'Cell', status: 'Cell', createdDate: 'Cell', lastUpdated: 'Cell' },
    { demandId: 'Cell', client: 'Cell', LOB: 'Cell', BU: 'Cell', PU: 'Cell', SPOC: 'Cell', status: 'Cell', createdDate: 'Cell', lastUpdated: 'Cell' },
    { demandId: 'ACell', client: 'Cell', LOB: 'Cell', BU: 'Cell', PU: 'Cell', SPOC: 'Cell', status: 'Cell', createdDate: 'Cell', lastUpdated: 'Cell' },
    { demandId: 'Cell', client: 'Cell', LOB: 'Cell', BU: 'Cell', PU: 'Cell', SPOC: 'Cell', status: 'Cell', createdDate: 'Cell', lastUpdated: 'Cell' }
  ];

  weeklyClientData = [
    { LOB: 'Cell', CP: 'Cell', DM: 'Cell', 'M1-WK1': 'Cell', 'M1-WK2': 'Cell', 'M1-WK3': 'Cell', 'M1-WK4': 'Cell', 'M2-WK1': 'Cell', 'M2-WK2': 'Cell', 'M2-WK3': 'Cell', 'M2-WK4': 'Cell' },
    { LOB: 'Cell', CP: 'Cell', DM: 'Cell', 'M1-WK1': 'Cell', 'M1-WK2': 'Cell', 'M1-WK3': 'Cell', 'M1-WK4': 'Cell', 'M2-WK1': 'Cell', 'M2-WK2': 'Cell', 'M2-WK3': 'Cell', 'M2-WK4': 'Cell' },
    { LOB: 'Cell', CP: 'Cell', DM: 'Cell', 'M1-WK1': 'Cell', 'M1-WK2': 'Cell', 'M1-WK3': 'Cell', 'M1-WK4': 'Cell', 'M2-WK1': 'Cell', 'M2-WK2': 'Cell', 'M2-WK3': 'Cell', 'M2-WK4': 'Cell' },
    { LOB: 'Cell', CP: 'Cell', DM: 'Cell', 'M1-WK1': 'Cell', 'M1-WK2': 'Cell', 'M1-WK3': 'Cell', 'M1-WK4': 'Cell', 'M2-WK1': 'Cell', 'M2-WK2': 'Cell', 'M2-WK3': 'Cell', 'M2-WK4': 'Cell' }

  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource1.filter = filterValue;
  }

}
