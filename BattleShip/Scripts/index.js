function Main(){
document.addEventListener('DOMContentLoaded', function () {
  var gameForm = document.getElementById('game-form');
  gameForm.addEventListener('submit', startGame);
});
function startGame(event) {
  let toGo = document.getElementById('toGo')
  toGo.classList.add('none')
  event.preventDefault();
  var boardSize = parseInt(document.getElementById('board-size').value);
  ship2Count = parseInt(document.getElementById('ship-2').value);
  ship3Count = parseInt(document.getElementById('ship-3').value);
  ship4Count = parseInt(document.getElementById('ship-4').value);
  ship5Count = parseInt(document.getElementById('ship-5').value);
  showTable();
  generateGameTable(boardSize);
  generateBattleships(boardSize, ship2Count, ship3Count, ship4Count, ship5Count);
  var scoreTable = document.querySelector('.score-table');
  scoreTable.style.display = 'block';
}
function showTable() {
  var gameTable = document.getElementById('game-container');
  gameTable.style.display = 'grid';
  gameTable.style.gridTemplateColumns = 'repeat(var(--board-size), 1fr)';
  gameTable.classList.add('game-table');
}
function generateGameTable(boardSize) {
  var gameContainer = document.getElementById('game-container');
  gameContainer.style.setProperty('--board-size', boardSize);
  gameContainer.innerHTML = '';
  for (var i = 0; i < boardSize * boardSize; i++) {
    var slot = document.createElement('div');
    slot.className = 'slot';
    slot.addEventListener('click', handleSlotClick);
    gameContainer.appendChild(slot);
  }
}
}
Main();