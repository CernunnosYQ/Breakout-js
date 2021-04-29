import Board from './board.js'
import Player from './player.js'
import Controls from './controls.js'

const game_width = 960;
const game_height = 540;

const aps = (1000 / 30).toFixed()

class Game {
  constructor() {
    this.in_game = false;
    this.game_loop = null;

    this.element = document.createElement('div');
    this.element.classList.add('board');
    this.element.style.width = `${game_width}px`;
    this.element.style.height = `${game_height}px`;

    this.player = new Player();
    this.controls = new Controls(this.player);
  }

  startGame() {
    console.log("iniciando juego");

    this.container = document.getElementById('container');
    this.element.appendChild(this.player.element);
    this.container.appendChild(this.element);
    this.element.classList.add('ready');

    this.game_loop = setInterval(() => {this.updateGame()}, aps)
  }

  updateGame() {
    this.player.move();
  }
}

const game = new Game();
// // Blocks size
// const block_width = 110;
// const block_height = 20;

// let game_loop = null;
// const aps = (1000/30).toFixed();

// let test_marker = null;
// let player = null;

window.addEventListener('DOMContentLoaded', () => {game.startGame()})