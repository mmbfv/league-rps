export enum MoveType {
  ROCK = 'ROCK',
  PAPER = 'PAPER',
  SCISSORS = 'SCISSORS'
}

export enum GameResult {
  VICTORY = 'VICTORY',
  DEFEAT = 'DEFEAT',
  DRAW = 'DRAW'
}

export interface Champion {
  id: MoveType;
  name: string;
  title: string;
  description: string;
  color: string;
  imageUrl: string; // Using placeholder or gradient logic
  borderColor: string;
}

export interface GameState {
  playerScore: number;
  cpuScore: number;
  matches: number;
}