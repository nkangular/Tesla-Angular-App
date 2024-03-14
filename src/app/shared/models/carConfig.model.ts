export interface CarOption {
  configs: CarConfig[];
  towHitch: boolean;
  yoke: boolean;
}

export interface CarConfig {
  id: string;
  description: string;
  range: number;
  speed: number;
  price: number;
}