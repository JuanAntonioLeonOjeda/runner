function Enemy (y, speed, parent) {
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
    this.x -= this.speed
    this.sprite.style.left = `${this.x}px`
  }

  this.playerCollision = function (player) {
    return self.x <= player.x + player.width &&
           self.y <= player.y + player.height ||
           self.y + self.height >= player.y
  }
}

export { Enemy }