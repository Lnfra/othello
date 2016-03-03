

//Initialize the game and call the game loop
function init() {

    //Model of board
    var board = {
        //TODO: Look into setting the width and height + html table in DOM as configurable instead of hardcoding it
        // Change width and height = 8 for 8 x 8 board
        // Change width and height = 4 for 4 x 4 board
        width: 4,
        height: 4,
        //Variable storing the current score for the two players.
        player1Score: 0,
        player2Score: 0,

        //Variable storing the current player at any point in time
        currentPlayer: 'player1',

        data:[],

        //Creates a 2D array initialized with null values for the board model
        createBoard: function(){
            var data = [];
            for(i = 0; i < this.height; i++) {
                data[i] = [];
                for(j = 0; j < this.width; j++) {
                    data[i][j] = null;
                }
            }
            this.data = data;
        },

        setCell: function(x, y, newCellValue) {
            var prevCellValue = this.data[y][x];
            this.data[y][x] = newCellValue;
            this.updateScores(prevCellValue, newCellValue);
        },

        getCell: function(x, y){
            return this.data[y][x];
        },

        //function in charge of updating the score for the players
        updateScores: function( prevValue, newValue ) {
            if( prevValue == newValue ){
                console.log('Do not increment or decrement counter as no change in cell value.');
            } else if( prevValue == null && newValue == 'player1'){
                this.player1Score++;
            } else if( prevValue == null && newValue == 'player2') {
                this.player2Score++;
            } else if ( prevValue == 'player1' && newValue == null) {
                this.player1Score--;
            } else if ( prevValue == 'player2' && newValue == null) {
                this.player2Score--;
            } else if (prevValue == 'player1' && newValue == 'player2') {
                this.player1Score--;
                this.player2Score++;
            } else if (prevValue == 'player2' && newValue == 'player1') {
                this.player2Score--;
                this.player1Score++;
            } else {
                console.log('Undefined condition in updateScore()');
            }
        },

        printBoard: function(){
            console.log('Printing current board');
            this.data.forEach(function(row){
                console.log(row);
            });
        },

        //Check that position is within the board
        //TODO: Write a test case to verify method returns correct results
        isOnboard: function(x, y) {
            return (y >= 0 && y < this.height) && (x >=0 && x < this.width);
        },

        currentPlayerName: function(){
            if(this.currentPlayer == 'player1'){
                return 'Player 1';
            }else if(this.currentPlayer == 'player2') {
                return 'Player 2';
            }else {
                return '';
            }
        }
    };


    //Start the game with player1
    switchPlayerTo('player1');

    //Initialize the board
    board.createBoard();
    //Set the board to the initial layout
    initialPositions();
    //Get the valid cells for next move and set the css class for hover effect
    setValidCells();
    //Attach listeners to all cells
    addListeners();
    //print board status to console for debugging
    board.printBoard();

    console.log('The current player1 score is : ' + board.player1Score);
    console.log('The current player2 score is : ' + board.player2Score);


    function addListeners() {
        //Assign event listeners to all cells in the board
        var cells = Array.from(document.querySelectorAll('table td'));
        for (var i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', changeColor);
        }
    }

    //Event listener to handle processing when user clicks a cell
    function changeColor(event){
        console.log('clicked');

        //TODO: Fix this selector as if user clicks on a cell which is already filled target is div whose firstchild is undefined
        console.log(event.target.firstChild.id);


        //Do we really need the Id? Can we just do var cell = event.target?
        //Target is the td, to get the id of the circle, get id of the first child.
        var cellId = event.target.firstChild.id;
        var cell = document.getElementById(cellId);
        var isValidMove = event.target.className == 'validMove';
        //Check if this button has not been clicked before
        var isUnclickedButton = getCell(cellId) == null;

        if (isValidMove && board.currentPlayer == 'player1' && isUnclickedButton ) {
            //TODO: To try and  refactor the below code so that the below order dosent matter.
            //TODO: processing by side effect is prone to error hard to debug
            //Note flip cells before changing currentPlayer as flipCells uses the value of currentPlayer
            //Also before setting cell color as function ignores cells which are already set

            flipCells(cellId);

            setCell(cellId, 'player1');

            switchPlayerTo('player2');
            //Set valid cell only after the board and currentPlayer is updated
            setValidCells();



        } else if (isValidMove && board.currentPlayer == 'player2' && isUnclickedButton) {
            //Note flip cells before changing currentPlayer as flipCells uses the value of currentPlayer
            //Also before setting cell color as function ignores cells which are already set

            flipCells(cellId);

            setCell(cellId, 'player2');

            switchPlayerTo('player1');
            //Set valid cell only after the board and currentPlayer is updated
            setValidCells();


        } else {
            console.log('Ignored click as it is not a valid move for current player');
        }

        updateScoreBoard();

        board.printBoard();
        console.log('The current player1 score is : ' + board.player1Score);
        console.log('The current player2 score is : ' + board.player2Score);
    }


    //Checks if a move is made what are the oponnents cells to be flipped
    //And gones on to flip them
    function flipCells(cellId){
        //Check for a particular move made what are the cells to be flipped
        var cellIds = cellId.split('');
        var x = Number(cellIds[0]);
        var y = Number(cellIds[1]);
        var toFlip =  cellsToBeFlipped(x, y);

        //TODO: Possible to write some method to flips both model and dom at the same time instead of handling seperately?!
        toFlip.forEach( function(cell) {
            //Flip the cells in the board model
            board.setCell(cell[0], cell[1], board.currentPlayer );

            //Also remember to flip the cells in the Dom
            var cellId = cell[0].toString() + cell[1].toString();
            document.getElementById(cellId).className = board.currentPlayer;

        });

        console.log('Cell clicked on = ' + cellId);
        console.log('Cells to be flipped = ' + toFlip);
    }

    //Sets the value of a cell in the model and the dom
    function setCell(cellId, player) {
        var cellIds =  cellId.split('');
        var vertical = Number(cellIds[1]);
        var horizontal = Number(cellIds[0]);
        //Set board value
        board.setCell(horizontal, vertical, player.toLowerCase());
        //Set dom value
        document.getElementById(cellId).className = player;
        board.printBoard();
    }

    //TODO: Can the below be improved besides using split?
    //Gets the value of a cell
    function getCell(cellId) {
        var cellIds =  cellId.split('');
        var x = Number(cellIds[0]);
        var y = Number(cellIds[1]);
        return board.getCell(x, y);
    }

    //Set the board to the initial layout
    function initialPositions() {
        //Calculate the center of board
        var xPos = board.width / 2;
        var yPos = board.height / 2;

        var whitePos2 = xPos.toString() + yPos.toString();
        var whitePos1 = (xPos-1).toString() + (yPos-1).toString();
        var blackPos2 = (xPos-1).toString() + yPos.toString();
        var blackPos1 = xPos.toString() + (yPos-1).toString();

        setCell(whitePos1, 'player2');
        setCell(blackPos1, 'player1');
        setCell(blackPos2, 'player1');
        setCell(whitePos2, 'player2');
        updateScoreBoard();
    }

    //Use getValidMoves to check which cells are valid moves for the current player
    function setValidCells() {
        var existingValidMoves = Array.from(document.getElementsByClassName('validMove'));
        var newValidMoves = getValidMoves();

        //Clear all existing valid cells
        existingValidMoves.forEach( function(position){
            position.className='';
        });

        if(newValidMoves.length > 0 ){
            //If the current player has valid moves proceed to set the location of new moves on the board
            newValidMoves.forEach( function(position){
                //Set the validMove style on the parent td element not the circle.
                var cell = document.getElementById(position[0].toString() + position[1].toString()).parentNode;
                cell.className ='validMove';
            });

        } else {
            //Check if other player has valid moves
            //Require to switch player as getValidMoves has a dependancy on the value of currentPlayer
            switchPlayerTo(opponentColor());
            var opponentValidMoves = getValidMoves();

            //If the current player has no valid move but the next player has valid moves
            if(newValidMoves.length == 0 && opponentValidMoves.length > 0){
                //alert the current player that their turn is passed
                alert(opponentColor() + ' you have no valid moves, passing your turn to ' + board.currentPlayerName() );
                //After they click ok, switch to the next player and set the locations of their valid moves.
                setValidCells();

            } else {
                //Else if both players has no valid moves end the game
                endTheGame();
            }

        }

        //TODO: Should we remove the event listener from those cells which are not valid moves? or just handle in the listener if/else
    }

    //Processes the end of the game
    function endTheGame () {
        //get the winner of the game from the score counter
        if(board.player1Score == board.player2Score){
            document.getElementById('currentPlayer').innerHTML = 'Game Over! It is a Tie!';
        } else{
            var winner = '';
            if (board.player1Score > board.player2Score ){
                winner = 'Player 1';
            } else {
                winner = 'Player 2';
            }
            document.getElementById('currentPlayer').innerHTML = 'Game Over! The winner is ' + winner + '!';
        }
    }

    //Changes the currentPlayer to the next player
    function switchPlayerTo(player) {
        //Toggle value of current player
        board.currentPlayer = player;
        //Update display display to show which player is next
        document.getElementById('currentPlayer').innerHTML = "It is " + board.currentPlayerName() + "'s turn.";

        if(board.currentPlayer == 'player1'){
            document.getElementById('leftArrow').style.visibility = 'visible';
            document.getElementById('rightArrow').style.visibility = 'hidden';
        }else {
            document.getElementById('leftArrow').style.visibility = 'hidden';
            document.getElementById('rightArrow').style.visibility = 'visible';
        }
    }

    //Updates the score in the Dom
    function updateScoreBoard() {
        Array.from(document.getElementsByClassName('player1Score')).forEach( function(element){
            element.innerHTML = board.player1Score;
        });

        Array.from(document.getElementsByClassName('player2Score')).forEach( function(element){
            element.innerHTML = board.player2Score;
        });
    }

    //Check board to see which positions are valid moves for the current player
    //TODO: to optimize this algorithm to not check all cells in the board
    //TODO: but only check a list of empty cells directly next to current cells of other color
    //TODO: Write a test case to verify method returns the correct results
    function getValidMoves(){
        console.log('Entered get valid moves');
        var validMoves = [];
        //Traverse the board and check all spaces

        for(y = 0; y < board.height; y++) {
            for(x = 0; x < board.width; x++) {
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

        if(board.getCell(x, y) !=null){
            //if this cell is already set do not need to test if it is a valid move
            return toBeFlipped;
        }else{
            //Set the cell temporarily for the purpose of evaluating if it will cause discs to flip
            //Reset the cell back to null before end of function
            board.setCell(x, y, board.currentPlayer);
        }

        //Loop through each direction
        for(var i = 0; i < allDirections.length; i++){
            var currDir = allDirections[i];
            var currX = x;
            var currY = y;

            currX = currX + currDir[0];
            currY = currY + currDir[1];
            if(board.isOnboard(currX, currY) && board.getCell(currX, currY) == opponentColor()){
                //if the very next position contains opponents colour
                //continue in the same direction
                while(true){
                    console.log('in while loop 1')
                    currX = currX + currDir[0];
                    currY = currY + currDir[1];
                    if(board.isOnboard(currX, currY) && board.getCell(currX, currY) == opponentColor()){
                       continue;
                    } else if(board.isOnboard(currX, currY) && board.getCell(currX, currY) == board.currentPlayer){
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

            } else if(board.isOnboard(currX, currY)) {
                //if the very next position is on the board and contains same colour or no color
                //skip to next direction
                continue;
            } else if(!board.isOnboard(currX, currY)) {
                //if the very next position is not on the board skip to next direction
                continue;
            }
        }

        //Reset the cell back to empty after the testingis done
        board.setCell(x, y, null);
        console.log('Testing position x =' + x + " y= " + y);
        console.log('length of tobeflipped ' + toBeFlipped.length );
        console.log('positions to be flipped ' + toBeFlipped);
        //Return list of discs to be flipped
        return toBeFlipped;
    }

    //Returns the color of the other player
    function opponentColor(){
        if(board.currentPlayer.toLowerCase() == 'player1'){
            return 'player2';
        } else {
            return 'player1';
        }
    }


}// end of init()



//Load only after the page has loaded
window.addEventListener("load", init ,false);
