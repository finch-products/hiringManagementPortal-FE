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
// import { ClientMasterComponent } from './client-master/client-master.component';
// import { LobMasterComponent } from './lob-master/lob-master.component';
// import { LocationMasterComponent } from './location-master/location-master.component';
// import { PracticeUnitMasterComponent } from './internal-department-master/internal-department-master.component';

const routes: Routes = [
  { path: '', redirectTo: '/open-demands', pathMatch: 'full' },
  { path: 'open-demands', component: CreateOpenDemandComponent },
  { path: 'client-master', component: CreateClientComponent},
  { path: 'client-manager', component: CreateClientManagerComponent},//added client manager
  { path: 'lob-master', component: CreateLOBComponent},
  { path: 'location-master', component: CreateLocationComponent},
  { path: 'internal-department-master', component: CreateInternalDepartmentComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'documents', loadChildren: () => import('../documents/documents.module').then(m => m.DocumentsModule) }
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
