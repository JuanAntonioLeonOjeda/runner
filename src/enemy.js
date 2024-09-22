function Enemy (y, speed, parent, player, array) {
  this.id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    )
  let self = this
  this.x = window.innerWidth
  this.y = y
  this.speed = speed
  this.width = 25
  this.height = 25
  this.sprite = document.createElement('div')
  this.sprite.classList.add('enemy')
  this.sprite.style.backgroundSize = "cover"
  this.babyFrame = 1

  
  this.checkHeight = function () {
    return this.y !== 50 ? 
      player.character === 'kimchi' ? 
        'carrier.png' : 
        'baby1.png'
      : 
      player.character === 'kimchi' ? 
       'roomba.png' :
       'email.png'
  }

  this.sprite.style.backgroundImage = `url(./assets/enemies/${this.checkHeight()}`
  if (this.checkHeight() === 'baby1.png') {
    this.sprite.style.width = '70px'
    this.sprite.style.height = '70px'
  }
  this.sprite.style.backgroundSize = 'contain'

  
  this.drawEnemy = function () {
    this.sprite.style.left = `${this.x}px`
    this.sprite.style.bottom = `${this.y}px`
    parent.appendChild(this.sprite)
  }

  this.move = function () {
    if (self.checkHeight().includes('baby')) {
      if (self.babyFrame === 5) {
        self.sprite.style.backgroundImage = `url(./assets/enemies/baby2.png`
      } else if (self.babyFrame === 1) {
        self.sprite.style.backgroundImage = `url(./assets/enemies/baby1.png`;
      }
      self.babyFrame++;
      if (self.babyFrame > 10) {
        self.babyFrame = 1
      }
    }
    const previousX = self.x;

    // Move the enemy
    self.x -= self.speed;
    self.sprite.style.left = `${self.x}px`;

    // Check for player collision using the new and previous positions
    if (self.playerCollision(previousX)) {
      player.isDead = true;
    }

    // If enemy is out of screen, remove it
    if (self.x + self.width + 25 <= 0) {
      self.removeEnemy();
    }
  }

  this.playerCollision = function (previousX) {
    // Get the furthest left and right positions of the enemy during its movement
    const minX = Math.min(self.x, previousX);
    const maxX = Math.max(self.x + self.width, previousX + self.width);

    // Check if this bounding box intersects with the player's bounding box
    return (
      minX < player.x + player.width &&
      maxX > player.x &&
      self.y < player.y + player.height &&
      self.y + self.height > player.y
    );
  };

  this.removeEnemy = function () {
    parent.removeChild(this.sprite)
    clearInterval(this.timerId)
    const index = array.findIndex(enemy => enemy.id === this.id)
    if (index !== -1) {
      array.splice(index, 1)
    }
  }

  this.timerId = setInterval(this.move, 50)
}

export { Enemy }