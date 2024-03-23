import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {
  private map!: L.Map;
 
 

  markers: L.Marker[] = [
    L.marker([31.9539, 35.9106]),
    L.marker([32.5568, 35.8469]),

    L.marker([31.9839, 35.7106]),
    L.marker([32.7568, 35.4469]) 
  ];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initializeMap();
    this.addMarkers();
    this.centerMap();
    this.initializeRouting();
  }


  private initializeMap() {
    //https://gist.github.com/xantiagoma/39145a3042eca53a57ac3290a1a34973?permalink_comment_id=3415377
    //const baseMapURl = 'http://mts3.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}';
    //const baseMapURl = "https://mts1.google.com/vt/lyrs=m@186112443&hl=x-local&src=app&x=1325&y=3143&z=13&s=Galile";
    //const baseMapURl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    //const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?key=2IbwsVHJNBrcYUp0xEJs'
    const baseMapURl = 'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=9EPuY0KcdIk7nGeNgjz84t4v6YXWvE33qACJMNKYfX0m1UfytsyWERuzVJ3rR7Sk'
    this.map = L.map('map').setView([31.9539, 35.9106],  1);
    L.tileLayer(baseMapURl).addTo(this.map);
  
  }


  private addMarkers() {
    // Add your markers to the map
    this.markers.forEach(marker => marker.addTo(this.map));
  }

  private centerMap() {
    // Create a LatLngBounds object to encompass all the marker locations
    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
    
    // Fit the map view to the bounds
    this.map.fitBounds(bounds);
  }

  private initializeRouting() {
    const waypoints = [
      L.latLng(-22.985308, -43.204845),
      L.latLng(-22.983449, -43.202773),
    ];

    const waypoints1 = [
      L.latLng(-22.983449, -43.204845),
      L.latLng(-22.984708, -43.202430),
    ];

    var route1 = L.Routing.control({
      waypoints: [
          L.latLng(-22.985308, -43.204845),
          L.latLng(-22.983449, -43.202773),
      ],
      lineOptions: {
        styles: [{ color: '#5733ff', opacity: 1, weight: 3 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10
    }
  }).addTo(this.map);
  
  var route2 = L.Routing.control({
      waypoints: [
          L.latLng(-22.983449, -43.204845),
          L.latLng(-22.984708, -43.202430),
      ],
      lineOptions: {
        styles: [{ color: '#ff5733', opacity: 1, weight: 3 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10
      }
  }).addTo(this.map);


/// Remove Tool Tips!

   var routingControlContainer = route1?.getContainer();
   var controlContainerParent = routingControlContainer?.parentNode;
  if (controlContainerParent && routingControlContainer) {
    controlContainerParent.removeChild(routingControlContainer);
}
 routingControlContainer = route2?.getContainer();
 controlContainerParent = routingControlContainer?.parentNode;
if (controlContainerParent && routingControlContainer) {
  controlContainerParent.removeChild(routingControlContainer);
}
  



    /*var routingControl = L.Routing.control({
      router: L.Routing.osrmv1({
        serviceUrl: 'http://router.project-osrm.org/route/v1/'
      }),
      showAlternatives: true,
      fitSelectedRoutes: false,
      show: false,
      routeWhileDragging: true,
      waypoints: waypoints
    }    
    ).addTo(this.map);*/

    
  }
}