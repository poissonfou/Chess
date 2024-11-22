import Piece from "./Piece";

const PAWN = class Pawn extends Piece {
  constructor(color, position, type) {
    super(color, position, type);
    this.hasMoved = false;
    this.enPassant = false;
  }

  getEnPassant() {
    return this.enPassant;
  }

  setEnPassant(boolean) {
    this.enPassant = boolean;
  }

  getHasMoved() {
    return this.hasMoved;
  }

  setHasMoved(boolean) {
    this.hasMoved = boolean;
  }

  possibleMoves(board) {
    const possibleMoves = [];

    if (this.color == "w") {
      let row = this.position.row - 1;
      let column = this.position.column - 1;

      //loops through the first three cases in front of the pawn
      while (column <= this.position.column + 1) {
        if (column == this.position.column) {
          if (!board[row][column]) possibleMoves.push({ row, column });
        } else {
          if (board[row][column] && board[row][column].getColor() == "b") {
            possibleMoves.push({ row, column });
          }
        }
        column++;
      }

      //checks for en passant
      row = this.position.row;
      column = this.position.column - 1;

      for (let i = column; i < column + 3; i++) {
        if (i == 8) break;
        if (i == -1 || i == this.position.column) continue;
        if (
          board[row][i]?.getType() == "p" &&
          board[row][i]?.getColor() == "b" &&
          board[row][i]?.getEnPassant()
        ) {
          possibleMoves.push({
            row: row - 1,
            column: i,
          });
        }
      }

      //checks for special two-cases movement
      if (
        !this.hasMoved &&
        !board[this.position.row - 2][this.position.column] &&
        !board[this.position.row - 1][this.position.column]
      ) {
        possibleMoves.push({
          row: this.position.row - 2,
          column: this.position.column,
        });
      }
    } else {
      let row = this.position.row + 1;
      let column = this.position.column - 1;

      //loops through the first three cases in front of the pawn
      while (column <= this.position.column + 1) {
        if (column == this.position.column) {
          if (!board[row][column]) possibleMoves.push({ row, column });
        } else {
          if (board[row][column] && board[row][column].getColor() == "w") {
            possibleMoves.push({ row, column });
          }
        }
        column++;
      }

      //checks for en passant
      row = this.position.row;
      column = this.position.column - 1;

      for (let i = column; i < column + 3; i++) {
        if (i == 8) break;
        if (i == -1 || i == this.position.column) continue;
        if (
          board[row][i]?.getType() == "p" &&
          board[row][i]?.getColor() == "w" &&
          board[row][i]?.getEnPassant()
        ) {
          possibleMoves.push({
            row: row + 1,
            column: i,
          });
        }
      }

      //checks for special two-cases movement
      if (
        !this.hasMoved &&
        !board[this.position.row + 2][this.position.column] &&
        !board[this.position.row + 1][this.position.column]
      ) {
        possibleMoves.push({
          row: this.position.row + 2,
          column: this.position.column,
        });
      }
    }

    return possibleMoves;
  }
};

export default PAWN;
