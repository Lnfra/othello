

//Initialize the game and call the game loop
function init() {
    var currentPlayer = 'black';
    //Model to store the states
    var boardWidth = 4;
    var boardHeight = 4;
    var board = createBoard(boardWidth, boardHeight, null)
    document.getElementById('currentPlayer').innerHTML = "It is " + currentPlayer + "'s turn.";
    initialPositions(board);
    setValidCells();
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
            //Set valid cell only after the board and currentPlayer is updated
            setValidCells();

        } else if (currentPlayer == 'white' && isUnclickedButton) {
            cell.className = 'white';
            setCell(cellId, 'white');
            //checkForWinner();
            switchPlayerTo('black');
            //Set valid cell only after the board and currentPlayer is updated
            setValidCells();
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
        console.log(board.toString());

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

    function setValidCells() {
        var existingValidMoves = Array.from(document.getElementsByClassName('validMove'));
        var newValidMoves = getValidMoves();

        //Clear all existing valid cells
        existingValidMoves.forEach( function(position){
            position.className='';
        });

        newValidMoves.forEach( function( position){
            var cell = document.getElementById(position[0].toString() + position[1].toString());
            cell.className ='validMove';
        });

        //TODO: Should we remove the event listener from those cells which are not valid moves? or just handle in the listener if/else
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

    //Check board to see which positions are valid moves for the current player
    //TODO: to optimize this algorithm to not check all cells in the board
    //TODO: but only check a list of empty cells directly next to current cells of other color
    //TODO: Write a test case to verify method returns the correct results
    function getValidMoves(){
        console.log('Entered get valid moves');
        var validMoves = [];
        //Traverse the board and check all spaces

        for(y = 0; y < board.length; y++) {
            for(x = 0; x < board[0].length; x++) {
                var toBeFlipped = cellsToBeFlipped(x, y);
                if(toBeFlipped.length != 0){
                    //for all moves which cause cells to be flipped they are valid
                    //Add these valid positions to the list
                    validMoves.push([x,y]);
                }
            }
        }
        return validMoves;
    }

    //Check if move placed on board will cause any cells to be flipped
    //Return lists of cells to be flipped
    //TODO: Write a test case to verify method returns the correct results
    function cellsToBeFlipped(x, y) {

        //All possible 8 directions to check NW, N, NE, E, SE, S, SW, W
        var allDirections = [[-1,-1], [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0]];
        var toBeFlipped = [];

        if(board[y][x] !=null){
            //if this cell is already set do not need to test if it is a valid move
            return toBeFlipped;
        }else{
            //Set the cell temporarily for the purpose of evaluating if it will cause discs to flip
            //Reset the cell back to null before end of function
            board[y][x] = currentPlayer;
        }

        //Loop through each direction
        for(var i = 0; i < allDirections.length; i++){
            var currDir = allDirections[i];
            var currX = x;
            var currY = y;

            currX = currX + currDir[0];
            currY = currY + currDir[1];
            if(isOnboard(currX, currY) && board[currY][currX] == opponentColor()){
                //if the very next position contains opponents colour
                //continue in the same direction
                while(true){
                    console.log('in while loop 1')
                    currX = currX + currDir[0];
                    currY = currY + currDir[1];
                    if(isOnboard(currX, currY) && board[currY][currX] == opponentColor()){
                       continue;
                    } else if(isOnboard(currX, currY) && board[currY][currX] == currentPlayer){
                        //Keep navigating backwards until you have reached the starting position
                        while(true){
                            console.log('in while loop 2')
                            currX = currX - currDir[0];
                            currY = currY - currDir[1];
                            if(currX == x && currY == y){
                                //break out of loop once reached the starting point
                                //TODO: even if break from this loop, how do we break from outer while loop??
                                break;
                            }else {
                                //Add add positions to list
                                toBeFlipped.push([currX, currY]);
                            }
                        }
                        //Break out of the second loop after all the discs to be flipped are saved to list
                        if(currX == x && currY == y){
                            break;
                        }
                    } else {
                        //else if is onboard and is a blank cell/ cell of the same color
                        // or its a position not onboard
                        //skip to next direction
                        break;
                    }

                }

            } else if(isOnboard(currX, currY)) {
                //if the very next position is on the board and contains same colour or no color
                //skip to next direction
                continue;
            } else if(!isOnboard(currX, currY)) {
                //if the very next position is not on the board skip to next direction
                continue;
            }
        }

        //Reset the cell back to empty after the testingis done
        board[y][x] = null;
        console.log('Testing position x =' + x + " y= " + y);
        console.log('length of tobeflipped ' + toBeFlipped.length );
        console.log('positions to be flipped ' + toBeFlipped)
        //Return list of discs to be flipped
        return toBeFlipped;
    }

    //Check that position is within the board
    //TODO: Write a test case to verify method returns correct results
    function isOnboard(x, y) {
        return (y >= 0 && y < board.length) && (x >=0 && x < board[0].length);
    }

    //Returns the color of the other player
    function opponentColor(){
        if(currentPlayer.toLowerCase() == 'black'){
            return 'white';
        } else {
            return 'black';
        }
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
