function Enemy (y, speed, parent, player) {
  let self = this
  this.x = 750
  this.y = y
  this.speed = speed
  this.width = 25
  this.height = 25
  this.sprite = document.createElement('div')
  this.sprite.classList.add('enemy')

  this.drawEnemy = function () {
    this.sprite.style.left = `${this.x}px`
    this.sprite.style.top = `${this.y}px`
    parent.appendChild(this.sprite)
  }

  this.move = function () {
    if (self.playerCollision()) {
      player.isDead = true
    }

    self.x -= self.speed
    self.sprite.style.left = `${self.x}px`

    if (self.x <= 0) {
      self.removeEnemy()
    }
  }

  this.playerCollision = function () {
    return self.x <= player.x + player.width &&
           self.x + self.width >= player.x &&
           self.y <= player.y + player.height &&
           self.y + self.height >= player.y
  }

  this.removeEnemy = function () {
    parent.removeChild(this.sprite)
    clearInterval(this.timerId)
  }

  this.timerId = setInterval(this.move, 100)
}

export { Enemy }