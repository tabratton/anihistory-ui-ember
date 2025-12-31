import { t, tKey } from 'ember-intl';

<template>
  <div class="h-full flex flex-col items-center justify-center">
    <p class="text-center text-gray-100 text-lg">
      {{t (tKey "subtitle") htmlSafe=true}}
    </p>
  </div>
</template>
