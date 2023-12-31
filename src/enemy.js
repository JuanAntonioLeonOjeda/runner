function Enemy (y, speed, parent, player, array) {
  let self = this
  this.x = window.innerWidth
  this.y = y
  this.speed = speed
  this.width = 25
  this.height = 25
  this.sprite = document.createElement('div')
  this.sprite.classList.add('enemy')
  this.sprite.style.backgroundSize = "cover";
  
  this.checkHeight = function () {
    return this.y === 50 ? 'baby.png' : 'email.png'
  }
  this.sprite.style.backgroundImage = `url(./assets/enemies/${this.checkHeight()}`
  
  this.drawEnemy = function () {
    this.sprite.style.left = `${this.x}px`
    this.sprite.style.bottom = `${this.y}px`
    parent.appendChild(this.sprite)
  }

  this.move = function () {
    self.x -= self.speed
    self.sprite.style.left = `${self.x}px`
    
    if (self.playerCollision()) {
      player.isDead = true
    }

    if (self.x <= 0) {
      self.removeEnemy()
    }
  }

  this.playerCollision = function () {
    return self.x < player.x + player.width &&
           self.x + self.width > player.x &&
           self.y < player.y + player.height &&
           self.y + self.height > player.y
  }

  this.removeEnemy = function () {
    parent.removeChild(this.sprite)
    clearInterval(this.timerId)
    array.splice(0,1)
  }

  this.timerId = setInterval(this.move, 100)
}

export { Enemy }