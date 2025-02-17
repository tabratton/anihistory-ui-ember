import { hash } from '@ember/helper';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const Option = <template>
  <option class="text-white bg-[rgb(20,18,18)]" ...attributes>
    {{yield}}
  </option>
</template>;

<template>
  <select
    class="select text-white bg-white bg-opacity-5 placeholder-gray-400 placeholder-opacity-65 focus:ring-0 border border-gray-500 focus:border-main-600 rounded-md pl-4 py-2 bg-none"
    ...attributes
  >
    {{yield (hash Option=(component Option))}}
  </select>
  <div
    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
  >
    <FaIcon class="text-white" @icon={{faCaretDown}} @fixedWidth={{true}} />
  </div>
</template>
