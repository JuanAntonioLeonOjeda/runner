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

function createCharacter() {
  const player = document.createElement('div')
  switch (character) {
    case 0:
      player.classList.add('juanan')
      break
    case 1:
      player.classList.add('tati')
      break
    case 2:
      player.classList.add('kimchi')
      break
  }
  board.appendChild(player)
}

function startGame() {
  createCharacter()
  board.style.backgroundImage = 'url(./assets/backgrounds/Parallax_No_Car.gif)'
  board.style.backgroundSize = 'cover'
}