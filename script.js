// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Bird image
const bird = new Image();
bird.src = 'bluebird.png'; // Path to your local bird image

// Pipe image (used for both top and bottom pipes)
const pipeImg = new Image();
pipeImg.src = 'pipe.png'; // Path to your local pipe image

// Game variables
let birdX = 50;
let birdY = 150;
let birdWidth = 30;
let birdHeight = 30;
let gravity = 1.5;
let lift = -20;
let velocity = 0;
let score = 0;
let gameOver = false;

// Pipes variables
let pipes = [];
let pipeWidth = 40;
let pipeGap = 120; // Gap between top and bottom pipe
let pipeSpeed = 2;
let frameCount = 0;
let pipeFrequency = 90; // Frames before a new pipe appears

// Bird jump control
document.addEventListener('keydown', () => {
  if (!gameOver) {
    velocity = lift;
  } else {
    restartGame();
  }
});

// Function to generate pipes at random heights
function generatePipes() {
  let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
  pipes.push({
    x: canvas.width,
    top: pipeHeight,
    bottom: pipeHeight + pipeGap,
  });
}

// Restart game
function restartGame() {
  birdY = 150;
  pipes = [];
  velocity = 0;
  score = 0;
  frameCount = 0;
  gameOver = false;
  gameLoop();
}

// Drawing top pipe with flipping (canvas transform)
function drawTopPipe(pipe) {
  // Save the context state before transforming it
  context.save();

  // Flip the canvas vertically for the top pipe
  context.translate(pipe.x + pipeWidth / 2, pipe.top);
  context.rotate(Math.PI); // 180-degree rotation to flip the pipe
  context.drawImage(
    pipeImg,
    -pipeWidth / 2, 0, // Correct positioning after flipping
    pipeWidth,
    canvas.height
  );

  // Restore the original canvas state
  context.restore();
}

// Drawing bottom pipe normally
function drawBottomPipe(pipe) {
  context.drawImage(
    pipeImg,
    pipe.x,
    pipe.bottom, // Draw the bottom pipe normally
    pipeWidth,
    canvas.height
  );
}

// Game loop
function gameLoop() {
  if (!gameOver) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Bird physics
    velocity += gravity;
    birdY += velocity;

    // Draw bird
    context.drawImage(bird, birdX, birdY, birdWidth, birdHeight);

    // Pipe generation
    if (frameCount % pipeFrequency === 0) {
      generatePipes();
    }

    // Move and draw pipes
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].x -= pipeSpeed;

      // Draw top pipe (flipped)
      drawTopPipe(pipes[i]);

      // Draw bottom pipe
      drawBottomPipe(pipes[i]);

      // Collision detection (with pipes)
      if (
        birdX < pipes[i].x + pipeWidth &&
        birdX + birdWidth > pipes[i].x &&
        (birdY < pipes[i].top || birdY + birdHeight > pipes[i].bottom)
      ) {
        gameOver = true;
        alert('Game Over! Your score: ' + score);
      }

      // Check if bird passed the pipe
      if (pipes[i].x + pipeWidth < birdX && !pipes[i].passed) {
        score++;
        pipes[i].passed = true; // Mark pipe as passed
      }
    }

    // Remove pipes that have gone off-screen
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

    // Collision detection (with ground or ceiling)
    if (birdY + birdHeight > canvas.height || birdY < 0) {
      gameOver = true;
      alert('Game Over! Your score: ' + score);
    }

    // Draw score
    context.fillStyle = '#000';
    context.font = '20px Arial';
    context.fillText('Score: ' + score, 10, 30);

    frameCount++;
    requestAnimationFrame(gameLoop);
  }
}

// Start the game
gameLoop();
