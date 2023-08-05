import { characterScreen } from "./characterScreen.js"
import { gameOverScreen } from "./gameOver.js"
import { Player } from './player.js'
import { Enemy } from './enemy.js'

const board = document.getElementById('main')
const startButton = document.getElementsByClassName('start-button')[0]
let character
let speed = 10
let enemies = []

startButton.addEventListener('click', characterSelection)

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

function characterSelection() {
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
}

function startGame() {
  const player = new Player(character, board)
  player.drawPlayer()
  loadBackground('road')
  
  let gameTimer = setInterval(gameLoop, 100)
  let enemyTimer = setInterval(enemyCreation, 3000)

  function gameLoop () {
    player.jump()
    player.runAnimation()
    if (player.isDead) {
      gameOver()
    }
  }

  function enemyCreation () {
    const enemy = new Enemy(375, speed, board, player, enemies)
    enemies.push(enemy)
    enemy.drawEnemy()
  }

  function gameOver() {
    clearInterval(gameTimer)
    clearInterval(enemyTimer)
    enemies.forEach(enemy => {
      clearInterval(enemy.timerId)
    })
    removeChildren(board)
    board.innerHTML = gameOverScreen
    board.style.background = 'none'
    board.style.backgroundColor = 'grey'

    const retry = document.getElementById('retry-btn')
    retry.addEventListener('click', characterSelection)
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
