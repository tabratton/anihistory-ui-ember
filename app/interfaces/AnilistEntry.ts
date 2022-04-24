export interface AnilistEntry {
  completedAt: {
    year: number;
    month: number;
    day: number;
  };
  scoreRaw: number;
  startedAt: {
    year: number;
    month: number;
    day: number;
  };
  media: {
    id: number;
    averageScore: number;
    coverImage: {
      large: string;
    };
    description: string;
    siteUrl: string;
    title: {
      userPreferred: string;
      english: string;
      romaji: string;
      native: string;
    };
  };
}
