const GameBoard = (() => {
    const Player = (name, mark) => {
        this.name = name;
        this.mark = mark;
        
        let wins = 0;
        let movesList = [];
    
        this.moves = (slot) => {
            movesList.push(slot.id - 1);
        };

        return { name, mark, wins, moves, movesList }
    };
    
    let _gameBoard = new Array(9);
    let _lastMark = 'O';
    let _firstMoveX = true;
    let gameStart = false;
    let gameEnd = false;
    const playerOne = Player('Player One', 'X');
    const playerTwo = Player('Player Two', 'O');

    const initGame = () => {
        GameBoard.gameStart = true;

        if (_firstMoveX) {
            _lastMove = 'O';
        } else {
            _lastMove = 'X';
        }
    };

    const _gameBoardFull = () => {
        let fullCells = 0;

        for (i in _gameBoard) {
            if (_gameBoard[i] === 'O' || _gameBoard[i] === 'X')
                fullCells++;
        }
        if (fullCells === 9)
            return true;
        else
            return false;
    };

    const _checkRow = (rowCell) => {
        let markRow = _gameBoard[rowCell];
        if (!markRow)
            return false;

        if ((_gameBoard[rowCell + 1] === markRow)
            && (_gameBoard[rowCell + 2] === markRow))
            return markRow;
        else
            return false;
    };

    const _checkRows = () => {
        let rowsStartAt = [0, 3, 6];

        for (rowCell in rowsStartAt) {
            let rowCheck = _checkRow(rowsStartAt[rowCell]);
            if (rowCheck)
                return rowCheck;
            if (rowsStartAt[rowCell] === 6)
                return false;
        }
    };

    const _checkColumn = (columnCell) => {
        let markCol = _gameBoard[columnCell];
        if (!markCol)
            return false;

        if ((_gameBoard[columnCell + 3] === markCol)
            && (_gameBoard[columnCell + 6] === markCol))
            return markCol;
        else
            return false;
    };

    const _checkColumns = () => {
        const columnsStartAt = [0, 1, 2];

        for (columnCell in columnsStartAt) {
            let checkColumn = _checkColumn(columnsStartAt[columnCell]);
            if (checkColumn)
                return checkColumn;
            if (columnsStartAt[columnCell] === 2)
                return false;
        }
    };

    const _checkDiagonals = () => {
        const centerMark = _gameBoard[4];
        if (!centerMark)
            return;

        if ((_gameBoard[0] === centerMark && _gameBoard[8] === centerMark)
            || (_gameBoard[2] === centerMark && _gameBoard[6] === centerMark))
            return centerMark;
        return false;
    };

    const _checkForWin = () => {
        let verifyRows = _checkRows();
        let verifyColumns = _checkColumns();
        let verifyDiagonals = _checkDiagonals();

        let winner = verifyRows || verifyColumns || verifyDiagonals;

        if (winner) {
            setTimeout(() => {
                alert('winner is ' + winner);
                if (playerOne.mark === winner)
                    playerOne.wins++;
                else
                    playerTwo.wins++;
                _displayWinner(winner);
            }, 50);
            GameBoard.gameEnd = true;
        }
    };

    const _displayWinner = (winner) => {
        if (playerOne.wins > playerTwo.wins) {
            document.querySelector('.winsP1').style.visibility = 'visible';
            document.querySelector('.winsP2').style.visibility = 'hidden';
        } else if (playerTwo.wins > playerOne.wins) {
            document.querySelector('.winsP2').style.visibility = 'visible';
            document.querySelector('.winsP1').style.visibility = 'hidden';
        } else if (playerOne.wins === playerTwo.wins) {
            document.querySelector('.winsP1').style.visibility = 'hidden';
            document.querySelector('.winsP2').style.visibility = 'hidden';
        }

        document.getElementById('p1counter').innerHTML = `${playerOne.wins} wins`;
        document.getElementById('p2counter').innerHTML = `${playerTwo.wins} wins`;
    };

    const _placeMarkOnBoard = (slot, mark) => {
        _gameBoard[slot.id - 1] = mark;
        slot.innerHTML = mark;
    };

    const _newGame = () => {
        slots.forEach((slot) => {
            slot.innerHTML = ' ';       /* clear html */
        });
        GameBoard.gameStart = false;
        GameBoard.gameEnd = false;
        _gameBoard = new Array(9);
        if (_firstMoveX)
            _lastMark = 'O';
    }

    const makePlayerTurn = (slot) => {
        let mark;
        if (_lastMark === 'O') {
            mark = 'X';
            playerOne.moves(slot);
        } else {
            mark = 'O';
            playerTwo.moves(slot);
        }

        _lastMark = mark;

        _placeMarkOnBoard(slot, mark);
        _checkForWin();

        if (_gameBoardFull()) {
            setTimeout(function () {
                alert("it's a tie");
            }, 50);
            GameBoard.gameEnd = true;
        }

    };

    const parseButtonsClick = (button) => {
        if (button.id === 'O') {
            button.disabled = true;     // disable 'O' button
            document.getElementById('X').disabled = false;
            _firstMoveX = false;
            _lastMark = 'X';
        } else if (button.id === 'X') {
            button.disabled = true;     // disable 'X' button
            document.getElementById('O').disabled = false;
            _firstMoveX = true;
            _lastMark = 'O';
        } else if (button.id === 'newGame') {
            _newGame();
        } else if (button.id === 'changeNameP1') {
            let newPlayerOneName = prompt('new name?', 'Player One');
            if (newPlayerOneName) {
                playerOne.name = newPlayerOneName;
                document.querySelector('#changeNameP1 > h2').innerHTML = `${playerOne.name}`;
            }
        } else if (button.id === 'changeNameP2') {
            let newPlayerTwoName = prompt('new name?', 'Player Two');
            if (newPlayerTwoName) {
                playerTwo.name = newPlayerTwoName;
                document.querySelector('#changeNameP2 > h2').innerHTML = `${playerTwo.name}`;
            }
        }
    };

    return { gameStart, gameEnd, initGame, makePlayerTurn, parseButtonsClick };
})();

const slots = document.querySelectorAll('.gameContainer > div');

slots.forEach((slot) => {
    slot.addEventListener('click', () => {
        if (GameBoard.gameStart === false) {
            GameBoard.initGame();
        }
        if (GameBoard.gameEnd === false) {
            GameBoard.makePlayerTurn(slot);
        } else {
            alert('start new game');
        }
    });
});

const buttons = document.querySelectorAll('button');

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        GameBoard.parseButtonsClick(button);
    });
})
