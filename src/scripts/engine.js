const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        livesDisplay: document.querySelector("#lives-display"),
        highScoreDisplay: document.querySelector("#high-score"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3,
        highScore: 0,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    },
};

function initializeGame() {
    state.actions.timerId = setInterval(randomSquare, 1000);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    playGameOverSound();
    state.values.lives--;
    updateLivesDisplay();

    if (state.values.lives > 0) {
        showAlert('Você perdeu uma vida!', 'Você tem ' + state.values.lives + ' vidas restantes.<br> Sua pontuação é: ' + state.values.result + ' pontos!', 'warning', resetGame);
    } else {
        showAlert('Game Over!', 'Você perdeu todas as suas vidas!<br> Sua pontuação é: ' + state.values.result + ' pontos!', 'error', resetGame);
    }

    if (state.values.result > state.values.highScore) {
        state.values.highScore = state.values.result;
        state.view.highScoreDisplay.textContent = state.values.highScore;
    }
}

function showAlert(title, content, icon, callback) {
    Swal.fire({
        title: title,
        html: content,
        icon: icon,
        confirmButtonText: 'Continuar'
    }).then(callback);
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy", "clicked");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function updateLivesDisplay() {
    state.view.livesDisplay.innerHTML = `Lives: <span style="color: #fff;">x${state.values.lives}</span>`;
}

function playSound() {
    let audio = new Audio("./src/audios/hit.m4a");
    audio.volume = 0.2;
    audio.play();
}

function playGameOverSound() {
    let audio = new Audio("./src/audios/game-over.mp3"); 
    audio.volume = 0.2;
    audio.play();
}

function resetGame() {
    state.values.currentTime = 60;
    state.values.result = 0;
    state.view.score.textContent = state.values.result;
    initializeGame();
}

state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
        if (square.id === state.values.hitPosition && !square.classList.contains("clicked")) {
            state.values.result++;
            state.view.score.textContent = state.values.result;
            state.values.hitPosition = null;
            playSound();
            square.classList.add("clicked");
            setTimeout(() => {
                square.classList.remove("clicked");
            }, 1000);
        }
    });
});

document.addEventListener("keydown", (e) => {
    if (e.key === "h") {
        Swal.fire({
            title: "High Score",
            text: "Seu high score é: " + state.values.highScore,
            icon: "info",
            confirmButtonText: "OK",
        });
    }
});

initializeGame();
