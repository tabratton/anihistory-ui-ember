import Route from '@ember/routing/route';
import { service } from '@ember/service';

const translationModules = {
  'en-us': () => import('virtual:ember-intl/translations/en-us'),
};

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
        translations = (await translationModules['en-us']()).default;
        break;
    }

    this.intl.addTranslations(locale, translations);
  }
}
