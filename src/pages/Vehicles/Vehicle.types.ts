export interface VehicleAdd {
  id?: string;
  vehicleTypeId: string;
  licensePlate: any;
  bodyTypeId: string;
  length: number;
  width: number;
  height: number;
  volume: number;
  loadCapacity: number;
  additionalEquipment?: string;
  description?: string;
}