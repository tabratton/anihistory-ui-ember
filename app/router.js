import EmberRouter from '@ember/routing/router';
import config from 'anihistory-ui-ember/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('user', { path: '/:username' });
});
