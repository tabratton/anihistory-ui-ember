import createChart from '../modifiers/create-chart';

import './chart.css';

<template>
  <div
    id="chartDiv"
    class="flex-grow w-full text-italic"
    ...attributes
    {{createChart list=@list lang=@lang}}
  ></div>
</template>
