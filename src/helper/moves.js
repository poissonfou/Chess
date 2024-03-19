import {
  authDiagonal,
  authVerticalAndHorizontal,
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

    if (final.idx > initial.idx && final.idx - 1 !== initial.idx) return false;
    if (final.idx < initial.idx && final.idx + 1 !== initial.idx) return false;

    if (final.idx > initial.idx || final.idx < initial.idx) {
      if (final.row + 1 !== initial.row) return false;
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

    if (final.idx > initial.idx && final.idx - 1 !== initial.idx) return false;
    if (final.idx < initial.idx && final.idx + 1 !== initial.idx) return false;

    if (final.idx < initial.idx || final.idx > initial.idx) {
      if (final.row - 1 !== initial.row) return false;
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

export function moveKing(
  initial,
  final,
  board,
  turn,
  piecesTaken,
  kingsPosition,
  updateKingsPosition,
  hooksMoved,
  updateCastle
) {
  if (initial.idx == final.idx) {
    if (final.row + 1 !== initial.row && final.row - 1 !== initial.row)
      return false;
    if (board[final.row][final.idx] !== 0) {
      setPiecesTaken(turn, final, board, piecesTaken);
    }

    updateKingsPosition(turn, final, true);
    return true;
  }
  if (initial.row == final.row) {
    if (final.idx - 1 == initial.idx || final.idx + 1 == initial.idx) {
      updateKingsPosition(turn, final, true);
      return true;
    }

    if (initial.row == 7 || initial.row == 0) {
      if (!kingsPosition.hasMoved) {
        if (final.idx + 2 == initial.idx) {
          if (!hooksMoved[turn]["queenSide"]) {
            updateKingsPosition(turn, final, true);
            updateCastle(true, "queenSide");
            return true;
          }
        }
        if (final.idx - 2 == initial.idx) {
          if (!hooksMoved[turn]["kingSide"]) {
            updateKingsPosition(turn, final, true);
            updateCastle(true, "kingSide");
            return true;
          }
        }
        return false;
      }
    }

    if (final.idx + 1 !== initial.idx && final.idx - 1 !== initial.idx)
      return false;
    if (board[final.row][final.idx] !== 0) {
      setPiecesTaken(turn, final, board, piecesTaken);
    }

    updateKingsPosition(turn, final, true);
    return true;
  }
  if (final.row + 1 !== initial.row && final.row - 1 !== initial.row)
    return false;
  if (final.idx + 1 !== initial.idx && final.idx - 1 !== initial.idx)
    return false;

  if (board[final.row][final.idx] !== 0) {
    setPiecesTaken(turn, final, board, piecesTaken);
  }
  updateKingsPosition(turn, final, true);
  return true;
}

export function moveQueen(turn, initial, final, board, piecesTaken, piece) {
  let isValid;

  if (final.row !== initial.row && final.idx !== initial.idx) {
    isValid = authDiagonal(board, initial, final, piece);
  } else {
    isValid = authVerticalAndHorizontal(board, initial, final);
  }

  if (isValid) {
    if (board[final.row][final.idx] !== 0) {
      setPiecesTaken(turn, final, board, piecesTaken);
    }
    return true;
  }
  return false;
}

export function moveHook(
  initial,
  final,
  piecesTaken,
  board,
  turn,
  hooksMoved,
  updateHooksMoved
) {
  if (final.idx !== initial.idx && final.row !== initial.row) return false;

  if (authVerticalAndHorizontal(board, initial, final)) {
    if (initial.row == 7) {
      if (initial.idx == 0 && !hooksMoved["white"]["queenSide"])
        updateHooksMoved(turn, "queenSide", true);
      if (initial.idx == 7 && !hooksMoved["white"]["kingSide"])
        updateHooksMoved(turn, "kingSide", true);
    }

    if (initial.row == 0) {
      if (initial.idx == 0 && !hooksMoved["black"]["queenSide"])
        updateHooksMoved(turn, "queenSide", true);
      if (initial.idx == 7 && !hooksMoved["black"]["kingSide"])
        updateHooksMoved(turn, "kingSide", true);
    }

    if (board[final.row][final.idx] !== 0) {
      setPiecesTaken(turn, final, board, piecesTaken);
    }
    return true;
  }
  return false;
}

export function moveBishop(initial, final, piecesTaken, board, turn, piece) {
  if (final.idx !== initial.idx && final.row == initial.row) return false;
  if (final.idx == initial.idx && final.row !== initial.row) return false;

  if (authDiagonal(board, initial, final, piece)) {
    if (board[final.row][final.idx] !== 0) {
      setPiecesTaken(turn, final, board, piecesTaken);
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
        setPiecesTaken(turn, final, board, piecesTaken);
      }
      return true;
    }
    return false;
  }
  if (final.row + 1 == initial.row || final.row - 1 == initial.row) {
    if (final.idx + 2 == initial.idx || final.idx - 2 == initial.idx) {
      if (board[final.row][final.idx] !== 0) {
        setPiecesTaken(turn, final, board, piecesTaken);
      }
      return true;
    }
    return false;
  }
  return false;
}
