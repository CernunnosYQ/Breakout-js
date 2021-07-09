const board_width = window.innerWidth;
const board_height = window.innerHeight;

const block_columns = 12;
const block_rows = 8;

const block_width = board_width / block_columns;
const block_height = board_height / (block_rows * 3);

const player_init_x = (board_width / 2) - block_width;
const player_init_y = board_height * (21/24);

const const_velocity = board_width / 200;

const fps_target = 25;

let colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple']
let last_color = ''

class Game {
  constructor(container) {
    this.container = container;
    
    this.board = document.createElement('div');
    this.board.classList.add('board');
    this.board.style.width = `${board_width}px`;
    this.board.style.height = `${board_height}px`;
  }
  
  initialize() {
    console.log('Iniciando juego');
    this.player = new Player(player_init_x, player_init_y, block_width * 2, block_height);
    this.paused = true;
    
    this.board.appendChild(this.player.element);
    this.container.appendChild(this.board);
    this.setControls(this.player);
    this.createBlocks();
    this.createBall();
  }
  
  setControls() {
    document.addEventListener('keydown', (e) => {
      if (!e.repeat) { this.keyPressed(e.key); }
    })
    
    document.addEventListener('keyup', (e) => {
      this.keyReleased(e.key);
    })
  }

  createBlocks() {
    this.blocks = [];
    for (let i = 0; i < block_columns; i++) {
      for (let j = 0; j < block_rows; j++) {
        let block = new Block(i * block_width, j * block_height);
        this.blocks.push(block);
        this.board.appendChild(block.element);
      } 
    }
  }

  createBall() {
    this.ball = new Ball((board_width - block_height) / 2, (board_height - block_height) / 2);
    this.board.appendChild(this.ball.element);
  }
  
  update() {
    this.player.updatePos();
    this.ball.updatePos();
    this.detectCollision();
  }

  detectCollision() {
    let ball_pos = this.ball.getBounds();

    if (ball_pos['bottom'] >= board_height - Math.abs(this.ball.velocity_y)) {
      this.pauseGame();
      console.log('Game Over');
    }

    this.detectBorderCollision(ball_pos);
    this.detectPlayerCollision(ball_pos);
    this.detectBlockCollision(ball_pos);
  }

  detectBorderCollision(ball_pos) {
    if (ball_pos['right'] >= board_width - Math.abs(this.ball.velocity_x) ||
        ball_pos['left'] <= Math.abs(this.ball.velocity_x)) {
      this.ball.turnX();
    }

    if (ball_pos['top'] <= Math.abs(this.ball.velocity_y)) {
      this.ball.turnY();
    }
  }

  detectPlayerCollision(ball_pos) {
    let ball_last_pos = this.ball.getLastBounds();
    let player_pos = this.player.getBounds();

    if (ball_pos['bottom'] >= player_pos['top'] && ball_pos['right'] >= player_pos['left'] &&
        ball_pos['left'] <= player_pos['right'] && ball_pos['top'] <= player_pos['bottom']) {
      this.ball.turnY();
      if (ball_last_pos['right'] <= player_pos['left'] || ball_last_pos['left'] >= player_pos['right']) {
        this.ball.turnX();
      }
    }
  }

  detectBlockCollision(ball_pos) {
    for (let i = 0; i < this.blocks.length; i++) {
      let ball_last_pos = this.ball.getLastBounds();
      let block_pos = this.blocks[i].getBounds();
      if (ball_pos['bottom'] >= block_pos['top'] && ball_pos['right'] >= block_pos['left'] &&
          ball_pos['left'] <= block_pos['right'] && ball_pos['top'] <= block_pos['bottom']) {
        this.ball.turnY();
        if (ball_last_pos['right'] <= block_pos['left'] || ball_last_pos['left'] >= block_pos['right']) {
          this.ball.turnX();
        }

        this.board.removeChild(this.blocks[i].element);
        this.blocks.splice(i, 1);
      }
    }
  }
  
  pauseGame() {
    if (this.paused) {
      this.loop = window.setInterval(() => { this.update() }, 1000/fps_target);
      this.paused = false;
    } else {
      clearInterval(this.loop);
      this.paused = true;
    }
  }
  
  unloadContent() {
    console.log('Descargando datos de juego');
  }
  
  keyPressed(key) {
    switch (key.toLowerCase()) {
      case 'a':
        this.player.left = true;
        break;
      case 'arrowleft':
        this.player.left = true;
        break;
      case 'd':
        this.player.right = true;
        break;
      case 'arrowright':
        this.player.right = true;
        break;
      case ' ':
        this.pauseGame();
        break;
      case 'escape':
        this.pauseGame();
        break;
    }
  }
  
  keyReleased(key) {
    switch (key.toLowerCase()) {
      case 'a':
        this.player.left = false;
        break;
      case 'arrowleft':
        this.player.left = false;
        break;
      case 'd':
        this.player.right = false;
        break;
      case 'arrowright':
        this.player.right = false;
        break;
    }
  }
}

class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.left = false;
    this.right = false;
    this.velocity = Math.round(board_width / 100)
    
    this.element = document.createElement('div');
    this.element.ID = 'player';
    this.element.classList.add('player');
    
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.updatePos()
  }

  getBounds() {
    return {"top": this.y,
            "left": this.x,
            "bottom": this.y + this.height,
            "right": this.x + this.width }
  }
  
  updatePos() {
    if (this.right) {
      if (this.x + this.width <= board_width - 2 * this.velocity) {
        this.x += this.velocity;
      }
    }
    if (this.left) {
      if (this.x >= 2 * this.velocity) {
        this.x -= this.velocity;
      }
    }
    
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = block_width;
    this.height = block_height;

    this.element = document.createElement('div');
    this.element.classList.add('block');
    this.element.classList.add(this.getRandomColor());
    this.element.style.top = `${this.y}px`;
    this.element.style.left = `${this.x}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
  }

  getRandomColor() {
    let n = Math.floor(Math.random() * colors.length);
    let res = colors[n];

    if (last_color != '') { colors.push(last_color) };
    last_color = colors.splice(n, 1);

    return res;
  }

  getBounds() {
    return {"top": this.y,
            "left": this.x,
            "bottom": this.y + this.height,
            "right": this.x + this.width }
  }
}

class Ball {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.last_x;
    this.last_y;
    this.diameter = block_height;
    this.velocity_x = ((Math.random() * const_velocity) / 2) + (const_velocity * (1/2));
    this.velocity_y = ((Math.random() * const_velocity) / 2) + (const_velocity * (1/2));

    this.element = document.createElement('div');
    this.element.ID = 'ball';
    this.element.classList.add('ball');

    this.element.style.width = `${this.diameter}px`;
    this.element.style.height = `${this.diameter}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.left = `${this.x}px`;
  }

  updatePos() {
    this.last_x = this.x;
    this.last_y = this.y;

    this.x += this.velocity_x;
    this.y += this.velocity_y;

    this.element.style.top = `${this.y}px`;
    this.element.style.left = `${this.x}px`;
  }

  turnX () {
    this.velocity_x = - this.velocity_x;
  }

  turnY () {
    this.velocity_y = - this.velocity_y;
  }

  getBounds() {
    return {"top": this.y,
            "left": this.x,
            "bottom": this.y + this.diameter,
            "right": this.x + this.diameter }
  }

  getLastBounds() {
    return {"top": this.last_y,
            "left": this.last_x,
            "bottom": this.last_y + this.diameter,
            "right": this.last_x + this.diameter }
  }
}

const container = document.getElementById('container')
const game = new Game(container);

document.addEventListener('DOMContentLoaded', () => { game.initialize() })
