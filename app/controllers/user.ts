import Controller from '@ember/controller';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import type { UserRouteModel } from 'anihistory-ui-ember/routes/user';
import type UserService from 'anihistory-ui-ember/services/user';

export default class UserController extends Controller {
  @service declare router: RouterService;
  @service declare user: UserService;

  declare model: UserRouteModel;

  @tracked lang = 'user';

  @action
  updateLang(event: InputEvent) {
    this.lang = (event.target as HTMLInputElement).value;
  }

  @action
  refresh() {
    this.router.refresh();
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    user: UserController;
  }
}
