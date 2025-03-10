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
  selectedRows: any[] = [];

  // displayedColumns: string[] = [
  //   'ctool_number', 'ctool_date', 'client_manager_name',
  //   'client_location', 'position_location', 'tentative_required_by',
  //   'skillset', 'lob_name', 'practice_unit_name', 'job_description', 'no_of_positions',
  //   'rr_numbers', 'rr_grade', 'gcb_level'
  // ];

  displayedColumns: string[] = [
    'select','dem_ctoolnumber', 'dem_ctooldate' ,'dem_validtill', 'dem_position_name',
    'dem_lcm_id', 'dem_skillset', 'dem_positions', 'status','action'];

  dataSource = new MatTableDataSource<OpenDemand>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  stat:any
isEditmode="false";
  element: any;
  constructor(private fb: FormBuilder,private http: HttpClient, private demandService: OpenDemandService, private httpService: HttpService) { 
    this.listForm = this.fb.group({
      status:[''],
      dem_comment:['']
    })
  }

  ngOnInit() {
    this.fetchOpenDemands();
    this.demandService.demands$.subscribe(demand => {
      this.dataSource.data = demand;
      // console.log("demand",demand)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.loadStatus();
    this.listForm.get('status')?.valueChanges.subscribe(() => {
      this.updateSaveButtonState();
    });
  }


  loadStatus(): void {
    this.httpService.getDemandStatusDetails().subscribe({
      next: (data) => {
        this.stat = data;
        console.log("stat",this.stat)
      },
      error: (err) => console.error('Error fetching clients', err)
    });

  }

  onSubmit(){
    console.log("button clicked")
      if (this.listForm.valid && this.selectedRows.length > 0) {
        // Extract DEM_IDs from selected rows
        console.log("selected row", this.selectedRows)
        // const demIds = this.selectedRows.map(row => row.dem_id);
    
        // Prepare request body
        const requestBody = {
          dem_id: this.selectedRows[0].dem_id,  
          status: this.listForm.get('status')?.value,
          dem_comment:this.listForm.get('dem_comment')?.value,
          dem_updateby_id: 'emp_11022025_02'
        };
        console.log("Request Payload:", requestBody);
      this.httpService.updateDemand(requestBody).subscribe({
        next:(data)=>{
          console.log('Form submission successful:', data);
          alert('Demand updated successfully!');
          this.fetchOpenDemands()
        },
        error: (err) => console.error('Form submission error:', err)
      })
    }
 
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
    // this.element={...element}
   this.isEditmode="true";
  }

  toggleSelection(row: any, event: any) {
    if (event.checked) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter(selected => selected !== row);
    }
    this.updateSaveButtonState();
  }
  updateSaveButtonState() {
    document.querySelector('.submit')?.toggleAttribute('disabled', this.isSaveDisabled());
  }
  isSaveDisabled(): boolean {
    const isStatusSelected = !!this.listForm.get('status')?.value;
    const isCheckboxSelected = this.selectedRows.length > 0;
    return !(isStatusSelected && isCheckboxSelected);
  }

}
