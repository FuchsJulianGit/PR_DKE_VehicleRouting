import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { RoutePointListComponent } from './route-point-list/route-point-list.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';

export const routes: Routes = [
   { path: '', component: RoutePointListComponent},
   { path: 'login', component: LoginComponent },
   { path: 'map', component: MapComponent } 
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })

export class AppRoutingModule {}




