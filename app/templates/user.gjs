import { on } from '@ember/modifier';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { t } from 'ember-intl';
import RouteTemplate from 'ember-route-template';
import { eq } from 'ember-truth-helpers';

import Button from '../components/button';
import Chart from '../components/chart';
import Loading from '../components/loading';
import Select from '../components/select';

export default RouteTemplate(
  <template>
    <div class="user rounded-md justify-self-stretch flex flex-col p-2 h-full">
      <div class="bg-white/7 p-4 text-white flex items-center justify-between">
        <h4 class="text-2xl font-bold">
          {{t "chart.title"}}
        </h4>
        <div class="controls grid items-center justify-items-center">
          <div class="language text-center flex flex-col">
            <label class="sr-only" for="lang-select">
              {{t "chart.language.title"}}
            </label>
            <div class="inline-block relative w-64">
              <Select
                id="lang-select"
                class="block w-full"
                {{on "change" @controller.updateLang}}
                as |s|
              >
                <s.Option value="user" selected={{eq @controller.lang "user"}}>
                  {{t "chart.language.user"}}
                </s.Option>
                <s.Option
                  value="english"
                  selected={{eq @controller.lang "english"}}
                >
                  {{t "chart.language.english"}}
                </s.Option>
                <s.Option
                  value="romaji"
                  selected={{eq @controller.lang "romaji"}}
                >
                  {{t "chart.language.romaji"}}
                </s.Option>
                <s.Option
                  value="native"
                  selected={{eq @controller.lang "native"}}
                >
                  {{t "chart.language.native"}}
                </s.Option>
              </Select>
            </div>
          </div>
        </div>
        <Button type="button" {{on "click" @controller.refresh}}>
          <FaIcon @icon={{faArrowsRotate}} @fixedWidth={{true}} />
        </Button>
      </div>
      <div
        class="bg-white/5 flex flex-col items-center justify-center flex-grow p-0.5"
      >
        <Loading @loading={{@controller.loading}}>
          {{#if @controller.error}}
            <div
              class="flex flex-col justify-center items-center bg-clip-content"
            >
              {{#each @controller.messages as |m|}}
                <p class="text-center text-gray-100 text-sm m-2">
                  {{m.message}}
                </p>
              {{/each}}
              {{#if (eq @controller.error "DateRange")}}
                <a
                  class="text-main-500 text-sm"
                  href={{@controller.user.url}}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{t "messages.anilist_instructions"}}
                </a>
              {{/if}}
            </div>
          {{else}}
            <Chart @list={{@model.userData.list}} @lang={{@controller.lang}} />
          {{/if}}
        </Loading>
      </div>
    </div>
  </template>,
);
