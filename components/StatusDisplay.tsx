
import React from 'react';
import type { GameStatus, Player, AIDifficulty } from '../types';

interface StatusDisplayProps {
    status: GameStatus;
    currentPlayer: Player;
    activeMacroBoardIndex: number | null;
    playerXController: AIDifficulty;
    playerOController: AIDifficulty;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, currentPlayer, activeMacroBoardIndex, playerXController, playerOController }) => {
    const getStatusMessage = (): string => {
        const isXHuman = playerXController === 'human';
        const isOHuman = playerOController === 'human';
        const currentPlayerController = currentPlayer === 'X' ? playerXController : playerOController;
        
        switch (status) {
            case 'X_WINS':
                return isXHuman && !isOHuman ? 'You win!' : (isXHuman ? 'Player X wins!' : 'Player X (AI) wins!');
            case 'O_WINS':
                return isOHuman && !isXHuman ? 'You win!' : (isOHuman ? 'Player O wins!' : 'Player O (AI) wins!');
            case 'DRAW':
                return "It's a draw!";
            case 'InProgress':
                let message: string;
                if (currentPlayerController === 'human') {
                    if (isXHuman && isOHuman) {
                        message = `Player ${currentPlayer}'s turn. `;
                    } else {
                        message = "Your turn. ";
                    }
                } else {
                    message = `Player ${currentPlayer} (AI) is thinking...`;
                }


                if (currentPlayerController === 'human') {
                    if (activeMacroBoardIndex === null) {
                        message += "Play in any available board.";
                    } else {
                        const names = ["top-left", "top-center", "top-right", "middle-left", "center", "middle-right", "bottom-left", "bottom-center", "bottom-right"];
                        message += `Play in the ${names[activeMacroBoardIndex]} board.`;
                    }
                }
                return message;
            default:
                return '';
        }
    };
    
    const playerColor = currentPlayer === 'X' ? 'text-blue-500' : 'text-pink-500';
    const statusColor = status.includes('WINS') ? 'text-green-600' : status === 'DRAW' ? 'text-yellow-600' : 'text-gray-600';

    return (
        <p className={`text-xl font-semibold mb-6 h-14 md:h-7 flex items-center justify-center ${statusColor}`}>
             <span className={status === 'InProgress' ? playerColor : ''}>{getStatusMessage()}</span>
        </p>
    );
};
