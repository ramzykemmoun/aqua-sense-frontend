import { IUser } from "./user";

export interface IPondData {
  id: string;
  pondId: string;
  temperature?: number;
  pH?: number;
  dissolvedOxygen?: number;
  salinity?: number;
  turbidity?: number;
  ammonia?: number;
  nitrate?: number;
  nitrite?: number;
  waterLevel: number;
  fishCount: number;
  timestamp: Date;
  createdAt: string;
  bioSample?: string; // Optional field for bio sample data
}

export interface IPond {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  data: IPondData;
  supervisors?: IUser[];

  temperatureActive: boolean;
  pHActive: boolean;
  dissolvedOxygenActive: boolean;
  salinityActive: boolean;
  turbidityActive: boolean;
  ammoniaActive: boolean;
  nitrateActive: boolean;
  nitriteActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface IPondCreateInput {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  temperatureActive: boolean;
  pHActive: boolean;
  dissolvedOxygenActive: boolean;
  salinityActive: boolean;
  turbidityActive: boolean;
  ammoniaActive: boolean;
  nitrateActive: boolean;
  nitriteActive: boolean;
  supervisorIds: string[]; // Array of user IDs for supervisors
}
