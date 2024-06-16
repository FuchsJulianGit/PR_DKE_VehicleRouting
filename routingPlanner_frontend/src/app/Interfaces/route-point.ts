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
    startCoordinate: string;
    endCoordinate: string;
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
  


//PersonNew
/*export class Person {
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
    wheelchair: boolean
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
  }
}


export class Address {
  streetName?: string;
  doorNumber?: string;
  zipcode?: string;
  city?: string;
}

export class Coordinates {
  longitude?: string;
  latitude?: string;
}
*/

/*export interface RoutePoint {
    id: number;
    seq: number;
    startPoint: number;
    person: number;
}*/