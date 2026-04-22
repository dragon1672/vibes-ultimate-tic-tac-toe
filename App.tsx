
import React, { useState, useEffect, useCallback } from 'react';
import { MacroBoard } from './components/MacroBoard';
import { GameControls } from './components/GameControls';
import { StatusDisplay } from './components/StatusDisplay';
import { StrategyView } from './components/StrategyView';
import type { Player, BoardState, AIDifficulty, GameStatus } from './types';
import { checkWinner } from './utils/gameLogic';
import { getAIMove } from './services/aiService';

const App: React.FC = () => {
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
    const [mainBoardState, setMainBoardState] = useState<BoardState>(Array(9).fill(''));
    const [microBoardStates, setMicroBoardStates] = useState<BoardState[]>(Array(9).fill(null).map(() => Array(9).fill('')));
    const [activeMacroBoardIndex, setActiveMacroBoardIndex] = useState<number | null>(null);
    const [gameStatus, setGameStatus] = useState<GameStatus>('InProgress');
    const [playerXController, setPlayerXController] = useState<AIDifficulty>('human');
    const [playerOController, setPlayerOController] = useState<AIDifficulty>('easy');
    const [aiPlaySpeed, setAiPlaySpeed] = useState(500);
    const [showStrategyView, setShowStrategyView] = useState(false);

    const initializeGame = useCallback(() => {
        setCurrentPlayer('X');
        setMainBoardState(Array(9).fill(''));
        setMicroBoardStates(Array(9).fill(null).map(() => Array(9).fill('')));
        setActiveMacroBoardIndex(null);
        setGameStatus('InProgress');
    }, []);

    const handleCellClick = (macroIndex: number, microIndex: number) => {
        if (gameStatus !== 'InProgress' || mainBoardState[macroIndex] !== '' || microBoardStates[macroIndex][microIndex] !== '' || (activeMacroBoardIndex !== null && activeMacroBoardIndex !== macroIndex)) {
            return;
        }

        const currentPlayerIsHuman = (currentPlayer === 'X' && playerXController === 'human') || (currentPlayer === 'O' && playerOController === 'human');
        if (!currentPlayerIsHuman) return;

        makeMove(macroIndex, microIndex, currentPlayer);
    };

    const makeMove = (macroIndex: number, microIndex: number, player: Player) => {
        const newMicroBoardStates = microBoardStates.map(board => [...board]);
        newMicroBoardStates[macroIndex][microIndex] = player;
        setMicroBoardStates(newMicroBoardStates);

        const newMainBoardState = [...mainBoardState];
        const microBoardWon = checkWinner(newMicroBoardStates[macroIndex], player);
        const microBoardDraw = !newMicroBoardStates[macroIndex].includes('');

        if (microBoardWon) {
            newMainBoardState[macroIndex] = player;
        } else if (microBoardDraw) {
            newMainBoardState[macroIndex] = 'D';
        }
        setMainBoardState(newMainBoardState);

        if (microBoardWon) {
            const gameWon = checkWinner(newMainBoardState, player);
            if (gameWon) {
                setGameStatus(player === 'X' ? 'X_WINS' : 'O_WINS');
                return;
            }
        }
        
        if (!newMainBoardState.includes('')) {
            const mainBoardWinner = checkWinner(newMainBoardState, 'X') ? 'X' : checkWinner(newMainBoardState, 'O') ? 'O' : null;
            if (!mainBoardWinner) {
                setGameStatus('DRAW');
                return;
            }
        }

        setActiveMacroBoardIndex(newMainBoardState[microIndex] === '' ? microIndex : null);
        setCurrentPlayer(player === 'X' ? 'O' : 'X');
    };
    
    useEffect(() => {
        if (gameStatus !== 'InProgress') return;
        
        const currentPlayerController = currentPlayer === 'X' ? playerXController : playerOController;

        if (currentPlayerController !== 'human') {
            const timer = setTimeout(() => {
                const move = getAIMove(currentPlayerController, mainBoardState, microBoardStates, activeMacroBoardIndex, currentPlayer);
                if (move) {
                    makeMove(move.macroIndex, move.microIndex, currentPlayer);
                }
            }, aiPlaySpeed);
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPlayer, gameStatus, mainBoardState, microBoardStates, activeMacroBoardIndex, playerXController, playerOController, aiPlaySpeed]);
    
    useEffect(() => {
        initializeGame();
    }, [playerXController, playerOController, initializeGame]);

    if (showStrategyView) {
        return <StrategyView onBack={() => setShowStrategyView(false)} />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Ultimate Tic Tac Toe</h1>
                    <GameControls 
                        playerXController={playerXController}
                        playerOController={playerOController}
                        onPlayerXChange={(e) => setPlayerXController(e.target.value as AIDifficulty)}
                        onPlayerOChange={(e) => setPlayerOController(e.target.value as AIDifficulty)}
                        aiPlaySpeed={aiPlaySpeed}
                        onSpeedChange={(e) => setAiPlaySpeed(Number(e.target.value))}
                        onNewGame={initializeGame}
                        onShowStrategy={() => setShowStrategyView(true)}
                    />
                    <StatusDisplay 
                        status={gameStatus}
                        currentPlayer={currentPlayer}
                        activeMacroBoardIndex={activeMacroBoardIndex}
                        playerXController={playerXController}
                        playerOController={playerOController}
                    />
                    <MacroBoard
                        mainBoardState={mainBoardState}
                        microBoardStates={microBoardStates}
                        activeMacroBoardIndex={activeMacroBoardIndex}
                        gameStatus={gameStatus}
                        onCellClick={handleCellClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
