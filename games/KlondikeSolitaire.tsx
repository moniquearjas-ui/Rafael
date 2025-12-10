
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

// Simplified Klondike - this is a very complex game, so this is a basic representation
const SUITS = ['♥', '♦', '♣', '♠'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const KlondikeSolitaire = () => {
    const [foundations, setFoundations] = useState([[], [], [], []]);
    const [tableau, setTableau] = useState([]);
    const [stock, setStock] = useState([]);
    const [waste, setWaste] = useState([]);
    const [winner, setWinner] = useState(false);
    const { updateStat } = useAchievements();

    const createDeck = () => {
        let deck = [];
        for (let suit of SUITS) {
            for (let value of VALUES) {
                deck.push({ suit, value, faceUp: false });
            }
        }
        return deck.sort(() => Math.random() - 0.5);
    };

    const setupGame = () => {
        const deck = createDeck();
        const newTableau = [];
        for (let i = 1; i <= 7; i++) {
            const pile = deck.splice(0, i);
            pile[pile.length - 1].faceUp = true;
            newTableau.push(pile);
        }
        setTableau(newTableau);
        setStock(deck);
        setWaste([]);
        setFoundations([[], [], [], []]);
        setWinner(false);
    };
    
    useEffect(setupGame, []);

    useEffect(() => {
        if(foundations.flat().length === 52 && !winner){
            setWinner(true);
            updateStat('totalWins', 1);
            updateStat('gamesPlayed', 1);
            updateStat('differentGamesWon', 'solitaire');
        }
    }, [foundations, winner, updateStat]);

    const drawFromStock = () => {
        if (stock.length > 0) {
            const newWaste = [...waste, ...stock.splice(0, 1).map(c => ({...c, faceUp: true}))];
            setWaste(newWaste);
            setStock(stock);
        } else {
            // Reset stock from waste
            setStock(waste.reverse().map(c => ({...c, faceUp: false})));
            setWaste([]);
        }
    };
    
    // Very simplified placeholder for game logic
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl mb-4">Paciência (Versão Simplificada)</h2>
            <div className="flex gap-4">
                <div onClick={drawFromStock} className="w-20 h-28 border-2 border-slate-600 rounded-lg bg-slate-700 cursor-pointer flex items-center justify-center text-4xl">
                   {stock.length > 0 ? '🃏' : '♻️'}
                </div>
                 <div className="w-20 h-28 border-2 border-slate-600 rounded-lg bg-slate-800 flex items-center justify-center">
                    {waste.length > 0 && `${waste[waste.length - 1].value}${waste[waste.length-1].suit}`}
                </div>
                <div className="w-48" />
                {foundations.map((pile, i) => (
                    <div key={i} className="w-20 h-28 border-2 border-slate-600 rounded-lg bg-green-900/50 flex items-center justify-center">
                       {pile.length > 0 && `${pile[pile.length - 1].value}${pile[pile.length-1].suit}`}
                    </div>
                ))}
            </div>
            <p className="mt-4 text-slate-400">Lógica de arrastar e soltar não implementada nesta demo.</p>
            {winner && <h2 className="text-2xl font-bold text-green-400 mt-4">Você Venceu!</h2>}
            <button onClick={setupGame} className="mt-4 px-4 py-2 bg-purple-600 rounded">Novo Jogo</button>
        </div>
    );
};

export default KlondikeSolitaire;
