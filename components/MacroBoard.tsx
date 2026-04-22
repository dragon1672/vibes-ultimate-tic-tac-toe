
import React from 'react';
import { MicroBoard } from './MicroBoard';
import type { BoardState, GameStatus } from '../types';

interface MacroBoardProps {
    mainBoardState: BoardState;
    microBoardStates: BoardState[];
    activeMacroBoardIndex: number | null;
    gameStatus: GameStatus;
    onCellClick: (macroIndex: number, microIndex: number) => void;
}

export const MacroBoard: React.FC<MacroBoardProps> = ({ mainBoardState, microBoardStates, activeMacroBoardIndex, gameStatus, onCellClick }) => {
    return (
        <div className="grid grid-cols-3 gap-2 p-2 bg-gray-800 border-4 border-gray-800 rounded-xl">
            {mainBoardState.map((winner, i) => (
                <MicroBoard
                    key={i}
                    macroIndex={i}
                    winner={winner}
                    boardState={microBoardStates[i]}
                    isActive={gameStatus === 'InProgress' && (activeMacroBoardIndex === i || activeMacroBoardIndex === null)}
                    isPlayable={gameStatus === 'InProgress' && winner === ''}
                    onCellClick={onCellClick}
                />
            ))}
        </div>
    );
};
