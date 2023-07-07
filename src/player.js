function Player(character, parent) {
  const self = this
  this.x = 50
  this.y = 350
  this.jumping = false
  this.force = 60
  this.height = 50
  this.width = 50
  this.isDead = false
  this.sprite = document.createElement('div')
  this.sprite.classList.add('player')
  this.sprite.style.backgroundImage = `url(./assets/characters/${character}/main.jpg)`

  this.drawPlayer = function() {
    this.sprite.style.left = `${this.x}px`
    this.sprite.style.top = `${this.y}px`
    parent.appendChild(this.sprite)
  }

  this.jump = function() {
    if (this.jumping && this.force >= 0.15) {
      this.y -= this.force
      this.force -= this.force * 0.6
      this.sprite.style.top = `${this.y}px`
    } else if (!this.collideFloor()) {
      this.y += 25
      this.sprite.style.top = `${this.y}px`
    } else {
      this.jumping = false
      this.y = 350
      this.force = 60
    }
  }

  this.collideFloor = function () {
    return this.y >= 350
  }
}

export { Player }