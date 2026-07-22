

/** My cards with IDS names and an image path */
const CARDS = [
    { id: 1, name: "ahri", image: "assets/images/ahri.png" },
    { id: 2, name: "darius", image: "assets/images/darius.png"},
    { id: 3, name: "ezreal", image: "assets/images/ezreal.png"},
    { id: 4, name: "garen", image: "assets/images/garen.png"},
    { id: 5, name: "katarina", image: "assets/images/katarina.png"},
    { id: 6, name: "lee_sin", image: "assets/images/lee_sin.png"},
    { id: 7, name: "leona", image: "assets/images/leona.png"},
    { id: 8, name: "lux", image: "assets/images/lux.png"},
    { id: 9, name: "miss_fortune", image: "assets/images/miss_fortune.png"},
    { id: 10, name: "seraphine", image: "assets/images/seraphine.png"},
    { id: 11, name: "thresh", image: "assets/images/thresh.png"},
    { id: 12, name: "vi", image: "assets/images/vi.png"},
    { id: 13, name: "yasuo", image: "assets/images/yasuo.png"},
    { id: 14, name: "zed", image: "assets/images/zed.png"},
];

// making sure the back of the card is shown before the front card//
const FLIPPED_CARD = "assets/images/back_of_card.png";

const TOTAL_PAIRS = CARDS.length;

const NO_MATCH_DELAY = 800;

const gameAreaE1 = document.getElementById("game-board")
// Game state

let flippedCards = [];  /** cards that are flipped  */
let matchedIds = [];  /**cards that already have been matches so you cant click them again */
let lockBoard = false;  /** whilst TRUE the clicks are ignored on an already matched pair */
let score = 0;
let incorrectCount = 0;
let timerInterval = null;
let timeElapsed = 0;

/* Event listener */

document.addEventListener("click", (e) => {

    if (e.target && e.target.classList.contains("back-btn")) {
        stopTimer();
        window.location.href ="index.html"
    }
})


/* Game board */

/* making sure each card is duplicated */

function buildDeck() {
    const deck = CARDS.flatMap(card => [ 
        { ...card, uniqueId: `${card.id}-a` },
         { ...card, uniqueId: `${card.id}-b` },

    ]);
    return shuffle(deck);
}

/* uses fisher-yates so its random - link in readME the website  https://stackoverflow.com/questions/59810241/how-to-fisher-yates-shuffle-a-javascript-array */
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1 ));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;

}


/* Building the card grind, back button, score, timer and incorrect counter */

function generateBoard() {
    gameAreaE1.innerHTML ="";


const backButton = document.createElement("button");
backButton.classList.add("back-btn");
backButton.textContent = "Back";

const topHUD = document.createElement("div");
topHUD.id = "top-hud";

const scoreDisplay = document.createElement("div");
scoreDisplay.id="score"
scoreDisplay.textContent = `Score: 0 / ${TOTAL_PAIRS}`;

const timerDisplay = document.createElement("div");
timerDisplay.id = "timer";
timerDisplay.textContent = "Time: 00:00";

const incorrectDisplay = document.createElement("div");
incorrectDisplay.id = "incorrect";
incorrectDisplay.textContent = "Incorrect: 0";

topHUD.append(backButton, scoreDisplay, timerDisplay, incorrectDisplay );
gameAreaE1.appendChild(topHUD);

/* Card grid */

const gridContainer = document.createElement("div");
gridContainer.id = "grid-container";
gameAreaE1.appendChild(gridContainer);

const deck = buildDeck();

deck.forEach((card) => {
    const cardEL = document.createElement("div");
      cardEL.classList.add("game-card");
    cardEL.dataset.id = card.id;
    cardEL.dataset.uniqueId = card.uniqueId;


cardEL.innerHTML = `
        <img src="${FLIPPED_CARD}" alt="card back" class="card-back">
        <img src="${card.image}" alt="${card.name}" class="card-front">
      `;

      cardEL.addEventListener("click", () => handleCardClick(cardEL,card));
      gridContainer.appendChild(cardEL);

});

startTimer();

}



/* Flipping the cards */


   function handleCardClick(cardEL, card) {
    if (lockBoard) return;
    if (cardEL.classList.contains("flipped")) return;
    if (matchedIds.includes(card.id)) return;

    cardEL.classList.add("flipped");
    flippedCards.push({ el: cardEL, card });

    if (flippedCards.length === 2) {
        checkForMatch();
    }
   }

   function checkForMatch() {
    lockBoard = true;
    const [first,second] = flippedCards;
    const isMatch = first.card.id === second.card.id;

    if (isMatch) {
        handleMatch(first,second);
      } else {
        handleNoMatch(first,second)
      }

    }


    function handleMatch(first,second) {
        matchedIds.push(first.card.id);
        first.el.classList.add("matched");
        second.el.classList.add("matched");

        score++;
        document.getElementById("score").textContent = `Score: ${score} / ${TOTAL_PAIRS}`;

        resetTurn();
        checkForWin();
    }


    function handleNoMatch(first,second) {
        incorrectCount++;
        document.getElementById("incorrect").textContent =`Incorrect: ${incorrectCount}`;

        setTimeout(() => {
            first.el.classList.remove("flipped");
            second.el.classList.remove("flipped");
            resetTurn();
            }, NO_MATCH_DELAY);

        }
            

    function resetTurn() {
        flippedCards = [];
        lockBoard = false;
    }

    function checkForWin() {
        if (matchedIds.length === CARDS.length)  {
            stopTimer();
            setTimeout(() => {
                alert(`CONGRATS YOU WON! Time: ${document.getElementById("timer").textContent.replace("Time:","")}-Incorrect flipss: ${incorrectCount}`);
            }, 300);        }
    }


    /* Timer functions */

    function startTimer() {
        const timerDisplay = document.getElementById("timer");
        timeElapsed = 0;

        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeElapsed++;
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
  }
        
   function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
   }
    


generateBoard();


    

   



