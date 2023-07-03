import { characterScreen } from "./characterScreen.js"

const board = document.getElementById('main')
const startButton = document.getElementsByClassName('start-button')[0]

startButton.addEventListener('click', () => {
  removeChildren(board)
  loadCharacterScreen()
})

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function loadCharacterScreen() {
  board.innerHTML = characterScreen
}