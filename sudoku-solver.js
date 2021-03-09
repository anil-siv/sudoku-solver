class SudokuSolver {

    validate(puzzleString) {
        //console.log(puzzleString)

        if (puzzleString.length === 0) {
            return {
                error: 'Required field missing'
            }
        }

        if (puzzleString.length !== 81) {
            return {
                error: 'Expected puzzle to be 81 characters long'
            }
        }

        if (!/^[0-9.]*$/.test(puzzleString)) {
            return {
                error: 'Invalid characters in puzzle'
            };
        }

        return true

    }

    createBoard(puzzleString) {
        //create a new row on 0th or 9th iteration
        let puzzleBoard = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ]
        let puzzle = puzzleString.split('');
        let row = -1

        for (let i = 0; i < puzzle.length; i++) {
            if (i % 9 === 0) {
                row++
            }

            puzzleBoard[row].push(puzzle[i])

        }
        return puzzleBoard
    }

    checkRowPlacement(board, row, column, value) {

        for (let i = 0; i < 9; i++) {
            if (board[row][i] == value) {
                return {
                    valid: false,
                    conflict: 'row'
                }
            }
        }

        return {
            valid: true
        }

    }

    checkColPlacement(board, row, column, value) {

        for (let i = 0; i < 9; i++) {
            if (board[i][column] == value) {
                return {
                    valid: false,
                    conflict: 'column'
                };
            }
        }

        return {
            valid: true
        };

    }

    checkRegionPlacement(board, row, column, value) {

        let regionStartRow = parseInt(row / 3) * 3;
        let regionStartCol = parseInt(column / 3) * 3;
        for (let i = regionStartRow; i < regionStartRow + 3; i++) {
            for (let j = regionStartCol; j < regionStartCol + 3; j++) {
                if (board[i][j] == value) {
                    return {
                        valid: false,
                        conflict: 'region'
                    }
                }
            }
        }
        return {
            valid: true
        }
    }

    coordToBoard(input) {
        let res = [];
        // A1 -> A = 0, 1 = 0 
        res.push(input.toUpperCase().charCodeAt(0) - 65)
        res.push(parseInt(input.charAt(1)) - 1)


        return res

    }

    checkPlacement(puzzleString, coordinate, value) {
        if (!puzzleString || !coordinate || !value) {
            return {
                error: 'Required field(s) missing'
            }
        }

        if (this.validate(puzzleString) != true) {
            return this.validate(puzzleString)
        };

        let coordSplit = coordinate.split('')

        if (!/[A-Ia-i]/.test(coordSplit[0] || !/[0-9]/.test(coordSplit[1]))) {
            return {
                error: 'Invalid coordinate'
            }
        };

        if (value < 1 || value > 9 || isNaN(value)) {
            return {
                error: 'Invalid value'
            }
        }

        let boardCoords = this.coordToBoard(coordinate)
        //console.log("boardCoords: " + boardCoords)

        let board = this.createBoard(puzzleString)
        //console.log(board)


        let conflicts = []

        if (this.checkRowPlacement(board, boardCoords[0], boardCoords[1], value).valid != true) {
            conflicts.push(this.checkRowPlacement(board, boardCoords[0], boardCoords[1], value).conflict)
        }

        if (this.checkColPlacement(board, boardCoords[0], boardCoords[1], value).valid != true) {
            conflicts.push(this.checkColPlacement(board, boardCoords[0], boardCoords[1], value).conflict)
        }

        if (this.checkRegionPlacement(board, boardCoords[0], boardCoords[1], value).valid != true) {
            conflicts.push(this.checkRegionPlacement(board, boardCoords[0], boardCoords[1], value).conflict)
        }
        //if value is the same as current coordinate make blank and check if valid and if so return true
        if (board[boardCoords[0]][boardCoords[1]] == value) {

            board[boardCoords[0]][boardCoords[1]] = '.'

            if (this.checkRegionPlacement(board, boardCoords[0], boardCoords[1], value).valid == true && this.checkColPlacement(board, boardCoords[0], boardCoords[1], value).valid == true && this.checkRowPlacement(board, boardCoords[0], boardCoords[1], value).valid == true) {

                return {
                    valid: true
                }

            }
        }

        if (this.checkRegionPlacement(board, boardCoords[0], boardCoords[1], value).valid != true || this.checkColPlacement(board, boardCoords[0], boardCoords[1], value).valid != true || this.checkRowPlacement(board, boardCoords[0], boardCoords[1], value).valid != true) {
            return {
                valid: false,
                conflict: conflicts
            }
        }




        return {
            valid: true
        }

    }

    findUnassignedLocation(puzzleString) {

        return puzzleString.indexOf('.')


    }

    rowColToCoord(index) {

        let col = (index % 9) + 1;
        let row = String.fromCharCode(parseInt(index / 9) + 65)


        return row + col
    }


    solve(puzzleString) {
        if (!puzzleString) {
            return {
                error: 'Required field missing'
            }
        }
        if (this.validate(puzzleString) != true) {
            return this.validate(puzzleString)
        }
        let empty = this.findUnassignedLocation(puzzleString)
        //console.log(empty)

        if (empty == -1) {
            console.log('no empties: ' + puzzleString)
            return {
                solution: puzzleString
            }
        } else {
            let coord = this.rowColToCoord(empty)

            for (var num = 1; num <= 9; num++) {


                if (this.checkPlacement(puzzleString, coord, num).valid) {

                    let result = this.solve((puzzleString.substr(0, empty) + num + puzzleString.substr(empty + 1)));
                    if (!result.error) {
                        return result; // Return what you got from the recursive call (the solution)
                    }
                }
            }
            return {
                error: 'Puzzle cannot be solved'
            }
        }
    }




}

module.exports = SudokuSolver;