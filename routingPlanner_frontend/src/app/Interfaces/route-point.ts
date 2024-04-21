export interface RoutePoint{
    id: number,
    description: String,
    sequenz: number,
    atHome: boolean,
    coordinates: string,
    vehicle: number
}

export interface Vehicle {
    id: number;
    companyName: string;
    vehicleDescription: string;
    coordinates: string;
    canTransportWheelchairs: boolean;
    seatingPlaces: number;
  }
  
  export interface Person {
    id: number;
    name: string;
    startCoordinate: string;
    endCoordinate: string;
    company: string;
    needsWheelchair?: boolean;
  }
  

/*export interface RoutePoint {
    id: number;
    seq: number;
    startPoint: number;
    person: number;
}*/