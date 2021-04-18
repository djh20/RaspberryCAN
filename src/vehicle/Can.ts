import * as socketcan from 'socketcan';
import Metric from './Metric';
import Vehicle from './Vehicle';

export default class CanModule {
  public vehicle: Vehicle;
  public definition: CanDefinition;

  private channel: any;

  constructor(vehicle: Vehicle) {
    this.vehicle = vehicle;
  }

  public connect(channelName: string) {
    try {
      this.channel = socketcan.createRawChannel(channelName);
      console.log("SUCCESS Initalize cansocket")
    } catch (err) {
      console.log("ERROR Failed to create cansocket")
    }
  }

  public listen() {
    if (!this.channel) return;

    this.channel.addListener('onMessage', (frame: CanFrame) => {
      if (!this.definition) return;

      let group = this.definition.groups.find(g => g.id == frame.id);
      if (!group) return;

      group.points.forEach(point => {
        let metric = this.vehicle.getMetric(point);
        metric.setValue(point.process(frame.data));
      });
    });

    this.channel.start();
  }
}

type CanFrame = {
  id: number,
  data: Buffer
}

export type CanDefinition = {
  id: string,
  name?: string,
  groups?: {
    id: number,
    name?: string,
    points?: CanDefinitionPoint[]
  }[]
}

export type CanDefinitionPoint = {
  id?: number,
  name: string,
  log?: boolean,
  interval?: number,
  process?: (buffer: Buffer) => number,
  convert?: (value: number) => Uint8Array | Uint16Array
}