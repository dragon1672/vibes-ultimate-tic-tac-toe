export type Player = 'X' | 'O';
export type CellState = Player | 'D' | '';
export type BoardState = CellState[];

export type AIDifficulty = 'human' | 'easy' | 'medium' | 'hard' | 'expert';
export type GameStatus = 'InProgress' | 'X_WINS' | 'O_WINS' | 'DRAW';

export interface Move {
    macroIndex: number;
    microIndex: number;
}
