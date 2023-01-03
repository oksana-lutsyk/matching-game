class MatchGrid {
    constructor(width, height, columnsNumber, rowsNumber, boardColor, timeLimit, primaryColor, secondaryColor) {
        this.width = width;
        this.height = height;
        this.columnsNum = columnsNumber;
        this.rowsNum = rowsNumber;
        this.boardColor = boardColor;
        this.timeLimit = timeLimit,
            this.primaryColor = primaryColor,
            this.secondaryColor = secondaryColor
    }

    get gameWrapperWidth() {
        return this.width;
    }

    get gameWrapperHeight() {
        return this.height;
    }

    get gameBoardColor() {
        return this.boardColor;
    }

    get columnsNumber() {
        return this.columnsNum;
    }
    get rowsNumber() {
        return this.rowsNum;
    }

    get cardsNumber() {
        return (+matcher.columnsNumber * +matcher.rowsNumber) / 2;
    }

    get matchedElementCount() {
        return matchedElementsCount
    }

    get gameTimeLimit() {
        return this.timeLimit
    }

    get primaryThemeColor() {
        return this.primaryColor
    }

    get secondaryThemeColor() {
        return this.secondaryColor
    }

    checkForMatch() {
        const isEqual = firstCard.getAttribute('id') === secondCard.getAttribute('id');

        isEqual ? matcher.disableCards() : matcher.unflipCards();
    }

    flipCard(event) {
        if (boardLocked) return;

        const target = event.target.parentElement;

        if (target === firstCard) return;

        matcher.cardAnimation(target, 180);

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = target;

        } else {
            hasFlippedCard = false;
            secondCard = target;
            matcher.checkForMatch()
        }
    }

    disableCards() {
        matcher.updateMatchedElementsCount(1)

        firstCard.removeEventListener('click', this.flipCard);
        secondCard.removeEventListener('click', this.flipCard);

        if (matcher.matchedElementCount === cards.length / 2) {
            setTimeout(() => matcher.endGame(), 1000)
        }
    }

    unflipCards() {
        boardLocked = true;
        setTimeout(() => {
            matcher.cardAnimation(firstCard, 0);
            matcher.cardAnimation(secondCard, 0);

            boardLocked = false;
            matcher.resetBoard()

        }, 1000)
    }

    resetBoard() {
        hasFlippedCard = false;
        boardLocked = false;
        firstCard = null;
        secondCard = null;
    }

    replayGame() {
        const isReplay = true;
        cards.forEach((card) => {
            matcher.cardAnimation(card, 0, isReplay);
            card.addEventListener('click', matcher.flipCard);
        });
        matcher.resetBoard();

        matcher.updateMatchedElementsCount(0)

        overlay.classList.remove('visible')

        matcher.resetTimer();
    }

    flipCardAnimation(target, deg) {
        anime({
            targets: target,
            rotateY: deg + 'deg',
            duration: 500,
            easing: 'linear'
        });
    }

    shakeCardAnimation(target) {
        const xMax = 16;
        anime({
            targets: target,
            easing: 'easeInOutSine',
            duration: 550,
            translateX: [
                {
                    value: xMax * -1,
                },
                {
                    value: xMax,
                },
                {
                    value: xMax / -2,
                },
                {
                    value: xMax / 2,
                },
                {
                    value: 0
                }
            ],
        });
    }

    cardAnimation(target, deg, replay = false) {
        if (deg !== 0 || replay) {
            matcher.flipCardAnimation(target, deg);
        }
        else {
            matcher.shakeCardAnimation(target, deg);
            setTimeout(() => {
                matcher.flipCardAnimation(target, deg);
            }, 1000)
        }
    }

    startGame() {
        overlay.classList.remove('visible');
        matcher.startTimer(matcher.gameTimeLimit)
    }

    endGame() {
        overlay.classList.add('visible')
        playButton.style.display = "none";
        completeGameButton.style.display = "block";
        clearInterval(interval);

    }

    gemeOver() {
        overlay.classList.add('visible')
        playButton.style.display = "none";
        completeGameButton.style.display = "block";
        completeGameButton.innerText = 'YOU FAILED';
        clearInterval(interval);
    }

    pauseTimer() {
        clearInterval(interval);
    }

    resetTimer() {
        clearInterval(interval)
        matcher.startTimer(initTimeLimit)
    }

    updateMatchedElementsCount(count) {
        count === 0 ? matchedElementsCount = 0 : matchedElementsCount += 1
        matches.innerHTML = "MATCHES: " + matcher.matchedElementCount;
    }

    startTimer(duration) {
        interval = setInterval(() => {
            mins = parseInt(duration / 60, 10)
            seconds = parseInt(duration % 60, 10);

            mins = mins < 10 ? "0" + mins : mins;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            if (--duration < 0) {
                matcher.gemeOver()

                clearInterval(interval);
            }

            secondsValue.innerHTML = seconds;
            minsValue.innerHTML = mins + ':';

            this.timeLimit--

        }, 1000);
    }
}

