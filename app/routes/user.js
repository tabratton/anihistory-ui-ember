import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { DateTime, Interval } from 'luxon';

export default class UserRoute extends Route {
  @service intl;
  @service user;

  @action
  handleError(response, error) {
    if (!error.type) {
      error.type = response.status === 404 ? 'NotFound' : 'Unavail';
      error.messages.push(
        response.status === 404
          ? this.intl.t('messages.not_found')
          : this.intl.t('messages.unavail'),
      );
    }
  }

  async getListInfo(id, error) {
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
      ...lists.find((e) => e.name === 'Completed').entries,
      ...lists.find((e_1) => e_1.name === 'Watching').entries,
    ];
  }

  createGroupCategories(list) {
    const rows = [[]];
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

        // Find out if the last item in the row has a date range conflict
        const lastItem = row?.[row.length - 1];
        const conflictInRow = lastItem
          ? Interval.fromDateTimes(lastItem.startDay, lastItem.endDay).overlaps(
              Interval.fromDateTimes(listElement.startDay, listElement.endDay),
            )
          : true;

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

  async model(params) {
    const username = params.username;

    const error = {
      type: null,
      messages: [],
    };

    const user = await this.user.getUserInfo(username, error, this.handleError);

    if (!user) return;

    this.user.update(user);

    const list = await this.getListInfo(user.id, error);

    const dateRangeErrors = [];

    const mappedList = list?.map((e) => {
      const mapped = {
        average: e.media.averageScore / 10,
        cover: e.media.coverImage.large,
        description: e.media.description,
        end_day: e.completedAt.year
          ? DateTime.fromObject({
              year: e.completedAt.year,
              month: e.completedAt.month,
              day: e.completedAt.day,
            })
          : null,
        english: e.media.title.english,
        id: e.media.id,
        native: e.media.title.native,
        romaji: e.media.title.romaji,
        score: e.scoreRaw / 10,
        start_day: e.startedAt.year
          ? DateTime.fromObject({
              year: e.startedAt.year,
              month: e.startedAt.month,
              day: e.startedAt.day,
            })
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

      realStartDay = realStartDay.startOf('day').plus({ hours: 12 });

      const realEndDay = (mapped.end_day || DateTime.now()).startOf('day');
      const chartEndDay = realEndDay.plus({ days: 1, hours: 12 });

      if (
        chartEndDay - realStartDay < 0 ||
        (chartEndDay.hasSame(realStartDay, 'day') &&
          chartEndDay.hasSame(realStartDay, 'hour'))
      ) {
        error.type = 'DateRange';
        dateRangeErrors.push(
          this.intl.t('messages.invalid_date', {
            start: realStartDay.toLocaleString(),
            end: realEndDay.toLocaleString(),
            name: mapped.user_title,
          }),
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
        mappedList.sort((a, b) => a.startDay - b.startDay),
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
