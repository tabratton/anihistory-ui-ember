import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class Application extends Route {
  @service intl;

  async beforeModel() {
    await this.loadTranslations('en-us');
    this.intl.setLocale(['en-us']);
  }

  async loadTranslations(locale) {
    let translations;
    switch (locale) {
      case 'en-us':
        translations = (await import('../../translations/en-us.json')).default;
        break;
    }

    this.intl.addTranslations(locale, translations);
  }
}
