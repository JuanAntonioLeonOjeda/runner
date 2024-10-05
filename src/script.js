import { characterScreen } from "./characterScreen.js"
import { gameOverScreen } from "./gameOver.js"
import { Player } from './player.js'
import { Enemy } from './enemy.js'
import { Bonus } from "./bonus.js"

import { 
  getTopTen, 
  insertUser, 
  getAllPlayers 
} from "./fireStoreQueries.js"

const sounds = {
  success: new Audio("assets/sounds/treasure.wav"),
  gameOver: new Audio("assets/sounds/gameover.mp3"),
  jump: new Audio("assets/sounds/Jump.wav")
}

sounds.jump.volume = 1;
sounds.jump.preload = "auto"
sounds.jump.load()

const music = {
  hottogo: "assets/music/hottogo.mp3",
  nyan: "assets/music/nyan.mp3",
  melancholly: "assets/music/melancholy.mp3",
  takeOnMe: "assets/music/TakeOnMe.mp3",
  daftPunk: "assets/music/daftpunk.mp3",
  hero: "assets/music/HoldingOutForAHero.mp3",
}

const array = Object.values(music)

const isIphone = /iPhone/.test(navigator.userAgent);

console.log(isIphone)


// function goFullScreen() {
//     if (document.documentElement.requestFullscreen) {
//         document.documentElement.requestFullscreen()
//     } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
//         document.documentElement.mozRequestFullScreen()
//     } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
//         document.documentElement.webkitRequestFullscreen()
//     } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
//         document.documentElement.msRequestFullscreen()
//     }
// }

// window.addEventListener("load", function () {
//   setTimeout(function () {
//     window.scrollTo(0, document.body.scrollHeight){}
//   }, 0)
// })

const board = document.getElementById('main')
if (board.requestFullscreen) board.requestFullscreen()
const startButton = document.querySelector('.start-button button')
let character
let gameSpeed = 30
let enemies = []
let bonusArr = []
let flyingEnemies = false
let doubleEnemies = false
let score = 0
let index = 0
let audio
let audioInterval
let prevIdx

localStorage.mute = 'false'

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

let isCreating = false

function defineStartTime(audio, idx) {
  if (idx === 2) {
    audio.currentTime = 20
  } else if (idx === 3) {
    audio.currentTime = 17
  } else if (idx === 4) {
    audio.currentTime = 39
  } else {
    audio.currentTime = 55
  }
}

function startAudio() {
   if (audio) {
     audio.pause()
     audio.currentTime = 0
   }

  switch (character) {
    case "tati":
      audio = new Audio(music.hottogo)
      audio.currentTime = 17
      break
    case "kimchi":
      audio = new Audio(music.nyan)
      break
    default:
      let idx = Math.floor(Math.random() * (6 - 2) + 2)
      while (idx === prevIdx) {
        idx = Math.floor(Math.random() * (6 - 2) + 2)
      }
      prevIdx = idx
      audio = new Audio(array[idx])

      defineStartTime(audio, idx)
  }
  audio.volume = 0.5
  if (localStorage.mute === "false") audio.play()
}

