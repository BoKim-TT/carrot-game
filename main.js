'use strict';

const CARROT_SIZE = 80;
const CARROT_COUNT = 20;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 10;

const gameBtn = document.querySelector('.gameBtn');
const playBtn = document.querySelector('.fa-play');
const stopBtn = document.querySelector('.fa-stop');
const timeDisplay = document.querySelector('.timer');
const scoreBoard = document.querySelector('.count');

const game = document.querySelector('.game');
const field = document.querySelector('.field');
const fieldPosition = field.getBoundingClientRect();
const popUp = document.querySelector('.pop-up');
const replayBtn = document.querySelector('.refresh-btn');
const commentBox = document.querySelector('.comment');
const carrot = document.querySelector('.carrot');
const bug = document.querySelector('.bug');

const bgAudio = new Audio('sound/bg.mp3');
const carrotAudio = new Audio('sound/carrot_pull.mp3');
const bugAudio = new Audio('sound/bug_pull.mp3');
const allertAudio = new Audio('sound/alert.wav');
const winAudio = new Audio('sound/game_win.mp3');

let score ;
let timer ;

playBtn.addEventListener('click', () => {
  startGame();
});

stopBtn.addEventListener('click', () => {
  stopGame();
});

replayBtn.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

function initGame() {
  score = 0;
  field.innerHTML = '';
  scoreBoard.innerHTML = CARROT_COUNT;
  generateItems('carrot', CARROT_COUNT, 'img/carrot.png');
  generateItems('bug',BUG_COUNT, 'img/bug.png');
}

function startGame() {
  initGame();
  startTimer();
  showTimerAndScore();
  showStopButton();
  playSound(bgAudio);
}

function stopGame() {
  stopTimer();
  showPopUpWithText('');
  hideGameButton();
  stopSound(bgAudio);
  playSound(allertAudio);
}

function finishGame(win) {
  if (win === true) {
    playSound(winAudio);
  } else {
    playSound(bugAudio);
  }
  stopTimer();
  hideGameButton();
  stopSound(bgAudio);
  showPopUpWithText(win ? 'You won!' : 'You lost');
}

function startTimer() {
  let remainingTime = GAME_DURATION_SEC;
  updateTimerText(remainingTime);
  timer = setInterval(() => {
    if (remainingTime <= 0) {
      // clearInterval(timer);
      finishGame(score === CARROT_COUNT);
      return;
    }
    updateTimerText(--remainingTime);
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  timeDisplay.innerHTML = `${min}:${sec}`;
}

function updateScoreBoard() {
  scoreBoard.innerHTML = CARROT_COUNT - score;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}
function stopSound(sound) {
  sound.pause();
}

function showTimerAndScore() {
  scoreBoard.style.visibility = 'visible';
  timeDisplay.style.visibility = 'visible';
}
function showPopUpWithText(text) {
  stopSound(bgAudio);
  playSound(allertAudio);
  popUp.style.display = 'block';
  commentBox.innerHTML = `${text}`;
}

function hidePopUp() {
  popUp.style.display = 'none';
 
}
function hideGameButton() {
  gameBtn.style.visibility = 'hidden';
}

function showStopButton() {
  gameBtn.style.visibility = 'visible';
  playBtn.style.display = 'none';
  stopBtn.style.display = 'block';
}


function generateItems(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldPosition.width - CARROT_SIZE;
  const y2 = fieldPosition.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('src', imgPath);
    item.setAttribute('class', className);
    const x = randomPositioning(x1, x2);
    const y = randomPositioning(y1, y2);
    item.style.position = 'absolute';
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomPositioning(min, max) {
  return Math.random() * (max - min) + min;
}

field.addEventListener('click', (event) => {
  if (event.target.matches('.carrot')) {
    score++;
    event.target.remove();
    updateScoreBoard();
    playSound(carrotAudio);
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (event.target.matches('.bug')) {
    finishGame(false);
  }
});
