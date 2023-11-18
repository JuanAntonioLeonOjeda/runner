function Bonus (y, speed, parent, player, array, score) {
  let self = this
  this.x = window.innerWidth
  this.y = y
  this.speed = speed
  this.width = 25
  this.height = 25
  this.sprite = document.createElement('div')
  this.sprite.classList.add('bonus')

  this.drawBonus = function () {
    this.sprite.style.left = `${this.x}px`
    this.sprite.style.bottom = `${this.y}px`
    parent.appendChild(this.sprite)
  }

  this.move = function () {
    self.x -= self.speed
    self.sprite.style.left = `${self.x}px`
    
    if (self.playerCollision() || self.x <= 0) {
      self.removeBonus()
      player.sumBonus = true
    }
  }

  this.playerCollision = function () {
    return self.x <= player.x + player.width &&
           self.x + self.width >= player.x &&
           self.y <= player.y + player.height &&
           self.y + self.height >= player.y
  }

  this.removeBonus = function () {
    parent.removeChild(this.sprite)
    clearInterval(this.timerId)
    array.splice(0,1)
  }

  this.timerId = setInterval(this.move, 100)
}

export { Bonus }