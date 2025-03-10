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

  constructor(private route: ActivatedRoute, private httpService: HttpService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const demandId = params.get('id');
      this.loadData(demandId);
      this.loadStatus()
    })
  }

public   loadData(demandId: any) {
    const payload = { dem_id: demandId };
    this.httpService.postCandidateByDemandId(payload).subscribe({
      next: (data) => {
        this.demands = data;
        this.candidates = data.candidates || [];
      // this.candidates = data.candidates; 
      console.log("candidates linked", this.candidates);

      }
    })
  }
 

  loadStatus(): void {
    this.httpService.getDemandStatusDetails().subscribe({
      next: (data) => {
        console.log("stat", data)
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
