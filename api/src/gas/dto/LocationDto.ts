import { GeoLocationDto } from './GeoLocationDto';

export class LocationDto {
  readonly position: GeoLocationDto;
  readonly scope: number;
}
