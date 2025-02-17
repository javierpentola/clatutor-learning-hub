
export interface QAPair {
  id: string;
  question: string;
  answer: string;
}

export interface MatchState {
  selected: string | null;
  matched: Set<string>;
  score: number;
}
