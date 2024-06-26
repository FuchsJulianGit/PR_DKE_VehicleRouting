export interface RoutePoint{
    id: number,
    description: String,
    sequenz: number,
    atHome: boolean,
    coordinates?: string,
    vehicleId: number
    coordinateId: number
}

export interface Route {
  id: number;
  routeName: string;
  vehicleId: number;
}

export interface Vehicle {
  id: number;
  CompanyName: string;
  startCoordinate: Coordinates;
  endCoordinate: Coordinates;
  canTransportWheelchairs: boolean;
  VehicleDescription: '';
  seatingPlaces: number;
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
  longitude: string;
  latitude: string;
}

export interface TransportProvider {
  id: number;
  companyName: string;
}

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

