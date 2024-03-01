export function getCoords(event, coords) {
  let [rowTo, idxTo] = event.target.id.split(".");
  let [rowFrom, idxFrom] = coords.split(".");

  return {
    initial: { row: +rowFrom, idx: +idxFrom },
    final: { row: +rowTo, idx: +idxTo },
  };
}

export function setPiecesTaken(turn, final, piecesTaken) {
  turn == "white"
    ? piecesTaken.black.push(board[final.row][final.idx])
    : piecesTaken.white.push(board[final.row][final.idx]);
}

export function checkDiagonal(board, initial, final, piece) {
  let start = final.idx < initial.idx ? final.idx : initial.idx;
  let end = final.idx > initial.idx ? final.idx : initial.idx;
  let row;
  let isValid;

  if (final.idx > initial.idx) {
    start = start + 1;

    if (final.row > initial.row) {
      row = initial.row + 1;
    } else {
      row = initial.row - 1;
    }

    for (let i = start; i <= end; i++) {
      if (i == final.idx && row == final.row) {
        isValid = true;
      } else if (board[row][i] !== 0) {
        return false;
      }
      if (final.row > initial.row) {
        row++;
      } else {
        row--;
      }
    }
  } else {
    row = final.row;

    for (let i = start; i <= end; i++) {
      if (i == end) {
        return board[row][i] == piece;
      }
      if (board[row][i] !== 0 && i !== start) {
        return false;
      }
      if (final.row > initial.row) {
        row--;
      } else {
        row++;
      }
    }
  }
  return isValid;
}

export function checkVerticalAndHorizontal(board, initial, final) {
  let start;
  let end;
  let isValid;

  if (final.row == initial.row) {
    start = final.idx < initial.idx ? final.idx : initial.idx;
    end = final.idx > initial.idx ? final.idx : initial.idx;

    start = start + 1;
    if (start == final.idx || start == initial.idx) {
      return true;
    } else {
      for (let i = start; i < end; i++) {
        if (board[final.row][i] !== 0) {
          return false;
        }
      }
    }
  } else {
    start = final.row < initial.row ? final.row : initial.row;
    end = final.row > initial.row ? final.row : initial.row;

    for (let i = start + 1; i < end; i++) {
      if (board[i][final.idx] !== 0) {
        return false;
      }
    }
  }
  return isValid === undefined ? true : false;
}
