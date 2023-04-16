import { action } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';
import fetch from 'fetch';

export default class UserService extends Service {
  @service router;

  @tracked selectedUser;

  get url() {
    return this.selectedUser?.name
      ? `https://anilist.co/usr/${this.selectedUser.name}/animelist`
      : '';
  }

  @action
  wipe() {
    this.update(null);
  }

  update(user) {
    this.selectedUser = user;
  }

  searchUsers = restartableTask(async (searchTerm) => {
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

  async getUserInfo(username, error, errorCallback) {
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
  updateUser(user) {
    this.update(user);
    this.goTo(user.name);
  }

  @action
  goTo(username) {
    this.router.transitionTo('user', username);
  }
}
