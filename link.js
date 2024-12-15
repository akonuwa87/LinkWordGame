const phrases = [
    ["LUNCH", "BREAK", "ROOM", "SERVICE", "DOG", "PARK"],
    ["BOOK", "WORM", "HOLE", "PUNCH", "LINE", "DANCE"],
    ["RAIN", "BOW", "TIE", "DYE", "CAST", "IRON"],
    ["FIRE", "WORK", "SHOP", "LIFT", "OFF", "BEAT"],
    ["SNOW", "BALL", "PARK", "BENCH", "PRESS", "RELEASE"],
    ["FOOT", "PRINT", "SCREEN", "PLAY", "GROUND", "ZERO"],
    ["EYE", "LASH", "BACK", "PACK", "RAT", "RACE"],
    ["HEART", "BEAT", "BOX", "SPRING", "BOARD", "GAME"],
    ["TREE", "HOUSE", "BOAT", "RACE", "TRACK", "RECORD"],
    ["ROCK", "STAR", "FISH", "TANK", "TOP", "HAT"],
    ["BLUE", "BIRD", "HOUSE", "GUEST", "BOOK", "MARK"],
    ["TOOTH", "PICK", "AXE", "HANDLE", "BAR", "STOOL"],
    ["DOOR", "BELL", "HOP", "SCOTCH", "TAPE", "WORM"],
    ["CANDLE", "STICK", "FIGURE", "EIGHT", "BALL", "ROOM"],
    ["FLASH", "LIGHT", "YEAR", "BOOK", "SHELF", "LIFE"],
    ["PEPPER", "MINT", "CONDITION", "REPORT", "CARD", "SHARK"],
    ["MATCH", "BOX", "OFFICE", "CHAIR", "LIFT", "GATE"],
    ["BUTTER", "FLY", "BALL", "POINT", "BLANK", "SLATE"],
    ["BLUE", "BIRD", "HOUSE", "GUEST", "BOOK", "MARK"],
    ["HEART", "BEAT", "BOX", "SPRING", "BOARD", "WALK"]
];

let currentPhrase;
let height = 6; // number of words/rows
let width = 8; // max length of the word
let gameover = false;
let hintButtonActive = false;
let correctWordsGuessed = 0;
let currentRow = 1;
let hintUsed = false;
let firstAttempt = true; // Track if it's the player's first attempt at each word
let incorrectAttempts = 0; // Track the number of errors made by the player

window.onload = function () {
    initialize();
};

function initialize() {
    currentPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    createBoard();
    addEventListeners();
    revealFirstAndLastWord();
    updateButtons();
    updateErrorCounter(); // Initialize the error counter
}

function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = '';
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("input");
            tile.id = r + "-" + c;
            tile.classList.add("tile");
            tile.type = "text";
            tile.maxLength = 1; // Only allow one letter per tile
            board.appendChild(tile);
        }
    }
}

function addEventListeners() {
    document.getElementById("giveUpBtn").addEventListener("click", giveUp);
    document.getElementById("giveHintBtn").addEventListener("click", function () {
        giveHint();
        hideHintButton();
    });
    document.getElementById("tryAgainBtn").addEventListener("click", tryAgain);

    for (let r = 1; r < height - 1; r++) {
        const wordLength = currentPhrase[r].length;
        for (let c = 0; c < wordLength; c++) {
            let tile = document.getElementById(r + "-" + c);
            tile.addEventListener("input", function () {
                this.value = this.value.toUpperCase();
                if (c + 1 < wordLength && this.value) {
                    document.getElementById(r + "-" + (c + 1)).focus();
                }
            });
            tile.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    checkWord(r);
                } else if (e.key === "Backspace" && !this.value && c > 0) {
                    document.getElementById(r + "-" + (c - 1)).focus();
                }
            });
        }
    }
}

function revealFirstAndLastWord() {
    revealWord(0, 0); // First word
    revealWord(5, 5); // Last word
    revealNextWordFirstLetter();
}

function revealWord(wordIndex, row) {
    for (let c = 0; c < currentPhrase[wordIndex].length; c++) {
        let tile = document.getElementById(row + "-" + c);
        tile.value = currentPhrase[wordIndex][c];
        tile.classList.add("revealed");
        tile.disabled = true;
    }
}

