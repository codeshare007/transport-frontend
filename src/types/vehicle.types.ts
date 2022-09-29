export interface GoodsTypes {
  name: string;
  id: string;
  available: boolean;
}

export interface SingleVehicle {
  name:             string;
  id:               string;
  vehicleMandatory: boolean;
  goodTypeIds:      string[];
  available:        boolean;
}
