
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const WORDS = ["GEMINI", "ARCADE", "JOGADOR", "DESAFIO", "VITORIA"];

const WordScramble = () => {
    const [word, setWord] = useState('');
    const [scrambledWord, setScrambledWord] = useState('');
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState('');
    const { updateStat } = useAchievements();

    const setupNewWord = () => {
        const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        setWord(newWord);
        setScrambledWord(newWord.split('').sort(() => 0.5 - Math.random()).join(''));
        setGuess('');
        setMessage('');
    };

    useEffect(setupNewWord, []);

    const handleGuess = (e) => {
        e.preventDefault();
        if (guess.toUpperCase() === word) {
            setMessage('Correto!');
            updateStat('totalWins', 1);
            updateStat('gamesPlayed', 1);
            updateStat('differentGamesWon', 'word-scramble');
            setTimeout(setupNewWord, 1500);
        } else {
            setMessage('Incorreto, tente novamente.');
            setGuess('');
        }
    };
    
    return (
        <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-mono tracking-widest mb-6 p-4 bg-slate-700 rounded-lg">{scrambledWord}</h2>
            <p className="mb-4">Desembaralhe as letras para formar uma palavra.</p>
            <form onSubmit={handleGuess} className="flex gap-2">
                <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    className="p-2 bg-slate-800 border-2 border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button type="submit" className="px-4 py-2 bg-pink-600 rounded">Adivinhar</button>
            </form>
            {message && <p className={`mt-4 text-lg ${message === 'Correto!' ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
        </div>
    );
};

export default WordScramble;
