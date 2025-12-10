
import React from 'react';

const PlaceholderGame: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-slate-700/50 rounded-lg">
            <h2 className="text-2xl font-bold text-slate-300">Em Breve!</h2>
            <p className="mt-2 text-slate-400">Este jogo está em desenvolvimento. Volte mais tarde!</p>
            <div className="mt-4 text-4xl animate-bounce">🚀</div>
        </div>
    );
};

export default PlaceholderGame;
