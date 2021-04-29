export default class Controls {
  constructor(player) {
    this.player = player;

    document.addEventListener('keydown', (e) => {
      if (!e.repeat) { this.keyPressed(e.key); }
    })

    document.addEventListener('keyup', (e) => {
      this.keyReleased(e.key);
    })
  }
  
  keyPressed(key) {
    switch (key) {
      case 'a':
      this.player.left = true;
      break;
      
      case 'ArrowLeft':
      this.player.left = true;
      break;
      
      case 'd':
      this.player.right = true;
      break;
      
      case 'ArrowRight':
      this.player.right = true;
      break;
      
      case ' ':
      this.board.pauseGame();
      break;
      
      case 'Escape':
      this.board.pauseGame();
      break;
      
      default:
      break;
    }
  }
  
  keyReleased(key) {
    switch (key) {
      case 'a':
      this.player.left = false;
      break;
      
      case 'ArrowLeft':
      this.player.left = false;
      break;
      
      case 'd':
      this.player.right = false;
      break;
      
      case 'ArrowRight':
      this.player.right = false;
      break;
      
      default:
      break;
    }
  }
}