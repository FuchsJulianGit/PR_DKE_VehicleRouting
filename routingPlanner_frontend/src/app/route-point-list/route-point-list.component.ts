import { Component, Inject, OnInit } from '@angular/core';
import { RoutePoint, Person, Vehicle } from '../interfaces/interfaces';
import { RoutePointService } from './route-point-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-route-point-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './route-point-list.component.html',
  styleUrl: './route-point-list.component.scss',
  providers: [RoutePointService]
})

export class RoutePointListComponent implements OnInit{
  route_points: RoutePoint[] = [];
  seq: string ='';
  startPoint: string ='';
  person: string ='';
  constructor(public routePointService: RoutePointService){ }

  ngOnInit(){
    this.routePointService.findAll().subscribe((data: RoutePoint[]) => {
      this.route_points = data;
      console.dir(this.route_points);
    });
  }

  onSubmit(): void {
  }
}

export default RoutePointListComponent;