import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css'


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {

  public routesData = [
    { routeName: "Route 1", sequenceNumber: 1, coordinates: [47.6097, 13.0419] },
    { routeName: "Route 1", sequenceNumber: 2, coordinates: [47.507603, 15.724283] },
    { routeName: "Route 2", sequenceNumber: 1, coordinates: [47.316917, 15.421834] },
    { routeName: "Route 2", sequenceNumber: 2, coordinates: [47.207603, 15.724283] }
  ];
  

  private map!: L.Map;
  private markers: L.Marker[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initializeMap();
    this.addMarkers();
    this.initializeRouting();
  }

  private initializeMap() {
    const baseMapURl = 'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=9EPuY0KcdIk7nGeNgjz84t4v6YXWvE33qACJMNKYfX0m1UfytsyWERuzVJ3rR7Sk'
    //const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.map = L.map('map').setView([48.2082,16.3719],  10);
    L.tileLayer(baseMapURl).addTo(this.map);
  }

  private addMarkers() {
    this.markers.forEach(marker => marker.removeFrom(this.map));
    this.markers = [];
    this.routesData.forEach(routeData => {
      var coordinates: L.LatLngTuple = [Number(routeData.coordinates[0]), Number(routeData.coordinates[1])];
    });
  }

  public getPoints(routeData: any): number[][] {
    console.dir(routeData);

    var coordinates: number[][] = [];

    routeData.forEach((data: any) => {
      const lat = Number(data.coordinates[0]);
      const lng = Number(data.coordinates[1]);
      coordinates.push([lat, lng]);
    });

    console.dir(coordinates);

    return coordinates;
  }

  private initializeRouting() {
    const groupedRoutes = this.groupRoutesByRouteName(this.routesData);

    Object.values(groupedRoutes).forEach((routes: any[], index) => {

      var group = L.featureGroup();
      var latlngArray = [];
      var input = this.getPoints(routes);
      var innerRoute = [];
      
      console.log("input: " + input[0]);
      console.log("input: " + input[1]);

      for (var i = 0; i < input.length; ++i) {
        var ltln = L.latLng(input[i][0], input[i][1]);
        L.circleMarker(ltln, {
          radius: 2
        }).addTo(group);
        latlngArray.push(ltln);
      }

         innerRoute[index] = L.Routing.control({
          waypoints: [...latlngArray],
          lineOptions: {
            styles: [{ color: index === 0 ? '#5733ff' : '#ff5733', opacity: 1, weight: 3 }],
            extendToWaypoints: true,
            missingRouteTolerance: 10
          },
          router: L.Routing.osrmv1({
            serviceUrl: "http://localhost:5000/route/v1",
          })
        }).addTo(this.map);

      const routingControlContainer = innerRoute[index].getContainer();
      const controlContainerParent = routingControlContainer?.parentNode;
      if (controlContainerParent && routingControlContainer) {
        controlContainerParent.removeChild(routingControlContainer);
      }
    });
  }

  private groupRoutesByRouteName(routesData: any[]): { [key: string]: any[] } {
    const groupedRoutes: { [key: string]: any[] } = {};
    routesData.forEach(routeData => {
      const routeName = routeData.routeName;
      if (!groupedRoutes[routeName]) {
        groupedRoutes[routeName] = [];
      }
      groupedRoutes[routeName].push(routeData);
    });
    return groupedRoutes;
  }

  }
 