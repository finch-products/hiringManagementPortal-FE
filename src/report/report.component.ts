import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, startWith } from 'rxjs';
import { OpenDemand } from '../interfaces/open-demand.interface';
import { HttpService } from '../app/services/http.service';
import { OpenDemandService } from '../app/services/open.demand.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {

  locations: any[] = [];
  clientPartners: any[] = [];
  deliveryManagers: any[] = [];
  lobData = [
    { lob: "LOB 1", India: 32, UK: 38, Poland: 37 },
    { lob: "LOB 2", India: 42, UK: 54, Poland: 64 },
    { lob: "LOB 3", India: 22, UK: 13, Poland: 9 },
    { lob: "LOB 4", India: 12, UK: 11, Poland: 65 },
    { lob: "LOB 5", India: 65, UK: 31, Poland: 33 }
  ];

  aiPredictions = [
    { lob: "LOB 1", Jan: 32, Feb: 38, Mar: 37, Apr: 37, May: 37 },
    { lob: "LOB 2", Jan: 42, Feb: 54, Mar: 64, Apr: 64, May: 64 },
    { lob: "LOB 3", Jan: 22, Feb: 13, Mar: 9, Apr: 9, May: 9 },
    { lob: "LOB 4", Jan: 12, Feb: 11, Mar: 65, Apr: 65, May: 65 },
    { lob: "LOB 5", Jan: 65, Feb: 31, Mar: 33, Apr: 33, May: 33 }
  ];



  employeeData = [
    { name: "John Doe", skills: "Python, AI, ML", location: "New York", manager: "Mark Lee", partner: "Sarah Kim", profiles: 5, ctoolId: 12345, position: "Data Scientist" },
    { name: "Alice Johnson", skills: "AWS, Kubernetes", location: "Chicago", manager: "Tom Brown", partner: "Emma Davis", profiles: 3, ctoolId: 67890, position: "DevOps Engineer" },
    { name: "Alice Johnson", skills: "Java, Spring Boot", location: "San Francisco", manager: "Kevin White", partner: "Daniel Green", profiles: 7, ctoolId: 543213, position: "Software Engineer" },
    { name: "Emily Davis", skills: "Cisco, Networking", location: "Austin", manager: "Rachel Adams", partner: "Chris Black", profiles: 4, ctoolId: 98765, position: "Network Engineer" },
    { name: "Michael Brown", skills: "SQL, Tableau", location: "Seattle", manager: "Olivia Scott", partner: "Andrew Wilson", profiles: 6, ctoolId: 11223, position: "Business Analyst" }
  ];

  displayedColumns: string[] = [
    'manager', 'skills', 'location',
    'delivery_manager', 'client_partner', 'profiles', 'ctool', 'position'
  ];

  dataSource = new MatTableDataSource<OpenDemand>([]);

  @ViewChild(MatPaginator) paginator !: MatPaginator
  @ViewChild(MatSort) sort !: MatSort

  // locations = ["India", "UK", "Poland"];
  hiringManagerControl = new FormControl('');
  skillsControl = new FormControl('');
  locationControl = new FormControl('');
  deliveryManagerControl = new FormControl('');
  clientPartnerControl = new FormControl('');

  filteredManagers!: Observable<string[]>;
  filteredSkills!: Observable<string[]>;
  filteredLocations!: Observable<any[]>;
  filteredDeliveryManagers!: Observable<string[]>;
  filteredClientPartners!: Observable<string[]>;

  allManagers: string[] = [];
  allSkills: string[] = [];
  allLocations: string[] = [];
  allDeliveryManagers: string[] = [];
  allClientPartners: string[] = [];

  constructor(private httpService: HttpService, private demandService: OpenDemandService) {

  }

  async ngOnInit() {
    this.fetchOpenDemands();
    await this.loadLocations();
    await this.loadClientPartners();
    await this.loadDeliveryManagers();
    this.allLocations = [...new Set(this.locations.map(location => location.lcm_name))];
    this.allClientPartners = [...new Set(this.clientPartners.map(partner => partner.emp_name))];
    this.allDeliveryManagers = [...new Set(this.deliveryManagers.map(manager => manager.emp_name))];
    this.demandService.demands$.subscribe(demand => {
      this.dataSource.data = demand;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    // this.dataSource = new MatTableDataSource(this.employeeData);

    // Set displayed columns dynamically
    // this.displayedColumns = ['lob', ...this.locations];

    // Extract unique values for filtering
    // this.allManagers = [...new Set(this.employeeData.map(emp => emp.name))];
    // this.allSkills = [...new Set(this.employeeData.flatMap(emp => emp.skills.split(', ')))];
    // this.allLocations = [...new Set(this.locations.map(location => location.lcm_name))];
    // this.allDeliveryManagers = [...new Set(this.employeeData.map(emp => emp.manager))];
    // this.allClientPartners = [...new Set(this.employeeData.map(emp => emp.partner))];

    this.filteredManagers = this.hiringManagerControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', this.allManagers))
    );
    this.filteredSkills = this.skillsControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', this.allSkills))
    );
    this.filteredLocations = this.locationControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', this.allLocations))
    );
    this.filteredClientPartners = this.clientPartnerControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', this.allClientPartners))
    );

    this.filteredDeliveryManagers = this.deliveryManagerControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', this.allDeliveryManagers))
    );
    
    // alert(JSON.stringify(this.filteredLocations))
    // this.filteredDeliveryManagers = this.deliveryManagerControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this.filterOptions(value || '', this.allDeliveryManagers))
    // );
    // this.filteredClientPartners = this.clientPartnerControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this.filterOptions(value || '', this.allClientPartners))
    // );

    // *Custom Filtering Logic for Multiple Fields*
    this.dataSource.filterPredicate = (data, filter) => {
      const searchTerms = JSON.parse(filter); // Convert filter string back to object

      return (
        (!searchTerms.hiringManager || data.client_details.clm_managername.toLowerCase().includes(searchTerms.hiringManager)) &&
        (!searchTerms.skills || data.dem_skillset.toLowerCase().includes(searchTerms.skills)) &&
        (!searchTerms.location || data.location_details.lcm_name.toLowerCase().includes(searchTerms.location)) &&
        (!searchTerms.deliveryManager || data.lob_details.delivery_manager.emp_name.toLowerCase().includes(searchTerms.deliveryManager)) &&
        (!searchTerms.clientPartner || data.lob_details.client_partner.emp_name.toLowerCase().includes(searchTerms.clientPartner))
      );
    };

    this.setupFilterListeners();
  }

  async loadLocations() {
    this.locations = await this.httpService.getLocations().toPromise(); // Convert Observable to Promise
  }
  async loadClientPartners() {
    const response = await this.httpService.getclientpartner().toPromise();
    this.clientPartners = response.client_partner;
  }

  async loadDeliveryManagers() {
    const response = await this.httpService.getdileverymanager().toPromise();
    this.deliveryManagers = response.delivery_manager;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }
  private setupFilterListeners() {
    this.hiringManagerControl.valueChanges.subscribe(() => this.applyFilters());
    this.skillsControl.valueChanges.subscribe(() => this.applyFilters());
    this.locationControl.valueChanges.subscribe(() => this.applyFilters());
    this.deliveryManagerControl.valueChanges.subscribe(() => this.applyFilters());
    this.clientPartnerControl.valueChanges.subscribe(() => this.applyFilters());
  }

  private applyFilters() {
    const searchTerms = {
      hiringManager: this.hiringManagerControl.value?.trim().toLowerCase() || '',
      skills: this.skillsControl.value?.trim().toLowerCase() || '',
      location: this.locationControl.value?.trim().toLowerCase() || '',
      deliveryManager: this.deliveryManagerControl.value?.trim().toLowerCase() || '',
      clientPartner: this.clientPartnerControl.value?.trim().toLowerCase() || ''
    }
    this.dataSource.filter = JSON.stringify(searchTerms);
  };

  fetchOpenDemands() {
    this.httpService.getDemands().subscribe({
      next: (data) => {
        const mappedData = data.map((demand: any) => ({
          client_details:{
            clm_managername: demand.client_details.clm_managername},
          dem_skillset: demand.dem_skillset,
          location_details: demand.dem_position_location?.map((loc: any) => ({
            lcm_id: loc.lcm_id,
            lcm_name: loc.lcm_name
          })) || [], 
          lob_details: {
            delivery_manager: {
              emp_name: demand.lob_details.delivery_manager.emp_name
            },
            client_partner: {
              emp_name: demand.lob_details.client_partner.emp_name
            }},
          dem_ctoolnumber: demand.dem_ctoolnumber,
          dem_positions: demand.dem_positions
        }));
        this.demandService.setInitialData(mappedData);
        console.log(JSON.stringify(mappedData));
      },
      error: (err) => console.error('Error fetching demands', err)
    });
  }

  // loadLocations(): void {
  //   this.httpService.getLocationDetails().subscribe({
  //     next: (data) => {
  //       this.locations = data;
  //       console.log('Locations:', this.locations);
  //     },
  //     error: (err) => console.error('Error fetching locations', err)
  //   });
  // }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  //   this.dataSource.filter = filterValue;
  // }

  getLocationNames(locations: { lcm_id: number, lcm_name: string }[] | undefined): string {
    if (!locations || locations.length === 0) {
      return ''; 
    }
    return locations.map(loc => loc.lcm_name).join(', ');
  }  

}