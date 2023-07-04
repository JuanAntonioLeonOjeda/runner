import { characterScreen } from "./characterScreen.js"
import { Player } from './player.js'

const board = document.getElementById('main')
const startButton = document.getElementsByClassName('start-button')[0]
let character = ''

startButton.addEventListener('click', () => {
  removeChildren(board)
  loadCharacterScreen()
  const options = document.getElementsByClassName('character-select')
  for (let i = 0; i < options.length; i++) {
    options[i].addEventListener('click', () => {
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

function startGame() {
  const player = new Player(character, board)
  player.drawPlayer()
  board.style.backgroundImage = 'url(./assets/backgrounds/Parallax_No_Car.gif)'
  board.style.backgroundSize = 'cover'
}