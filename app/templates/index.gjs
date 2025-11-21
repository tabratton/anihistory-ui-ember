import { t } from 'ember-intl';
import RouteTemplate from 'ember-route-template';

export default RouteTemplate(
  <template>
    <div class="h-full flex flex-col items-center justify-center">
      <p class="text-center text-gray-100 text-lg">
        {{t "subtitle" htmlSafe=true}}
      </p>
    </div>
  </template>,
);