const tableWidth = 700;
const tableHeight = 700;
const columnNum = 4;
const rowNum = 5;

const initTimeLimit = 60;
const primaryColor = 'rgb(129, 49, 56)';
const secondaryColor = 'white';
const boardColor = '#81313833';


let matcher = new MatchGrid(tableWidth, tableHeight, columnNum, rowNum, boardColor, initTimeLimit, primaryColor, secondaryColor);


//create game board
const gameBoard = document.createElement('div');
document.body.appendChild(gameBoard);
gameBoard.classList.add('game-board');

//create header
const header = document.createElement('header');
gameBoard.appendChild(header);

//add replay button
const replayButton = document.createElement('button');
header.appendChild(replayButton);
replayButton.classList.add('replay-button');
replayButton.style.color = matcher.secondaryThemeColor;
replayButton.style.backgroundColor = matcher.primaryThemeColor;
replayButton.innerText = 'Replay';

//add matches block
const matches = document.createElement('span');
header.appendChild(matches);
matches.classList.add('matches');
matches.style.color = matcher.primaryThemeColor;
matches.style.backgroundColor = matcher.secondaryThemeColor;


//add timer
const timer = document.createElement('div');
header.appendChild(timer);
timer.classList.add('timer');
timer.style.backgroundColor = matcher.primaryThemeColor;
timer.style.color = matcher.secondaryThemeColor;


const hoursValue = document.createElement('span');
timer.appendChild(hoursValue);
hoursValue.classList.add('hours');
hoursValue.innerText = '00:';

const minsValue = document.createElement('span');
timer.appendChild(minsValue);
minsValue.classList.add('mins');
minsValue.innerText = '00:';

const secondsValue = document.createElement('span');
timer.appendChild(secondsValue);
secondsValue.classList.add('seconds');
secondsValue.innerText = '00';


//create game
const memoryGame = document.createElement('section');
gameBoard.appendChild(memoryGame);
memoryGame.classList.add('memory-game');
//create card
for (let i = 0; i < 2; i++) {
    const iterationsCount = matcher.cardsNumber;
    for (let index = 0; index < iterationsCount; index++) {
        const card = document.createElement('div');
        memoryGame.appendChild(card);
        card.classList.add('memory-card');
        card.setAttribute('id', index);


        const cartFrontFace = document.createElement('span');
        card.appendChild(cartFrontFace);
        cartFrontFace.classList.add('front-face');
        cartFrontFace.style.color = matcher.secondaryThemeColor;
        cartFrontFace.style.backgroundColor = matcher.primaryThemeColor;

        const cartBackFace = document.createElement('span');
        card.appendChild(cartBackFace);
        cartBackFace.classList.add('back-face');
        cartBackFace.style.backgroundColor = 'grey'

    }

}
//create overlay
const overlay = document.createElement('div');
gameBoard.appendChild(overlay);
overlay.classList.add('overlay', 'visible');

//create overlay buttons
const playButton = document.createElement('button');
overlay.appendChild(playButton);
playButton.classList.add('play-button');
playButton.style.backgroundColor = matcher.primaryThemeColor;
playButton.innerText = 'Play'

const completeGameButton = document.createElement('button');
overlay.appendChild(completeGameButton);
completeGameButton.classList.add('game-over-button');
completeGameButton.style.backgroundColor = matcher.primaryThemeColor;
completeGameButton.innerText = 'Congratulations! You Won'


const cards = document.querySelectorAll('.memory-card');



let hasFlippedCard = false;
let firstCard;
let secondCard;
let boardLocked = false;

let matchedElementsCount = 0;


let hours = 0;
let mins = 0;
let seconds = 0;

let interval;


gameBoard.style.backgroundColor = matcher.gameBoardColor;
memoryGame.style.height = matcher.gameWrapperHeight + 'px';
memoryGame.style.width = matcher.gameWrapperWidth + 'px';


cards.forEach((card) => {
    card.addEventListener('click', matcher.flipCard);
    card.firstElementChild.innerHTML = card.getAttribute('id');

    card.style.width = 100 / matcher.columnsNumber + '%';
    card.style.height = 100 / matcher.rowsNumber + '%';

})

replayButton.addEventListener('click', matcher.replayGame);
playButton.addEventListener('click', matcher.startGame);

completeGameButton.style.display = "none";
matches.innerHTML = "MATCHES: " + matcher.matchedElementCount;

completeGameButton.addEventListener('click', matcher.replayGame);


gameBoard.addEventListener("mouseenter", () => {
    if (!overlay.classList.contains('visible')) matcher.startTimer(matcher.gameTimeLimit)
});


gameBoard.addEventListener("mouseleave", matcher.pauseTimer);
