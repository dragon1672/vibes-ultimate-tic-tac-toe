
import React from 'react';
import { MicroCell } from './MicroCell';
import type { BoardState, CellState } from '../types';

interface MicroBoardProps {
    macroIndex: number;
    winner: CellState;
    boardState: BoardState;
    isActive: boolean;
    isPlayable: boolean;
    onCellClick: (macroIndex: number, microIndex: number) => void;
}

export const MicroBoard: React.FC<MicroBoardProps> = ({ macroIndex, winner, boardState, isActive, isPlayable, onCellClick }) => {
    const boardClasses = `
        aspect-square rounded-lg transition-all duration-300
        ${isActive && isPlayable ? 'bg-green-200 ring-4 ring-green-400 shadow-lg' : 'bg-gray-300'}
    `;

    if (winner) {
        const winnerColor = winner === 'X' ? 'text-blue-500' : winner === 'O' ? 'text-pink-500' : 'text-gray-500';
        return (
            <div className={`${boardClasses} flex items-center justify-center bg-gray-200`}>
                <span className={`text-[clamp(3rem,20vw,8rem)] font-bold leading-none ${winnerColor}`}>
                    {winner === 'D' ? '-' : winner}
                </span>
            </div>
        );
    }

    return (
        <div className={boardClasses}>
            <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full p-1">
                {boardState.map((cell, i) => (
                    <MicroCell
                        key={i}
                        value={cell}
                        onClick={() => onCellClick(macroIndex, i)}
                        isPlayable={isPlayable}
                    />
                ))}
            </div>
        </div>
    );
};
