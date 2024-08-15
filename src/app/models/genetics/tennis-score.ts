export interface TennisScore {
  scores: {
    games: string[];
    currentScore: string;
  }[];
  sets: number;
}
