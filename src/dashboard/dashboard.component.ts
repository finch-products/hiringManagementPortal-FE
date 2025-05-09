import { Component, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { HttpService } from '../app/services/http.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  legendPosition: LegendPosition = LegendPosition.Right;
  total_open_demands: any[] = [];
  total_non_open_demands: any[] = [];
  total_india_open_demands: any[] = [];;
  total_non_india_open_demands: any[] = [];
  skillData: any[] = [];
  isRightColumnTaller = false;
  isRightColumnMuchTaller = false;
  showAllProgress = false;


  
  ngOnInit() {
    this.loadOpemnDemands();
    this.loadDemandfullfilment();
    this.loadReportLOBTargetProgress();
    this.loadOpenposition();
    this.loadReportagedemand();
    this.loadSkillDemandReport();
  }

  constructor(private httpService: HttpService) {

  }

  loadOpemnDemands() {

    this.httpService.getOpenDemandCount().subscribe({
      next: (data) => {
        this.total_open_demands = data.total_open_demands;
        this.total_non_open_demands = data.total_non_open_demands;
        this.total_india_open_demands = data.total_india_open_demands;
        this.total_non_india_open_demands = data.total_non_india_open_demands;
      },
      error: (err) => console.error('Error fetching clients', err)
    });
  }
    open_positions: any[] = [];
    profiles_submitted: any[] = [];
    interview_scheduled: any[] = [];;
    profiles_not_submitted: any[] = [];
    pieChartData: any[] = [];
  
    loadDemandfullfilment() {
      this.httpService.getDemandFulfillmentMetricsReport().subscribe({
        next: (data) => {
          this.open_positions = data.open_positions;
          this.profiles_submitted = data.profiles_submitted;
          this.interview_scheduled = data.interview_scheduled;
          this.profiles_not_submitted = data.profiles_not_submitted;
    
          // Convert API response to Pie Chart format
          this.pieChartData = [
            { name: 'Open Positions', value: parseFloat(data.open_positions) },
            { name: 'Profiles Submitted', value: parseFloat(data.profiles_submitted) },
            { name: 'Interview Scheduled', value: parseFloat(data.interview_scheduled) },
            { name: 'Profiles Not Submitted', value: parseFloat(data.profiles_not_submitted) }
          ];
        },
        error: (err) => console.error('Error fetching demand', err)
      });
    }

    progressData: any[] = [];
    toggleShowAllProgress() {
      this.showAllProgress = !this.showAllProgress;
    }
    loadReportLOBTargetProgress() {
      this.httpService.getReportLOBTargetProgress().subscribe({
        next: (data) => {
          // Sort by percentage in descending order with proper typing
          this.progressData = data
            .map((item: any) => ({
              name: String(item.LOB_name), 
              value: parseFloat(item.percentage) 
            }))
            .sort((a: { value: number }, b: { value: number }) => b.value - a.value); // Sort from highest to lowest
        },
        error: (err) => console.error('Error fetching demand', err)
      });
    }
total_positions_opened_last_week: any[] = [];
loadOpenposition() {
  this.httpService.getopenposition().subscribe({
    next: (data) => {
      this.total_positions_opened_last_week = data.total_positions_opened_last_week;
    },
    error: (err) => console.error('Error fetching clients', err)
  });
}

customBarColors = [
  { name: 'Bar 1', value: '#d2f55b' },
  { name: 'Bar 2', value: '#cbd2f7' },
  { name: 'Bar 3', value: '#ebf9bb' },
  { name: 'Bar 4', value: '#dee2ff' },
  { name: 'Bar 5', value: '#f8fce5' },
  { name: 'Bar 6', value: '#f3f3ff' }
];

// Or as a function if you need dynamic coloring
barColorFn = (value: any) => {
  return value.index % 2 === 0 ? '#d2f55b' : '#cbd2f7';
};


agedata: any[] = [];

loadReportagedemand() {
  this.httpService.getReportagedemand().subscribe({
    next: (data) => {
      this.agedata = data.map((item: any) => ({
        name: String(item.age),  // Updated for better axis labeling
        value: parseInt(item.count)
      }));
    },
    error: (err) => console.error('Error fetching age data', err)
  });
}

customColors = [
  { name: 'Open Positions', value: '#d9f473' },
  { name: 'Profiles Submitted', value: '#cbd2f7' },
  { name: 'Interview Scheduled', value: '#f8fce5' },
  { name: 'Profiles Not Submitted', value: '#f3f3ff' }
];
 
loadSkillDemandReport() {
  this.httpService.getSkillDemandReport().subscribe({
    next: (data) => {
      this.skillData = data.map((item: any) => ({
        name: item.skill,
        value: item.gap,
        demandCount: item.demand_count,
        totalPositions: item.total_positions,
        candidatesSubmitted: item.candidate_submitted_count,
        totalCandidates: item.total_candidates_with_skill
      }));
    },
    error: (err) => console.error('Error fetching skill demand data', err)
  });
}

skillColorFn = (skillName: string) => {  // Now expects a string, not an object
  // Find the skill in skillData
  const skill = this.skillData.find(item => item.name === skillName);
  
  // If skill exists, check if gap is positive/negative
  if (skill) {
    const gapValue = skill.originalValue ?? skill.value;
    return gapValue > 0 ? '#ff6b6b' : '#d1f851';
  }

  // Fallback color if skill not found
  return '#cccccc';
};


}