const Player = (marker, playerName) => {
    this.marker = marker
    this.playerName = playerName;

    const getMarker = () => marker;

    return { getMarker };
};

const gameBoard = (() => {
    const grid = ["","","","","","","","",""];

    const setCell = (index, marker) => {
        if (index > grid.length) return;
        grid[index] = marker;
        console.log(grid);
    };

    const getCell = (index) => {
        if (index > grid.length) return;
        return grid[index];
    };

    const reset = () => {
        for (let i = 0; i < grid.length; i++) grid[i] = "";
    }

    return {
        setCell,
        getCell,
        reset,
    }
})();

const displayController = (() => {
    const displayElement = document.getElementById("display")
    const cellElements = document.querySelectorAll(".cell");
    const restartButton = document.getElementById("restartButton");
    const opponentButton = document.getElementById("chooseOpponent");

    cellElements.forEach((cell) => {
        cell.addEventListener("click", (e) => {
            if (gameController.getIsOver() || e.target.textContent !== "") return;
            gameController.playRound(parseInt(e.target.dataset.index));
        });
    });

    const updateGameboard = () => {
        for(let i = 0; i < cellElements.length; i++) {
            if (gameBoard.getCell(i) == "x") cellElements[i].style.color = "rgb(51, 204, 51)";
            else if (gameBoard.getCell(i) == "o") cellElements[i].style.color = "rgb(255, 102, 204)";
            cellElements[i].textContent = gameBoard.getCell(i);
        }
    }
    restartButton.addEventListener("click", (e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setMessageElement("Player X's turn");
    });

    opponentButton.addEventListener("click", () => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setMessageElement("Player X's turn");        
    });

    const gameResultMessage = (winner) => {
        if (winner === "Draw") {
            setMessageElement("It's a Draw!");
        } else {
            setMessageElement(`Player ${winner.toUpperCase()} has won!`);
        }
    };
    const setMessageElement = (message) => {
        displayElement.textContent = message;
    }

    const getOpponentButton = () => {
        return opponentButton;
    }

    return {
        updateGameboard,
        setMessageElement,
        gameResultMessage,
        getOpponentButton,
    };
})();

const gameController = (() => {
    const playerX = Player("x");
    const playerO = Player("o");
    let round = 1;
    let isOver = false;

    const playRound = (cellIndex) => {
        gameBoard.setCell(cellIndex, getCurrentPlayerMarker());
        if (checkWinner(cellIndex)) {
            displayController.gameResultMessage(getCurrentPlayerMarker());
            isOver = true;
            displayController.updateGameboard();
            return;
        }
        if (round === 9) {
            displayController.gameResultMessage("Draw");
            isOver = true;
            displayController.updateGameboard();
            return;
        }
        round++;
        displayController.setMessageElement(`Player ${getCurrentPlayerMarker()}'s turn`);
        displayController.updateGameboard();
        if(getCurrentPlayerMarker() == "o" && displayController.getOpponentButton().checked) {
            let rand;
            do { 
                rand = Math.floor(Math.random()*8);
            } while(gameBoard.getCell(rand) !== "");
            console.log(rand);
            playRound(rand);
        }
    };

    const getCurrentPlayerMarker = () => {
        return round % 2 === 1 ? playerX.getMarker() : playerO.getMarker();
    };

    const checkWinner = (cellIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
          ];
        return winConditions
            .filter((combination) => combination.includes(cellIndex))
            .some((possibleCombination) =>
                possibleCombination.every(
                (index) => gameBoard.getCell(index) === getCurrentPlayerMarker()
                )
            );
    };

    const getIsOver = () => {
        return isOver;
    };

    const reset = () => {
        round = 1;
        isOver = false;
    };
    return {
        playRound,
        getIsOver,
        reset,
    };
})();
