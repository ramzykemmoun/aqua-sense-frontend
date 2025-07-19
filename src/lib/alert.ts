import { IPondData } from "@/types/pond";

const intervals = {
  temperature: { min: 24, max: 30 },
  pH: { min: 6.5, max: 8.5 },
  dissolvedOxygen: { min: 5, max: 8 },
  salinity: { min: 0.5, max: 35 },
  turbidity: { min: 1, max: 50 },
  ammonia: { min: 0, max: 0.05 },
  nitrate: { min: 0, max: 50 },
  nitrite: { min: 0, max: 0.1 },
};

export function isWithinInterval(data: IPondData): boolean {
  return Object.entries(intervals).every(([key, { min, max }]) => {
    const value = data[key as keyof IPondData];
    return value !== undefined && Number(value) >= min && Number(value) <= max;
  });
}
