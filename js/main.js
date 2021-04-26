// Board size
const board_width = 960;
const board_height = 540;

// Player initial position
const player_init_x = 425;
const player_init_y = 40;

// Blocks size
const block_width = 110;
const block_height = 20;

// Variables for the controls
let right = false;
let left = false;
let pause = false;

let game_loop = null;
const aps = (1000/30).toFixed();

let test_marker = null;
let player = null;

class Player {
  constructor() {
    this.width = block_width;
    this.height = block_height;
    this.velocity = 10;

    this.setPosition(player_init_x, player_init_y);
    
    this.createElement();
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('player');
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.updateElementPos();
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;

    this.bottom_left = [x, y];
    this.bottom_right = [x + this.width, y];
    this.top_left = [x, y + this.height];
    this.top_right = [x + this.width, y + this.height];
  }

  updateElementPos() {
    this.element.style.bottom = `${this.y}px`;
    this.element.style.left = `${this.x}px`;
  }

  move() {
    if (right) {
      test_marker.innerHTML = `Right`;
      this.setPosition(this.x + this.velocity, this.y);

      this.updateElementPos();
    }
    if (left) {
      test_marker.innerHTML = `Left`;
      this.setPosition(this.x - this.velocity, this.y);

      this.updateElementPos();
    }
  }
}

// 
function updateGame() {
  test_marker.innerHTML = '';
  player.move();
}

function pauseGame() {
  if (pause) {
    game_loop = setInterval(updateGame, aps);
    pause = false;
  } else {
    clearInterval(game_loop);
    test_marker.innerHTML = 'On Pause';
    pause = true;
  }
}

class Controls {
  static keyPressed(key) {
    switch (key) {
      case 'a':
      left = true;
      break;
      
      case 'ArrowLeft':
      left = true;
      break;
      
      case 'd':
      right = true;
      break;
      
      case 'ArrowRight':
      right = true;
      break;
      
      case ' ':
      pauseGame();
      break;
      
      case 'Escape':
      pauseGame();
      break;
      
      default:
      break;
    }
  }
  
  static keyReleased(key) {
    switch (key) {
      case 'a':
      left = false;
      break;
      
      case 'ArrowLeft':
      left = false;
      break;
      
      case 'd':
      right = false;
      break;
      
      case 'ArrowRight':
      right = false;
      break;
      
      default:
      break;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  board = document.getElementById('board');
  test_marker = document.getElementById('test');
  player = new Player();

  board.appendChild(player.element);

  document.addEventListener('keydown', (e) => { 
    if (!e.repeat) { Controls.keyPressed(e.key) };
  })
  document.addEventListener('keyup', (e) => {
    Controls.keyReleased(e.key);
  })
})