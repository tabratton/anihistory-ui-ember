import { action } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';
import fetch from 'fetch';

export default class UserService extends Service {
  @service declare router: RouterService;

  @tracked declare selectedUser: UserResponse | null;

  get url() {
    return this.selectedUser?.name
      ? `https://anilist.co/usr/${this.selectedUser.name}/animelist`
      : '';
  }

  @action
  wipe() {
    this.update(null);
  }

  update(user: UserResponse | null) {
    this.selectedUser = user;
  }

  searchUsers = restartableTask(async (searchTerm: string) => {
    await timeout(250);
    const response = await fetch('https://graphql.anilist.co', {
      method: 'post',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `query=query {Page(page: ${1}, perPage: ${5}) {users(search: "${searchTerm}") {id name avatar { large medium } } } }`,
    });
    if (response.status !== 200) {
      return [];
    }

    const {
      data: {
        Page: { users },
      },
    } = await response.json();
    return users;
  });

  async getUserInfo(
    username: string,
    error: {
      type: 'NotFound' | 'Unavail' | 'DateRange' | null;
      messages: Array<string>;
    },
    errorCallback: Function
  ): Promise<UserResponse | null> {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'post',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `query=query {User(name: "${username}") {id name avatar { large medium } } }`,
    });
    if (response.status !== 200) {
      errorCallback(response, error);
      return null;
    }
    const {
      data: { User },
    } = await response.json();

    return User;
  }

  @action
  updateUser(user: UserResponse) {
    this.update(user);
    this.goTo(user.name);
  }

  @action
  goTo(username: string) {
    this.router.transitionTo('user', username);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  // eslint-disable-next-line no-unused-vars
  interface Registry {
    user: UserService;
  }
}

export interface UserResponse {
  id: number;
  name: string;
  avatar: {
    large: string;
    medium: string;
  };
}
