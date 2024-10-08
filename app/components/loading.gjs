import './loading.css';

<template>
  {{#if @loading}}
    <div class='loading sk-cube-grid'>
      <div class='sk-cube sk-cube1 float-left bg-main-500' />
      <div class='sk-cube sk-cube2 float-left bg-main-500' />
      <div class='sk-cube sk-cube3 float-left bg-main-500' />
      <div class='sk-cube sk-cube4 float-left bg-main-500' />
      <div class='sk-cube sk-cube5 float-left bg-main-500' />
      <div class='sk-cube sk-cube6 float-left bg-main-500' />
      <div class='sk-cube sk-cube7 float-left bg-main-500' />
      <div class='sk-cube sk-cube8 float-left bg-main-500' />
      <div class='sk-cube sk-cube9 float-left bg-main-500' />
    </div>
  {{else}}
    {{yield}}
  {{/if}}
</template>
