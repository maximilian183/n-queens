/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

/*
  Decision Tree logic

  Rooks
    Place Rook at starting point of [start]
    traverse down each row and place rook into immediate non-conflicting column
    when count of N-rooks = n
    return solved.

    change starting point for NrooksSolutions

  Queens

*/



// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solution = new Board({'n':n});
  solution.get(0)[0] = 1;

  var find = function (piecesLeft, currentBoard) {
    var board = currentBoard;
    var size = board.get('n');
    if (piecesLeft === 0) {
      return board;
    }
    for (var rowPointer = 0; rowPointer < size ; rowPointer++) {
      for (var colPointer = 0; colPointer < size ; colPointer++) {
        if (board.get(rowPointer)[colPointer] === 0) {
          board.get(rowPointer)[colPointer] = 1;
          if (board.hasRowConflictAt(rowPointer) || board.hasColConflictAt(colPointer)) {
            board.get(rowPointer)[colPointer] = 0;
          } else {
            find(piecesLeft-1, board);
          }
        }
      }
    }
  }

  find(n-1,solution);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;

  var find = function (piecesLeft, currentBoard, currentRow) {
    var board = currentBoard;
    var size = board.get('n');
    if (piecesLeft === 0) {
      solutionCount++;
      return board;
    }
    for (var rowPointer = currentRow; rowPointer < size ; rowPointer++) {
      for (var colPointer = 0; colPointer < size ; colPointer++) {
        if (board.get(rowPointer)[colPointer] === 0) {
          board.get(rowPointer)[colPointer] = 1;
          if (board.hasRowConflictAt(rowPointer) || board.hasColConflictAt(colPointer)) {
            board.get(rowPointer)[colPointer] = 0;
          } else {
            var newSolution = new Board(board.rows());
            find(piecesLeft-1, newSolution, rowPointer);
            board.get(rowPointer)[colPointer] = 0;
          }
        }
      }
    }
  }

  for (var i = 0 ; i < n ; i++) {
    var solution = new Board({'n':n});
    solution.get(0)[i] = 1;
    find(n-1,solution, 0);
  }

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {

  var oneSolution;

  var find = function (piecesLeft, currentBoard, currentRow) {
    var board = currentBoard;
    var size = board.get('n');
    if (piecesLeft === 0) {
      oneSolution = JSON.stringify(board);
      return true;
    }
    for (var rowPointer = currentRow; rowPointer < size ; rowPointer++) {
      for (var colPointer = 0; colPointer < size ; colPointer++) {
        if (board.get(rowPointer)[colPointer] === 0) {
          board.get(rowPointer)[colPointer] = 1;
          if (board.hasRowConflictAt(rowPointer) ||
              board.hasColConflictAt(colPointer) ||
              board.hasMajorDiagonalConflictAt(board._getFirstRowColumnIndexForMajorDiagonalOn(rowPointer, colPointer)) ||
              board.hasMinorDiagonalConflictAt(board._getFirstRowColumnIndexForMinorDiagonalOn(rowPointer, colPointer))) {
            board.get(rowPointer)[colPointer] = 0;
          } else {
            var newSolution = new Board(board.rows());
            find(piecesLeft-1, newSolution, rowPointer);
            board.get(rowPointer)[colPointer] = 0;
          }
        }
      }
    }
  }

  if (n!==0 && n!==2 && n!==3) {
    var solution = null;
    for (var i = 0 ; i < n ; i++) {
      solution = new Board({'n':n});
      solution.get(0)[i] = 1;
      find(n-1,solution, 0);
      if (oneSolution !== undefined && typeof oneSolution === 'string' ){
        oneSolution = JSON.parse(oneSolution);

        var matrix = [];
        for (var x in oneSolution){
          if (Array.isArray(oneSolution[x])){
            matrix.push(oneSolution[x]);
          }
        };
        if (matrix.length >0) {
          oneSolution = new Board(matrix);
          break;
        }
      }
    }
  }
  else {
    oneSolution = new Board({'n':n});
  }
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(oneSolution));
  return oneSolution.rows();
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;

  var find = function (piecesLeft, currentBoard, currentRow) {
    var board = currentBoard;
    var size = board.get('n');
    if (piecesLeft === 0) {
      solutionCount++;
      return board;
    }
    for (var rowPointer = currentRow; rowPointer < size ; rowPointer++) {
      for (var colPointer = 0; colPointer < size ; colPointer++) {
        if (board.get(rowPointer)[colPointer] === 0) {
          board.get(rowPointer)[colPointer] = 1;
          if (board.hasRowConflictAt(rowPointer) || board.hasColConflictAt(colPointer)
            || board.hasMajorDiagonalConflictAt(board._getFirstRowColumnIndexForMajorDiagonalOn(rowPointer, colPointer))
            || board.hasMinorDiagonalConflictAt(board._getFirstRowColumnIndexForMinorDiagonalOn(rowPointer, colPointer))) {
            board.get(rowPointer)[colPointer] = 0;
          } else {
            var newSolution = new Board(board.rows());
            find(piecesLeft-1, newSolution, rowPointer);
            board.get(rowPointer)[colPointer] = 0;
          }
        }
      }
    }
  }

  if (n !== 0) {
    for (var i = 0 ; i < n ; i++) {
      var solution = new Board({'n':n});
      solution.get(0)[i] = 1;
      find(n-1,solution, 0);
    }
  } else {
    solutionCount = 1;
  }

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
