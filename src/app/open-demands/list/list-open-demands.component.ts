import { Component, ViewChild } from '@angular/core';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { OpenDemandService } from '../../services/open.demand.service';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-open-demands',
  templateUrl: './list-open-demands.component.html',
  styleUrl: './list-open-demands.component.scss'
})
export class ListOpenDemandsComponent {
  listForm:FormGroup;
  hoveredRow: any = null;

  // displayedColumns: string[] = [
  //   'ctool_number', 'ctool_date', 'client_manager_name',
  //   'client_location', 'position_location', 'tentative_required_by',
  //   'skillset', 'lob_name', 'practice_unit_name', 'job_description', 'no_of_positions',
  //   'rr_numbers', 'rr_grade', 'gcb_level'
  // ];

  displayedColumns: string[] = [
    'select','dem_ctoolnumber', 'dem_ctooldate' ,'dem_validtill', 'position_name',
    'dem_lcm_id', 'dem_skillset', 'dem_positions', 'status'
  ];

  dataSource = new MatTableDataSource<OpenDemand>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  stat:any
isEditmode="false";
  element: any;
  constructor(private fb: FormBuilder,private http: HttpClient, private demandService: OpenDemandService, private httpService: HttpService) { 
    this.listForm = this.fb.group({
      status:[''],
      comment:['']
    })
  }

  ngOnInit() {
    this.fetchOpenDemands();
    this.demandService.demands$.subscribe(demand => {
      this.dataSource.data = demand;
      console.log(demand)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadStatus();
    });
  }


  loadStatus(): void {
  }

  onSubmit(){
 
  }

  fetchOpenDemands() {
    this.httpService.getDemands().subscribe({
      next: (data) => {
        this.demandService.setInitialData(data);
      },
      error: (err) => console.error('Error fetching demands', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  editRow(element: any) {
    console.log("Editing row: ", element);
    this.element={...element}
   this.isEditmode="true";
  }
}
