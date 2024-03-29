import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class Application extends Controller {
  @service user;

  @tracked mobileMenuOpen = false;
}
