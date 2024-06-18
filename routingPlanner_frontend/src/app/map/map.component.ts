import { publishFacade } from '@angular/compiler';
import { AfterViewInit, Component, Input,  OnChanges, SimpleChanges, input, numberAttribute } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css'


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})



export class MapComponent implements AfterViewInit, OnChanges {
  markerCount: number = 0;

//  @Input() mapCoordinatesInput: any[] = [];

  @Input() inputValue: [any[], boolean] = [[], false];

  
  public mapCoordinatesInput: any[] = [];
  public inputType: boolean = false;
//mapCoordinatesInput

  public routesData = [
    { routeName: "Route 1", id:1, sequenceNumber: 1, coordinates: [47.6097, 13.0419] },
    { routeName: "Route 1", id:1, sequenceNumber: 2, coordinates: [47.507603, 15.724283] },
    { routeName: "Route 2", id:1, sequenceNumber: 1, coordinates: [47.316917, 15.421834] },
    { routeName: "Route 2", id:1, sequenceNumber: 2, coordinates: [47.207603, 15.724283] }
  ];
  
  public mapCoordinates: any[] = [];



  /*public markerCoordinates = [
    {coordinates: [47.6097, 13.0419] },
    {coordinates: [47.507603, 15.724283] },
    {coordinates: [47.6097, 15.724283] }
  ]*/

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private mapInitialized: boolean = false;
  private innerRoute: any[] = [];

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.initializeMap();
    this.mapInitialized = true;
  //  this.initializeRouting();
  }


  private previousInput: any = null;



  ngOnChanges(changes: SimpleChanges): void {

    const [mapCoordinatesInput, inputType] = this.inputValue;

    this.mapCoordinatesInput = mapCoordinatesInput;
    this.inputType = inputType;

    //Draw Routes 
    if(inputType == false){
      if(this.mapCoordinatesInput != undefined && this.mapInitialized == true){
        if( JSON.stringify(this.mapCoordinates) !==  JSON.stringify(this.mapCoordinatesInput)){
          this.mapCoordinates = this.mapCoordinatesInput;

          this.routesData = mapCoordinatesInput;

          this.initializeRouting();
        }}
    }

    //Draw Markers
    if(inputType == true || this.markerCount != mapCoordinatesInput.length){
      if(this.mapCoordinatesInput != undefined && this.mapInitialized == true){
      if( JSON.stringify(this.mapCoordinates) !==  JSON.stringify(this.mapCoordinatesInput)){
        let x = 0;
        let y = 0;

      //  console.log(mapCoordinatesInput);

        for (let i = 0; i < this.mapCoordinatesInput.length; i++) {
          x += this.mapCoordinatesInput[i][0];  
          y += this.mapCoordinatesInput[i][1];
        }
        x = x / this.mapCoordinatesInput.length;
        y = y / this.mapCoordinatesInput.length;

       try { this.map.fitBounds(this.mapCoordinatesInput); } catch (error) { }
      
        this.mapCoordinates = this.mapCoordinatesInput;
        this.drawMarkers();
    }
     }
     this.markerCount = mapCoordinatesInput.length;
    }

    

  }

  private initializeMap() {
    const baseMapURl = 'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=9EPuY0KcdIk7nGeNgjz84t4v6YXWvE33qACJMNKYfX0m1UfytsyWERuzVJ3rR7Sk'
    //const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.map = L.map('map').setView([48.2082,16.3719],  10);
    L.tileLayer(baseMapURl).addTo(this.map);
  }

  private resetMap(){
 
   this.markers.forEach(marker => {
      marker.remove();
    });

    this.innerRoute.forEach(control => {
      control.remove();
    });

  }

  private drawMarkers() {
    this.resetMap();


    console.log(this.mapCoordinates);
    //console.log(this.inputValue);

    this.markers = [];
    Object.values(this.mapCoordinates).forEach((markerCoord: any, index) => {

      const latitude = markerCoord[0]; // Extract latitude
      const longitude = markerCoord[1]; // Extract longitude

      if (!this.isMarkerDrawn(markerCoord)) {
      var marker = L.marker([latitude, longitude]).addTo(this.map);
      this.markers.push(marker);
      }
    });
}

private isMarkerDrawn(markerCoord: any): boolean {
  return this.markers.some(marker => {
    return marker.getLatLng().equals(L.latLng(markerCoord.coordinates));
  });
}

 /* private addRouteMarkers() {
    this.markers.forEach(marker => marker.removeFrom(this.map));
    this.markers = [];
    this.routesData.forEach(routeData => {
      var coordinates: L.LatLngTuple = [Number(routeData.coordinates[0]), Number(routeData.coordinates[1])];
    });
  }*/

  public getPoints(routeData: any): number[][] {
    //console.dir(routeData);

    var coordinates: number[][] = [];

    routeData.forEach((data: any) => {
      const lat = Number(data.coordinates[0]);
      const lng = Number(data.coordinates[1]);
      coordinates.push([lat, lng]);
    });

    //console.dir(coordinates);

    return coordinates;
  }

  private initializeRouting() {
    this.resetMap();

    //console.log(this.routesData);

    const groupedRoutes = this.groupRoutesByRouteName(this.routesData);

    //console.log(groupedRoutes);


    Object.values(groupedRoutes).forEach((routes: any[], index) => {

      var group = L.featureGroup();
      var latlngArray = [];
      var input = this.getPoints(routes);
  

      for (var i = 0; i < input.length; i++) {
        //console.log(input[i]);
        var ltln = L.latLng(input[i][0], input[i][1]);
        L.circleMarker(ltln, {
          radius: 2
        }).addTo(group);
        latlngArray.push(ltln);
      }


     /* this.map.addControl(L.Routing.control({
        waypoints: [...latlngArray],
        lineOptions: {
          styles: [{ color: index === 0 ? '#5733ff' : '#ff5733', opacity: 1, weight: 3 }],
          extendToWaypoints: true,
          missingRouteTolerance: 10
        },
        router: L.Routing.osrmv1({
          serviceUrl: "http://localhost:5000/route/v1",
        })
      }))*/

      //console.log(routes);
      //console.log( this.innerRoute);


         this.innerRoute[index] = L.Routing.control({
          waypoints: [...latlngArray],
          lineOptions: {
            styles: [{ color: (routes[0].mainRoute ? '#5733ff' : '#888888'), opacity: 1, weight: 3 }],
            extendToWaypoints: true,
            missingRouteTolerance: 10
          },
          router: L.Routing.osrmv1({
            serviceUrl: "http://localhost:5000/route/v1",
          }) // Remove {servceUrl...} in case OSMR is not working - this is however not suitable for production
        }).addTo(this.map);

      const routingControlContainer = this.innerRoute[index].getContainer();
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
 