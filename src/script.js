import { characterScreen } from "./characterScreen.js"
import { Player } from './player.js'

const board = document.getElementById('main')
const startButton = document.getElementsByClassName('start-button')[0]
let character = ''

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
  }, 100)

  window.addEventListener('click', () => {
    if (!player.jumping) {
      player.jumping = true
    }
  })
}
