const MAX_LIVES = 3;
const INITIAL_TIME = 60;

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
        currentTime: INITIAL_TIME,
        lives: MAX_LIVES,
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

    if (state.values.currentTime <= 0) endGame();
}

function endGame() {
    clearIntervals();
    playSound("./src/audios/game-over.mp3");
    state.values.lives--;
    updateLivesDisplay();

    if (state.values.lives > 0) {
        showLifeLostMessage();
    } else {
        showGameOverMessage();
    }

    updateHighScore();
}

function randomSquare() {
    state.view.squares.forEach(square => square.classList.remove("enemy", "clicked"));
    const randomIndex = Math.floor(Math.random() * state.view.squares.length);
    const randomSquare = state.view.squares[randomIndex];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function updateLivesDisplay() {
    state.view.livesDisplay.innerHTML = `Lives: <span style="color: #fff;">x${state.values.lives}</span>`;
}

function playSound(src) {
    const audio = new Audio(src);
    audio.volume = 0.2;
    audio.play();
}

function resetGame() {
    state.values.currentTime = INITIAL_TIME;
    state.values.result = 0;
    state.view.score.textContent = state.values.result;
    updateLivesDisplay(); // Atualiza a exibição de vidas
    initializeGame();
}

function updateHighScore() {
    if (state.values.result > state.values.highScore) {
        state.values.highScore = state.values.result;
        state.view.highScoreDisplay.textContent = state.values.highScore;
    }
}

function showLifeLostMessage() {
    const lifeText = state.values.lives === 1 ? 'vida restante' : 'vidas restantes';
    Swal.fire({
        title: 'Você perdeu uma vida!',
        html: `Você tem ${state.values.lives} ${lifeText}.<br> Sua pontuação é: ${state.values.result} pontos!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Parar'
    }).then(result => {
        if (result.isConfirmed) {
            resetGame();
        } else {
            // Adicione a lógica para parar o jogo se necessário
            clearIntervals(); // Para os timers se o jogo for parado
        }
    });
}

function showGameOverMessage() {
    Swal.fire({
        title: 'Fim de Jogo!',
        html: `Você perdeu todas as suas vidas!<br> Sua pontuação é: ${state.values.result} pontos!`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Recomeçar',
        cancelButtonText: 'Sair'
    }).then(result => {
        if (result.isConfirmed) {
            state.values.lives = MAX_LIVES; // Redefine vidas para o máximo
            resetGame(); // Reinicia o jogo
        }
    });
}

function clearIntervals() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
}

state.view.squares.forEach(square => {
    square.addEventListener("mousedown", () => {
        if (square.id === state.values.hitPosition && !square.classList.contains("clicked")) {
            state.values.result++;
            state.view.score.textContent = state.values.result;
            playSound("./src/audios/hit.m4a");
            square.classList.add("clicked");
            setTimeout(() => square.classList.remove("clicked"), 1000);
        }
    });
});

initializeGame();
