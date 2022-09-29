export interface CargoData {
  cargoOrders:      any[];
  id:               string;
  registrationNumber: string;
  type:             string;
  origin:           Destination;
  destination:      Destination;
  status:           string;
  publisher:        Publisher;
  goodsDetails:     GoodsDetails;
  transportDetails: TransportDetails;
  loadingDate:      string;
  unloadingDate:    string;
  price:            Price;
  totalCarriedWeight?: number;
  totalPrice?:      number;
  customPrice?:    number;
  remainingSpots?: number;
}

export interface Destination {
  location:     Location;
  companyName:  string;
  city:         string;
  street:       string;
  houseNumber:  number | null;
  phoneNumbers: string[];
}

export interface Location {
  lat: number;
  lng: number;
}

export interface GoodsDetails {
  weight:    number;
  goodsType: Type;
  note:      string;
}

export interface Type {
  name: string;
  id:   string;
}

export interface Price {
  method:          string;
  currency:        string;
  customPrice:     number;
  calculatedPrice: number;
  pricePerUnit?:   number;
  customPricePerUnit?: number;
}

export interface Publisher {
  companyId:         string;
  publisherId:       string;
  publisherContacts: PublisherContact[];
}

export interface PublisherContact {
  name:  null;
  phone: string;
  email: string;
}

export interface TransportDetails {
  bodyTypes:        Type[];
  vehicleType:      Type;
  note:             string;
  vehiclesRequired: number;
}
