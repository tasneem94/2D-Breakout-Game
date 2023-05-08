const MIN_WINDOW_WIDTH = 705//grid.offsetWidth+50;
const MIN_WINDOW_HEIGHT = 405//grid.offsetHeight+50;
let score = 0;
let level = 1;
let ballSpeed = 45;
const grid = document.querySelector(".grid");

// adding the blocks
const addBlock = () => {
  for (let i = 0; i < 24; i++) {

    const row = Math.floor(i / 6);
    const col = i % 6;

    const block = document.createElement("div");
    block.classList.add("block");

    block.style.left = `${20+col*100 + col*12}px`
    block.style.top = `${5+row*20 + row*12}px`

    grid.appendChild(block);

    // return;
  }
}

// Add the initial blocks and user to the grid
addBlock();
// addBlockLevel2(grid);
// addBlockLevel3(grid);
// addBlockLevel4(grid);


const gameOver = () => {
  clearInterval(gameInterval);

  let gameOverText = document.createElement("div");
  // gameOverText.classList.add("game-over");
  // show the semi-transparent overlay
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  gameOverText.innerHTML = 
  `<div class="game-over">GAME OVER!</div>
  <div class="restart-level"><strong>&#8635;&nbsp; </strong> RESTART LEVEL</div>
  <div class="restart-game"><strong>&#8635;&nbsp; </strong> RESTART GAME</div>`;
  
  grid.appendChild(gameOverText);
  setInterval(() => ball.style.backgroundColor = ball.style.backgroundColor == "rgb(224, 4, 4)" ? "white" : "rgb(224, 4, 4)", 100);
  
  let restartLevelText = gameOverText.querySelector(".restart-level");
  let restartGameText = gameOverText.querySelector(".restart-game");

  restartLevelText.addEventListener("click", function() {
    // do something when the "next level" text is clicked
    location.reload();
    
  });
  restartGameText.addEventListener("click", function() {
    window.location.href = "index.html";
  });
}

function levelPassed(){
  clearInterval(gameInterval);

  let levelPassedText = document.createElement("div");

  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  levelPassedText.innerHTML =
  `<div class="level-passed">LEVEL PASSED!</div>
  <div class="next-level">&#10132; NEXT LEVEL</div>`;

  grid.appendChild(levelPassedText);

  let nextLevelText = levelPassedText.querySelector(".next-level");
  nextLevelText.addEventListener("click", function() {
    // do something when the "next level" text is clicked
    // load next level script
  const script = document.createElement('script');
  script.src = `level-${level}.js`;
  document.body.appendChild(script);
  
  // increment level for next click
  level++;
  });
}

let gamePauseText;

const gamePaused = () => {
  clearInterval(gameInterval);
  gameInterval = null; // reset gameInterval variable 

  if (countdown) {
    clearInterval(countdown);
  }

  gamePauseText = document.createElement("div");

  gamePauseText.innerHTML = 
  `<div class="pause">PAUSED</div>
  <div class="play">&#9658; RESUME</div>`;

  grid.appendChild(gamePauseText);
  let gameResumeText = document.querySelector(".play");
  gameResumeText.addEventListener("click", gameResumed);
}

const gameResumed = () => {
  // Remove the paused text from the grid
  grid.removeChild(gamePauseText);

  // Resume the game
  gameInterval = setInterval(moveBall, ballSpeed);
  startCountdown(); // resume the countdown
  paused = false;
}



// Listen for arrow key presses and move the user
document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
      user.style.left = `${Math.max(1, user.offsetLeft - 20)}px`;
    } else if (event.code === "ArrowRight") {
      user.style.left = `${Math.min(grid.clientWidth - user.offsetWidth-1, user.offsetLeft + 20)}px`;
    }
  });


const checkBlocksRemaining = () => {
  const blocks = document.querySelectorAll(".block");
  const hardBlocks = document.querySelectorAll(".block-hard-1");
  const harderBlocks = document.querySelectorAll(".block-hard-2");
  if (blocks.length === 0 && hardBlocks.length === 0 && harderBlocks.length === 0) {
    // All blocks are removed, end the game
    levelPassed();
    clearInterval(countdown);
    let extraScoreForTime = Math.round(timerValue/1000);
    // console.log(extraScoreForTime);
    score+=extraScoreForTime;
    const scoreValue = document.querySelector('.score-value')
    scoreValue.textContent = score;
    
    // alert("You won!");
  }
}

// keep track of whether the ball has taken off from the user yet
let ballLaunched = false; 

