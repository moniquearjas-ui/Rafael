
import React from 'react';
import type { Game } from '../types';

import {
  TicTacToeIcon, MemoryIcon, RockPaperScissorsIcon, ReactionTimeIcon, PuzzleIcon,
  ArcadeIcon, StrategyIcon, CardIcon, WordIcon, NumberIcon, BlocksIcon, SnakeIcon,
  RacingIcon, TargetIcon, MazeIcon
} from '../components/icons';

import TicTacToe from './TicTacToe';
import MemoryGame from './MemoryGame';
import RockPaperScissors from './RockPaperScissors';
import ReactionTime from './ReactionTime';
import SlidePuzzle from './SlidePuzzle';
import Snake from './Snake';
import BlockFall from './BlockFall';
import Sudoku from './Sudoku';
import WordScramble from './WordScramble';
import ConnectFour from './ConnectFour';
import Pong from './Pong';
import Game2048 from './Game2048';
import Hangman from './Hangman';
import Minesweeper from './Minesweeper';
import Breakout from './Breakout';
import Checkers from './Checkers';
import MazeRunner from './MazeRunner';
import TypingTest from './TypingTest';
import SimonSays from './SimonSays';
import WhackAMole from './WhackAMole';
import FlappyClone from './FlappyClone';
import DoodleClone from './DoodleClone';
import PegSolitaire from './PegSolitaire';
import LightsOut from './LightsOut';
import KlondikeSolitaire from './KlondikeSolitaire';


export const games: Game[] = [
  { id: 'tic-tac-toe', name: 'Jogo da Velha', description: 'O clássico jogo de estratégia.', icon: React.createElement(TicTacToeIcon), component: TicTacToe, isAvailable: true },
  { id: 'memory-game', name: 'Jogo da Memória', description: 'Encontre os pares de cartas.', icon: React.createElement(MemoryIcon), component: MemoryGame, isAvailable: true },
  { id: 'rock-paper-scissors', name: 'Pedra, Papel, Tesoura', description: 'Teste sua sorte contra o computador.', icon: React.createElement(RockPaperScissorsIcon), component: RockPaperScissors, isAvailable: true },
  { id: 'reaction-time', name: 'Teste de Reação', description: 'Quão rápido você consegue clicar?', icon: React.createElement(ReactionTimeIcon), component: ReactionTime, isAvailable: true },
  { id: 'slide-puzzle', name: 'Quebra-cabeça', description: 'Ordene os blocos.', icon: React.createElement(PuzzleIcon), component: SlidePuzzle, isAvailable: true },
  { id: 'snake', name: 'Snake', description: 'O clássico jogo da cobrinha.', icon: React.createElement(SnakeIcon), component: Snake, isAvailable: true },
  { id: 'block-fall', name: 'Blocos', description: 'Encaixe os blocos que caem.', icon: React.createElement(BlocksIcon), component: BlockFall, isAvailable: true },
  { id: 'sudoku', name: 'Sudoku', description: 'Preencha a grade com números.', icon: React.createElement(NumberIcon), component: Sudoku, isAvailable: true },
  { id: 'word-scramble', name: 'Caça Palavras', description: 'Encontre as palavras escondidas.', icon: React.createElement(WordIcon), component: WordScramble, isAvailable: true },
  { id: 'connect-four', name: 'Ligue 4', description: 'Conecte quatro discos em uma linha.', icon: React.createElement(StrategyIcon), component: ConnectFour, isAvailable: true },
  { id: 'pong', name: 'Pong', description: 'O clássico de arcade.', icon: React.createElement(ArcadeIcon), component: Pong, isAvailable: true },
  { id: '2048', name: '2048', description: 'Junte os números para chegar a 2048.', icon: React.createElement(NumberIcon), component: Game2048, isAvailable: true },
  { id: 'hangman', name: 'Jogo da Forca', description: 'Adivinhe a palavra secreta.', icon: React.createElement(WordIcon), component: Hangman, isAvailable: true },
  { id: 'solitaire', name: 'Paciência', description: 'O clássico jogo de cartas.', icon: React.createElement(CardIcon), component: KlondikeSolitaire, isAvailable: true },
  { id: 'minesweeper', name: 'Campo Minado', description: 'Não pise nas minas!', icon: React.createElement(StrategyIcon), component: Minesweeper, isAvailable: true },
  { id: 'breakout', name: 'Breakout', description: 'Quebre todos os tijolos.', icon: React.createElement(ArcadeIcon), component: Breakout, isAvailable: true },
  { id: 'checkers', name: 'Damas', description: 'Capture as peças do seu oponente.', icon: React.createElement(StrategyIcon), component: Checkers, isAvailable: true },
  { id: 'maze-runner', name: 'Labirinto', description: 'Encontre a saída do labirinto.', icon: React.createElement(MazeIcon), component: MazeRunner, isAvailable: true },
  { id: 'typing-test', name: 'Teste de Digitação', description: 'Teste sua velocidade de digitação.', icon: React.createElement(WordIcon), component: TypingTest, isAvailable: true },
  { id: 'simon-says', name: 'Simon Diz', description: 'Siga a sequência de cores.', icon: React.createElement(MemoryIcon), component: SimonSays, isAvailable: true },
  { id: 'whack-a-mole', name: 'Acerte a Toupeira', description: 'Acerte as toupeiras que aparecem.', icon: React.createElement(TargetIcon), component: WhackAMole, isAvailable: true },
  { id: 'flappy-clone', name: 'Pássaro Saltitante', description: 'Passe pelos obstáculos.', icon: React.createElement(ArcadeIcon), component: FlappyClone, isAvailable: true },
  { id: 'doodle-clone', name: 'Salto Infinito', description: 'Suba o mais alto que puder.', icon: React.createElement(RacingIcon), component: DoodleClone, isAvailable: true },
  { id: 'peg-solitaire', name: 'Resta Um', description: 'Deixe apenas uma peça no tabuleiro.', icon: React.createElement(PuzzleIcon), component: PegSolitaire, isAvailable: true },
  { id: 'lights-out', name: 'Apague as Luzes', description: 'Apague todas as luzes do tabuleiro.', icon: React.createElement(PuzzleIcon), component: LightsOut, isAvailable: true },
];
