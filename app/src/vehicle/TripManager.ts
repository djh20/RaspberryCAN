import App from "../app/App";
import FileSystem from "../util/FileSystem";
import { Trip, TripInfo } from "./Trip";

export default class TripManager {
  public trips: Trip[];
  private folderPath: string;

  constructor() {
    this.trips = []; 
  }

  public async load(folderPath: string) {
    let directory = await FileSystem.readDirectory({path: folderPath});
   
    for (let child of directory.children) {
      let data = await FileSystem.readFile({path:child.path, json:true});
      this.trips.push(new Trip(data.json));
    }
  }

  
}