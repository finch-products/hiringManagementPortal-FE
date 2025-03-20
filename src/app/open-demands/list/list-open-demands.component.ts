import { Component, ViewChild } from '@angular/core';
import { OpenDemand } from '../../../interfaces/open-demand.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { OpenDemandService } from '../../services/open.demand.service';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-list-open-demands',
  templateUrl: './list-open-demands.component.html',
  styleUrl: './list-open-demands.component.scss'
})
export class ListOpenDemandsComponent {
  listForm:FormGroup;
  hoveredRow: any = null;
  selectedRows: any[] = [];
  dem_id: string = '';
  isRowSelected: boolean = false;
  selection = new SelectionModel<OpenDemand>(true, []);
  // displayedColumns: string[] = [
  //   'ctool_number', 'ctool_date', 'client_manager_name',
  //   'client_location', 'position_location', 'tentative_required_by',
  //   'skillset', 'lob_name', 'practice_unit_name', 'job_description', 'no_of_positions',
  //   'rr_numbers', 'rr_grade', 'gcb_level'
  // ];

  displayedColumns: string[] = [
    'select','dem_ctoolnumber', 'dem_ctooldate' ,'dem_validtill', 'dem_position_name',
    'dem_lcm_id', 'dem_skillset', 'dem_positions', 'dem_dsm_id','action'];

  dataSource = new MatTableDataSource<OpenDemand>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  stat:any
  isEditmode="false";
  element: any;
  constructor(private fb: FormBuilder,private http: HttpClient, private demandService: OpenDemandService, private httpService: HttpService,private snackBar:MatSnackBar, private router: Router) { 
    this.listForm = this.fb.group({
      dem_dsm_id:[''],
      dem_comment:[''],
      dem_id:[''],
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

    this.selection.changed.subscribe(() => {
      this.selectedRows = this.selection.selected;
      this.isRowSelected = this.selectedRows.length > 0; // Update the flag
      this.updateSaveButtonState();
    
      if (this.isRowSelected) {
        const selectedDemId = this.selectedRows[0].dem_id;
        this.loadStatus(selectedDemId); // Load status for the selected demand
      } else {
        this.listForm.get('dem_dsm_id')?.reset(); // Reset the dropdown
        this.stat = []; // Clear the dropdown data
      }
    });

    this.listForm.get('dem_dsm_id')?.valueChanges.subscribe(() => {
      this.updateSaveButtonState();
    });
  }


  loadStatus(dem_id: string): void {
    if (!dem_id) {
      console.error('No dem_id provided');
      return;
    }
  
    this.httpService.getDemandStatusDetails(dem_id).subscribe({
      next: (data) => {
        this.stat = data;
        console.log("stat", this.stat);
      },
      error: (err) => console.error('Error fetching demand status', err)
    });
  }
  fetchOpenDemands() {
    this.httpService.getDemands().subscribe({
      next: (data) => {
        this.demandService.setInitialData(data);
      },
      error: (err) => console.error('Error fetching demands', err)
    });
  }

  onSubmit(){
    console.log("button clicked")
      if (this.listForm.valid && this.selectedRows.length > 0) {
        // Extract DEM_IDs from selected rows
        console.log("selected row", this.selectedRows)
        // const demIds = this.selectedRows.map(row => row.dem_id);
        const selectedDemId = this.selectedRows[0].dem_id;

        // Load status for the selected demand
        this.loadStatus(selectedDemId); 
        // Prepare request body
        const requestBody = {
          dem_id: this.selectedRows[0].dem_id,  
          dem_dsm_id: this.listForm.get('dem_dsm_id')?.value,
          dem_comment:this.listForm.get('dem_comment')?.value,
          dem_updateby_id: 'emp_11022025_02'
        };
        console.log("Request Payload:", requestBody);
      this.httpService.updateDemand(requestBody).subscribe({
        next:(data)=>{
          // console.log('Form submission successful:', data);
          // alert('Demand updated successfully!');
          this.snackBar.open(" Demand updated Successfully!", "✅", {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.listForm.reset()
          this.fetchOpenDemands()
          // Clear selection after the data is refreshed
        this.selection.clear();
        this.selectedRows = [];
        // Force table refresh by reassigning dataSource
        setTimeout(() => {
          this.dataSource = new MatTableDataSource<OpenDemand>(this.dataSource.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 0);
        this.updateSaveButtonState();
        },
        error: (err) =>  this.snackBar.open("Failed to update demand. Check console for details","❌", {
          duration: 3000,
          panelClass: ['error-snackbar']
        })
      })
    }
 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    this.dataSource.filterPredicate = (data: OpenDemand, filter: string) => {
      // Extract and format all relevant data for filtering
      const dataStr =
        (data.dem_ctoolnumber || '').toLowerCase() + '◬' + // CTool
        (data.dem_ctooldate ? new Date(data.dem_ctooldate).toLocaleDateString('en-GB') : '').toLowerCase() + '◬' + // Date
        (data.dem_validtill ? new Date(data.dem_validtill).toLocaleDateString('en-GB') : '').toLowerCase() + '◬' + // Required By
        (data.dem_position_name || '').toLowerCase() + '◬' + // Position
        (data.location_details ? data.location_details.lcm_name || '' : '').toLowerCase() + '◬' + // Location
        (data.dem_skillset || '').toLowerCase() + '◬' + // Skills
        (data.dem_positions ? data.dem_positions.toString() : '').toLowerCase() + '◬' + // Positions
        (data.status_details ? data.status_details.dsm_code || '' : '').toLowerCase(); // Status
  
      // Normalize the filter string to handle diacritics and case insensitivity
      const transformedFilter = filter.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
      // Check if the filter string exists in the concatenated data string
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  
    // Apply the filter
    this.dataSource.filter = filterValue;
  }

  editRow(element: any) {
    console.log("Editing row: ", element);
    // this.element={...element}
   this.isEditmode="true";
  }

  toggleSelection(row: any) {
    this.selection.clear();  // Clear previous selection
    this.selection.select(row); // Select only the clicked row
    this.selectedRows = this.selection.selected;
    this.isRowSelected = this.selectedRows.length > 0; // Update the flag
    this.updateSaveButtonState();
  
    if (this.isRowSelected) {
      const selectedDemId = this.selectedRows[0].dem_id;
      this.loadStatus(selectedDemId); // Load status for the selected demand
    } else {
      this.listForm.get('dem_dsm_id')?.reset(); // Reset the dropdown
    }
}


 /* isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }  

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
    this.selectedRows = this.selection.selected;
    this.updateSaveButtonState();
  }
*/
  
  updateSaveButtonState() {
    document.querySelector('.submit')?.toggleAttribute('disabled', this.isSaveDisabled());
  }
  isSaveDisabled(): boolean {
    const isStatusSelected = !!this.listForm.get('dem_dsm_id')?.value;
    const isCheckboxSelected = this.selectedRows.length > 0;
    return !(isStatusSelected && isCheckboxSelected);
  }

  disableRowClick(event: Event, row: any) {
    const target = event.target as HTMLElement;
    
    if (target && target.closest && target.closest('.ignore-click')) {  
      return;  
    }
  
    this.navigateToHistory(row);
  }

  
  navigateToHistory(row: any): void {
    if (row && row.dem_id) {
      this.router.navigate([`/demand-view/${row.dem_id}`]);
    }
  }

}
