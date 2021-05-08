import FileSystem from "../util/FileSystem";
import Metric from "./Metric";

export class Trip {
  public path: string;
  public info: TripInfo;

  constructor(path: string, info: TripInfo) {
    this.path = path;
    this.info = info;
  }

  public async save(): Promise<boolean> {
    return FileSystem.writeFile(this.path, JSON.stringify(this.info, null, 2));
  }
}

export interface TripInfo {
  timeStart: number;
  timeEnd: number | null;
  waypoints: Waypoint[];
}

interface Waypoint {
  lat: number;
  lon: number;
  metrics: object;
}