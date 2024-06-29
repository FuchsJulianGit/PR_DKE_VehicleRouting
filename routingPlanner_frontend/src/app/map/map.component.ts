import { AfterViewInit, Component, Input,  OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit, OnChanges {

  @Input() inputValue: [any[], boolean] = [[], false]; // Input data: array of coordinates and a boolean flag
  
  public markerCount: number = 0; // Counter for the number of markers
  public mapCoordinatesInput: any[] = []; // Array to store map coordinates input
  public inputType: boolean = false; // Flag to indicate input type (routes or markers)
  public routesData = [{}];  // Sample routes data for demonstration
  public mapCoordinates: any[] = []; // Array to store current map coordinates
  private map!: L.Map; // Leaflet map instance
  private markers: L.Marker[] = []; // Array to store Leaflet markers
  private mapInitialized: boolean = false; // Flag to track if map is initialized
  private innerRoute: any[] = []; // Array to store inner routing controls

  ngAfterViewInit() {
    this.initializeMap();
    this.mapInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const [mapCoordinatesInput, inputType] = this.inputValue; // Destructure input value into coordinates and type
    this.mapCoordinatesInput = mapCoordinatesInput; // Update map coordinates input
    this.inputType = inputType; // Update input type flag

    //Draw Routes 
    if(inputType == false){
      if(this.mapCoordinatesInput != undefined && this.mapInitialized == true){
        if( JSON.stringify(this.mapCoordinates) !==  JSON.stringify(this.mapCoordinatesInput)){
          this.mapCoordinates = this.mapCoordinatesInput; // Update current map coordinates
          this.routesData = mapCoordinatesInput; // Update routes data
          this.initializeRouting(); // Initialize route drawing
        }}
    }

     // Draw Markers if input type is true or if marker count changes
    if(inputType == true || this.markerCount != mapCoordinatesInput.length){
      if(this.mapCoordinatesInput != undefined && this.mapInitialized == true){
      if( JSON.stringify(this.mapCoordinates) !==  JSON.stringify(this.mapCoordinatesInput)){
        let x = 0;
        let y = 0;

        // Calculate average center of markers
        for (let i = 0; i < this.mapCoordinatesInput.length; i++) {
          x += this.mapCoordinatesInput[i][0];  
          y += this.mapCoordinatesInput[i][1];
        }
        x = x / this.mapCoordinatesInput.length;
        y = y / this.mapCoordinatesInput.length;

       try { this.map.fitBounds(this.mapCoordinatesInput); } catch (error) { } // Fit map bounds to markers
      
        this.mapCoordinates = this.mapCoordinatesInput; // Update current map coordinates
        this.drawMarkers(); // Draw markers on the map
    }
     }
     this.markerCount = mapCoordinatesInput.length; // Update marker count
    }
  }

    // Initialize the Leaflet map
  private initializeMap() {
    const baseMapURl = 'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=9EPuY0KcdIk7nGeNgjz84t4v6YXWvE33qACJMNKYfX0m1UfytsyWERuzVJ3rR7Sk'
    //const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.map = L.map('map').setView([48.2082,16.3719],  10); // Initialize map with center and zoom
    L.tileLayer(baseMapURl).addTo(this.map); // Add base tile layer to the map
  }

    // Reset map by removing markers and routing controls
  private resetMap(){
    this.markers.forEach(marker => {
      marker.remove();  // Remove each marker from the map
    });

    this.innerRoute.forEach(control => {
      control.remove(); // Remove each routing control from the map
    });
  }

  private drawMarkers() {
    this.resetMap();  // Reset the map (remove existing markers and routing controls)
    this.markers = []; // Clear markers array
    Object.values(this.mapCoordinates).forEach((markerCoord: any, index) => {

      const latitude = markerCoord[0]; // Extract latitude
      const longitude = markerCoord[1]; // Extract longitude

      if (!this.isMarkerDrawn(markerCoord)) {
      var marker = L.marker([latitude, longitude]).addTo(this.map);
      this.markers.push(marker);  // Push marker to markers array
      }
    });
}

 // Check if a marker is already drawn on the map
private isMarkerDrawn(markerCoord: any): boolean {
  return this.markers.some(marker => {
    return marker.getLatLng().equals(L.latLng(markerCoord.coordinates));
  });
}

 // Get points (coordinates) from route data
  public getPoints(routeData: any): number[][] {
    var coordinates: number[][] = [];
    routeData.forEach((data: any) => {
      const lat = Number(data.coordinates[0]);
      const lng = Number(data.coordinates[1]);
      coordinates.push([lat, lng]);
    });
    return coordinates;
  }

   // Initialize routing on the map
   private async initializeRouting() {
    this.resetMap(); // Reset the map (remove existing markers and routing controls)
    let serviceUrl = "http://localhost:5000/route/v1";  // OSMR service URL
    let serverAvailable = await checkOSMRServer(serviceUrl); // Check OSMR server availability
    const groupedRoutes = this.groupRoutesByRouteName(this.routesData);  // Group routes by route name

    Object.values(groupedRoutes).forEach((routes: any[], index) => {
      var group = L.featureGroup(); // Create Leaflet feature group for routing
      var latlngArray = []; // Array to store LatLng objects
      var input = this.getPoints(routes); // Get points (coordinates) from routes data
  
       // Iterate over input coordinates and add circle markers
      for (var i = 0; i < input.length; i++) {
        var ltln = L.latLng(input[i][0], input[i][1]); // Create LatLng object
        L.circleMarker(ltln, {
          radius: 2 // Marker radius
        }).addTo(group); // Add circle marker to feature group
        latlngArray.push(ltln); // Push LatLng object to latlngArray
      }

      if(serverAvailable){
        console.log("%cOSMR SERVER AVAILABLE... ", "color: green;");

            // Add routing control with OSMR router if server is available
         this.innerRoute[index] = L.Routing.control({
          waypoints: [...latlngArray], // Waypoints for routing control
          lineOptions: {
            styles: [{ color: (routes[0].mainRoute ? '#5733ff' : '#888888'), opacity: 1, weight: 3 }],
            extendToWaypoints: true, // Extend route to waypoints
            missingRouteTolerance: 10 // Missing route tolerance
          },
          router: L.Routing.osrmv1({
            serviceUrl: "http://localhost:5000/route/v1",  // OSMR service URL
          }) // Remove {servceUrl...} in case OSMR is not working - this is however not suitable for production
        }).addTo(this.map);
      }else{
        console.log("%cOSMR SERVER UNVAILABLE... ", "color: red;");

        // Add routing control without OSMR router if server is unavailable
        this.innerRoute[index] = L.Routing.control({
          waypoints: [...latlngArray], // Waypoints for routing control
          lineOptions: {
            styles: [{ color: (routes[0].mainRoute ? '#5733ff' : '#888888'), opacity: 1, weight: 3 }],
            extendToWaypoints: true,  // Extend route to waypoints
            missingRouteTolerance: 10 // Missing route tolerance
          },
          router: L.Routing.osrmv1(/*{
            serviceUrl: "http://localhost:5000/route/v1",
          }*/) // Remove {servceUrl...} in case OSMR is not working - this is however not suitable for production
        }).addTo(this.map);  // Add routing control to the map

      }

      // Remove routing control from its parent container
      const routingControlContainer = this.innerRoute[index].getContainer();
      const controlContainerParent = routingControlContainer?.parentNode;
      if (controlContainerParent && routingControlContainer) {
        controlContainerParent.removeChild(routingControlContainer);
      }
    });
  }

   // Group routes by route name
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

  // Function to check OSMR server availability
  const checkOSMRServer = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url);
      if (response.status === 400) {
        //console.log("%cSERVER AVAILABLE...", "color: green;");
        return true;
      } else {
       // console.log("%cSERVER UNAVAILABLE... (unexpected status)", "color: red;");
        return false;
      }
    } catch (error) {
     // console.log("%cSERVER UNAVAILABLE... (error)", "color: red;");
      return false;
    }
  };
 