// FIXME: Complete the interface using the XML parser result
export interface PointOfSale {
  id: number;
  latitude: number;
  longitude: number;
  cp: number;
  pop: 'A' | 'R';

  addresse: string;
  ville: string;
  services: Array<string>;
}
