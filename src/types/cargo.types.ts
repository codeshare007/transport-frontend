export interface Cargo {
  goodsDetails?:     GoodsDetails;
  transportDetails?: TransportDetails;
  priceDetails?:     PriceDetails;
  originId?:         string;
  destinationId?:    string;
  loadingDate?:      string;
  unloadingDate?:    string;
  contactDetails?:   ContactDetail[];
}

export interface ContactDetail {
  fullname: string;
  phone:    string;
  email:    string;
}
export interface DestinationID {
}

export interface GoodsDetails {
  goodsTypeId: string;
  weight:      number;
  note:        string;
}

export interface PriceDetails {
  customPrice: number;
  customPricePerUnit: number;
  currency:    string;
  method:      string;
}

export interface TransportDetails {
  vehicleTypeId:    string;
  vehiclesRequired: number;
  bodyTypes:        DestinationID[];
  note:             string;
}

export interface CargoFilters {
  companyId?:          string;
  acceptedBy?:         string;
  status?:             string;
  originQuery?:        string;
  destinationQuery?:   string;
  loadingDate?:        string;
  unloadingDate?:      string;
  goodsTypeId?:        string;
  vehicleTypeId?:      string;
  bodyTypeIds?:        string[];
  maxCustomPrice?:     number;
  maxcustomPricePerUnit?:     number;
  maxCalculatedPrice?: number | null;
  maxWeight?:          number | null;
  sortBy?:             string;
  sortDirection?:      string;
  pageNo?:             number;
  pageSize?:           number;
}


export interface AcceptedBy {
}


export interface CargoAccept {
  vehicleId: ID;
  driverId:  string;
  trailerId: ID;
}

export interface ID {
}


