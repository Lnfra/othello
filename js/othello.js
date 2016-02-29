

//Initialize the game and call the game loop
function init() {
    var currentPlayer = 'black';
    //Model to store the states
    var boardWidth = 4;
    var boardHeight = 4;
    var board = createBoard(boardWidth, boardHeight, null)
    document.getElementById('currentPlayer').innerHTML = "It is " + currentPlayer + "'s turn.";
    initialPositions(board);

    addListeners();
    printBoard();


    //Assign event listeners to all cells in the board
    function addListeners() {
        var cells = Array.from(document.querySelectorAll('table td'));
        for (var i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', changeColor);
        }
    }

    function changeColor(event){
        console.log('clicked');
        console.log(event.target.id);

        //Do we really need the Id? Can we just do var cell = event.target?
        var cellId = event.target.id;
        var cell = document.getElementById(cellId);
        //Check if this button has not been clicked before
        var isUnclickedButton = getCell(cellId) == null;

        if (currentPlayer == 'black' && isUnclickedButton) {
            cell.className = 'black';
            setCell(cellId, 'black');
            //checkForWinner();
            switchPlayerTo('white');

        } else if (currentPlayer == 'white' && isUnclickedButton) {
            cell.className = 'white';
            setCell(cellId, 'white');
            //checkForWinner();
            switchPlayerTo('black');
        } else {
            console.log('Ignore click as button has been clicked before.');
        }

        printBoard();
    }

    //Sets the value of a cell
    function setCell(cellId, color) {
        var cellIds =  cellId.split('');
        var vertical = Number(cellIds[1]);
        var horizontal = Number(cellIds[0]);
        //Set board value
        board[vertical][horizontal]= color.toLowerCase();
        //Set dom value
        document.getElementById(cellId).className = color;

    }

    //TODO: Can the below be improved besides using split?
    //Gets the value of a cell
    function getCell(cellId) {
        var cellIds =  cellId.split('');
        var vertical = Number(cellIds[1]);
        var horizontal = Number(cellIds[0]);
        return board[vertical][horizontal];
    }

    //Set the board to the initial layout
    function initialPositions() {
        setCell('11', 'white');
        setCell('12', 'black');
        setCell('21', 'black');
        setCell('22', 'white');
    }

    function printBoard() {
        console.log('Printing Board');
        board.forEach(function(row){
            console.log(row);
        });
    }

    function switchPlayerTo(player) {
        //Toggle value of current player
        currentPlayer = player;

        //Update display display to show which player is next
        document.getElementById('currentPlayer').innerHTML = "It is " + player + "'s turn.";

        //Change the class for all buttons on the board to affect hover color
        //var boardButtons = document.querySelectorAll('td > button');
        //for (i = 0; i < boardButtons.length; ++i) {
        //    boardButtons[i].className = player.toLowerCase();
        //}
    }

}// end of init()



//Creates a 2D array initialized with a value
function createBoard(width, height, val) {
    var board = [];
    for(i = 0; i < height; i++) {
        board[i] = [];
        for(j = 0; j < width; j++) {
            board[i][j] = val;
        }
    }
    return board;
}


//Load only after the page has loaded
window.addEventListener("load", init ,false);
