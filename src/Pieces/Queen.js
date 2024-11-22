import Piece from "./Piece";

const QUEEN = class Queen extends Piece {
  constructor(color, position, type) {
    super(color, position, type);
  }

  getType() {
    return this.type;
  }

  possibleMoves(board) {
    //diagonal movement
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

    //horizontal movement
    //going to the left
    row = this.position.row;
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
    column = this.position.column;
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

export default QUEEN;
