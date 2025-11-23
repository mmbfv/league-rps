import { Champion, MoveType } from './types';

export const CHAMPIONS: Record<MoveType, Champion> = {
  [MoveType.ROCK]: {
    id: MoveType.ROCK,
    name: 'Malphite',
    title: 'Shard of the Monolith',
    description: 'Unstoppable force. Crushes Scissors.',
    color: 'bg-slate-700',
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Malphite_0.jpg',
    borderColor: 'border-slate-500',
  },
  [MoveType.PAPER]: {
    id: MoveType.PAPER,
    name: 'Twisted Fate',
    title: 'The Card Master',
    description: 'It’s all in the cards. Covers Rock.',
    color: 'bg-amber-600',
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/TwistedFate_0.jpg',
    borderColor: 'border-amber-400',
  },
  [MoveType.SCISSORS]: {
    id: MoveType.SCISSORS,
    name: 'Gwen',
    title: 'The Hallowed Seamstress',
    description: 'Snip snip! Cuts Paper.',
    color: 'bg-cyan-500',
    imageUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Gwen_0.jpg',
    borderColor: 'border-cyan-300',
  }
};

export const WINNING_MOVES: Record<MoveType, MoveType> = {
  [MoveType.ROCK]: MoveType.SCISSORS,
  [MoveType.PAPER]: MoveType.ROCK,
  [MoveType.SCISSORS]: MoveType.PAPER
};

export const SOUND_EFFECTS = {
  SELECT: 'https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3',
  VICTORY: 'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3',
  DEFEAT: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-game-over-213.mp3',
  DRAW: 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-positive-notification-266.mp3',
  COMMENTARY: 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3',
};