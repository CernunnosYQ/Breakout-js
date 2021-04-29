
// Blocks size
const block_width = 110;
const block_height = 20;

// Player initial position
const player_init_x = 425;
const player_init_y = 40;

export default class Player {
  constructor() {
    this.width = block_width;
    this.height = block_height;

    this.right = false;
    this.left = false;
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
    if (this.right) {
      this.setPosition(this.x + this.velocity, this.y);
      this.updateElementPos();
    }
    if (this.left) {
      this.setPosition(this.x - this.velocity, this.y);
      this.updateElementPos();
    }
  }
}