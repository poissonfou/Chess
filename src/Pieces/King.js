import Piece from "./Piece";

const KING = class King extends Piece {
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
    //stores possible moves
    const possibleMoves = [];
    let row = this.position.row - 1;
    let column = this.position.column - 1;

    //loops through the 9 cases adjcent to the king and checks if it can move there;
    while (row < this.position.row + 2 && row > this.position.row - 2) {
      if (row < 0 || row > 7) {
        row++;
        continue;
      }

      for (let i = column; i <= column + 2; i++) {
        if (i > 7) break;
        if (!board[row][i] || board[row][i]?.getColor() != this.color) {
          possibleMoves.push({ row, column: i });
        }
      }
      row++;
    }

    if (!this.hasMoved) {
      row = this.position.row;
      column = this.position.column;

      //going to the left
      for (let i = column + 1; i < column + 4; i++) {
        if (i == column + 3 && board[row][i]?.getType() == "r") {
          if (
            board[row][i]?.getColor() != this.color ||
            board[row][i]?.getHasMoved()
          )
            break;
          possibleMoves.push({ row, column: i - 1 });
        }
        if (board[row][i]) break;
      }

      //going to the right
      for (let i = column - 1; i > column - 5; i--) {
        if (i == column - 4 && board[row][i]?.getType() == "r") {
          if (
            board[row][i]?.getColor() != this.color ||
            board[row][i]?.getHasMoved()
          )
            break;
          possibleMoves.push({ row, column: i + 2 });
        }
        if (board[row][i]) break;
      }
    }

    return possibleMoves;
  }
};

export default KING;