function revealNextWordFirstLetter() {
    if (correctWordsGuessed < height - 2) { // -2 because first and last words are already revealed
        let tile = document.getElementById(currentRow + "-0");
        tile.value = currentPhrase[currentRow][0];
        tile.classList.add("revealed");
        tile.disabled = true;
    }
}

function checkWord(row) {
    const wordLength = currentPhrase[row].length;
    let allCorrect = true;

    for (let c = 0; c < wordLength; c++) {
        let tile = document.getElementById(row + "-" + c);
        if (tile.value !== currentPhrase[row][c]) {
            allCorrect = false;
            tile.classList.add("incorrect-letter");
            tile.value = ""; // Clear incorrect guess
        } else {
            tile.classList.add("correct-letter-orange");
        }
    }

    if (allCorrect) {
        highlightFullWord(row, 'blue');
        correctWordsGuessed++;
        currentRow++;

        // Show hint button only if the word was guessed correctly on the first try
        if (firstAttempt) {
            showHintButton();
        }

        if (correctWordsGuessed === 4) {
            gameover = true;
            revealPuzzle();
            document.getElementById("answer").innerHTML = "Congratulations! You won!<br>The complete link was: " + currentPhrase.join(", ");
        } else {
            revealNextWordFirstLetter();
        }

        firstAttempt = true; // Reset first attempt for the next word
    } else {
        firstAttempt = false;
        incorrectAttempts++;
        updateErrorCounter();
        if (incorrectAttempts >= 6) {
            gameover = true;
            revealPuzzle();
            document.getElementById("answer").innerHTML = "Game Over! You've made too many errors.<br>The complete link was: " + currentPhrase.join(", ");
        }
    }
    updateButtons();
}

function giveHint() {
    if (hintButtonActive && !gameover && currentRow < height - 1) {
        let word = currentPhrase[currentRow];
        for (let c = 1; c < word.length; c++) { // Start from 1 because the first letter is already revealed
            let tile = document.getElementById(currentRow + "-" + c);
            if (tile.value === "") {
                tile.value = word[c];
                tile.classList.add("hint-letter-blue");
                tile.disabled = true;
                hideHintButton();
                return;
            }
        }
    }
}

function highlightFullWord(row, colorClass) {
    const wordLength = currentPhrase[row].length;
    for (let c = 0; c < wordLength; c++) {
        let tile = document.getElementById(row + "-" + c);
        tile.classList.add(colorClass === 'blue' ? 'full-word-correct' : 'correct-letter-orange');
        tile.disabled = true;
    }
}

function updateErrorCounter() {
    document.getElementById("error-counter").innerText = `Errors: ${incorrectAttempts}/6`;
}

function giveUp() {
    gameover = true;
    revealPuzzle();
    document.getElementById("answer").innerHTML = "You gave up.<br>The complete phrase was: " + currentPhrase.join(", ");
    updateButtons();
} 

function tryAgain() {
    gameover = false;
    correctWordsGuessed = 0;
    currentRow = 1;
    hintButtonActive = false;
    hintUsed = false;
    firstAttempt = true;
    incorrectAttempts = 0; // Reset errors
    
    // Clear the answer display
    document.getElementById("answer").innerHTML = "";
    
    initialize();
}

function revealPuzzle() {
    for (let i = 0; i < height; i++) {
        for (let c = 0; c < currentPhrase[i].length; c++) {
            let tile = document.getElementById(i + "-" + c);
            tile.value = currentPhrase[i][c];
            tile.classList.add("revealed");
            tile.disabled = true;
        }
    }
}

function updateButtons() {
    document.getElementById("giveUpBtn").style.display = gameover ? "none" : "inline-block";
    document.getElementById("giveHintBtn").style.display = hintButtonActive && !gameover ? "inline-block" : "none";
    document.getElementById("tryAgainBtn").style.display = gameover ? "inline-block" : "none";
}

function showHintButton() {
    hintButtonActive = true;
    updateButtons();
}

function hideHintButton() {
    hintButtonActive = false;
    updateButtons();
}
