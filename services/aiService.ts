
import type { AIDifficulty, BoardState, Move, Player } from '../types';
import { checkWinner, WINNING_CONDITIONS } from '../utils/gameLogic';

const getLegalMoves = (mainBoardState: BoardState, microBoardStates: BoardState[], activeMacroBoardIndex: number | null): Move[] => {
    const moves: Move[] = [];
    const targetBoards = activeMacroBoardIndex !== null ? [activeMacroBoardIndex] : [0, 1, 2, 3, 4, 5, 6, 7, 8];

    for (const macro of targetBoards) {
        if (mainBoardState[macro] === '') {
            for (let micro = 0; micro < 9; micro++) {
                if (microBoardStates[macro][micro] === '') {
                    moves.push({ macroIndex: macro, microIndex: micro });
                }
            }
        }
    }

    if (moves.length === 0 && activeMacroBoardIndex !== null) {
        return getLegalMoves(mainBoardState, microBoardStates, null);
    }
    return moves;
};

const getEasyMove = (legalMoves: Move[]): Move | null => {
    if (legalMoves.length === 0) return null;
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
};

const isWinningMove = (move: Move, player: Player, microBoardStates: BoardState[]): boolean => {
    const { macroIndex, microIndex } = move;
    const tempBoard = [...microBoardStates[macroIndex]];
    tempBoard[microIndex] = player;
    return checkWinner(tempBoard, player);
};

const getMediumMove = (legalMoves: Move[], microBoardStates: BoardState[], player: Player): Move | null => {
    if (legalMoves.length === 0) return null;
    const opponent: Player = player === 'X' ? 'O' : 'X';

    // 1. Check for a winning move for AI (player)
    for (const move of legalMoves) {
        if (isWinningMove(move, player, microBoardStates)) return move;
    }
    // 2. Check to block opponent's winning move
    for (const move of legalMoves) {
        if (isWinningMove(move, opponent, microBoardStates)) return move;
    }
    // 3. Otherwise, random move
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
};


const scoreMove = (move: Move, mainBoardState: BoardState, microBoardStates: BoardState[], player: Player): number => {
    const { macroIndex, microIndex } = move;
    const opponent: Player = player === 'X' ? 'O' : 'X';
    let score = 0;

    // Simulate move for AI (player)
    const tempMicroPlayer = [...microBoardStates[macroIndex]];
    tempMicroPlayer[microIndex] = player;
    if (checkWinner(tempMicroPlayer, player)) {
        const tempMacroPlayer = [...mainBoardState];
        tempMacroPlayer[macroIndex] = player;
        if (checkWinner(tempMacroPlayer, player)) return 10000; // Win the whole game
        score += 200; // Win a board
    }

    // Simulate move for Opponent to block
    const tempMicroOpponent = [...microBoardStates[macroIndex]];
    tempMicroOpponent[microIndex] = opponent;
    if (checkWinner(tempMicroOpponent, opponent)) {
        const tempMacroOpponent = [...mainBoardState];
        tempMacroOpponent[macroIndex] = opponent;
        if (checkWinner(tempMacroOpponent, opponent)) return 5000; // Block opponent from winning game
        score += 100; // Block opponent from winning a board
    }

    // Center preference
    if (microIndex === 4) score += 5;
    if (macroIndex === 4) score += 10;
    
    // Add small random factor to break ties
    score += Math.random() * 3;

    return score;
};


