import Piece from "./Piece";

const ROOK = class Rook extends Piece {
  constructor(color, position, type) {
    super(color, position, type);
    this.hasMoved = false;
  }

  getHasMoved() {
    return this.hasMoved;
  }

  setHasMoved(boolean) {
    this.hasMoved = boolean;
  }

  possibleMoves(board) {
    const possibleMoves = [];
    //horizontal movement
    //going to the left
    const row = this.position.row;
    for (let i = this.position.column + 1; i < 8; i++) {
      if (board[row][i] && board[row][i].getColor() == this.color) break;
      if (board[row][i] && board[row][i].getColor() != this.color) {
        possibleMoves.push({ row, column: i });
        break;
      }

      possibleMoves.push({ row, column: i });
    }

    //going to the right
    for (let i = this.position.column - 1; i > -1; i--) {
      if (board[row][i] && board[row][i].getColor() == this.color) break;
      if (board[row][i] && board[row][i].getColor() != this.color) {
        possibleMoves.push({ row, column: i });
        break;
      }

      possibleMoves.push({ row, column: i });
    }

    //vertical movement
    //going down the matrix
    const column = this.position.column;
    for (let i = row + 1; i < 8; i++) {
      if (board[i][column] && board[i][column].getColor() == this.color) break;
      if (board[i][column] && board[i][column].getColor() != this.color) {
        possibleMoves.push({ row: i, column });
        break;
      }

      possibleMoves.push({ row: i, column });
    }

    //going up the matrix
    for (let i = row - 1; i > -1; i--) {
      if (board[i][column] && board[i][column].getColor() == this.color) break;
      if (board[i][column] && board[i][column].getColor() != this.color) {
        possibleMoves.push({ row: i, column });
        break;
      }

      possibleMoves.push({ row: i, column });
    }

    return possibleMoves;
  }
};

export default ROOK;
