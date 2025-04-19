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

  dataSource = new MatTableDataSource<any>([]);

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
    await this.fetchOpenDemands();
    
    this.demandService.demands$.subscribe(demand => {
      if (demand && demand.length) {
        this.dataSource = new MatTableDataSource(demand);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.initializeFilterOptions(demand);
        
        // Trigger initial filter update
        this.applyFilters();
      }
    });
  
    this.setupFilterPredicate();
    this.setupFilterListeners();
  }

  private initializeFilterOptions(data: any[]) {
    // Extract unique values for filtering from the actual data
    this.allManagers = [...new Set(
      data.map(item => (item.client_details && item.client_details.clm_managername) ? item.client_details.clm_managername : '')
      .filter(Boolean)
    )];
    
    this.allSkills = [...new Set(
      data.map(item => item.dem_skillset ? item.dem_skillset : '')
      .filter(Boolean)
    )];
    
    // Extract locations - handle both possible location structures
    const allLocations = data.flatMap(item => {
      if (item.location_details && item.location_details.length) {
        return item.location_details.map((loc: any) => loc.lcm_name);
      }
      if (item.dem_location_position && item.dem_location_position.length) {
        return item.dem_location_position.map((loc: any) => loc.lcm_name);
      }
      return [];
    });
    this.allLocations = [...new Set(allLocations)].filter(Boolean);
    
    this.allDeliveryManagers = [...new Set(data.map(item => 
      item.lob_details && item.lob_details.delivery_manager ? 
      item.lob_details.delivery_manager.emp_name : '').filter(Boolean))];
    
    this.allClientPartners = [...new Set(data.map(item => 
      item.lob_details && item.lob_details.client_partner ? 
      item.lob_details.client_partner.emp_name : '').filter(Boolean))];
  
    // Set up filtered observables
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
    
    this.filteredDeliveryManagers = this.deliveryManagerControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', this.allDeliveryManagers))
    );
    
    this.filteredClientPartners = this.clientPartnerControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', this.allClientPartners))
    );
  }

  private setupFilterPredicate() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      // If filter is empty, show all records
      if (!filter) return true;
      
      try {
        const searchTerms = JSON.parse(filter);
        
        // Convert all search terms to lowercase for case-insensitive comparison
        const searchHiringManager = searchTerms.hiringManager?.toLowerCase() || '';
        const searchSkills = searchTerms.skills?.toLowerCase() || '';
        const searchLocation = searchTerms.location?.toLowerCase() || '';
        const searchDeliveryManager = searchTerms.deliveryManager?.toLowerCase() || '';
        const searchClientPartner = searchTerms.clientPartner?.toLowerCase() || '';
  
        // Get data values (with null checks)
        const managerName = (data.client_details?.clm_managername || '').toString().toLowerCase();
        const skills = (data.dem_skillset || '').toString().toLowerCase();
        const locations = this.getLocationNames(data).toLowerCase();
        const deliveryManager = (data.lob_details?.delivery_manager?.emp_name || '').toString().toLowerCase();
        const clientPartner = (data.lob_details?.client_partner?.emp_name || '').toString().toLowerCase();
  
        // Check each filter field only if it has a value
        const managerMatch = !searchHiringManager || managerName.includes(searchHiringManager);
        const skillsMatch = !searchSkills || skills.includes(searchSkills);
        const locationMatch = !searchLocation || locations.includes(searchLocation);
        const deliveryManagerMatch = !searchDeliveryManager || deliveryManager.includes(searchDeliveryManager);
        const clientPartnerMatch = !searchClientPartner || clientPartner.includes(searchClientPartner);
  
        return managerMatch && skillsMatch && locationMatch && 
               deliveryManagerMatch && clientPartnerMatch;
      } catch (e) {
        console.error('Error parsing filter:', e);
        return true; // Show all records if filter parsing fails
      }
    };
  }
  
  private applyFilters() {
    // Create filter object only with non-empty values
    const searchTerms: any = {};
    
    if (this.hiringManagerControl.value?.toString().trim()) {
      searchTerms.hiringManager = this.hiringManagerControl.value.toString().trim();
    }
    if (this.skillsControl.value?.toString().trim()) {
      searchTerms.skills = this.skillsControl.value.toString().trim();
    }
    if (this.locationControl.value?.toString().trim()) {
      searchTerms.location = this.locationControl.value.toString().trim();
    }
    if (this.deliveryManagerControl.value?.toString().trim()) {
      searchTerms.deliveryManager = this.deliveryManagerControl.value.toString().trim();
    }
    if (this.clientPartnerControl.value?.toString().trim()) {
      searchTerms.clientPartner = this.clientPartnerControl.value.toString().trim();
    }
  
    // If no filters are active, pass empty string to show all records
    this.dataSource.filter = Object.keys(searchTerms).length > 0 
      ? JSON.stringify(searchTerms) 
      : '';
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

  fetchOpenDemands(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpService.getDemands().subscribe({
        next: (data) => {
          try {
            this.demandService.setInitialData(data);
            console.log("Data loaded successfully");
            resolve();
          } catch (e) {
            console.error("Error setting initial data:", e);
            reject(e);
          }
        },
        error: (err) => {
          console.error('Error fetching demands', err);
          reject(err);
        }
      });
    });
  }
  

  getLocationNames(element: any): string {
    // Handle array of locations
    if (Array.isArray(element.location_details)) {
      return element.location_details
        .map((loc: any) => loc.lcm_name)
        .filter((name: string) => name)
        .join(', ');
    }
    
    // Handle single location object
    if (element.location_details?.lcm_name) {
      return element.location_details.lcm_name;
    }
    
    // Handle dem_location_position array
    if (Array.isArray(element.dem_location_position)) {
      return element.dem_location_position
        .map((loc: any) => loc.lcm_name)
        .filter((name: string) => name)
        .join(', ');
    }
    
    return '';
  }  

}