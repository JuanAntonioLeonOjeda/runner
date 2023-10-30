import { characterScreen } from "./characterScreen.js"
import { gameOverScreen } from "./gameOver.js"
import { Player } from './player.js'
import { Enemy } from './enemy.js'
import { Bonus } from "./bonus.js"
import { db } from "./fireStore.js"
import { collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'

async function getAllUsers() {
  const usersCollection = collection(db, 'users');
  console.log(usersCollection)
  const userSnapshot = await getDocs(usersCollection);
  const userList = userSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })).sort((a,b) => b.score - a.score)
  console.log(userList);
}

getAllUsers();

async function insertUser() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: 'Test',
      score: 129
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

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

  function loadGameOverScreen () {
    removeChildren(board)
    board.innerHTML = gameOverScreen
    board.style.background = 'none'
    board.style.backgroundColor = 'grey'
    const totalScore = document.querySelector('.total-score')
    totalScore.innerText = score
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
