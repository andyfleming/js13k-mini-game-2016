
var canvas = document.getElementById('c')
var ctx = canvas.getContext('2d');
var newGameEl = document.getElementById('new')
var scoreValueEl = document.getElementById('score-value')
var score
var gameActive
var roundCount

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

function createEnemy(speed) {
  return {
    x: randInt(20, canvas.width - 20),
    y: rand() > 0.5 ? 20 : canvas.height - 40,
    w: 20,
    h: 20,
    color: ['#AA3846','#E88E4F', '#E3A922'][randInt(0,2)],
    index: enemies.length,
    speed: speed
  }
}

function updateEnemy(enemy) {
  if (!enemy) {
    return
  }

  if (enemy.x > hero.x) {
    enemy.x -= enemy.speed * 0.75
  } else if (enemy.x < hero.x) {
    enemy.x += enemy.speed * 0.75
  }

  if (enemy.y > hero.y) {
    enemy.y -= enemy.speed
  } else if (enemy.y < hero.y) {
    enemy.y += enemy.speed
  }

}

function drawEnemy(enemy) {
  if (!enemy) {
   return
  }
  ctx.globalAlpha = 0.8
  ctx.fillStyle = enemy.color
  ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h)
  ctx.globalAlpha = 1
}

function createProjectile(x, y) {
  var target = {x: x - 2, y: y - 2}
  var startX = (canvas.width / 2) - 2
  var startY = (canvas.height / 2) - 2
  var dx = startX - target.x
  var dy = startY - target.y
  var angle = Math.atan2(dy, dx)
  var velocity = 2
  var xVelocity = velocity * Math.cos(angle);
  var yVelocity = velocity * Math.sin(angle);

  projectiles.push({
    x: startX,
    y: startY,
    w: 4,
    h: 4,
    xv: xVelocity,
    yv: yVelocity,
    index: projectiles.length
  })

}


function updateProjectile(proj) {
  if (!proj) {
    return
  }
  proj.x -= proj.xv
  proj.y -= proj.yv
  if (proj.x < -4 || proj.x > canvas.width) {
    projectiles[proj.index] = null
  } else if (proj.y < -4 || proj.y > canvas.height) {
    projectiles[proj.index] = null
  }
}

function drawProjectile(proj) {
  if (!proj) {
    return
  }
  ctx.globalAlpha = 0.8
  ctx.fillStyle = '#9999aa'
  ctx.fillRect(proj.x, proj.y, proj.w, proj.h)
  ctx.globalAlpha = 1
}

function update() {
  updateHero()
  enemies.forEach(updateEnemy)
  projectiles.forEach(updateProjectile)

  // If any projectiles are hitting enemies, remove them (and up score
  // If any enemies are hitting the hero, lose
  enemies.forEach(checkForHeroHit)
  enemies.forEach(checkForProjectileHit)
}

function colliding(rect1, rect2) {
  return (rect1.x < rect2.x + rect2.w &&
  rect1.x + rect1.w > rect2.x &&
  rect1.y < rect2.y + rect2.h &&
  rect1.h + rect1.y > rect2.y)
}

function checkForHeroHit(enemy) {
  if (enemy && colliding(enemy, hero)) {
    lose()
  }
}

function checkForProjectileHit(enemy) {
  if (!enemy) {
    return
  }
  var enemyHit = false
  projectiles.forEach(function(proj) {
    if (proj && !enemyHit && colliding(enemy, proj)) {
      enemyHit = true
      projectiles[proj.index] = null
      enemies[enemy.index] = null
      incrementScore()
    }
  })
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
    ctx.fillText('GOOD WORK!', 32, 32);
    ctx.font = "14px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText('You stopped ' + score + ' glitches!', 32, 75);
  }

}

function incrementScore() {
  score++
  scoreValueEl.innerText = score
}

function startNewGame() {

  roundCount = 0
  enemies = []
  projectiles = []
  gameActive = true
  score = 0
  scoreValueEl.innerText = '0'
  hero.x = (canvas.width / 2) - 10
  hero.y = (canvas.height / 2) - 10

  // On reset, set interval
  // If the time passed is 2 seconds
  // - raise the speed of the enemies
  // - raise the number of enemies to spawn
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

canvas.addEventListener('click', function(e) {
  if (gameActive) {
    createProjectile(e.offsetX, e.offsetY)
  }
  e.preventDefault()
})

setInterval(function() {
  if (gameActive) {
    var enemiesToCreate
    var speed

    if (roundCount > 2) {
      enemiesToCreate = floor(roundCount / 2)
    } else {
      enemiesToCreate = 3
    }

    if (roundCount > 15) {
      speed = 2
    } else if (roundCount > 10) {
      speed = 1.5
    } else if (roundCount > 5) {
      speed = 1
    } else if (roundCount > 2) {
      speed = 0.75
    } else {
      speed = 0.5
    }

    for (var i = 0; i < enemiesToCreate; i++) {
      enemies.push(createEnemy(speed))
    }

    roundCount++
  }
}, 2000)

// Let's play this game!
var then = Date.now()
startNewGame()
loop()