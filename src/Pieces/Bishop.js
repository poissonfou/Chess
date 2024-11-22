import Piece from "./Piece";

const BISHOP = class Bishop extends Piece {
  constructor(color, position, type) {
    super(color, position, type);
  }

  getType() {
    return this.type;
  }

  possibleMoves(board) {
    const possibleMoves = [];

    let row = this.position.row - 1;
    let column = this.position.column + 1;
    let goingDown = false;

    //covers issue of bishop being in row 0
    if (row == -1) {
      row = this.position.row + 1;
      goingDown = true;
    }

    //checks the right side of the board;
    //goes up the matrix first (row--) and then gows down(row++)
    while (true) {
      if ((column > 7 || row > 7) && goingDown) break;

      if ((row == -1 || column == 8) && !goingDown) {
        goingDown = true;
        row = this.position.row + 1;
        column = this.position.column + 1;
        if (column > 7 || row > 7) break;
      }

      if (
        board[row][column] &&
        board[row][column].getColor() == this.color &&
        goingDown
      )
        break;

      if (
        board[row][column] &&
        board[row][column].getColor() != this.color &&
        goingDown
      ) {
        possibleMoves.push({ row, column });
        break;
      }

      possibleMoves.push({ row, column });

      column++;
      if (!goingDown) {
        row--;
      } else {
        row++;
      }
    }

    row = this.position.row - 1;
    column = this.position.column - 1;
    goingDown = false;

    if (row == -1) {
      row = this.position.row + 1;
      goingDown = true;
    }

    //covers the left side of the board
    while (true) {
      if ((column < 0 || row > 7) && goingDown) break;

      if ((row == -1 || column == -1) && !goingDown) {
        goingDown = true;
        row = this.position.row + 1;
        column = this.position.column - 1;
        if (column < 0 || row > 7) break;
      }

      if (
        board[row][column] &&
        board[row][column].getColor() == this.color &&
        goingDown
      )
        break;

      if (
        board[row][column] &&
        board[row][column].getColor() != this.color &&
        goingDown
      ) {
        possibleMoves.push({ row, column });
        break;
      }

      possibleMoves.push({ row, column });

      column--;
      if (!goingDown) {
        row--;
      } else {
        row++;
      }
    }

    return possibleMoves;
  }
};

export default BISHOP;
