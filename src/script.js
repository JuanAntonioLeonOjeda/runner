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

// window.addEventListener("load", function () {
//   setTimeout(function () {
//     window.scrollTo(0, document.body.scrollHeight);
//   }, 0);
// })

const board = document.getElementById('main')
const startButton = document.querySelector('.start-button button')
let character
let gameSpeed = 14
let enemies = []
let bonusArr = []
let flyingEnemies = false
let score = 0
let index = 0
let repeatedTimer

startButton.addEventListener('touchstart', characterSelection)

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
  const helpSection = document.getElementById('help-section')
  const closeHelp = document.getElementById('close-help')
  let isVisible = !localStorage.hasPlayed
  if (isVisible) helpSection.style.visibility = "visible"
  const helpIcon = document.querySelector('.help-icon')
  
  helpIcon.addEventListener('touchstart', () => {
    helpSection.style.visibility = 'visible'
  })

  closeHelp.addEventListener("touchstart", () => {
    helpSection.style.visibility = "hidden"
  })

  for (let i = 0; i < options.length; i++) {
    options[i].addEventListener('touchstart', (e) => {
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
  board.style.backgroundImage = 'url(./assets/backgrounds/background.png)'
  board.style.backgroundSize = 'cover'
}

function loadBackground(source) {
  board.style.backgroundImage = `url(./assets/backgrounds/${source}.gif)`
  board.style.backgroundSize = 'contain'
  board.style.backgroundRepeat = 'repeat'
}

function startGame() {
  localStorage.hasPlayed = true
  score = 0
  let enemyCounter = 0
  let createEnemyTimer = 3000
  const player = new Player(character, board)
  player.drawPlayer()
  loadBackground('road')
  const displayScore = document.createElement('span')
  displayScore.classList.add('score')
  displayScore.innerText = `Score: ${score}`
  board.appendChild(displayScore)
  
  let modeTimer = setTimeout(changeMode, 10000)
  let gameTimer = setInterval(gameLoop, 50)
  let enemyTimer = setInterval(enemyCreation, createEnemyTimer)
  let bonusTimer = setInterval(bonusCreation, 5000)
  let speedTimer = setInterval(increaseSpeed, 30000)
  let scoreTimer = setInterval(sumScore, 100)

  function gameLoop () {
    player.jump()
    if (!player.jumping) {
      player.runAnimation()
    }
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
    clearInterval(enemyTimer)
    createEnemyTimer -= 500
    enemyTimer = setInterval(enemyCreation, createEnemyTimer);
  }

  function enemyCreation () {
    let repeated = false
    const heights = [50, 200]
    if (flyingEnemies) {
      const aux = Math.floor(Math.random() * heights.length)
      if (aux === index) { 
        repeated = true 
      }
      index = aux
    }
    if (repeated) {
      repeatedTimer = setTimeout(() => {
        const enemy = new Enemy(heights[index === 0 ? 1 : 0], gameSpeed, board, player, enemies)
        enemies.push(enemy)
        enemy.drawEnemy()
      }
        , 1000)
      repeated = false
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
    flyingEnemies = false
    gameSpeed = 14
    loadGameOverScreen()
    const retry = document.getElementById('retry-btn')
    retry.addEventListener('touchstart', characterSelection)
  }

  function clearTimers () {
    clearTimeout(modeTimer)
    clearTimeout(repeatedTimer)
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
    gameSpeed = 14
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
    board.style.backgroundImage = 'url(./assets/backgrounds/background.png)'
    board.style.backgroundSize = "cover"
    const totalScore = document.querySelector('.total-score')
    totalScore.innerText = score
    const uploadButton = document.querySelector('#upload-btn')
    uploadButton.addEventListener('touchstart', () => uploadScore(uploadButton))
  }

// board.addEventListener('mouseup', (e) => {
//   console.log('down')
//     e.preventDefault()
//     if (!player.jumping) {
//       player.jumping = true
//     }
// })

// board.addEventListener('mousedown', () => {
//   console.log('up')
//     if (player.jumping) {
//       player.jumping = false
//     }
//   })
//   // board.addEventListener("contextmenu", (e) => {
//   //   e.preventDefault()
//   // })
//   board.addEventListener('touchend', () => {
//       if (player.jumping) {
//         player.jumping = false
//       }
//   })
//   board.addEventListener("touchstart", (e) => {
//     if (!player.jumping) {
//       player.jumping = true;
//     }
//   })
let pressTimer;
const holdDuration = 1; // Duration in milliseconds to detect a held press

// Prevent the context menu from appearing on long press
board.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Handle mouse events for jumping
// board.addEventListener("mousedown", (e) => {
//   e.preventDefault();
//   pressTimer = setTimeout(() => {
//     if (!player.jumping) {
//       player.jumping = true;
//     }
//   }, holdDuration);
// });

// board.addEventListener("mouseup", () => {
//   e.preventDefault();
//   pressTimer = setTimeout(() => {
//     if (!player.jumping) {
//       player.jumping = true;
//     }
//   }, holdDuration);
// });

// board.addEventListener("mouseleave", () => {
//   clearTimeout(pressTimer);
//   if (player.jumping) {
//     const reduceForceGradually = setInterval(() => {
//       if (player.force > 0.1) {
//         player.force -= 100;
//       } else {
//         clearInterval(reduceForceGradually);
//       }
//     }, 10);
//   }
// });

// Handle touch events for jumping
board.addEventListener("touchstart", (e) => {
  e.preventDefault();
  pressTimer = setTimeout(() => {
    if (!player.jumping) {
      player.jumping = true;
    }
  }, holdDuration);
});

board.addEventListener("touchend", () => {
  clearTimeout(pressTimer);
  if (player.jumping) {
    const reduceForceGradually = setInterval(() => {
      if (player.force > 0.1) {
        player.force -= 2
      } else {
        clearInterval(reduceForceGradually);
      }
    }, 15)
  }
})
}
