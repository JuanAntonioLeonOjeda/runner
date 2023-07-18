import { characterScreen } from "./characterScreen.js"
import { Player } from './player.js'
import { Enemy } from './enemy.js'

const board = document.getElementById('main')
const startButton = document.getElementsByClassName('start-button')[0]
let character
let speed = 10
let enemies = []

startButton.addEventListener('click', (e) => {
  removeChildren(board)
  loadCharacterScreen()
  const options = document.getElementsByClassName('character-select')
  for (let i = 0; i < options.length; i++) {
    options[i].addEventListener('click', (e) => {
      e.stopPropagation()
      switch (i) {
        case 0:
          character = 'tati'
          break
        case 1:
          character = 'juanan'
          break
        case 2:
          character = 'kimchi'
          break
      }
      removeChildren(board)
      startGame()
    })
  }
})

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function loadCharacterScreen() {
  board.innerHTML = characterScreen
}

function loadBackground(source) {
  board.style.backgroundImage = `url(./assets/backgrounds/${source}.gif)`
  board.style.backgroundSize = 'cover'
}

function startGame() {
  const player = new Player(character, board)
  player.drawPlayer()
  loadBackground('road')
  
  let gameTimer = setInterval(() => {
    player.jump()
    if (player.isDead) {
      gameOver()
    }
  }, 100)

  let enemyTimer = setInterval(() => {
    const enemy = new Enemy(375, speed, board, player)
    enemies.push(enemy)
    enemy.drawEnemy()
  }, 3000)

  function gameOver() {
    clearInterval(gameTimer)
    clearInterval(enemyTimer)
    enemies.forEach(enemy => {
      clearInterval(enemy.timerId)
    })
    alert('Game Over')
  }


  window.addEventListener('mousedown', () => {
    if (!player.jumping) {
      player.jumping = true
    }
  })

  /*window.addEventListener('mouseup', () => {
    if (player.jumping) {
      player.jumping = false
    }
  })*/
}
