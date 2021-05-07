export class Trip {
  public info: TripInfo;

  constructor(info: TripInfo) {
    this.info = info;
  }
}

export interface TripInfo {
  timeStart: number;
  timeEnd?: number;
  waypoints: Waypoint[];
}

interface Waypoint {
  latitude: number;
  longitude: number;
  metrics: object;
}