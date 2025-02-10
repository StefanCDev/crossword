const puzzle = '2001\n0..0\n1000\n0..0'
const words = ['aaab', 'aaac', 'aaad', 'aaae']
console.log(crosswordSolver(puzzle, words));
const emptyPuzzle = `2001
0..0
1000
0..0`
const words2 = ['casa', 'alan', 'ciao', 'anta']
console.log(crosswordSolver(emptyPuzzle, words2))
const puzzle2 = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
const words3 = [
  'sun',
  'sunglasses',
  'suncream',
  'swimming',
  'bikini',
  'beach',
  'icecream',
  'tan',
  'deckchair',
  'sand',
  'seaside',
  'sandals',
].reverse()
console.log(crosswordSolver(puzzle2, words3))
function crosswordSolver(puzzle, words) {
    // Check if puzzle is empty or not in the correct format.
    if (typeof puzzle !== "string" || puzzle == "") {
        console.log("Error");
        return;
    }
    // Check if words is not an array.
    if (!Array.isArray(words)) {
        console.log("Error");
        return;
    }
    // Check if the puzzle is in the correct format.
    const puzzleRegex = /^[012.]+(\n[012.]+)+$/;
    if (!puzzleRegex.test(puzzle)) {
        console.log("Error");
        return;
    }
    // Convert the empty puzzle string to a 2D array.
    const puzzles = puzzle.split("\n").map((row) => row.split(""));
    const height = puzzles.length;
    const width = puzzles[0].length;
    // Check if the number of words is valid.
    //   const numWords = words.length;
    //   if (numWords == 2) {
    //     console.log("Error");
    //     return;
    //   }
    // Check if there are at least 2 starting cells.
    let numStartCells = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (puzzles[i][j] === "0") {
                numStartCells++;
            }
        }
    }
    if (numStartCells < 2) {
        console.log('Error');
    }
    // Check for repeated words.
    const wordSet = new Set();
    for (const word of words) {
        if (wordSet.has(word)) {
            console.log("Error");
            return;
        }
        wordSet.add(word);
    }
    // Convert the empty puzzle string to a 2D array of "#" and null.
    const puzzleData = puzzle.split("\n");
    const size = parseInt(puzzleData[0].length);
    const grid = puzzleData.map((row) =>
        row.split("").map((cell) => (cell === "." ? null : "#"))
    );
    // Create a list of words with the starting row, starting column, and direction unknown.
    let wordList = words.map((word) => ({
        text: word,
        length: word.length,
        startRow: null,
        startCol: null,
        direction: null,
    }));
    // Compute the sum of the numbers in the puzzle.
    const numbersOnly = puzzle.replace(/\D/g, "");
    const numbersArray = numbersOnly.split("").map(Number);
    const sum = numbersArray.reduce((acc, cur) => acc + cur);
    // Check if the number of words and the sum of the numbers in the puzzle match.
    if (sum !== words.length) {
        console.log("Error");
        return;
    }
    //store solved solutions
    let solvedSolutions = []
    let k = true
    // Solve the crossword puzzle.
    while (k) {
        let solvedGrid = solveCrossword(grid, words, wordList, solvedSolutions);
        if (solvedGrid === null) {
            k = false
        } else {
            solvedSolutions.push(solvedGrid)
            wordList = words.map((word) => ({
                text: word,
                length: word.length,
                startRow: null,
                startCol: null,
                direction: null,
            }));
        }
    }
    // Check if a solution was found
    if (solvedSolutions.length === 0) {
        console.log('Error');
        return;
    } else if (solvedSolutions.length > 1) {
        console.log('Error');
        return;
    } else {
        print(solvedSolutions[0]);
        return { grid: solvedSolutions[0], wordList };
    }
}
// This function prints the solved grid.
function print(grid) {
    // If the grid is null or undefined, log an error and return.
    if (!grid) {
        console.log('Error');
        return;
    }
    // Iterate through each row of the grid
    for (let row = 0; row < grid.length; row++) {
        let rowString = "";
        // Iterate through each column of the row
        for (let col = 0; col < grid[row].length; col++) {
            // If the cell is null, add a "." to the row string
            if (grid[row][col] === null) {
                rowString += ".";
            } else {
                // Otherwise, add the character in the cell to the row string
                rowString += grid[row][col];
            }
        }
        console.log(rowString);
    }
}
// This function solves the crossword puzzle recursively
function solveCrossword(grid, words, wordList, solvedSolutions) {
    // Base case: if there are no more words to fill and the grid contains no empty cells, the crossword is solved
    if (words.length === 0 && !grid.flat().includes("#")) {
        let c = grid.length * grid[0].length
        let counter = 0
        for (let i = 0; i < solvedSolutions.length; i++) {
            for (var j = 0; j < solvedSolutions[i].length; j++) {
                for (let k = 0; k < solvedSolutions[i][j].length; k++) {
                    if (grid[j][k] == solvedSolutions[i][j][k]) {
                        counter++
                    }
                }
            }
            if (counter == c) {
                return null;
            } else {
                counter = 0
            }
        }
        return grid;
    }
    // Get the first word in the list of words to fill
    const word = words[0];
    // Find all words in the word list that have the same length as the word and have not yet been used
    const matchingWords = wordList.filter(
        (w) => w.length === word.length && w.startRow === null
    );
    // Iterate through all matching words
    for (const matchingWord of matchingWords) {
        // Iterate through each cell in the grid
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                // If the cell is not null, try to place the word horizontally and vertically starting from this cell
                if (grid[row][col] !== null) {
                    // Set the start row, start column, and direction of the matching word
                    matchingWord.startRow = row;
                    matchingWord.startCol = col;
                    matchingWord.direction = "across";
                    // Check if the word fits in the grid horizontally
                    const wordFits = checkWordFitsGrid(grid, matchingWord);
                    if (wordFits) {
                        // If the word fits, create a new grid with the word filled in and a new word list with the matching word marked as used
                        const newGrid = fillWordInGrid(grid, matchingWord);
                        const newWordList = markWordAsUsed(wordList, matchingWord);
                        // Recursively solve the new crossword grid with the remaining words
                        const solution = solveCrossword(
                            newGrid,
                            words.slice(1),
                            newWordList,
                            solvedSolutions
                        );
                        if (solution) {
                            return solution;
                        }
                    }
                    // If the word does not fit horizontally, try placing it vertically starting from the same cell
                    matchingWord.direction = "down";
                    const wordFitsDown = checkWordFitsGrid(grid, matchingWord);
                    if (wordFitsDown) {
                        const newGrid = fillWordInGrid(grid, matchingWord);
                        const newWordList = markWordAsUsed(wordList, matchingWord);
                        const solution = solveCrossword(
                            newGrid,
                            words.slice(1),
                            newWordList,
                            solvedSolutions
                        );
                        if (solution) {
                            return solution;
                        }
                    }
                    matchingWord.startRow = null;
                    matchingWord.startCol = null;
                    matchingWord.direction = null;
                }
            }
        }
    }
    // if no matching word was found, backtrack and try another word
    return null;
}
function checkWordFitsGrid(grid, matchingWord) {
    const wordLength = matchingWord.text.length;
    const numRows = grid.length;
    const numCols = grid[0].length;
    let row = matchingWord.startRow;
    let col = matchingWord.startCol;
    let direction = matchingWord.direction;
    // Check if word fits within the grid in the given direction
    if (direction === "across") {
        if (col + wordLength > numCols) {
            return false;
        }
    } else {
        if (row + wordLength > numRows) {
            return false;
        }
    }
    // Check if word overlaps with any existing letters in the grid
    for (let i = 0; i < wordLength; i++) {
        // Calculate the row and column indices for the next letter of the word
        const newRow = direction === "across" ? row : row + i;
        const newCol = direction === "across" ? col + i : col;
        // Check if the cell at the new row and column indices already has a letter that conflicts with the word
        if (grid[newRow][newCol] !== "#" && grid[newRow][newCol] !== matchingWord.text[i]) {
            // If there is a conflict, return false
            return false;
        }
    }
    return true;
}
function fillWordInGrid(grid, matchingWord) {
    // Create a new copy of the grid to avoid modifying the original grid
    const newGrid = grid.map((row) => [...row]);
    // Set the starting row and column indices for the word based on the matching word's location and direction
    let row = matchingWord.startRow;
    let col = matchingWord.startCol;
    // Fill in each letter of the word in the grid, one by one
    for (let i = 0; i < matchingWord.text.length; i++) {
        newGrid[row][col] = matchingWord.text[i];
        // Move to the next cell based on the matching word's direction
        if (matchingWord.direction === "across") {
            col++;
        } else {
            row++;
        }
    }
    // Return the new grid with the word filled in
    return newGrid;
}
function markWordAsUsed(wordList, matchingWord) {
    // Create a new copy of the word list to avoid modifying the original list
    const newWordList = wordList.map((w) => ({ ...w }));
    // Find the index of the matching word in the new word list
    const index = newWordList.findIndex((w) => w.text === matchingWord.text);
    // Remove the matching word from the new word list
    newWordList.splice(index, 1);
    // Return the new word list with the matching word marked as used
    return newWordList;
}
function hasAdjacentFilledCell(grid, row, col) {
    // Check if any of the adjacent cells have a letter already filled in
    if (row > 0 && grid[row - 1][col] !== "#") {
        return true;
    }
    if (row < grid.length - 1 && grid[row + 1][col] !== "#") {
        return true;
    }
    if (col > 0 && grid[row][col - 1] !== "#") {
        return true;
    }
    if (col < grid.length - 1 && grid[row][col + 1] !== "#") {
        return true;
    }
    // If none of the adjacent cells have a letter filled in, return false
    return false;
}