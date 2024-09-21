function Bonus (y, speed, parent, player, array, isMute) {
  let self = this
  this.x = window.innerWidth
  this.setHeight = function() {
    switch (player.character) {
      case 'kimchi':
        return y > 100 ? y : y - 30
      default:
        return y
    }
  }
  this.y = this.setHeight()
  this.speed = speed
  this.width = 25
  this.height = player.character === 'kimchi' ? 15 : 25
  this.sprite = document.createElement('div')
  this.sprite.classList.add('bonus')
  this.sprite.style.backgroundSize = 'contain'
  this.sound = new Audio('assets/sounds/ring.wav')
  
  this.checkCharacter = function () {
    if (player.character === 'tati') return 'chocolate'
    if (player.character === 'juanan') return 'coffee'
    return 'fish'
    }
    this.sprite.style.backgroundImage = `url(./assets/bonus/${this.checkCharacter()}.png`
    
    this.drawBonus = function () {
      this.sprite.style.left = `${this.x}px`
      this.sprite.style.bottom = `${this.y}px`

    parent.appendChild(this.sprite)
  }

  this.move = function () {
    self.x -= self.speed
    self.sprite.style.left = `${self.x}px`
    
    if (self.playerCollision()) {
      if (!isMute) {
        self.sound.play()
      }
      self.removeBonus()
      player.sumBonus = true
    } else if (self.x + self.width < 0) {
      self.removeBonus()
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

  this.timerId = setInterval(this.move, 50)
}

export { Bonus }