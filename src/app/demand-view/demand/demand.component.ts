import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html',
  styleUrl: './demand.component.scss'
})
export class DemandComponent implements OnInit {
  @Output() pdfSelected = new EventEmitter<string>();

  demands: any;
  stat: any;

  constructor(private route:ActivatedRoute,private httpService:HttpService){

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const demandId = params.get('id');
      this.loadData(demandId);
      this.loadStatus()
  })
}

loadData(demandId: any) {
  this.httpService.getSingleDemandDetail(demandId).subscribe({
    next: (data) => {
      this.demands = data;
      console.log("delivery manager",this.demands.lob_details.delivery_manager.emp_name)
      console.log("jrnumber",this.demands.dem_jrnumber)
      console.log("jd",this.demands.dem_jd)
      
    }
})
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
openPdf(pdfUrl: string) {
  this.pdfSelected.emit(pdfUrl); // Emit the clicked PDF file name
  console.log("pdfUrl",pdfUrl)
}
}
