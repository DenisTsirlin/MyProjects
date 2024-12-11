function generateBattleships(boardSize, ship2Count, ship3Count, ship4Count, ship5Count) {
  var slots = document.getElementsByClassName('slot');
  var shipSizes = [];

  for (var i = 0; i < ship2Count; i++) {
    shipSizes.push(2);
  }
  for (var i = 0; i < ship3Count; i++) {
    shipSizes.push(3);
  }
  for (var i = 0; i < ship4Count; i++) {
    shipSizes.push(4);
  }
  for (var i = 0; i < ship5Count; i++) {
    shipSizes.push(5);
  }

  for (var i = 0; i < shipSizes.length; i++) {
    var shipSize = shipSizes[i];
    var shipSlots = [];
    var validPlacement = false;

    while (!validPlacement) {
      var randomIndex = Math.floor(Math.random() * slots.length);
      var orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';

      if (orientation === 'horizontal') {
        var row = Math.floor(randomIndex / boardSize);
        var startCol = Math.floor(randomIndex % boardSize);
        var endCol = startCol + shipSize;

        if (endCol <= boardSize) {
          var validRange = true;
          var hasSeparation = true;
          for (var j = startCol; j < endCol; j++) {
            var currentIndex = row * boardSize + j;
            var slot = slots[currentIndex];
            if (!slot || slot.classList.contains('battleship')) {
              validRange = false;
              break;
            }
            // Check separation with other ships
            for (var k = row - 1; k <= row + 1; k++) {
              for (var l = j - 1; l <= j + 1; l++) {
                if (k >= 0 && k < boardSize && l >= 0 && l < boardSize) {
                  var separationIndex = k * boardSize + l;
                  var separationSlot = slots[separationIndex];
                  if (separationSlot && separationSlot.classList.contains('battleship')) {
                    hasSeparation = false;
                    break;
                  }
                }
              }
              if (!hasSeparation) {
                break;
              }
            }
            
          }

          if (validRange && hasSeparation) {
            validPlacement = true;
            for (var j = startCol; j < endCol; j++) {
              var currentIndex = row * boardSize + j;
              shipSlots.push(slots[currentIndex]);
            }
          }
        }
      } else if (orientation === 'vertical') {
        var col = randomIndex % boardSize;
        var startRow = Math.floor(randomIndex / boardSize);
        var endRow = startRow + shipSize;

        if (endRow <= boardSize) {
          var validRange = true;
          var hasSeparation = true;
          for (var j = startRow; j < endRow; j++) {
            var currentIndex = j * boardSize + col;
            var slot = slots[currentIndex];
            if (!slot || slot.classList.contains('battleship')) {
              validRange = false;
              break;
            }
            // Check separation with other ships
            for (var k = col - 1; k <= col + 1; k++) {
              for (var l = j - 1; l <= j + 1; l++) {
                if (k >= 0 && k < boardSize && l >= 0 && l < boardSize) {
                  var separationIndex = l * boardSize + k;
                  var separationSlot = slots[separationIndex];
                  if (separationSlot && separationSlot.classList.contains('battleship')) {
                    hasSeparation = false;
                    break;
                  }
                }
              }
              if (!hasSeparation) {
                break;
              }
            }
           
          }

          if (validRange && hasSeparation) {
            validPlacement = true;
            for (var j = startRow; j < endRow; j++) {
              var currentIndex = j * boardSize + col;
              shipSlots.push(slots[currentIndex]);
            }
          }
        }
      }
    }

    if (shipSlots.length > 0) {
      shipSlots.forEach(function (slot) {
        slot.classList.add('battleship');
        slot.setAttribute('data-ship-size', shipSize);
      });
    }
  }
}

function handleSlotClick(event) {
  var slot = event.target;
 

  if (slot.classList.contains('battleship')) {
    if (!slot.classList.contains('hit')) {
      slot.classList.add('hit');
      slot.style.backgroundImage = 'url(/images/giphyBlow.gif)';
      slot.style.backgroundSize = '100% 100%'
      slot.style.backgroundRepeat = 'no-repeat';
      var shipSize = parseInt(slot.getAttribute('data-ship-size'));
      updateScore(shipSize);
      checkShipSunk(shipSize);
      var gameOver = checkAllShipsSunk(ship2Count, ship3Count, ship4Count, ship5Count);
      if (gameOver) {
        alert('Game Over');
        restartGame();
      }
    }
  } else if (!slot.classList.contains('clicked')) {
    slot.classList.add('clicked');
    slot.style.backgroundImage = 'url(/images/giphy.gif)'
    slot.style.backgroundSize = '100%'
    slot.classList.toggle('occupied');
  }
}

function updateScore(shipSize) {
  var scoreCell = document.getElementById('score-' + shipSize);
  var score = parseInt(scoreCell.textContent);
  scoreCell.textContent = score + 1;
}

function checkShipSunk(shipSize) {
  var scoreCell = document.getElementById('score-' + shipSize);
  var sunkCell = document.getElementById('sunk-' + shipSize);
  var score = parseInt(scoreCell.textContent);

  if (score === shipSize) {
    sunkCell.textContent = parseInt(sunkCell.textContent) + 1;
    scoreCell.textContent = 0;
    alert('Ship of size ' + shipSize + ' has been sunk!');
    displayBoomMessage();
  }
}

function updateScoreTable(ship2Count, ship3Count, ship4Count, ship5Count) {
  var scoreCells = document.querySelectorAll('.score-table table td:nth-child(2)');
  var sunkCells = document.querySelectorAll('.score-table table td:nth-child(3)');
  scoreCells[0].textContent = '0';
  scoreCells[1].textContent = '0';
  scoreCells[2].textContent = '0';
  scoreCells[3].textContent = '0';
  sunkCells[0].textContent = '0';
  sunkCells[1].textContent = '0';
  sunkCells[2].textContent = '0';
  sunkCells[3].textContent = '0';
}

function checkAllShipsSunk(ship2Count, ship3Count, ship4Count, ship5Count) {
  var sumAllShips = ship2Count + ship3Count + ship4Count + ship5Count;
  var sunkCells = document.querySelectorAll('.score-table table td:nth-child(3)');

  for (var i = 0; i < sunkCells.length; i++) {
    var currentScore = parseInt(sunkCells[i].textContent);

    if (currentScore !== sumAllShips) {
      // At least one ship is not sunk
      return false;
    }
  }

  // All ships are sunk
  return true;
}

function restartGame() {
  // Clear the game board
  var gameTable = document.getElementById('game-table');
  gameTable.innerHTML = '';

  // Reset the score table
  var scoreCells = document.querySelectorAll('.score-table table td:nth-child(2)');
  for (var i = 0; i < scoreCells.length; i++) {
    scoreCells[i].textContent = '0';
    scoreCells[i].parentNode.classList.remove('score-zero');
  }


}

function displayBoomMessage() {
  playSound();
  var outputDiv = document.getElementById('output');
  var animationImg = document.getElementById('animation');
  animationImg.classList.add('enlarged');

  setTimeout(function () {
    animationImg.classList.remove('enlarged');
  }, 2000);
}
function playSound() {
  var audio = document.getElementById('audio');
  audio.play();
}

const slots = document.querySelectorAll('.slot');

slots.forEach(slot => {
  slot.addEventListener('click', () => {
    if (!slot.classList.contains('occupied')) {
      slot.classList.add('occupied');
      slot.textContent = '';
    }
  });
});