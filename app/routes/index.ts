import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import type UserService from 'anihistory-ui-ember/services/user';

export default class Index extends Route {
  @service declare user: UserService;

  setupController(): void {
    this.user.wipe();
  }
}
