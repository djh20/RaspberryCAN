import * as socketcan from 'socketcan';
import Logger from '../util/Logger';
import Vehicle, { VehicleDefinition } from './Vehicle';

export default class CanModule {
  public vehicle: Vehicle;

  private channel: any;

  constructor(vehicle: Vehicle) {
    this.vehicle = vehicle;
  }

  public connect(channelName: string) {
    try {
      this.channel = socketcan.createRawChannel(channelName, false, null);
      Logger.info('CAN', "Connected!");
    } catch (err) {
      Logger.warn('CAN', "Failed to connect!");
    }
  }

  public listen() {
    if (!this.channel) return;

    this.channel.addListener('onMessage', (frame: CanFrame) => {
      if (!this.vehicle.definition) return;

      let group = this.vehicle.definition.can.find(g => g.id == frame.id);
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

export type CanPoint = {
  id?: number,
  name: string,
  log?: boolean,
  suffix?: string,
  interval?: number,
  process?: (buffer: Buffer) => number,
  convert?: (value: number) => Uint8Array | Uint16Array
}