import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import type UserService from 'anihistory-ui-ember/services/user';

import './application.css';

export default class Application extends Controller {
  @service declare user: UserService;

  @tracked mobileMenuOpen = false;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    application: Application;
  }
}
