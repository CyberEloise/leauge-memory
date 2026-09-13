/** My cards with IDS names and an image path */
const CARDS = [
    { id: 1, image: "assets/images/ahri.png", name: "ahri" },
    { id: 2, image: "assets/images/darius.png", name: "darius"},
    { id: 3, image:  "assets/images/ezreal.png", name: "ezreal"},
    { id: 4, image: "assets/images/garen.png", name: "garen"},
    { id: 5, image: "assets/images/katarina.png", name: "katarina"},
    { id: 6, image: "assets/images/lee_sin.png", name: "lee_sin"},
    { id: 7, image: "assets/images/leona.png", name: "leona"},
    { id: 8, image: "assets/images/lux.png", name: "lux"},
    { id: 9, image: "assets/images/miss_fortune.png", name: "miss_fortune"},
    { id: 10, image: "assets/images/seraphine.png", name: "seraphine"},
    { id: 11, image: "assets/images/thresh.png", name: "thresh"},
    { id: 12, image: "assets/images/vi.png", name: "vi"},
    { id: 13, image: "assets/images/yasuo.png", name: "yasuo"},
    { id: 14, image: "assets/images/zed.png", name: "zed"}];

// making sure the back of the card is shown before the front card//

const FLIPPED_CARD = "assets/images/back_of_card.png";

const TOTAL_PAIRS = CARDS.length;

const NO_MATCH_DELAY = 800;

const gameAreaE1 = document.getElementById("game-board");
// Game state
 /** cards that are flipped  */
let flippedCards = [];
/**cards that already have been matches so you cant click them again */
let matchedIds = [];
/** whilst TRUE the clicks are ignored on an already matched pair */
let lockBoard = false;
let score = 0;
let incorrectCount = 0;
let timerInterval = null;
let timeElapsed = 0;

/* Event listener */

document.addEventListener("click", (e) => {

    if (e.target && e.target.classList.contains("back-btn")) {
        stopTimer();
        window.location.href = "index.html"
    }

   if (e.target && e.target.classList.contains("reset-btn")) {
        stopTimer();
        matchedIds = [];
        flippedCards = [];
        lockBoard = false;
        score = 0;
        incorrectCount = 0;
        generateBoard();
    }
});

/* Game board */

function buildDeck() {
    const deck = CARDS.flatMap((card) => [
        { ...card, uniqueId: `${card.id}-a` },
         { ...card, uniqueId: `${card.id}-b` }

    ]);
    return shuffle(deck);
}

/* uses fisher-yates so its random - link in readME the website  */
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

const resetButton = document.createElement("button");
resetButton.classList.add("reset-btn");
resetButton.textContent = "Reset";

topHUD.append(backButton, scoreDisplay, timerDisplay, incorrectDisplay, );
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

gameAreaE1.appendChild(resetButton);

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
        document.getElementById("score").textContent =
        `Score: ${score} / ${TOTAL_PAIRS}`;

        resetTurn();
        checkForWin();
    }


    function handleNoMatch(first,second) {
        incorrectCount++;
        document.getElementById("incorrect").textContent =
        `Incorrect: ${incorrectCount}`;

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
                alert(`congratulations you wonTime:
                 ${document.getElementById("timer").textContent.replace("Time:","")}Incorrect flips: ${incorrectCount}`);
            }, 300);  }
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
            timerDisplay.textContent = 
            `Time: ${minutes.toString().padStart(2, "0")}
            :${seconds.toString().padStart(2, "0")}`;
    }, 1000);
  }
   function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
   }

generateBoard();








