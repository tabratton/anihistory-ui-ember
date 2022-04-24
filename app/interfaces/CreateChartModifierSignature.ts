import type { AnihistoryEntry } from 'anihistory-ui-ember/interfaces/AnihistoryEntry';

export interface CreateChartModifierSignature {
  Args: {
    positional: [];
    Named: {
      list: Array<AnihistoryEntry>;
      lang: string;
    };
  };
  Element: Element;
}
