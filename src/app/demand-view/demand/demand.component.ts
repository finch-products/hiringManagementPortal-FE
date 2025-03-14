import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html',
  styleUrl: './demand.component.scss'
})
export class DemandComponent implements OnInit {
  @Output() pdfSelected = new EventEmitter<string>();
  demandForm = new FormGroup({
    status: new FormControl(null)
  });

  demands: any;
  stat: any;
  candidates: any;
  statusList: any[] = [];

  constructor(private route: ActivatedRoute, private httpService: HttpService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const demandId = params.get('id');
      this.loadData(demandId);
      this.loadStatus();
      this.loadCandidateStatuses();
    });
  }

  loadCandidateStatuses() {
    this.httpService.getCandidateStatuses().subscribe(
      (response) => {
        this.statusList = response;
      },
      (error) => {
        console.error('Error fetching candidate statuses:', error);
      }
    );
  }

  public loadData(demandId: any) {
    const payload = { dem_id: demandId };
  
    this.httpService.postCandidateByDemandId(payload).subscribe({
      next: (data) => {
        this.demands = data;

        // Set the default value of the status dropdown
        if (this.demands?.demand_details?.status_details?.dsm_code) {
          this.demandForm.patchValue({
            status: this.demands.demand_details.status_details.dsm_code
          });
        }
      }
    });
  }


  loadStatus(): void {
    this.httpService.getDemandStatusDetails().subscribe({
      next: (data) => {
        this.stat = data;
      },
      error: (err) => console.error('Error fetching clients', err)
    });
  }
  openPdf(pdfUrl: string) {
    this.pdfSelected.emit(pdfUrl); // Emit the clicked PDF file name
    console.log("pdfUrl", pdfUrl)
  }
}
