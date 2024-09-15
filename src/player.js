function Player(character, parent) {
  const self = this
  this.x = 50
  this.y = 50
  this.jumping = false
  this.force = character === 'kimchi' ? 150 : 100
  this.fallSpeed = 30
  this.height = character === 'kimchi' ? 50 : 100
  this.width = character === 'kimchi' ? 50 : 90
  this.isDead = false
  this.sumBonus = false
  this.sprite = document.createElement('div')
  this.spriteNum = 1
  this.iterations = 1
  this.sprite.classList.add('player')
  this.character = character
  character === 'kimchi' ? this.sprite.setAttribute('id', 'kimchi') : null
  this.sprite.style.backgroundImage = `url(./assets/characters/${character}/running/${this.spriteNum}.png)`
  this.isFloating = false
  this.isHolding = false

  this.drawPlayer = function() {
    this.sprite.style.left = `${this.x}px`
    this.sprite.style.bottom = `${this.y}px`
    parent.appendChild(this.sprite)
  }

  this.numberOfSprites = function() {
    return character === 'kimchi' ? 6 : 4
  }

  this.runAnimation = function () {
    if (self.iterations === 2) {
      self.spriteNum = (self.spriteNum % self.numberOfSprites()) + 1
      self.sprite.style.backgroundImage = `url(./assets/characters/${character}/running/${self.spriteNum}.png`
      self.iterations = 1
    } else {
      self.iterations++
    }
  }

  this.jump = function() {
    if (this.jumping && this.force > 0.1) {
      // if (this.isFloating || this.isHolding) {
      //   // Floating effect: Slow down the falling speed
      //   this.force = Math.max(this.force - 0.1, 0.1); // Slow float
      // } else {
      //   this.y += this.force;
      //   this.force -= this.force * 0.6;
      // }
      this.y += this.force
      this.force -= this.force * 0.6
      self.sprite.style.backgroundImage = `url(./assets/characters/${character}/jumping/up.png`;
    } else if (!this.collideFloor()) {
      if (this.isHolding && character === "tati") {
        this.isFloating = true
      }
      this.y = Math.max(this.y - this.fallSpeed, 50)
      if (!this.isFloating) {
        // if (character !== 'tati') {
        //   this.fallSpeed *= 1.1
        // } else {
        //   this.fallSpeed *=1.5
        // }
        this.fallSpeed *= 1.1;
      } else {
        this.fallSpeed = 10
      }
      self.sprite.style.backgroundImage = `url(./assets/characters/${character}/jumping/down.png`;
    } else {
      this.jumping = false;
      // if (character !== 'tati') {
      //   this.fallSpeed = 30
      //   this.isFloating = false
      // } else {
      //   this.fallSpeed = 10
      // }
      this.fallSpeed = 30
      this.isFloating = false
      this.isHolding = false
      this.force = character === "kimchi" ? 150 : 100;
    }
    this.sprite.style.bottom = `${this.y}px`
  }

  this.collideFloor = function () {
    return this.y <= 50
  }
}

export { Player }