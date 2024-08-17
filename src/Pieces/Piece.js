const PIECE = class Piece {
  constructor(color, position, type) {
    this.color = color;
    this.position = position;
    this.type = type;
  }

  getBoard() {
    return this.board;
  }

  setBoard(board) {
    this.board = board;
  }

  getColor() {
    return this.color;
  }

  getPosition() {
    return this.position;
  }

  setPosition(position) {
    this.position = position;
  }

  getType() {
    return this.type;
  }

  possibleMoves() {}
};

export default PIECE;
