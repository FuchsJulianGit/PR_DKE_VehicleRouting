export interface RoutePoint{
    id: number,
    description: String,
    sequenz: number,
    atHome: boolean,
    coordinates?: string,
    vehicle: number
    coordinateId: number
}

/*export interface RoutePointNew{
  id: number,
  routeName: String,
  sequence: number,
  atHome: boolean,
  coordinates: number,
  vehicle: number
}*/


export interface Route {
  id: number;
  routeName: string;
  vehicleId: number;
}


export interface Vehicle {
    id: number;
    companyName: string;
    vehicleDescription: string;
    startCoordinate: string;
    endCoordinate: string;
    canTransportWheelchairs: boolean;
    seatingPlaces: number;
  }
  
  /*export interface Person {
    id: number;
    name: string;
    startCoordinate: string;
    endCoordinate: string;
    company: string;
    needsWheelchair?: boolean;
  }*/
  


//PersonNew
export class Person {
  id?: number;
  gender: string;
  titel: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  startAddress: Address;
  targetAddress: Address;
  startCoordinates: Coordinates;
  targetCoordinates: Coordinates;
  wheelchair: boolean;
  transportProvider?: TransportProvider;

  constructor(
    gender: string,
    titel: string,
    firstName: string,
    lastName: string,
    birthday: Date,
    startAddress: Address,
    targetAddress: Address,
    startCoordinates: Coordinates,
    targetCoordinates: Coordinates,
    wheelchair: boolean,
    transportProvider?: TransportProvider
  ) {
    this.gender = gender;
    this.titel = titel;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthday = birthday;
    this.startAddress = startAddress;
    this.targetAddress = targetAddress;
    this.startCoordinates = startCoordinates;
    this.targetCoordinates = targetCoordinates;
    this.wheelchair = wheelchair;
    this.transportProvider = transportProvider;
  }
}


export interface Address {
  id: number;
  streetName: string;
  doorNumber: string;
  zipcode: string;
  city: string;
}

export interface Coordinates {
  id: number;
  longitude: number | null;
  latitude: number | null;
}

interface TransportProvider {
  companyName: string;
  review: string;
  companyAddress: Address;
  companyCoordinates?: Coordinates;
}


/*export interface RoutePoint {
    id: number;
    seq: number;
    startPoint: number;
    person: number;
}*/