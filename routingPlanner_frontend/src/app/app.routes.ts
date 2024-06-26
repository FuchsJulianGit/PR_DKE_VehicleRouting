import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { RoutePointListComponent } from './route-point-list/route-point-list.component';
import { MapComponent } from './map/map.component';
import { PlannerComponent } from './planner/planner.component';

export const routes: Routes = [
   { path: '', component: PlannerComponent},
   /*{ path: 'login', component: LoginComponent },*/
   { path: 'map', component: MapComponent },
   { path: 'planner', component: PlannerComponent }  
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })

export class AppRoutingModule {}




