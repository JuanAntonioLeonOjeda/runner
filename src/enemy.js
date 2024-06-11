function Enemy (y, speed, parent, player, array) {
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
    return this.y !== 50 ? 'baby1.png' : 'email.png'
  }

  this.sprite.style.backgroundImage = `url(./assets/enemies/${this.checkHeight()}`
  if (this.checkHeight() === 'baby1.png') {
    // this.sprite.style.rotate = 'y 180deg'
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
    self.x -= self.speed
    self.sprite.style.left = `${self.x}px`
    
    if (self.playerCollision()) {
      player.isDead = true
    }

    if (self.x + self.width + 25 < 0) {
      self.removeEnemy()
    }
  }

  this.playerCollision = function () {
    return self.x < player.x + player.width - 10 &&
           self.x + self.width > player.x + 10 &&
           self.y < player.y + player.height + 10 &&
           self.y + self.height > player.y - 10
  }

  this.removeEnemy = function () {
    parent.removeChild(this.sprite)
    clearInterval(this.timerId)
    array.splice(0,1)
  }

  this.timerId = setInterval(this.move, 50)
}

export { Enemy }