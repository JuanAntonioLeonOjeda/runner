function Player(character, parent) {
  const self = this
  this.x = 50
  this.y = 350
  this.sprite = document.createElement('div')
  this.sprite.classList.add('player')
  this.sprite.style.backgroundImage = `url(./assets/characters/${character}/main.jpg)`

  this.drawPlayer = function() {
    this.sprite.style.left = `${this.x}px`
    this.sprite.style.top = `${this.y}px`
    parent.appendChild(this.sprite)
  }
}

export { Player }