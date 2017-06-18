// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var HAS_ONE = false;
      for ( var i = 0; i < row.length; i++ ) {
        if ( row[i] === 1 && !HAS_ONE ){
          HAS_ONE = true;
        } else if ( row[i] === 1 && HAS_ONE ){
          return true;
        }
      }
      return false; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var size = this.get('n');
      for ( var i = 0 ; i < size ; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //this.get(i)[colIndex]
      //get the n for size
      //loop through for loop on rowIndex while keeping same colIndex
      // if 2 exists  return true

      var size = this.get('n');
      var HAS_ONE = false;

      for ( var i = 0; i < size; i++ ){
        if (this.get(i)[colIndex] === 1 && !HAS_ONE){
          HAS_ONE = true;
        } else if ( this.get(i)[colIndex] === 1 && HAS_ONE) {
          return true;
        }
      }
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var size = this.get('n');
      for (var i = 0 ; i < size ; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var HAS_ONE = false;
      //if major diagonal is negative
      if (majorDiagonalColumnIndexAtFirstRow < 0) {
        for (var i = 0 ; i < this.get('n') - Math.abs(majorDiagonalColumnIndexAtFirstRow) ; i++) {
          if (this.get(i+Math.abs(majorDiagonalColumnIndexAtFirstRow))[i] === 1 && !HAS_ONE) {
            HAS_ONE = true;
          } else if (this.get(i+Math.abs(majorDiagonalColumnIndexAtFirstRow))[i] === 1 && HAS_ONE) {
            return true;
          }
        }
      } else if (majorDiagonalColumnIndexAtFirstRow >= 0) {
        for (var i = 0 ; i < this.get('n') - majorDiagonalColumnIndexAtFirstRow ; i++) {
          if (this.get(i)[majorDiagonalColumnIndexAtFirstRow+i] === 1 && !HAS_ONE) {
            HAS_ONE = true;
          } else if (this.get(i)[majorDiagonalColumnIndexAtFirstRow+i] === 1 && HAS_ONE) {
            return true;
          }
        }
      }

      return false; // fixme
    },

    /*
        [  0,  1,  2, 3 ]    [ [n-4, n-4] , [n-4, n-3] , [n-4, n-2] , [n-4, n-1] ]
        [ -1, 01, 02, 4 ]    [ [n-3, n-4] , [n-3, n-3] , [n-3, n-2] , [n-3, n-1] ]
        [ -2, 01, 02, 5 ]    [ [n-2, n-4] , [n-2, n-3] , [n-2, n-2] , [n-2, n-1] ]
        [ -3, 01, 02, 6 ]    [ [n-1, n-4] , [n-1, n-3] , [n-1, n-2] , [n-1, n-1] ]

4- size +1
5- 4 + 1 = 2

        [00, 01, 02, 03 ]
        [10, 11, 12, 13 ]
        [20, 21, 22, 23 ]
        [30, 31, 32, 33 ]

        1 - 2
        2 - 3

        majorDiagonalColumnIndexAtFirstRow = colIndex - rowIndex;

    */

    // if minor index > n
    // row start = index - size  - 1 = 1
    // row end = size - 1 = 3
    //    *diagnonal of 4
    //    [1][3]  =>  [i][this.get('n')-i]
    //    [2][2]
    //    [3][1]

    //                        i = 0; i<=index
    //    [0][2]  =>  [0][index]   => this.get(i)[index - i]
    //    [1][1]
    //    [2][0]

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var start = -1 * (this.get('n') - 1);
      var end = -1 * start;
      for ( var i = start; i <= end; i++ ) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      //minorDiagonalColumnIndexAtFirstRow = colIndex + rowIndex;

      var HAS_ONE = false;
      //if minor diagonal is negative
      if (minorDiagonalColumnIndexAtFirstRow >= this.get('n')) {
        var start = minorDiagonalColumnIndexAtFirstRow - this.get('n') + 1;   //position 5 ====>  5 - 4 +1 = 2
        var end = this.get('n') - 1;
        var col = this.get('n') - 1;                         // 4-1 = 3
        for (var i = start; i <= end; i++) {
          if (this.get(i)[col] === 1 && !HAS_ONE) {       //[2][3]
            HAS_ONE = true;
          } else if (this.get(i)[col] === 1 && HAS_ONE) {
            return true;
          }
          col--;
        }
      } else if (minorDiagonalColumnIndexAtFirstRow < this.get('n')) {
        var start = 0;
        var end = minorDiagonalColumnIndexAtFirstRow;
        for (var i = start; i <= end; i++) {
          if (this.get(i)[minorDiagonalColumnIndexAtFirstRow - i] === 1 && !HAS_ONE) {
            HAS_ONE = true;
          } else if (this.get(i)[minorDiagonalColumnIndexAtFirstRow - i] === 1 && HAS_ONE) {
            return true;
          }
        }
      }

      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var start = 1;
      var end = (this.get('n')-1)*2;

      for (var i = start; i < end; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }

      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
