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
      // //if there is a conflict it will be true
      // //matrix = [[0,0][0,0]]
      // //rowIndex = 0; check the first row
      var matrix = this.rows();
      var sumRowIndex = matrix[rowIndex].reduce(function(result, item) {
        return result + item;
      }, 0);

      if (sumRowIndex > 1) {
        return true;
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //build matrix
      //for each row call the hasRowConflictsAt
      //use hasRowConflictAt method to check each row
      //if one is true => true
      //_.range(n) => [0,...n-1]
      var matrix = this.rows();
      var board = this;
      return _.range(matrix.length).reduce(function(result, index) {
        return result || board.hasRowConflictAt(index);
      }, false);

    },


    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var matrix = this.rows();
      //reduce the matrix to get sum of rows at colIndex
      var sumColIndex = matrix.reduce(function(result, index) {
        return result + index[colIndex];
      }, 0);
      if (sumColIndex > 1) {
        return true;
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var matrix = this.rows();
      var board = this;
      return _.range(matrix.length).reduce(function(result, index) {
        return result || board.hasColConflictAt(index);
      }, false);
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //0,1,2,3,-1,0,1,2,-2,-1,0,1,-3,-2,-1,0
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var matrix = this.rows();
      var input = majorDiagonalColumnIndexAtFirstRow;
      //colIndex - rowIndex = input
      //input = -1
      //matrix[0]: 0 + (-1) < 0
      //matrix[1]: 1 + (-1) = 0
      //matrix[2]: 2 + (-1) = 1
      //matrix[3]: 3 + (-1) = 2

      var sumMajorIndex = matrix.reduce(function(result, item, index) {
        //item = rowIndex
        //index = colIndex
        if (index + input >= 0 && index + input < matrix.length) {
          return result + item[index + input];
        }
        return result;
      }, 0);

      if (sumMajorIndex > 1) {
        return true;
      }
      return false;

    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var matrix = this.rows();
      var board = this;
      return _.range(2 - matrix.length, matrix.length).reduce(function(result, index) {
        return result || board.hasMajorDiagonalConflictAt(index);
      }, false);
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var matrix = this.rows();
      var input = minorDiagonalColumnIndexAtFirstRow;
      //colIndex + rowIndex = input
      //n = 4
      //input = 4
      //matrix[0]: 4 - 0 = 4 (0, 4) not inbound
      //matrix[1]: 4 - 1 = 3 (1, 3)
      //matrix[2]: 4 - 2 = 2 (2, 2)
      //matrix[3]: 4 - 3 = 1 (3, 1)
      //item = rowIndex
      //index = colIndex
      var sumMinorIndex = matrix.reduce(function(result, item, index) {
        if (input - index >= 0 && input - index < matrix.length) {
          return result + item[input - index];
        }
        return result;
      }, 0);

      if (sumMinorIndex > 1) {
        return true;
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var matrix = this.rows();
      var board = this;
      return _.range(matrix.length * 2 - 2).reduce(function(result, index) {
        return result || board.hasMinorDiagonalConflictAt(index);
      }, false);
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
