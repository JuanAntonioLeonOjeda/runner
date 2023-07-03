import { characterScreen } from "./characterScreen.js"

const board = document.getElementById('main')
const startButton = document.getElementsByClassName('start-button')[0]
let character = ''

startButton.addEventListener('click', () => {
  removeChildren(board)
  loadCharacterScreen()
  const options = document.getElementsByClassName('character-select')
  for (let i = 0; i < options.length; i++) {
    options[i].addEventListener('click', () => {
      character = i
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