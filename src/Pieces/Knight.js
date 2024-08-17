import Piece from "./Piece";

const KNIGHT = class Knight extends Piece {
  constructor(color, position, type) {
    super(color, position, type);
  }

  possibleMoves(board) {
    //we'll calculate all the possible moves for the horse and
    //store them in this array
    const possibleMoves = [];
    let row = this.position.row - 1;
    let column = this.position.column - 2;
    //marks if we are now checking the right side of the matrix,
    //which needs column to be decreased instead of increased
    let hasMovedRight;

    //marks movements moving up the matrix
    if (this.position.row != 0) {
      while (true) {
        if (column == this.position.column && hasMovedRight) break;
        if (column == this.position.column) {
          row = this.position.row - 1;
          column = this.position.column + 2;
          hasMovedRight = true;

          if (column > 7) {
            column = 7;
            row--;
          }

          continue;
        }

        if (
          !board[row][column] ||
          board[row][column]?.getColor() != this.color
        ) {
          possibleMoves.push({ row, column });
        }
        row--;

        if (!hasMovedRight) {
          column++;
        } else {
          column--;
        }
      }
    }

    row = this.position.row + 1;
    column = this.position.column - 2;
    hasMovedRight = false;

    //marks movements moving down the matrix
    //doesn't work because count will go to 8 and it will not process all cases
    if (this.position.row != 7) {
      while (true) {
        if (column == this.position.column && hasMovedRight) break;
        if (column == this.position.column) {
          row = this.position.row + 1;
          column = this.position.column + 2;
          hasMovedRight = true;

          if (column > 7) {
            column = 7;
            row++;
          }

          continue;
        }

        if (
          !board[row][column] ||
          board[row][column]?.getColor() != this.color
        ) {
          possibleMoves.push({ row, column });
        }

        row++;

        if (!hasMovedRight) {
          column++;
        } else {
          column--;
        }
      }
    }

    return possibleMoves;
  }
};

export default KNIGHT;
