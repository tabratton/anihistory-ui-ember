import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UserController extends Controller {
  @service router;
  @service user;

  @tracked lang = 'user';

  @action
  updateLang(event) {
    this.lang = event.target.value;
  }

  @action
  refresh() {
    this.router.refresh();
  }
}
