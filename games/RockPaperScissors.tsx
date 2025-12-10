
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

type Choice = 'Pedra' | 'Papel' | 'Tesoura';
const CHOICES: Choice[] = ['Pedra', 'Papel', 'Tesoura'];
const EMOJIS: { [key in Choice]: string } = {
  Pedra: '✊',
  Papel: '✋',
  Tesoura: '✌️',
};

const RockPaperScissors: React.FC = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const { updateStat } = useAchievements();

  useEffect(() => {
    if (result) {
      updateStat('gamesPlayed', 1);
      if (result === 'Você Venceu!') {
        updateStat('totalWins', 1);
        updateStat('rpsWins', 1);
        updateStat('differentGamesWon', 'rock-paper-scissors');
      }
    }
  }, [result, updateStat]);

  const handlePlayerChoice = (choice: Choice) => {
    if (result) return; // Prevent choosing again until reset
    const computerChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    setPlayerChoice(choice);
    setComputerChoice(computerChoice);
    determineWinner(choice, computerChoice);
  };

  const determineWinner = (player: Choice, computer: Choice) => {
    if (player === computer) {
      setResult('Empate!');
    } else if (
      (player === 'Pedra' && computer === 'Tesoura') ||
      (player === 'Papel' && computer === 'Pedra') ||
      (player === 'Tesoura' && computer === 'Papel')
    ) {
      setResult('Você Venceu!');
    } else {
      setResult('Você Perdeu!');
    }
  };
  
  const resetGame = () => {
      setPlayerChoice(null);
      setComputerChoice(null);
      setResult(null);
  }

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-xl font-bold text-slate-300 mb-4">
        {result ? ' ' : 'Faça sua escolha!'}
      </h2>
      <div className="flex space-x-4 mb-8">
        {CHOICES.map((choice) => (
          <button
            key={choice}
            onClick={() => handlePlayerChoice(choice)}
            disabled={!!result}
            className="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center text-5xl transition-transform duration-200 hover:scale-110 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {EMOJIS[choice]}
          </button>
        ))}
      </div>

      {playerChoice && computerChoice && (
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex justify-around items-center mb-4">
            <div className="text-center">
              <p className="text-lg font-semibold">Você</p>
              <div className="text-6xl">{EMOJIS[playerChoice]}</div>
            </div>
            <div className="text-2xl font-bold text-slate-400">vs</div>
            <div className="text-center">
              <p className="text-lg font-semibold">Computador</p>
              <div className="text-6xl">{EMOJIS[computerChoice]}</div>
            </div>
          </div>
          <h3 className={`text-3xl font-bold
            ${result === 'Você Venceu!' && 'text-green-400'}
            ${result === 'Você Perdeu!' && 'text-red-400'}
            ${result === 'Empate!' && 'text-yellow-400'}
          `}>
            {result}
          </h3>
          <button onClick={resetGame} className="mt-6 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition-transform duration-200 hover:scale-105">
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;
