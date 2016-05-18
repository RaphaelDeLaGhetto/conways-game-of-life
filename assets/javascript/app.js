// 2016-5-16 http://stackoverflow.com/questions/4288253/html5-canvas-100-width-height-of-viewport
(function() {
    /**
     * Constants
     */
    var board = null,
        cellSize = 20,
        interval = 550,
        random = true,
        delta = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        controls = document.getElementById("controls");
        
        
    context.fillStyle = "rgba(0, 0, 0, 0.8)";

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    
    
    // Control events...
    controls.addEventListener("click", toggleChaos);
    
    controls.addEventListener("mouseover", function() {
        controls.style.opacity = 1;
    });
    
    controls.addEventListener("mouseleave", function() {
        controls.style.opacity = 0.6;
    });

    /**
     * 
     */
    function toggleChaos() {
        random = !random;
        if (random) controls.style.backgroundImage = "url('/assets/images/go.gif')";
        else controls.style.backgroundImage = "url('/assets/images/stop.gif')";
    }
    
    /**
     * 
     */
    function noOpacity() {
        controls.style.opacity = 1;
    }
 
    /**
     * 
     */
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      
      /**
       * Your drawings need to be inside this function otherwise they will be reset when 
       * you resize the browser window and the canvas goes will be cleared.
       */
      drawStuff(); 
   }
   resizeCanvas();
   setInterval(drawStuff, interval);

    /**
     * Generate a randomized game board
     * 
     * @param width - int
     * @param height - int
     * 
     * @return array
     */
    function makeBoard(width, height) {
        board = [];
        for (var i = 0; i < height; i++) {
            var row = [];
            for (var j = 0; j < width; j++) {
                row.push(Math.floor(Math.random() * 2));
            }
            board.push(row);
        }
    }
     
    /**
     * Move the gameboard forward 
     * 
     * @param gameboard - array
     * 
     * @return array
     */
    function updateBoard() {
        var newBoard = [];
        for (var y = 0; y < board.length; y++) {
            var row = [];
            for (var x = 0; x < board[y].length; x++) {
                var count = 0;
                delta.forEach(function(coordinates, index, dirArray) {
                    var yRel = y + coordinates[0],
                        xRel = x + coordinates[1];
                    if (xRel >= 0 && xRel < board[y].length &&
                        yRel >= 0 && yRel < board.length) {
                        if (board[yRel][xRel]) count++;
                    }
                });
                
                if (board[y][x]) {
                    // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
                    // Any live cell with more than three live neighbours dies, as if by over-population.
                    if (count < 2 || count > 3) row.push(0);
                    // Any live cell with two or three live neighbours lives on to the next generation.
                    else row.push(1);
                }
                else {
                    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                    if (count == 3) row.push(1);
                    else row.push(0);
                }
            }
            newBoard.push(row);
        }
        board = newBoard;
    }
 
    /**
     * 
     */
    function drawStuff() {
        
        if (random || !board)
            makeBoard(Math.floor(window.innerWidth/cellSize), Math.floor(window.innerHeight/cellSize));
        else
            updateBoard();
        
        // Draw the board
        context.save();
        board.forEach(function(row, yIndex, boardArray) {
            row.forEach(function(cell, xIndex, rowArray) {
//                context.fillStyle = "#FFFFFF";
//                if (cell) context.fillStyle = "#000000";
//                context.fillRect(xIndex * cellSize, yIndex * cellSize, cellSize, cellSize);
                context.clearRect(xIndex * cellSize, yIndex * cellSize, cellSize, cellSize);
                if (cell) context.fillRect(xIndex * cellSize, yIndex * cellSize, cellSize, cellSize);

            });
        });
        context.restore();
    }
})();