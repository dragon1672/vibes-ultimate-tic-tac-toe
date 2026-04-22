import React from 'react';

interface StrategyViewProps {
    onBack: () => void;
}

export const StrategyView: React.FC<StrategyViewProps> = ({ onBack }) => {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">AI Strategies</h1>
                    
                    <div className="space-y-6 text-gray-700">
                        <div>
                            <h2 className="text-2xl font-semibold text-green-600">Easy AI: The Random Player</h2>
                            <p className="mt-2">The Easy AI doesn't have a strategy. It simply looks at all the legally available moves on the board and picks one completely at random. It's like playing against someone who is just pointing at the board with their eyes closed.</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><strong>Goal:</strong> None.</li>
                                <li><strong>Strength:</strong> Unpredictable.</li>
                                <li><strong>Weakness:</strong> Makes strategically poor moves and won't block you from winning.</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-semibold text-yellow-600">Medium AI: The Reactive Defender</h2>
                            <p className="mt-2">The Medium AI is much smarter. It looks for critical moves in a specific order of priority:</p>
                            <ol className="list-decimal list-inside mt-2 space-y-1">
                                <li><strong>Win Now:</strong> If it can make a move to win a small board, it will take it immediately.</li>
                                <li><strong>Block Player Win:</strong> If it can't win, it checks if you are about to win a small board on your next turn. If so, it will block you.</li>
                                <li><strong>Random Move:</strong> If neither of the above conditions is met, it will make a random move, just like the Easy AI.</li>
                            </ol>
                            <p className="mt-2">This AI plays defensively and opportunistically, but doesn't think more than one step ahead.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-red-600">Hard AI: The Strategic Thinker</h2>
                            <p className="mt-2">The Hard AI uses a scoring system (a simple heuristic) to evaluate every possible move. It tries to find the move that gives it the best long-term advantage. It prioritizes moves based on this hierarchy:</p>
                            <ol className="list-decimal list-inside mt-2 space-y-1">
                                <li><strong>Win the Whole Game:</strong> Highest priority. If a move wins the entire game, it takes it.</li>
                                <li><strong>Block Player from Winning the Whole Game:</strong> Equally high priority.</li>
                                <li><strong>Win a Small Board:</strong> Very valuable.</li>
                                <li><strong>Block Player from Winning a Small Board:</strong> Also very valuable.</li>
                                <li><strong>Center Control:</strong> It slightly prefers taking the center cells on any board, as they are strategically more powerful.</li>
                            </ol>
                            <p className="mt-2">It calculates a score for every legal move and picks the one with the highest score, making it a much more formidable opponent.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-purple-600">Expert AI: The Grandmaster</h2>
                            <p className="mt-2">The Expert AI uses a sophisticated game theory algorithm called <strong>Minimax with Alpha-Beta Pruning</strong>. This allows it to "see" several moves into the future for both itself and its opponent.</p>
                            <ol className="list-decimal list-inside mt-2 space-y-1">
                                <li><strong>Future Sight:</strong> It constructs a tree of all possible future game states up to a certain depth (number of moves).</li>
                                <li><strong>Position Evaluation:</strong> It evaluates the "goodness" of each of these future states using a complex heuristic function, similar to how a chess engine works.</li>
                                <li><strong>Optimal Path:</strong> It traces back from the best possible future outcome to find the single best move to make right now. It assumes you will also play optimally.</li>
                            </ol>
                            <p className="mt-2">This AI is designed to be extremely difficult to beat, as it's always thinking multiple steps ahead and planning for every counter-move you could make.</p>
                        </div>
                    </div>
                    
                    <button onClick={onBack} className="mt-8 w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                        Back to Game
                    </button>
                </div>
            </div>
        </div>
    );
};
