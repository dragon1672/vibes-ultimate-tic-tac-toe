
import React from 'react';
import type { AIDifficulty } from '../types';

interface GameControlsProps {
    playerXController: AIDifficulty;
    playerOController: AIDifficulty;
    onPlayerXChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onPlayerOChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    aiPlaySpeed: number;
    onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNewGame: () => void;
    onShowStrategy: () => void;
}

const AIDropdownOptions = () => (
    <>
        <option value="human">Human</option>
        <option value="easy">Easy AI</option>
        <option value="medium">Medium AI</option>
        <option value="hard">Hard AI</option>
        <option value="expert">Expert AI</option>
    </>
);

export const GameControls: React.FC<GameControlsProps> = ({ 
    playerXController,
    playerOController,
    onPlayerXChange,
    onPlayerOChange,
    aiPlaySpeed,
    onSpeedChange,
    onNewGame,
    onShowStrategy
}) => {
    const isAiVsAi = playerXController !== 'human' && playerOController !== 'human';

    return (
        <>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="playerX" className="block text-sm font-medium text-gray-700">Player X</label>
                    <select 
                        id="playerX" 
                        value={playerXController} 
                        onChange={onPlayerXChange} 
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <AIDropdownOptions />
                    </select>
                </div>
                <div>
                    <label htmlFor="playerO" className="block text-sm font-medium text-gray-700">Player O</label>
                    <select 
                        id="playerO" 
                        value={playerOController} 
                        onChange={onPlayerOChange} 
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <AIDropdownOptions />
                    </select>
                </div>
            </div>
            {isAiVsAi && (
                 <div className="mb-4">
                    <label htmlFor="aiSpeed" className="block text-sm font-medium text-gray-700">AI vs AI Speed: {aiPlaySpeed}ms</label>
                    <input
                        type="range"
                        id="aiSpeed"
                        min="100"
                        max="2000"
                        step="100"
                        value={aiPlaySpeed}
                        onChange={onSpeedChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
            )}
             <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                <button 
                    onClick={onNewGame} 
                    className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                    New Game
                </button>
                <button 
                    onClick={onShowStrategy} 
                    className="w-full bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                    AI Strategies
                </button>
            </div>
        </>
    );
};
