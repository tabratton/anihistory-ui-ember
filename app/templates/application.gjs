import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import {
  faMagnifyingGlass,
  faBars,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import BasicDropdownWormhole from 'ember-basic-dropdown/components/basic-dropdown-wormhole';
import { t } from 'ember-intl';
import { pageTitle } from 'ember-page-title';
import PowerSelect from 'ember-power-select/components/power-select';

import Button from '../components/button';

<template>
  {{pageTitle "AniHistory"}}

  <div class="relative bg-[inherit] w-full h-full">
    <nav
      class="max-h-[3.875rem] sticky top-0 bg-gray-800 shadow-lg p-2 flex items-center justify-between"
    >
      <LinkTo
        class="font-mono italic text-white text-lg"
        @route="application"
        {{on "click" @controller.user.wipe}}
      >
        {{t "project_name"}}
      </LinkTo>
      {{#if @controller.user.selectedUser}}
        <div class="hidden md:flex items-center justify-between">
          <img
            class="avatar rounded"
            src={{@controller.user.selectedUser.avatar.large}}
            alt={{@controller.user.selectedUser.name}}
          />
          <a
            class="text-main-500 ml-2"
            href={{@controller.user.url}}
            target="_blank"
            rel="noopener noreferrer"
          >
            {{@controller.user.selectedUser.name}}
          </a>
        </div>
      {{/if}}
      <section class="hidden md:flex flex-nowrap items-center h-full">
        <div class="relative w-64">
          <PowerSelect
            @search={{@controller.user.searchUsers.perform}}
            @searchEnabled={{true}}
            @selected={{@controller.user.selectedUser}}
            @onChange={{@controller.user.updateUser}}
            @placeholder={{t "navigation-bar.username"}}
            as |user|
          >
            <span class="w-10 flex items-center justify-center">
              <img
                class="avatar-small rounded-lg"
                src={{user.avatar.medium}}
                alt=""
              />
            </span>
            {{user.name}}
          </PowerSelect>
          <FaIcon
            class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400/65"
            @icon={{faMagnifyingGlass}}
            @fixedWidth={{true}}
          />
        </div>
      </section>
      <div class="md:hidden text-white/80">
        <Button {{on "click" (fn (mut @controller.mobileMenuOpen) true)}}>
          <FaIcon @icon={{faBars}} @fixedWidth={{true}} />
        </Button>
        {{#if @controller.mobileMenuOpen}}
          <div class="absolute top-0 right-0 w-[85%] h-full bg-gray-900 z-10">
            <div class="flex justify-between p-4">
              {{#if @controller.user.selectedUser}}
                <div class="hidden md:flex items-center justify-between">
                  <img
                    class="avatar rounded"
                    src={{@controller.user.selectedUser.avatar.large}}
                    alt={{@controller.user.selectedUser.name}}
                  />
                  <a
                    class="text-main-500 ml-2"
                    href={{@controller.user.url}}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{@controller.user.selectedUser.name}}
                  </a>
                </div>
              {{/if}}
              <Button
                class="self-start"
                {{on "click" (fn (mut @controller.mobileMenuOpen) false)}}
              >
                <FaIcon @icon={{faXmark}} @fixedWidth={{true}} />
              </Button>
            </div>
            <section class="flex flex-nowrap items-center w-full p-4">
              <div class="relative flex-grow">
                <label class="sr-only" for="user-search-2">
                  {{t "navigation-bar.username"}}
                </label>
                <PowerSelect
                  @triggerId="user-search-2"
                  @search={{@controller.user.searchUsers.perform}}
                  @searchEnabled={{true}}
                  @selected={{@controller.user.selectedUser}}
                  @onChange={{@controller.user.updateUser}}
                  @placeholder={{t "navigation-bar.username"}}
                  @matchTriggerWidth={{false}}
                  as |user|
                >
                  <span class="w-10 flex items-center justify-center">
                    <img
                      class="avatar-small rounded-lg"
                      src={{user.avatar.medium}}
                      alt=""
                    />
                  </span>
                  {{user.name}}
                </PowerSelect>
                <FaIcon
                  class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400/65"
                  @icon={{faMagnifyingGlass}}
                  @fixedWidth={{true}}
                />
              </div>
            </section>
          </div>
        {{/if}}
      </div>
    </nav>

    <div class="h-[calc(100dvh_-_3.875rem_+_1px)]">
      {{outlet}}
    </div>
  </div>

  <BasicDropdownWormhole />
</template>
