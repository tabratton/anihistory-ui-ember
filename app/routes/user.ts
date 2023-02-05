import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import {
  addDays,
  addHours,
  areIntervalsOverlapping,
  compareAsc,
  isBefore,
  isSameHour,
  isSameDay,
  formatISO,
  parseISO,
  startOfDay,
} from 'date-fns';
import type IntlService from 'ember-intl/services/intl';
import fetch from 'fetch';

import type { AnihistoryEntry } from 'anihistory-ui-ember/interfaces/AnihistoryEntry';
import type { AnilistList } from 'anihistory-ui-ember/interfaces/AnilistList';
import type { AnilistEntry } from 'anihistory-ui-ember/interfaces/AnilistEntry';
import type UserService from 'anihistory-ui-ember/services/user';
import type { UserResponse } from 'anihistory-ui-ember/services/user';

interface UserParams {
  username: string;
}

interface SimpleError {
  type: 'NotFound' | 'Unavail' | 'DateRange' | null;
  messages: Array<string>;
}

export type UserRouteModel = {
  userData: {
    username: string;
    list: Array<AnihistoryEntry>;
  };
  error: SimpleError;
};

export default class UserRoute extends Route {
  @service declare intl: IntlService;
  @service declare user: UserService;

  @action
  handleError(response: Response, error: SimpleError) {
    if (!error.type) {
      error.type = response.status === 404 ? 'NotFound' : 'Unavail';
      error.messages.push(
        response.status === 404
          ? this.intl.t('messages.not_found')
          : this.intl.t('messages.unavail')
      );
    }
  }

  async getListInfo(id: Number, error: SimpleError) {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'post',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `query=query { MediaListCollection(userId: ${id}, type: ANIME) { lists { name entries { ...mediaListEntry } } } } fragment mediaListEntry on MediaList { scoreRaw: score(format: POINT_100) startedAt { year month day } completedAt { year month day } media { id title { userPreferred english romaji native } description(asHtml: true) coverImage { large } averageScore siteUrl } }`,
    });
    if (response.status !== 200) {
      this.handleError(response, error);
      return;
    }
    const data = await response.json();
    const {
      data: {
        MediaListCollection: { lists },
      },
    } = data;
    return [
      ...lists.find((e: AnilistList) => e.name === 'Completed').entries,
      ...lists.find((e_1: AnilistList) => e_1.name === 'Watching').entries,
    ];
  }

  createGroupCategories(list: Array<AnihistoryEntry>) {
    const rows: Array<Array<AnihistoryEntry>> = [[]];
    let currentRowIndex = 0;

    list.forEach((listElement) => {
      // Check each row for each list element to make sure all possible gaps are filled
      while (!listElement.category) {
        const row = rows[currentRowIndex];

        // If there's no other elements there can't be date range conflicts
        if (row?.length === 0) {
          listElement.category = `${currentRowIndex + 1}`;
          row.push(listElement);
          currentRowIndex = 0;
          return;
        }

        // Find out if there are any elements that have date range conflicts in this row
        const conflictInRow = row
          ?.map((rowElement) =>
            areIntervalsOverlapping(
              { start: rowElement.startDay, end: rowElement.endDay },
              { start: listElement.startDay, end: listElement.endDay }
            )
          )
          ?.reduce((a, b) => a || b);

        // If no conflicts, add the current element to the row,
        // otherwise add a new row if this is the last row
        if (!conflictInRow) {
          listElement.category = `${currentRowIndex + 1}`;
          row?.push(listElement);
          currentRowIndex = 0;
        } else {
          if (!rows[currentRowIndex + 1]) {
            rows.push([]);
          }

          currentRowIndex++;
        }
      }
    });

    return rows;
  }

  async model(params: UserParams) {
    const username = params.username;

    const error: SimpleError = {
      type: null,
      messages: [],
    };

    const user = await this.user.getUserInfo(username, error, this.handleError);

    if (!user) return;

    this.user.update(user);

    const list = await this.getListInfo(user.id, error);

    const dateRangeErrors: Array<string> = [];

    const mappedList = list?.map((e: AnilistEntry) => {
      const mapped = {
        average: e.media.averageScore / 10,
        cover: e.media.coverImage.large,
        description: e.media.description,
        end_day: e.completedAt.year
          ? parseISO(
              `${e.completedAt.year}-${String(e.completedAt.month).padStart(
                2,
                '0'
              )}-${String(e.completedAt.day).padStart(2, '0')}`
            )
          : null,
        english: e.media.title.english,
        id: e.media.id,
        native: e.media.title.native,
        romaji: e.media.title.romaji,
        score: e.scoreRaw / 10,
        start_day: e.startedAt.year
          ? parseISO(
              `${e.startedAt.year}-${String(e.startedAt.month).padStart(
                2,
                '0'
              )}-${String(e.startedAt.day).padStart(2, '0')}`
            )
          : null,
        user_title: e.media.title.userPreferred,
      };

      let realStartDay;
      if (mapped.start_day) {
        realStartDay = mapped.start_day;
      } else if (mapped.end_day) {
        realStartDay = mapped.end_day;
      } else {
        realStartDay = new Date();
      }

      realStartDay = addHours(startOfDay(realStartDay), 12);

      const realEndDay = startOfDay(
        mapped.end_day ? mapped.end_day : new Date()
      );
      const chartEndDay = addHours(addDays(realEndDay, 1), 12);

      if (
        isBefore(chartEndDay, realStartDay) ||
        (isSameDay(chartEndDay, realStartDay) &&
          isSameHour(chartEndDay, realStartDay))
      ) {
        error.type = 'DateRange';
        dateRangeErrors.push(
          this.intl.t('messages.invalid_date', {
            start: formatISO(realStartDay, { representation: 'date' }),
            end: formatISO(realEndDay, { representation: 'date' }),
            name: mapped.user_title,
          })
        );
      }

      return {
        english: mapped.english || mapped.user_title,
        romaji: mapped.romaji || mapped.user_title,
        native: mapped.native || mapped.user_title,
        user: mapped.user_title,
        average: mapped.average,
        cover: mapped.cover,
        description: mapped.description,
        id: mapped.id,
        score: mapped.score,
        startDay: realStartDay,
        endDay: chartEndDay,
        displayEndDay: realEndDay,
        category: '',
      };
    });

    if (dateRangeErrors.length > 0) {
      if (error.type === 'DateRange') {
        error.messages.push(...dateRangeErrors);
        error.messages.unshift(this.intl.t('messages.date_range'));
      }
    } else if (mappedList) {
      this.createGroupCategories(
        mappedList.sort((a, b) => compareAsc(a.startDay, b.startDay))
      );
    }

    return {
      userData: {
        username,
        list: mappedList,
      },
      error,
    };
  }
}
