import Component from '@glimmer/component';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import {
  faMagnifyingGlass,
  faBars,
  faXmark,
  faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';

export default class TemplateIcon extends Component {
  <template>
    <FaIcon ...attributes @icon={{this.icon}} @fixedWidth={{@fixedWidth}} />
  </template>

  get icon() {
    switch (this.args.icon) {
      case 'magnifying-glass':
        return faMagnifyingGlass;
      case 'bars':
        return faBars;
      case 'xmark':
        return faXmark;
      case 'arrows-rotate':
        return faArrowsRotate;
      default:
        return '';
    }
  }
}
