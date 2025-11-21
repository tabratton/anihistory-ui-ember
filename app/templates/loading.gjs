import RouteTemplate from 'ember-route-template';

import Loading from '../components/loading';

export default RouteTemplate(
  <template>
    <div class="h-full w-full flex items-center justify-center">
      <Loading @loading={{true}} />
    </div>
  </template>,
);
