import { characterScreen } from "./characterScreen.js"
import { gameOverScreen } from "./gameOver.js"
import { Player } from './player.js'
import { Enemy } from './enemy.js'
import { Bonus } from "./bonus.js"

import { getTopTen, insertUser, getAllPlayers } from "./fireStoreQueries.js"

// function goFullScreen() {
//     if (document.documentElement.requestFullscreen) {
//         document.documentElement.requestFullscreen();
//     } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
//         document.documentElement.mozRequestFullScreen();
//     } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
//         document.documentElement.webkitRequestFullscreen();
//     } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
//         document.documentElement.msRequestFullscreen();
//     }
// }

window.addEventListener("load", function () {
  setTimeout(function () {
    window.scrollTo(0, 1);
  }, 0);
});

// You can call this function on a user action, like a button click

const board = document.getElementById('main')
const startButton = document.getElementsByClassName('start-button')[0]
let character
let gameSpeed = 10
let enemies = []
let bonusArr = []
let flyingEnemies = false
let score = 0

startButton.addEventListener('click', characterSelection)

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function characterSelection() {
  //goFullScreen()
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

function loadCharacterScreen() {
  board.innerHTML = characterScreen
  board.style.backgroundImage = 'none'
  board.style.backgroundColor = 'gray'
}

function loadBackground(source) {
  board.style.backgroundImage = `url(./assets/backgrounds/${source}.gif)`
  board.style.backgroundSize = 'contain'
}

function startGame() {
  score = 0
  const player = new Player(character, board)
  player.drawPlayer()
  loadBackground('road')
  const displayScore = document.createElement('span')
  displayScore.classList.add('score')
  displayScore.innerText = `Score: ${score}`
  board.appendChild(displayScore)
  
  setTimeout(changeMode, 10000)
  let gameTimer = setInterval(gameLoop, 100)
  let enemyTimer = setInterval(enemyCreation, 3000)
  let bonusTimer = setInterval(bonusCreation, 5000)
  let speedTimer = setInterval(increaseSpeed, 30000)
  let scoreTimer = setInterval(sumScore, 100)

  function gameLoop () {
    player.jump()
    player.runAnimation()
    if (player.isDead) {
      gameOver()
    }
    if (player.sumBonus) {
      score += 250
      player.sumBonus = false
    }
  }

  function sumScore () {
    score += 5
    displayScore.innerText = `Score: ${score}`
  }
  function changeMode () {
    flyingEnemies = true
  }

  function increaseSpeed () {
    gameSpeed *= 1.5
  }

  function enemyCreation () {
    const heights = [50, 200]
    let index = 0
    if (flyingEnemies) {
      index = Math.floor(Math.random() * heights.length)
    }
    const enemy = new Enemy(heights[index], gameSpeed, board, player, enemies)
    enemies.push(enemy)
    enemy.drawEnemy()
  }

  function bonusCreation() {
    const heights = [100, 200]
    let index = Math.floor(Math.random() * heights.length)
    const bonus = new Bonus(heights[index], gameSpeed, board, player, bonusArr)
    bonusArr.push(bonus)
    bonus.drawBonus()
  }

  function gameOver() {
    clearTimers()
    loadGameOverScreen()
    const retry = document.getElementById('retry-btn')
    retry.addEventListener('click', characterSelection)
  }

  function clearTimers () {
    clearInterval(gameTimer)
    clearInterval(enemyTimer)
    clearInterval(speedTimer)
    clearInterval(scoreTimer)
    clearInterval(bonusTimer)
    enemies.forEach(enemy => {
      clearInterval(enemy.timerId)
    })
    bonusArr.forEach(bonus => {
      clearInterval(bonus.timerId)
    })
  }

  async function loadTopScores () {
    try {
      const scores = await getTopTen()
      const topSection = document.querySelector('.top-title')
      topSection.style.display = 'flex'
      const list = document.querySelector('.scores')
      scores.forEach(player => {
        const container = document.createElement('div')
        container.innerText = `${player.name}: ${player.score}`
        list.appendChild(container)
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function uploadScore (uploadButton) {
    const main = document.querySelector('.game-over')
    const top = document.querySelector('.top-title')
    const input = document.querySelector('#name-input')
    const value = input.value.toUpperCase()
    const userName = value
    localStorage.setItem('user', value)
    const loading = document.createElement("div")
    loading.classList.add('hourglass')
    main.insertBefore(loading, top)
    await insertUser({ name: userName, score })
    const players = await getAllPlayers()
    const result = players.findIndex(player => {
      return player.name === value
    })
    main.removeChild(loading)
    input.value = ''
    const inputSection = document.querySelector('.input')
    const confirm = document.createElement('div')
    main.removeChild(uploadButton)
    main.removeChild(inputSection)
    confirm.innerHTML = `Estás en ${result + 1}ª posición!`
    loadTopScores()
    main.insertBefore(confirm, top)
  }

  function loadGameOverScreen () {
    removeChildren(board)
    board.innerHTML = gameOverScreen
     const input = document.querySelector("#name-input");
     if (!input.value) {
      input.value = localStorage.getItem('user')
     }
    board.style.background = 'none'
    board.style.backgroundColor = 'grey'
    const totalScore = document.querySelector('.total-score')
    totalScore.innerText = score
    const uploadButton = document.querySelector('#upload-btn')
    uploadButton.addEventListener('click', () => uploadScore(uploadButton))
  }

  board.addEventListener('click', () => {
    if (!player.jumping) {
      player.jumping = true
    }
  })

  // board.addEventListener('touchend', () => {
  //   if (player.jumping) {
  //     player.jumping = false
  //   }
  // })
}