function startGame() {
  if (!sounds.gameOver.paused) {
    sounds.gameOver.pause()
    sounds.gameOver.currentTime = 0
  }
  // if (localStorage.mute === "false") startAudio()
  startAudio()

  if (character === "juanan") {
    if (audioInterval) {
      clearInterval(audioInterval)
    }

    audioInterval = setInterval(() => {
      if (localStorage.mute === "false") {
        audio.pause()
        startAudio()
      }
    }, 30000)
  }

  localStorage.hasPlayed = true
  let gameOverFlag = false
  score = 0
  let enemyCounter = 0
  let createEnemyTimer = 2000
  let pauseEnemyGeneration = false
  let clearScreenInterval
  let repeatedTimer

  const player = new Player(character, board)
  player.drawPlayer()
  loadBackground('road')

  const displayScore = document.createElement('span')
  displayScore.classList.add('score')
  displayScore.innerText = `Puntos: ${score}`
  board.appendChild(displayScore)

  const speaker = document.createElement("span")

  speaker.classList.add(localStorage.mute === 'false' ?'speaker' : 'mute')
  board.appendChild(speaker)

  speaker.addEventListener('touchend', pauseMusic)
  
  let modeTimer = setTimeout(changeMode, 10000)
  let doubleTimer = setTimeout(addDoubleEnemies, 20000)
  let gameTimer = setInterval(gameLoop, 50)
  let enemyTimer = setInterval(enemyCreation, createEnemyTimer)
  // let bonusTimer = setInterval(bonusCreation, 5000)
  let speedTimer = setInterval(increaseSpeed, 30000)
  let scoreTimer = setInterval(sumScore, 100)

  function pauseMusic() {
    if (localStorage.mute === 'true') {
      audio.play()
      speaker.classList.add("speaker")
      speaker.classList.remove("mute")
      localStorage.mute = 'false'
    } else {
      audio.pause()
      speaker.classList.add("mute")
      localStorage.mute = 'true'
    }
  }

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
    displayScore.innerText = `Puntos: ${score}`
  }

  function changeMode () {
    flyingEnemies = true
  }

  function addDoubleEnemies () {
    doubleEnemies = true
  }

  function resumeEnemyGeneration() {
    pauseEnemyGeneration = false

    if (createEnemyTimer > 1000) {
      createEnemyTimer -= 500
    }
    clearInterval(enemyTimer)
    enemyTimer = setInterval(enemyCreation, createEnemyTimer)
  }

  function increaseSpeed () {
    gameSpeed *= 1.5
    
    if (createEnemyTimer > 1000) {
      clearInterval(enemyTimer)
      pauseEnemyGeneration = true
      const clean = setTimeout(() => {
        enemies.splice(0, enemies.length)
      }, 3000)
      clearScreenInterval = setInterval(() => {
        if (enemies.length === 0) {
          clearTimeout(clean)
          resumeEnemyGeneration()
          clearInterval(clearScreenInterval)
        }
      }, 100)
      enemyTimer = setInterval(enemyCreation, createEnemyTimer)
    }
  }

  function enemyCreation () {
    if (!isCreating && !pauseEnemyGeneration && !gameOverFlag) {
      isCreating = true
      let repeated = false
      const heights = [50, 200]

      const enemyHeight = heights[Math.floor(Math.random() * heights.length)]

      if (flyingEnemies) {
        if (enemyHeight === heights[index]) {
          repeated = true
        }
        index = heights.indexOf(enemyHeight)
      }

      const currentSpeed = gameSpeed

      const enemy = new Enemy(
        enemyHeight,
        currentSpeed,
        board,
        player,
        enemies
      )
      enemies.push(enemy)
      enemy.drawEnemy()

      if (repeated && !isCreating) {
        const secondEnemyHeight = heights.find(
          (height) => height !== enemyHeight
        )
        repeatedTimer = setTimeout(() => {
          if (!gameOverFlag) {
            const enemy = new Enemy(
              secondEnemyHeight,
              currentSpeed,
              board,
              player,
              enemies
            )
            enemies.push(enemy)
            enemy.drawEnemy()
          }
        }, 1000)
        repeated = false
      }

      if (doubleEnemies && Math.random() < 0.5) {
        setTimeout(() => {
          if (!gameOverFlag) {
            const enemy = new Enemy(
              enemyHeight,
              currentSpeed,
              board,
              player,
              enemies
            )
  
            enemies.push(enemy)
            enemy.drawEnemy()
          }
        }, 100)
      }

      if (Math.random() > 0.7) {
        setTimeout(() => {
          if (!player.isDead) bonusCreation()
        }, 800)
      }

      setTimeout(() => {
        isCreating = false
      }, 800)
    }
  }

  function bonusCreation() {
    const heights = [100, 200]
    let index = Math.floor(Math.random() * heights.length)

    const bonus = new Bonus(
      heights[index],
      gameSpeed,
      board,
      player,
      bonusArr,
      audio.paused
    )

    bonusArr.push(bonus)
    bonus.drawBonus()
  }

  function gameOver() {
    gameOverFlag = true
    sounds.gameOver.volume = 0.5
    if (!audio.paused) {
      sounds.gameOver.play()
    }
    audio.pause()
    clearTimers()
    flyingEnemies = false
    doubleEnemies = false
    loadGameOverScreen()
    const retry = document.getElementById('retry-btn')
    retry.addEventListener('touchstart', characterSelection)
  }

  function clearTimers () {
    clearTimeout(modeTimer)
    clearTimeout(doubleTimer)
    clearTimeout(repeatedTimer)
    clearInterval(gameTimer)
    clearInterval(enemyTimer)
    clearInterval(speedTimer)
    clearInterval(scoreTimer)
    clearInterval(audioInterval)
    clearInterval(clearScreenInterval)

    enemies.forEach(enemy => {
      clearInterval(enemy.timerId)
    })
    bonusArr.forEach(bonus => {
      clearInterval(bonus.timerId)
    })
    enemies.splice(0, enemies.length)
    gameSpeed = 30
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
      if (localStorage.mute === 'false') sounds.success.play()
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
      return player.id === localStorage.userId
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
     const input = document.querySelector("#name-input")
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
//       player.jumping = true
//     }
//   })
let pressTimer
const holdDuration = 1 // Duration in milliseconds to detect a held press

// // Prevent the context menu from appearing on long press
// board.addEventListener("contextmenu", (e) => {
//     if (!player.isDead) {
//       e.preventDefault();
//     }
//   // e.preventDefault()
// })

// // Handle mouse events for jumping
// // board.addEventListener("mousedown", (e) => {
// //   e.preventDefault()
// //   pressTimer = setTimeout(() => {
// //     if (!player.jumping) {
// //       player.jumping = true
// //     }
// //   }, holdDuration)
// // })

// // board.addEventListener("mouseup", () => {
// //   e.preventDefault()
// //   pressTimer = setTimeout(() => {
// //     if (!player.jumping) {
// //       player.jumping = true
// //     }
// //   }, holdDuration)
// // })

// // board.addEventListener("mouseleave", () => {
// //   clearTimeout(pressTimer)
// //   if (player.jumping) {
// //     const reduceForceGradually = setInterval(() => {
// //       if (player.force > 0.1) {
// //         player.force -= 100
// //       } else {
// //         clearInterval(reduceForceGradually)
// //       }
// //     }, 10)
// //   }
// // })

function playJumpSound() {
  if (!audio.paused) {
    sounds.jump.currentTime = 0
    sounds.jump.play()
  }
}

// board.addEventListener("touchstart", (e) => {
//   if (e.target === speaker) {
//     return
//   }
//   if (!player.isDead) {
//     e.preventDefault()
//   }
//   if (player.jumping && character === 'tati') {
//     player.isFloating = true
//     }
//   player.isHolding = true

//   pressTimer = setTimeout(() => {
//     if (!player.jumping && !player.isDead) {
//       playJumpSound()
//       player.jumping = true
//     }
//   }, holdDuration)
// })

// board.addEventListener("touchend", () => {
//   clearTimeout(pressTimer)
//   if (player.jumping) {
//     const reduceForceGradually = setInterval(() => {
//       if (player.force > 0.01) {
//         player.force -= 1
//       } else {
//         clearInterval(reduceForceGradually)
//       }
//     }, 15)
//   }
//   player.isHolding = false
//   player.isFloating = false
// })
// }
let isLongPress = false

// Handle touchstart with additional logic for iPhone Chrome
board.addEventListener('touchstart', (e) => {
  if (e.target === speaker) {
    return;
  }

  // Prevent default on iPhone Chrome to avoid context menu
  if (!player.isDead && isIphone) {
    e.preventDefault();
  }

  // Player-specific actions
  if (player.jumping && character === 'tati') {
    player.isFloating = true;
  }
  player.isHolding = true;

  // Long press detection
  pressTimer = setTimeout(() => {
    isLongPress = true;
    if (!player.jumping && !player.isDead) {
      playJumpSound();
      player.jumping = true;
    }
  }, holdDuration);
}, { passive: false }); 

// Prevent context menu on long touch for iPhone Chrome
board.addEventListener('touchmove', (e) => {
  if (isIphone) {
    e.preventDefault(); // On movement, prevent the context menu from appearing
  }
}, { passive: false });

// Handle touchend with passive set to false
board.addEventListener('touchend', (e) => {
  clearTimeout(pressTimer);
  isLongPress = false;

  if (player.jumping) {
    const reduceForceGradually = setInterval(() => {
      if (player.force > 0.01) {
        player.force -= 1;
      } else {
        clearInterval(reduceForceGradually);
      }
    }, 15);
  }

  // Reset player state
  player.isHolding = false;
  player.isFloating = false;
}, { passive: false });

// Add a contextmenu event listener to prevent it on right-click (desktop browsers)
board.addEventListener('contextmenu', (e) => {
  if (!player.isDead) {
    e.preventDefault();
  }
})
}