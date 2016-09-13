
var canvas = document.getElementById('c')
var ctx = canvas.getContext('2d');
var newGameEl = document.getElementById('new')
var scoreValueEl = document.getElementById('score-value')
var score
var gameActive

// Shortcuts
var rand = Math.random
var floor = Math.floor
var ceil = Math.ceil
var min = Math.min
var max = Math.max

// Utilities
function randInt(min, max) { return floor(rand() * (max - min + 1)) + min }

var hero = {
  x: 0,
  y: 0,
  w: 20,
  h: 20
}
var enemies = []
var projectiles = []


function updateHero() {
  //hero.x += 1
  //hero.y += 1
}

function drawBackground() {
  ctx.fillStyle = "#2B2B2B"
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawHero() {
  ctx.fillStyle = "rgb(0,0,0)"
  ctx.fillRect(hero.x, hero.y, hero.w, hero.h);
}

function createEnemy() {
  return {
    x: randInt(20, canvas.width - 20),
    y: rand() > 0.5 ? 20 : canvas.height - 40,
    w: 20,
    h: 20,
    color: ['#AA3846','#E88E4F', '#E3A922'][randInt(0,2)]
  }
}

function updateEnemy(enemy) {

  if (enemy.x > hero.x) {
    enemy.x -= 0.75
  } else if (enemy.x < hero.x) {
    enemy.x += 0.75
  }

  if (enemy.y > hero.y) {
    enemy.y -= 1
  } else if (enemy.y < hero.y) {
    enemy.y += 1
  }

}

function drawEnemy(enemy) {
  ctx.globalAlpha = 0.8
  ctx.fillStyle = enemy.color
  ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h)
  ctx.globalAlpha = 1
}

function updateProjectile(proj) {

}

function drawProjectile(proj) {

}

function update() {
  updateHero()
  enemies.forEach(updateEnemy)
  projectiles.forEach(updateProjectile)

  // If any projectiles are hitting enemies, remove them (and up score
  // If any enemies are hitting the hero, lose
  enemies.forEach(checkForHeroHit)

}

function colliding(rect1, rect2) {
  return (rect1.x < rect2.x + rect2.w &&
  rect1.x + rect1.w > rect2.x &&
  rect1.y < rect2.y + rect2.h &&
  rect1.h + rect1.y > rect2.y)
}

function checkForHeroHit(enemy) {

  if (colliding(enemy, hero)) {
    lose()
  }

}

function draw() {

  // Reset the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (gameActive) {
    drawBackground()
    drawHero()
    enemies.forEach(drawEnemy)
    projectiles.forEach(drawProjectile)
  } else {
    // Draw lose screen
    ctx.fillStyle = "#2B2B2B"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText('GAME OVER', 32, 32);
    ctx.font = "14px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText('You stopped ' + score + ' glitches', 32, 75);
  }

}

function incrementScore() {
  score++
  scoreValueEl.innerText = score
}

function startNewGame() {

  enemies = []
  projectiles = []
  gameActive = true
  score = 0
  scoreValueEl.innerText = '0'
  hero.x = canvas.width / 2
  hero.y = canvas.height / 2

  // On reset, set interval
  // If the time passed is 2 seconds
  // - raise the speed of the enemies
  // - raise the number of enemies to spawn

  enemies.push(createEnemy())
  enemies.push(createEnemy())
  enemies.push(createEnemy())
}

function loop() {
  var now = Date.now()
  var delta = now - then

  update(delta / 1000)
  draw()

  then = now

  // Request to do this again ASAP
  requestAnimationFrame(loop)
}

function lose() {
  gameActive = false
}

// Handle the new button click
newGameEl.addEventListener('click', startNewGame)

// Let's play this game!
var then = Date.now()
startNewGame()
loop()