function Player(character, parent) {
  const self = this
  this.x = 50
  this.y = 50
  this.jumping = false
  this.force = character === 'kimchi' ? 120 : 100
  this.fallSpeed = character === 'tati' ? 10 : 25
  this.height = 100
  this.width = 90
  this.isDead = false
  this.sumBonus = false
  this.sprite = document.createElement('div')
  this.spriteNum = 1
  this.sprite.classList.add('player')
  this.sprite.style.backgroundImage = `url(./assets/characters/${character}/running/${this.spriteNum}.png)`
  this.sprite.style.border="1px solid red"

  this.drawPlayer = function() {
    this.sprite.style.left = `${this.x}px`
    this.sprite.style.bottom = `${this.y}px`
    parent.appendChild(this.sprite)
  }

  this.numberOfSprites = function() {
    return character === 'kimchi' ? 6 : 4
  }

  this.runAnimation = function () {
    self.spriteNum = (self.spriteNum % self.numberOfSprites()) + 1
    self.sprite.style.backgroundImage = `url(./assets/characters/${character}/running/${self.spriteNum}.png`
  }

  this.jump = function() {
    if (this.jumping && this.force >= 0.15) {
      this.y += this.force
      this.force -= this.force * 0.6
    } else if (!this.collideFloor()) {
      this.y = Math.max(this.y - this.fallSpeed, 50);
    } else {
      this.jumping = false
      this.force = character === 'kimchi' ? 100 : 80
    }
    this.sprite.style.bottom = `${this.y}px`
  }

  this.collideFloor = function () {
    return this.y <= 50
  }
}

export { Player }