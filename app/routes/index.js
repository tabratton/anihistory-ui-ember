import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class Index extends Route {
  @service user;

  setupController() {
    this.user.wipe();
  }
}
