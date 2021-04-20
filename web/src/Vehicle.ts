export class Vehicle {
  public metrics: Map<string, Metric>;

  constructor() {
    this.metrics = new Map<string, Metric>();
  }
}

export interface Metric {
  name: string;
  value: number;
}