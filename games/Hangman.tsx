
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const WORDS = ["REACT", "JOGO", "ARCADE", "GEMINI", "DESAFIO", "VITORIA"];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

const Hangman = () => {
  const [word, setWord] = useState(WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const { updateStat } = useAchievements();

  const isWinner = word.split('').every(letter => guessedLetters.has(letter));
  const isLoser = wrongGuesses >= 6;

  useEffect(() => {
    if (isWinner || isLoser) {
        updateStat('gamesPlayed', 1);
        if (isWinner) {
            updateStat('totalWins', 1);
            updateStat('differentGamesWon', 'hangman');
        }
    }
  }, [isWinner, isLoser, updateStat]);

  const handleGuess = (letter) => {
    if (guessedLetters.has(letter) || isWinner || isLoser) return;
    const newGuessed = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessed);
    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
    }
  };
  
  const resetGame = () => {
      setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
      setGuessedLetters(new Set());
      setWrongGuesses(0);
  }

  const HangmanDrawing = () => (
      <svg height="250" width="200" className="stroke-current text-white" strokeWidth="3">
        {/* Stand */}
        <line x1="20" y1="230" x2="100" y2="230" />
        <line x1="60" y1="230" x2="60" y2="20" />
        <line x1="60" y1="20" x2="150" y2="20" />
        <line x1="150" y1="20" x2="150" y2="50" />
        {/* Head */}
        {wrongGuesses > 0 && <circle cx="150" cy="70" r="20" fill="transparent" />}
        {/* Body */}
        {wrongGuesses > 1 && <line x1="150" y1="90" x2="150" y2="150" />}
        {/* Left Arm */}
        {wrongGuesses > 2 && <line x1="150" y1="110" x2="120" y2="90" />}
        {/* Right Arm */}
        {wrongGuesses > 3 && <line x1="150" y1="110" x2="180" y2="90" />}
        {/* Left Leg */}
        {wrongGuesses > 4 && <line x1="150" y1="150" x2="120" y2="180" />}
        {/* Right Leg */}
        {wrongGuesses > 5 && <line x1="150" y1="150" x2="180" y2="180" />}
      </svg>
  )

  return (
    <div className="flex flex-col items-center">
      <HangmanDrawing />
      <div className="flex gap-4 text-3xl font-mono tracking-widest my-4">
        {word.split('').map((letter, index) => (
          <span key={index} className="w-10 h-14 border-b-4 flex items-center justify-center">
            {guessedLetters.has(letter) ? letter : '_'}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 justify-center max-w-lg">
        {!isWinner && !isLoser ? (
          ALPHABET.map(letter => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.has(letter)}
              className="w-10 h-10 bg-slate-700 rounded disabled:bg-slate-800 disabled:opacity-50"
            >
              {letter}
            </button>
          ))
        ) : (
            <div className="text-center">
                <h2 className="text-2xl font-bold">{isWinner ? 'Você Venceu!' : 'Você Perdeu!'}</h2>
                <p>A palavra era: {word}</p>
                <button onClick={resetGame} className="mt-4 px-4 py-2 bg-purple-600 rounded">Jogar Novamente</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Hangman;
