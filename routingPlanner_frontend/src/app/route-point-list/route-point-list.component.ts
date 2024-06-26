import { Component, Inject, OnInit } from '@angular/core';
import { RoutePoint, Person, Vehicle } from '../Interfaces/interfaces';
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
     // console.log("THIS: ");
      console.dir(this.route_points);
    });
  }

  onSubmit(): void {
   /* const newRoutePoint: RoutePoint = {
      Id: 0,
      Sequenz: parseInt(this.route_points.Sequenz, 10),
      Vehicle: parseInt(this.person, 10),
      Description: "",
      AtHome: true,
      Coordinates: []
    };
    this.routePointService.save(newRoutePoint).subscribe(
      (response) => {
        console.log('Route point added successfully:', response);
        // You can add further logic here, such as resetting the form or displaying a success message
      },
      (error) => {
        console.error('Error adding route point:', error);
        // Handle error scenario, such as displaying an error message to the user
      }
    );*/
  }


}

export default RoutePointListComponent;