const getHardMove = (legalMoves: Move[], mainBoardState: BoardState, microBoardStates: BoardState[], player: Player): Move | null => {
    if (legalMoves.length === 0) return null;

    let bestScore = -Infinity;
    let bestMove: Move | null = legalMoves[0] || null;

    for (const move of legalMoves) {
        const score = scoreMove(move, mainBoardState, microBoardStates, player);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
};

// --- Expert AI (Minimax) Implementation ---

const simulateMove = (
    mainBoardState: BoardState,
    microBoardStates: BoardState[],
    move: Move,
    player: Player
): { newMainBoardState: BoardState; newMicroBoardStates: BoardState[]; newActiveMacroBoardIndex: number | null } => {
    const { macroIndex, microIndex } = move;

    const newMicroBoardStates = microBoardStates.map(board => [...board]);
    newMicroBoardStates[macroIndex][microIndex] = player;

    const newMainBoardState = [...mainBoardState];
    if (newMainBoardState[macroIndex] === '') {
        const microBoardWon = checkWinner(newMicroBoardStates[macroIndex], player);
        const microBoardDraw = !newMicroBoardStates[macroIndex].includes('');
        if (microBoardWon) {
            newMainBoardState[macroIndex] = player;
        } else if (microBoardDraw) {
            newMainBoardState[macroIndex] = 'D';
        }
    }
    
    const newActiveMacroBoardIndex = newMainBoardState[microIndex] === '' ? microIndex : null;
    return { newMainBoardState, newMicroBoardStates, newActiveMacroBoardIndex };
};

// Evaluates the board from the perspective of 'O' (positive) vs 'X' (negative)
const evaluateGameState = (mainBoardState: BoardState, microBoardStates: BoardState[]): number => {
    if (checkWinner(mainBoardState, 'O')) return 100000;
    if (checkWinner(mainBoardState, 'X')) return -100000;

    let score = 0;
    const twoInARowWeight = 100;
    const oneInARowWeight = 10;
    const microBoardWinWeight = 200;

    for (const condition of WINNING_CONDITIONS) {
        const line = condition.map(i => mainBoardState[i]);
        const oCount = line.filter(c => c === 'O').length;
        const xCount = line.filter(c => c === 'X').length;

        if (oCount > 0 && xCount === 0) {
            score += oCount === 2 ? twoInARowWeight : oneInARowWeight;
        } else if (xCount > 0 && oCount === 0) {
            score -= xCount === 2 ? twoInARowWeight : oneInARowWeight;
        }
    }

    for (let i = 0; i < 9; i++) {
        if (mainBoardState[i] === 'O') {
            score += microBoardWinWeight;
        } else if (mainBoardState[i] === 'X') {
            score -= microBoardWinWeight;
        } else if (mainBoardState[i] === '') {
            for (const condition of WINNING_CONDITIONS) {
                const line = condition.map(j => microBoardStates[i][j]);
                const oCount = line.filter(c => c === 'O').length;
                const xCount = line.filter(c => c === 'X').length;
                if (oCount > 0 && xCount === 0) score += oCount;
                else if (xCount > 0 && oCount === 0) score -= xCount;
            }
        }
    }
    return score;
};

const minimax = (
    mainBoardState: BoardState,
    microBoardStates: BoardState[],
    activeMacroBoardIndex: number | null,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean
): number => {
    const gameWinner = checkWinner(mainBoardState, 'O') ? 'O' : checkWinner(mainBoardState, 'X') ? 'X' : null;
    if (gameWinner || depth === 0) {
        return evaluateGameState(mainBoardState, microBoardStates);
    }

    const legalMoves = getLegalMoves(mainBoardState, microBoardStates, activeMacroBoardIndex);
    if (legalMoves.length === 0) {
        return evaluateGameState(mainBoardState, microBoardStates);
    }

    if (isMaximizingPlayer) { // AI 'O' is maximizing
        let maxEval = -Infinity;
        for (const move of legalMoves) {
            const { newMainBoardState, newMicroBoardStates, newActiveMacroBoardIndex } = simulateMove(mainBoardState, microBoardStates, move, 'O');
            const evaluation = minimax(newMainBoardState, newMicroBoardStates, newActiveMacroBoardIndex, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else { // Player 'X' is minimizing
        let minEval = Infinity;
        for (const move of legalMoves) {
            const { newMainBoardState, newMicroBoardStates, newActiveMacroBoardIndex } = simulateMove(mainBoardState, microBoardStates, move, 'X');
            const evaluation = minimax(newMainBoardState, newMicroBoardStates, newActiveMacroBoardIndex, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

const getExpertMove = (mainBoardState: BoardState, microBoardStates: BoardState[], activeMacroBoardIndex: number | null, player: Player): Move | null => {
    const legalMoves = getLegalMoves(mainBoardState, microBoardStates, activeMacroBoardIndex);
    if (legalMoves.length === 0) return null;

    let bestMove: Move | null = legalMoves[0] || null;
    const searchDepth = 3; // Adjust for performance vs. strength

    if (player === 'O') { // 'O' is the maximizing player
        let bestScore = -Infinity;
        for (const move of legalMoves) {
            const { newMainBoardState, newMicroBoardStates, newActiveMacroBoardIndex } = simulateMove(mainBoardState, microBoardStates, move, 'O');
            const score = minimax(newMainBoardState, newMicroBoardStates, newActiveMacroBoardIndex, searchDepth, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
    } else { // 'X' is the minimizing player
        let bestScore = Infinity;
        for (const move of legalMoves) {
            const { newMainBoardState, newMicroBoardStates, newActiveMacroBoardIndex } = simulateMove(mainBoardState, microBoardStates, move, 'X');
            const score = minimax(newMainBoardState, newMicroBoardStates, newActiveMacroBoardIndex, searchDepth, -Infinity, Infinity, true);
            if (score < bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
    }
    return bestMove;
};

// --- End Expert AI ---


export const getAIMove = (
    difficulty: AIDifficulty,
    mainBoardState: BoardState,
    microBoardStates: BoardState[],
    activeMacroBoardIndex: number | null,
    player: Player
): Move | null => {
    const legalMoves = getLegalMoves(mainBoardState, microBoardStates, activeMacroBoardIndex);
    if (legalMoves.length === 0) return null;

    switch (difficulty) {
        case 'easy':
            return getEasyMove(legalMoves);
        case 'medium':
            return getMediumMove(legalMoves, microBoardStates, player);
        case 'hard':
            return getHardMove(legalMoves, mainBoardState, microBoardStates, player);
        case 'expert':
            return getExpertMove(mainBoardState, microBoardStates, activeMacroBoardIndex, player);
        default:
            return null;
    }
};
