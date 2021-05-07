import { Page } from "../Page";
import { Metric } from "../Vehicle";
import WebApp from "../WebApp";
import CardWidget from "../widgets/CardWidget";

export default class MetricsPage extends Page {
  private widgets: Map<string, CardWidget>;

  constructor(app: WebApp) {
    super(app, 'metrics');
    this.widgets = new Map<string, CardWidget>();
  }

  public async load() {
    this.app.on('metrics_updated', (metrics: Metric[]) => this.update(metrics));
  }

  private update(metrics: Metric[]) {
    metrics.forEach(metric => {
      let widget = this.widgets.get(metric.name);
      let displayValue = !metric.suffix ? metric.value : `${metric.value}${metric.suffix}`;
      if (!widget) {
        widget = new CardWidget({
          title: metric.name, 
          value: displayValue,
          width: 260,
          parent: this.app.catalog.elements.metrics.layout
        });
        this.widgets.set(metric.name, widget);
        return;
      }

      widget.setState({value:displayValue});
    });
  }
}