//move the ball 
const moveBall= () => {

    const gridRect = grid.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();
    const blocks = document.querySelectorAll(".block");
    const hardBlocks = document.querySelectorAll(".block-hard-1");
    const harderBlocks = document.querySelectorAll(".block-hard-2");
  
    // Check for collision with blocks
    blocks.forEach((block) => {
      const blockRect = block.getBoundingClientRect();
      if (
        ballRect.bottom >= blockRect.top &&
        ballRect.top <= blockRect.bottom &&
        ballRect.right >= blockRect.left &&
        ballRect.left <= blockRect.right
      ) {
        block.remove();
        score+=1; // increase the score by 1
        const scoreValue = document.querySelector('.score-value')
        scoreValue.textContent = score; // update the score display
      }
      checkBlocksRemaining();
    });
  
    // Check for collision with user
    const userRect = user.getBoundingClientRect();
    if (
        ballRect.bottom >= userRect.top &&
        ballRect.top <= userRect.bottom &&
        ballRect.right >= userRect.left &&
        ballRect.left <= userRect.right
      ) {
        // Calculate the distance from the center of the user block to the point where the ball hits the user
        const userCenter = (userRect.left + userRect.right) / 2;
        const ballHitPoint = (ballRect.left + ballRect.right) / 2;
        const distance = ballHitPoint - userCenter;
      
        // Set the new value of ball.dx based on the distance
        ball.dx = distance / 10;
        ball.dy *= -1;
      }
  
    // Check for collision with grid edges
    if (ballRect.top <= gridRect.top) {
      ball.dy *= -1;
    }

    if (ballRect.bottom >= gridRect.bottom) {
      gameOver();
      clearInterval(countdown);
    }
    if (ballRect.left <= gridRect.left || ballRect.right >= gridRect.right) {
      ball.dx *= -1;
    }

    //check for collision with hard blocks 1
    hardBlocks.forEach((hardBlock) => {
      const hardBlockRect = hardBlock.getBoundingClientRect();
      if (
        ballRect.bottom >= hardBlockRect.top &&
        ballRect.top <= hardBlockRect.bottom &&
        ballRect.right >= hardBlockRect.left &&
        ballRect.left <= hardBlockRect.right
      ) {
        // Calculate the distance from the center of the block to the point where the ball hits the block
        const blockCenter = (hardBlockRect.left + hardBlockRect.right) / 2;
        const ballHitPoint = (ballRect.left + ballRect.right) / 2;
        const distance = ballHitPoint - blockCenter;
  
        // Set the new value of ball.dx based on the distance
        ball.dx = distance / 10;
        ball.dy *= -1;
  
        // Remove the block after collision
        hardBlock.remove();
        score += 2;
        const scoreValue = document.querySelector(".score-value");
        scoreValue.textContent = score;
        checkBlocksRemaining();
      }
    });

    //check for collision with harder blocks 
    harderBlocks.forEach((harderBlock) => {
      const harderBlockRect = harderBlock.getBoundingClientRect();
      if (
        ballRect.bottom >= harderBlockRect.top &&
        ballRect.top <= harderBlockRect.bottom &&
        ballRect.right >= harderBlockRect.left &&
        ballRect.left <= harderBlockRect.right
      ) {
        // Calculate the distance from the center of the block to the point where the ball hits the block
        const blockCenter = (harderBlockRect.left + harderBlockRect.right) / 2;
        const ballHitPoint = (ballRect.left + ballRect.right) / 2;
        const distance = ballHitPoint - blockCenter;
  
        // Set the new value of ball.dx based on the distance
        ball.dx = distance / 10;
        ball.dy *= -1;
  
        // Change the block after collision
        harderBlock.classList.remove("block-hard-2");
        harderBlock.classList.add("block-hard-1");

        score += 1;
        const scoreValue = document.querySelector(".score-value");
        scoreValue.textContent = score;
        checkBlocksRemaining();
      }
    });


    // Check if the window size is sufficient to start the game
    if (window.innerWidth < MIN_WINDOW_WIDTH + grid.offsetLeft + 10 || window.innerHeight < MIN_WINDOW_HEIGHT + grid.offsetTop + 10) {
        alert("Game paused due to small window size.");
        return;
      }

    // Launch the ball with a random direction if it hasn't launched yet
    if (!ballLaunched) {
        ball.dx = Math.random() < 0.5 ? -5 : 5;
        ball.dy = -5;
        ballLaunched = true;
      }
  
    // Move the ball
    ball.style.top = `${ball.offsetTop + ball.dy}px`;
    ball.style.left = `${ball.offsetLeft + ball.dx}px`;

  }
  

// Create user block
const user = document.createElement("div");
user.classList.add("user");
// const userElement = document.querySelector(".user");
grid.appendChild(user);

// Create ball
const ball = document.createElement("div");
ball.classList.add("ball");
// ball.dx = -5;
// ball.dy = 5;
grid.appendChild(ball);

// Move the ball every 40 milliseconds
let gameInterval = setInterval(moveBall, ballSpeed);

//timer


let countdown = null; // initialize countdown interval to null

// Get the timer element
const timerElement = document.querySelector('.timer');

// Set the initial timer value to 60 seconds
let timerValue = 9999;

// Update the timer every second
const startCountdown = () => {
  if (countdown) {
    clearInterval(countdown);
  }

  countdown = setInterval(() => {
    // Decrease the timer value by 1
    timerValue--;

    // Update the timer element with the new value
    timerElement.innerText = Math.floor(timerValue/100) + ' s';

    // Check if the timer has reached 0
    if (timerValue === 0) {
      // Stop the countdown
      clearInterval(countdown);

      // Game over logic here
      gameOver();
    }
  }, 10);
}


//check minimum window size
window.addEventListener("resize", () => {
    if ((window.innerWidth < MIN_WINDOW_WIDTH + grid.offsetLeft + 10 || window.innerHeight < MIN_WINDOW_HEIGHT + grid.offsetTop + 10) && overlay.style.display==="none" ) {
      clearInterval(gameInterval);
      gameInterval = null; // reset gameInterval variable
      alert("Game paused due to small window size.");
      // gamePaused();
    } else {
      // Resume the game if it was paused before
      if (!gameInterval) {
        gameInterval = setInterval(moveBall, ballSpeed);
      }
    }
  });

//To pause the game

let paused = false; // initialize the g ame as not paused


window.addEventListener('keydown', function(event) {
  if (event.code === 'Space' && overlay.style.display !=="block") {
    if (!paused) { 
      gamePaused();
      paused = true;
    } else { 
      gameResumed();
      paused = false;
    }
  }
});


startCountdown();