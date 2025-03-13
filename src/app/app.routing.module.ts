import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOpenDemandComponent } from './open-demands/create/create-open-demands.component';
import { ListOpenDemandsComponent } from './open-demands/list/list-open-demands.component';
import { CreateClientComponent } from '../masters/client/create/create-client.component';
//added client manager
import { CreateClientManagerComponent } from '../masters/client-manager/components/create/create-client-manager/create-client-manager.component';
import { ListClientManagerComponent } from '../masters/client-manager/components/list/list-client-manager/list-client-manager.component';
import { CreateLOBComponent } from '../masters/lob/create/create-lob.component';
import { CreateLocationComponent } from '../masters/location/create/create-location.component';
import { CreateInternalDepartmentComponent } from '../masters/internal-department/create/create-internal-department.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ReportComponent } from '../report/report.component';
import { CreateEmployeeComponent } from '../masters/employee/create/create-employee.component';
import { CreateCandidateComponent } from '../masters/candidate/create/create-candidate.component';
import { Otherview2Component } from './otherViews/otherview2/otherview2.component';
import { Otherview4Component } from './otherViews/otherview4/otherview4.component';
import { Otherview5Component } from './otherViews/otherview5/otherview5.component';
import { DemandHistoryComponent } from './open-demands/history/demand.history.component';
import { DemandViewComponent } from './demand-view/demand-view.component';
import { CandidateHistoryComponent } from './candidates/history/history.component';
import { CandidateProfileComponent } from './candidates/profile/profile.component';
import { CandidadteReportComponent } from './candidates/report/report.component';
// import { ClientMasterComponent } from './client-master/client-master.component';
// import { LobMasterComponent } from './lob-master/lob-master.component';
// import { LocationMasterComponent } from './location-master/location-master.component';
// import { PracticeUnitMasterComponent } from './internal-department-master/internal-department-master.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'entry', component: CreateOpenDemandComponent },
  { path: 'entry/:id', component: CreateOpenDemandComponent },
  { path: 'list', component: ListOpenDemandsComponent },
  { path: 'candidate/history', component: CandidateHistoryComponent },
  { path: 'candidate/profile', component: CandidateProfileComponent },
  { path: 'candidate/report', component: CandidadteReportComponent },
  { path: 'client-master', component: CreateClientComponent },
  { path: 'lob-master', component: CreateLOBComponent },
  { path: 'location-master', component: CreateLocationComponent },
  { path: 'internal-department-master', component: CreateInternalDepartmentComponent },
  { path: 'employee-master', component: CreateEmployeeComponent },
  { path: 'candidate-master', component: CreateCandidateComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reports', component: ReportComponent },
  { path: 'documents', loadChildren: () => import('../documents/documents.module').then(m => m.DocumentsModule) },
  { path: 'other-view2', component: Otherview2Component },
  { path: 'other-view4', component: Otherview4Component },
  { path: 'other-view5', component: Otherview5Component },
  { path: 'demand-history', component: DemandHistoryComponent },
  { path: 'demand-view/:id', component: DemandViewComponent },
  { path: 'history', component: DemandHistoryComponent },
  { path: '', component: DashboardComponent },



  // { path: 'client-master', component: ClientMasterComponent },
  // { path: 'lob-master', component: LobMasterComponent },
  // { path: 'location-master', component: LocationMasterComponent },
  // { path: 'internal-department-master', component: PracticeUnitMasterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
