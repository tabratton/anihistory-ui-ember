import {
  color,
  ColorSet,
  create,
  options,
  percent,
  ResizeButton,
  Scrollbar,
  useTheme,
} from '@amcharts/amcharts4/core';
import {
  CategoryAxis,
  ColumnSeries,
  DateAxis,
  XYChart,
  XYCursor,
} from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import theme from '@amcharts/amcharts4/themes/spiritedaway';
import { registerDestructor } from '@ember/destroyable';
import { inject as service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';
import Modifier, { ArgsFor, PositionalArgs, NamedArgs } from 'ember-modifier';

import type { AnihistoryEntry } from 'anihistory-ui-ember/interfaces/AnihistoryEntry';
import type { CreateChartModifierSignature } from 'anihistory-ui-ember/interfaces/CreateChartModifierSignature';

options.autoSetClassName = true;
useTheme(am4themesAnimated);

const colorSet = new ColorSet();
theme(colorSet);

function cleanup(instance: CreateChartAm4Modifier) {
  instance.chart?.dispose();
}

export default class CreateChartAm4Modifier extends Modifier<CreateChartModifierSignature> {
  @service declare intl: IntlService;

  chart?: XYChart;

  constructor(owner: unknown, args: ArgsFor<CreateChartModifierSignature>) {
    super(owner, args);
    registerDestructor(this, cleanup);
  }

  modify(
    element: HTMLElement,
    _positional: PositionalArgs<CreateChartModifierSignature>,
    { list, lang }: NamedArgs<CreateChartModifierSignature>
  ) {
    this.createChart(element, list, lang);
  }

  createChart(
    element: HTMLElement,
    list: Array<AnihistoryEntry>,
    lang: string
  ) {
    this.chart?.dispose();

    const internalChart = create(element, XYChart);

    internalChart.data = list.map((item) => {
      return {
        color: colorSet.next(),
        ...item,
      };
    });
    internalChart.paddingRight = 30;

    const categoryAxis = internalChart.yAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.strokeOpacity = 0.15;
    categoryAxis.renderer.grid.template.stroke = color('#78716C');
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.fontSize = 12;
    categoryAxis.renderer.labels.template.disabled = true;
    categoryAxis.cursorTooltipEnabled = false;

    const dateAxis = internalChart.xAxes.push(new DateAxis());
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.tooltipDateFormat = 'yyyy-MM-dd';
    dateAxis.renderer.fontSize = 12;
    dateAxis.renderer.labels.template.fill = color('#FFFFFF');
    dateAxis.renderer.labels.template.opacity = 0.87;
    dateAxis.renderer.grid.template.strokeOpacity = 0.15;
    dateAxis.renderer.grid.template.stroke = color('#78716C');

    const series1 = internalChart.series.push(new ColumnSeries());
    series1.columns.template.width = percent(80);
    series1.columns.template.tooltipHTML = '';
    series1.columns.template.adapter.add('tooltipHTML', (/*html, context*/) => {
      return `
              <div class="flex flex-col items-center justify-center w-96">
                  <h4 class="text-2xl font-bold mb-2">{${lang}}</h4>
                  <span class="flex justify-between w-full">
                      <span class="font-bold mr-1">${this.intl.t(
                        'chart.started'
                      )}</span>
                      <span>{openDateX}</span>
                  </span>
                  <span class="flex justify-between w-full">
                      <span class="font-bold mr-1">${this.intl.t(
                        'chart.finished'
                      )}</span>
                      <span>{displayEndDay}</span>
                  </span>
                  <span class="flex justify-between w-full">
                      <span class="font-bold mr-1">${this.intl.t(
                        'chart.score'
                      )}</span>
                      <span>{score}</span>
                  </span>
                  <span class="flex justify-between w-full">
                      <span class="font-bold mr-1">${this.intl.t(
                        'chart.average'
                      )}</span>
                      <span>{average}</span>
                  </span>
                  <span class="mt-2">{description}</span>
              </div>
             `;
    });

    series1.dataFields.openDateX = 'startDay';
    series1.dataFields.dateX = 'endDay';
    series1.dataFields.categoryY = 'category';
    series1.columns.template.propertyFields.fill = 'color';
    series1.columns.template.propertyFields.stroke = 'color';

    series1.columns.template.events.on('hit', (ev) => {
      if (ev.target.dataItem) {
        window.open(
          `https://anilist.co/anime/${
            (ev.target.dataItem.dataContext as AnihistoryEntry).id
          }`,
          '_blank'
        );
      }
    });

    internalChart.cursor = new XYCursor();
    internalChart.cursor.lineX.strokeDasharray = '';
    internalChart.cursor.lineY.disabled = true;
    internalChart.cursor.behavior = 'zoomXY';

    internalChart.scrollbarX = new Scrollbar();
    internalChart.scrollbarY = new Scrollbar();

    function customizeGrip(grip: ResizeButton) {
      grip.icon.disabled = true;
      grip.background.fill = color('#E5E7EB');
      grip.background.fillOpacity = 1;
    }

    internalChart.scrollbarX.thumb.background.fill = color('#E5E7EB');
    internalChart.scrollbarX.thumb.background.fillOpacity = 0.05;
    internalChart.scrollbarY.thumb.background.fill = color('#E5E7EB');
    internalChart.scrollbarY.thumb.background.fillOpacity = 0.05;

    customizeGrip(internalChart.scrollbarX.startGrip);
    customizeGrip(internalChart.scrollbarX.endGrip);
    customizeGrip(internalChart.scrollbarY.startGrip);
    customizeGrip(internalChart.scrollbarY.endGrip);

    internalChart.zoomOutButton.background.fill = color('#D946EF');
    internalChart.zoomOutButton.icon.stroke = color('#E5E7EB');
    const buttonHoverState =
      internalChart.zoomOutButton.background.states.getKey('hover');
    if (buttonHoverState) {
      buttonHoverState.properties.fill = color('#E879F9');
    }

    this.chart = internalChart;
  }
}
