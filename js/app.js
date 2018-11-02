// global scope
let toggledCards = [];
let matched = 0;
let moves = 0;
let time = 0;
let timerId;
let timerOff = true;


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// click event
 const deck = document.querySelector('.deck');

 deck.addEventListener('click', flipCard);

 function flipCard(event) {
   const clickTarget = event.target;
   if (
     clickTarget.classList.contains('card') &&
     !clickTarget.classList.contains('match') &&
     toggledCards.length < 2 &&
     !toggledCards.includes(clickTarget)
   ) {
     if (timerOff) {
       startTimer();
       timerOff = false;
     }
     toggleCard(clickTarget);
     addToggledCard(clickTarget);
     if (toggledCards.length === 2) {
       checkForMatch();
       addMove();
       checkScore();
     }
     const TOTAL_PAIRS = 8;
     if (matched === TOTAL_PAIRS) {
       gameOver();
     }
   }
 }

function toggleCard(clickTarget) {
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
}

function addToggledCard(clickTarget) {
  toggledCards.push(clickTarget);

}

function checkForMatch() {
  if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) {
    toggledCards[0].classList.toggle('match');
    toggledCards[1].classList.toggle('match');
    toggledCards = [];
    matched++;
  } else {
    setTimeout(noMatch, 1000);
  }
}

function noMatch() {
  toggleCard(toggledCards[0]);
  toggleCard(toggledCards[1]);
  toggledCards = [];
}

function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}

shuffleDeck();

function addMove() {
  moves++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}

function checkScore() {
  if (moves === 12 || moves === 21) {
    removeStar();
  }
}

function removeStar() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display != 'none') {
      star.style.display = 'none';
      break;
    }
  }
}


// timer
function startTimer() {
  timerId = setInterval(() => {
    time++;
    displayTime();
  }, 1000);
}

function displayTime() {
  const timer = document.querySelector('.timer');
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (seconds < 10) {
    timer.innerHTML = `${minutes}:0${seconds}`;
  } else {
    timer.innerHTML = `${minutes}:${seconds}`;
  }
}

function stopTimer() {
  clearInterval(timerId);
}


// modal
function toggleModal() {
  const modal = document.querySelector('.modal__background');
  modal.classList.toggle('hide');
}

function writeModalStats() {
  const timeStat = document.querySelector('.modal__time');
  const timerTime = document.querySelector('.timer').innerHTML;
  const movesStat = document.querySelector('.modal__moves');
  const starsStat = document.querySelector('.modal__stars');
  const stars = getStars();
  timeStat.innerHTML = `Time = ${timerTime}`;
  movesStat.innerHTML = `Moves = ${moves}`;
  starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
    if (star.style.display!== 'none') {
      starCount++;
    }
  }
  return starCount;
}

document.querySelector('.modal__cancel').addEventListener('click', toggleModal);
document.querySelector('.modal__close').addEventListener('click', toggleModal);
document.querySelector('.restart').addEventListener('click', resetGame);
document.querySelector('.modal__replay').addEventListener('click', replayGame);


// end game restart functions
function resetGame() {
  resetClock();
  resetMoves();
  resetStars();
  shuffleDeck();
  resetCards();
}

function resetClock() {
  stopTimer();
  timerOff = true;
  time = 0;
  displayTime();
}

function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
  stars = 0;
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    star.style.display = 'inline';
  }
}

function gameOver() {
  stopTimer();
  writeModalStats();
  toggleModal();
}

function replayGame() {
  resetGame();
  toggleModal();
}

function resetCards() {
  const cards = document.querySelectorAll('.deck li');
  for (let card of cards) {
    card.className = 'card';
  }
  matched = 0;
}
