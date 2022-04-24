import { action } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';

export default class UserService extends Service {
  @service declare router: RouterService;

  @tracked username = '';
  @tracked avatar = '';

  get url() {
    return this.username
      ? `https://anilist.co/usr/${this.username}/animelist`
      : undefined;
  }

  @action
  wipe() {
    this.username = '';
    this.avatar = '';
  }

  update(username: string, avatar: string) {
    this.username = username;
    this.avatar = avatar;
  }

  @action
  goTo(username: string) {
    this.router.transitionTo('user', username);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    user: UserService;
  }
}
