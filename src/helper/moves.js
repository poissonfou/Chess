import {
  checkDiagonal,
  checkVerticalAndHorizontal,
  setPiecesTaken,
} from "./helper";

export function movePawn(
  initial,
  final,
  board,
  piece,
  piecesTaken,
  enPassant,
  setEnPassant
) {
  if (piece.includes("wp")) {
    if (final.row >= initial.row) {
      return false;
    }
    if (final.row < initial.row && final.idx == initial.idx) {
      if (board[final.row][final.idx] !== 0) return false;

      if (initial.row == 6) {
        if (final.row + 1 == initial.row || final.row + 2 == initial.row) {
          if (final.row + 2 == initial.row) {
            if (
              board[final.row][final.idx + 1] == "bp" ||
              board[final.row][final.idx - 1] == "bp"
            ) {
              setEnPassant(true);
            }
          }
          return true;
        }
        return false;
      }

      return final.row + 1 == initial.row;
    }

    if (final.idx > initial.idx || final.idx < initial.idx) {
      if (enPassant) {
        if (board[initial.row][final.idx] == "bp") {
          piecesTaken.black.push(board[initial.row][final.idx]);
        }
        return true;
      }
      if (board[final.row][final.idx] === 0) return false;

      piecesTaken.black.push(board[final.row][final.idx]);

      return true;
    }
    return true;
  } else {
    if (final.row <= initial.row) {
      return false;
    }

    if (final.row > initial.row && final.idx == initial.idx) {
      if (board[final.row][final.idx] !== 0) return false;

      if (initial.row == 1) {
        if (final.row - 1 == initial.row || final.row - 2 == initial.row) {
          if (final.row - 2 == initial.row) {
            if (
              board[final.row][final.idx + 1] == "wp" ||
              board[final.row][final.idx - 1] == "wp"
            ) {
              setEnPassant(true);
            }
          }
          return true;
        }
        return false;
      }

      return final.row - 1 == initial.row;
    }

    if (+final.idx < initial.idx || final.idx > initial.idx) {
      if (enPassant) {
        if (board[initial.row][final.idx] == "wp") {
          piecesTaken.white.push(board[initial.row][final.idx]);
        }
        return true;
      }

      if (board[final.row][final.idx] === 0) return false;

      piecesTaken.white.push(board[final.row][final.idx]);

      return true;
    }
    return true;
  }
}

export function moveKing(initial, final, board, turn, piecesTaken) {
  if (initial.idx == final.idx) {
    if (final.row + 1 !== initial.row && final.row - 1 !== initial.row)
      return false;
    if (board[final.row][final.idx] !== 0) {
      //check if taking is valid
      setPiecesTaken(turn, final, piecesTaken);
    }
    //check for checks
    return true;
  }
  if (initial.row == final.row) {
    if (final.idx + 1 !== initial.idx && final.idx - 1 !== initial.idx)
      return false;
    if (board[final.row][final.idx] !== 0) {
      //check if taking is valid
      setPiecesTaken(turn, final, piecesTaken);
    }
    //check for checks
    return true;
  }
  if (final.row + 1 !== initial.row && final.row - 1 !== initial.row)
    return false;
  if (final.idx + 1 !== initial.idx && final.idx - 1 !== initial.idx)
    return false;

  if (board[final.row][final.idx] !== 0) {
    //check if taking is valid
    setPiecesTaken(turn, final, piecesTaken);
  }
  //check for checks
  return true;
}

export function moveQueen(initial, final, board, piecesTaken, piece) {
  let isValid;

  if (final.row !== initial.row && final.idx !== initial.idx) {
    isValid = checkDiagonal(board, initial, final, piece);
  } else {
    isValid = checkVerticalAndHorizontal(board, initial, final);
  }

  if (isValid) {
    if (board[final.row][final.idx] !== 0) {
      setPiecesTaken(turn, final, piecesTaken);
    }
    return true;
  }
  return false;
}

export function moveHook(initial, final, piecesTaken, board, turn) {
  if (final.idx !== initial.idx && final.row !== initial.row) return false;

  if (checkVerticalAndHorizontal(board, initial, final)) {
    if (board[final.row][final.idx] !== 0) {
      setPiecesTaken(turn, final, piecesTaken);
    }
    return true;
  }
  return false;
}

export function moveBishop(initial, final, piecesTaken, board, turn, piece) {
  if (final.idx !== initial.idx && final.row == initial.row) return false;
  if (final.idx == initial.idx && final.row !== initial.row) return false;

  if (checkDiagonal(board, initial, final, piece)) {
    if (board[final.row][final.idx] !== 0) {
      setPiecesTaken(turn, final, piecesTaken);
    }
    return true;
  }

  return false;
}

export function moveKnight(initial, final, piecesTaken, board, turn) {
  if (final.idx !== initial.idx && final.row == initial.row) return false;
  if (final.idx == initial.idx && final.row !== initial.row) return false;

  if (final.row + 2 == initial.row || final.row - 2 == initial.row) {
    if (final.idx + 1 == initial.idx || final.idx - 1 == initial.idx) {
      if (board[final.row][final.idx] !== 0) {
        setPiecesTaken(turn, final, piecesTaken);
      }
      return true;
    }
    return false;
  }
  if (final.row + 1 == initial.row || final.row - 1 == initial.row) {
    if (final.idx + 2 == initial.idx || final.idx - 2 == initial.idx) {
      if (board[final.row][final.idx] !== 0) {
        setPiecesTaken(turn, final, piecesTaken);
      }
      return true;
    }
    return false;
  }
  return false;
}
