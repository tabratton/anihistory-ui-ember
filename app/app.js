import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import compatModules from '@embroider/virtual/compat-modules';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';

import config from './config/environment';

import { setConfig } from 'ember-basic-dropdown/config';

setConfig({
  rootElement: config.APP.rootElement,
});

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

import './app.css';
import './fontawesome';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
  inspector = setupInspector(this);
}

loadInitializers(App, config.modulePrefix, compatModules);
