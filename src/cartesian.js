import {select} from 'd3-selection';
import {chartCartesian} from '@d3fc/d3fc-chart';
import {rebindAll} from '@d3fc/d3fc-rebind';
import {loadApi} from 'd3fc-webgl-proc';

export default (xScale, yScale) => {
  const base = chartCartesian(xScale, yScale);
  const chart = (selection) => {
    const result = base(selection);

    selection.select('d3fc-canvas.plot-area')
      .on('draw', (d, i, nodes) => {
          loadApi().then(() => {
              const canvas = select(nodes[i])
                  .select('canvas')
                  .node();
              const series = base.canvasPlotArea();
              const contextType = series.contextType ? series.contextType() : '2d';

              series.context(canvas.getContext(contextType))
                  .xScale(xScale)
                  .yScale(yScale);
              series(d);
          });
      });

    return result;
  }
  rebindAll(chart, base);
  return chart;
};
