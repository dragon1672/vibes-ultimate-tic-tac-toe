
import React from 'react';
import type { CellState } from '../types';

interface MicroCellProps {
    value: CellState;
    onClick: () => void;
    isPlayable: boolean;
}

export const MicroCell: React.FC<MicroCellProps> = ({ value, onClick, isPlayable }) => {
    const playerColor = value === 'X' ? 'text-blue-500' : 'text-pink-500';
    const cellClasses = `
        bg-gray-50 rounded transition-colors
        flex items-center justify-center
        text-[clamp(1rem,5vw,2.5rem)] font-bold
        ${isPlayable && !value ? 'cursor-pointer hover:bg-gray-200' : ''}
    `;

    return (
        <div className={cellClasses} onClick={onClick}>
            <span className={playerColor}>{value}</span>
        </div>
    );
};
