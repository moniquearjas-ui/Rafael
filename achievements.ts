
export type StatType = 
  | 'totalWins'
  | 'gamesPlayed'
  | 'ticTacToeWins'
  | 'rpsWins'
  | 'memoryGameBest'
  | 'reactionTimeBest'
  | 'differentGamesWon';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  goal: number;
  type: StatType;
}

export const achievementsList: Achievement[] = [
  { id: 'first_win', name: 'Primeira Vitória', description: 'Vença 1 jogo.', goal: 1, type: 'totalWins' },
  { id: 'getting_started', name: 'Começando', description: 'Jogue 5 partidas.', goal: 5, type: 'gamesPlayed' },
  { id: 'warming_up', name: 'Aquecendo', description: 'Vença 10 jogos no total.', goal: 10, type: 'totalWins' },
  { id: 'tic_tac_toe_master', name: 'Mestre da Velha', description: 'Vença 5 partidas de Jogo da Velha.', goal: 5, type: 'ticTacToeWins' },
  { id: 'rps_master', name: 'Estrategista', description: 'Vença 5 partidas de Pedra, Papel, Tesoura.', goal: 5, type: 'rpsWins' },
  { id: 'photographic_memory', name: 'Memória Fotográfica', description: 'Termine o Jogo da Memória em 15 movimentos ou menos.', goal: 15, type: 'memoryGameBest' },
  { id: 'lightning_reflexes', name: 'Reflexos de Relâmpago', description: 'Obtenha um tempo de reação inferior a 250ms.', goal: 250, type: 'reactionTimeBest' },
  { id: 'variety_gamer', name: 'Jogador Versátil', description: 'Vença 3 jogos diferentes.', goal: 3, type: 'differentGamesWon' },
  { id: 'serial_winner', name: 'Vencedor em Série', description: 'Vença 25 jogos no total.', goal: 25, type: 'totalWins' },
  { id: 'arcade_veteran', name: 'Veterano do Arcade', description: 'Jogue 50 partidas.', goal: 50, type: 'gamesPlayed' },
];
