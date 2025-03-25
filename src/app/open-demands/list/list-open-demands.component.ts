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

  listForm: FormGroup;

  hoveredRow: any = null;
  selectedRows: any[] = [];
  status: any
  element: any;
  dem_id: string = '';

  isEditmode = "false";;
  isRowSelected: boolean = false;
  selection = new SelectionModel<OpenDemand>(true, []);

  displayedColumns: string[] = [
    'select', 'dem_id','dem_ctoolnumber', 'dem_ctooldate' ,'dem_validtill', 'dem_position_name',
    'dem_lcm_id', 'dem_skillset', 'dem_positions', 'dem_dsm_id','action'];

  dataSource = new MatTableDataSource<OpenDemand>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private http: HttpClient, private demandService: OpenDemandService, private httpService: HttpService, private snackBar: MatSnackBar, private router: Router) {
    this.listForm = this.fb.group({
      dem_dsm_id: [''],
      dem_comment: [''],
      dem_id: [''],
    })
  }

  ngOnInit() {
    this.fetchOpenDemands();
    this.demandService.demands$.subscribe(demand => {
      this.dataSource.data = demand;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.selection.changed.subscribe(() => {
      this.selectedRows = this.selection.selected;
      this.isRowSelected = this.selectedRows.length > 0;
      this.updateSaveButtonState();

      if (this.isRowSelected) {
        const selectedDemId = this.selectedRows[0].dem_id;
        this.loadStatus(selectedDemId);
      } else {
        this.listForm.get('dem_dsm_id')?.reset();
        this.status = [];
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
        this.status = data;
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

  onSubmit() {
    if (this.listForm.valid && this.selectedRows.length > 0) {

      const selectedDemId = this.selectedRows[0].dem_id;

      this.loadStatus(selectedDemId);

      const requestBody = {
        dem_id: this.selectedRows[0].dem_id,
        dem_dsm_id: this.listForm.get('dem_dsm_id')?.value,
        dem_comment: this.listForm.get('dem_comment')?.value,
        dem_updateby_id: 'emp_22032025_1'
      };
      this.httpService.updateDemand(requestBody).subscribe({
        next: (data) => {
          this.snackBar.open(" Demand updated Successfully!", "✅", {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.listForm.reset()
          this.fetchOpenDemands()
          this.selection.clear();
          this.selectedRows = [];
          setTimeout(() => {
            this.dataSource = new MatTableDataSource<OpenDemand>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }, 0);
          this.updateSaveButtonState();
        },
        error: (err) => this.snackBar.open("Failed to update demand. Check console for details", "❌", {
          duration: 3000,
          panelClass: ['error-snackbar']
        })
      })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = this.flattenObjectToString(data).toLowerCase();
      return dataStr.includes(filter);
    };

    this.dataSource.filter = filterValue;
  }

  /**
   * Converts an object into a searchable string, including nested objects.
   */
  private flattenObjectToString(obj: any): string {
    let result = '';

    Object.keys(obj).forEach(key => {
      const value = obj[key];

      if (typeof value === 'object' && value !== null) {
        result += this.flattenObjectToString(value) + ' ';
      } else if (value !== undefined && value !== null) {
        result += value.toString() + ' ';
      }
    });

    return result.trim();
  }


  editRow(element: any) {
    this.isEditmode = "true";
  }

  toggleSelection(row: any) {
    this.selection.clear();
    this.selection.select(row);
    this.selectedRows = this.selection.selected;
    this.isRowSelected = this.selectedRows.length > 0;
    this.updateSaveButtonState();

    if (this.isRowSelected) {
      const selectedDemId = this.selectedRows[0].dem_id;
      this.loadStatus(selectedDemId);
    } else {
      this.listForm.get('dem_dsm_id')?.reset();
    }
  }

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
