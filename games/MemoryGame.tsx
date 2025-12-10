
import React, { useState, useEffect, useRef } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const EMOJIS = ['🚀', '🍕', '🎉', '🌟', '🤖', '🔥', '💡', '💯'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const generateCards = (): Card[] => {
  const duplicatedEmojis = [...EMOJIS, ...EMOJIS];
  const shuffled = duplicatedEmojis.sort(() => Math.random() - 0.5);
  return shuffled.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
};

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(generateCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const { updateStat } = useAchievements();
  const isGameWon = cards.every(card => card.isMatched);
  const gameWonRef = useRef(false);

  useEffect(() => {
    if (isGameWon && !gameWonRef.current) {
      gameWonRef.current = true;
      updateStat('totalWins', 1);
      updateStat('gamesPlayed', 1);
      updateStat('differentGamesWon', 'memory-game');
      updateStat('memoryGameBest', Math.floor(moves / 2));
    }
  }, [isGameWon, moves, updateStat]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.emoji === secondCard.emoji) {
        setCards(prev => prev.map(c => (c.emoji === firstCard.emoji ? { ...c, isMatched: true } : c)));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => (flippedCards.includes(c.id) ? { ...c, isFlipped: false } : c)));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const handleCardClick = (clickedCard: Card) => {
    if (flippedCards.length >= 2 || clickedCard.isFlipped || isGameWon) return;

    setMoves(prev => prev + 1);
    setCards(prev => prev.map(c => (c.id === clickedCard.id ? { ...c, isFlipped: true } : c)));
    setFlippedCards(prev => [...prev, clickedCard.id]);
  };
  
  const resetGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMoves(0);
    gameWonRef.current = false;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-xl font-semibold text-slate-300">Movimentos: {Math.floor(moves / 2)}</div>
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div key={card.id} className="w-16 h-16 sm:w-20 sm:h-20 [perspective:1000px]" onClick={() => handleCardClick(card)}>
            <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${(card.isFlipped || card.isMatched) ? '[transform:rotateY(180deg)]' : ''}`}>
              <div className="absolute w-full h-full bg-slate-700 rounded-lg flex items-center justify-center text-3xl [backface-visibility:hidden]">?</div>
              <div className={`absolute w-full h-full rounded-lg flex items-center justify-center text-4xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${card.isMatched ? 'bg-emerald-500' : 'bg-purple-600'}`}>
                {card.emoji}
              </div>
            </div>
          </div>
        ))}
      </div>
       {isGameWon && (
        <div className="mt-4 text-2xl font-bold text-green-400 animate-pulse">Você Venceu!</div>
      )}
      <button onClick={resetGame} className="mt-6 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition-transform duration-200 hover:scale-105">
        Reiniciar Jogo
      </button>
    </div>
  );
};

export default MemoryGame;
