export function movePawn(event, board, coords, piece, piecesTaken) {
  let [rowTo, idxTo] = event.target.id.split(".");
  let [rowFrom, idxFrom] = coords.split(".");

  if (piece.includes("wp")) {
    if (+rowTo >= +rowFrom) {
      return false;
    }
    if (+rowTo < +rowFrom && idxTo == idxFrom) {
      if (board[rowTo][idxTo] !== 0) return false;

      if (+rowFrom == 6) {
        if (+rowTo + 1 == +rowFrom || +rowTo + 2 == +rowFrom) return true;
        return false;
      }

      return +rowTo + 1 == +rowFrom;
    }

    if (+idxTo > +idxFrom || +idxTo < +idxFrom) {
      //check for en-passant later
      if (board[rowTo][idxTo] === 0) return false;

      piecesTaken.black.push(board[rowTo][idxTo]);

      return true;
    }
    return true;
  } else {
    if (+rowTo <= +rowFrom) {
      return false;
    }

    if (+rowTo > +rowFrom && idxTo == idxFrom) {
      if (board[rowTo][idxTo] !== 0) return false;

      if (+rowFrom == 1) {
        if (+rowTo - 1 == +rowFrom || +rowTo - 2 == +rowFrom) return true;
        return false;
      }

      return +rowTo - 1 == +rowFrom;
    }

    if (+idxTo < +idxFrom || +idxTo > +(+idxFrom)) {
      if (board[rowTo][idxTo] === 0) return false;

      piecesTaken.white.push(board[rowTo][idxTo]);

      return true;
    }
    return true;
  }
}

export function moveKing(event, board, coords, turn, piecesTaken) {
  let [rowTo, idxTo] = event.target.id.split(".");
  let [rowFrom, idxFrom] = coords.split(".");

  if (board[rowTo][idxTo] === 0) {
    if (+rowTo + 1 == +rowFrom) {
      if (+idxTo + 1 == +idxFrom || +idxTo - 1 == +idxFrom || idxTo == idxFrom)
        return true;
      return false;
    }
    if (+rowTo - 1 == +rowFrom) {
      if (+idxTo + 1 == +idxFrom || +idxTo - 1 == +idxFrom || idxTo == idxFrom)
        return true;
      return false;
    }
    if (+rowTo == +rowFrom) {
      if (+idxTo + 1 == +idxFrom || +idxTo - 1 == +idxFrom) return true;

      return false;
    }
    if (+idxTo + 1 == +idxFrom || +idxTo - 1 == +idxFrom) return true;
    return false;
  } else {
    if (turn == "white") {
      piecesTaken.black.push(board[rowTo][idxTo]);
    } else {
      piecesTaken.white.push(board[rowTo][idxTo]);
    }
    console.log(piecesTaken);
    return true;
  }
}

export function moveHook(event, coords, piecesTaken, board, turn) {
  let [rowTo, idxTo] = event.target.id.split(".");
  let [rowFrom, idxFrom] = coords.split(".");

  if (idxTo !== idxFrom && rowTo !== rowFrom) return false;

  let start;
  let end;
  let isValid;

  if (rowTo == rowFrom) {
    start = idxTo < idxFrom ? idxTo : idxFrom;
    end = idxTo > idxFrom ? idxTo : idxFrom;

    start = +start + 1;
    if (start == idxTo || start == idxFrom) {
      isValid = true;
    } else {
      for (let i = start; i < +end; i++) {
        if (board[rowTo][i] !== 0) {
          isValid = false;
          break;
        }
      }
      isValid = isValid === undefined ? true : false;
    }

    if (isValid) {
      if (board[rowTo][idxTo] !== 0) {
        turn == "white"
          ? piecesTaken.black.push(board[rowTo][idxTo])
          : piecesTaken.white.push(board[rowTo][idxTo]);
      }
      return true;
    }
  } else {
    start = rowTo < rowFrom ? rowTo : rowFrom;
    end = rowTo > rowFrom ? rowTo : rowFrom;

    for (let i = +start + 1; i < end; i++) {
      if (board[i][idxTo] !== 0) {
        isValid = false;
        break;
      }
    }

    isValid = isValid === undefined ? true : false;

    if (isValid) {
      if (board[rowTo][idxTo] !== 0) {
        turn == "white"
          ? piecesTaken.black.push(board[rowTo][idxTo])
          : piecesTaken.white.push(board[rowTo][idxTo]);
      }
      return true;
    }
  }
  return false;
}

export function moveBishop(event, coords, piecesTaken, board, turn) {
  let [rowTo, idxTo] = event.target.id.split(".");
  let [rowFrom, idxFrom] = coords.split(".");

  if (idxTo !== idxFrom && rowTo == rowFrom) return false;
  if (idxTo == idxFrom && rowTo !== rowFrom) return false;

  let start = idxTo < idxFrom ? idxTo : idxFrom;
  let end = idxTo > idxFrom ? idxTo : idxFrom;
  let row;
  let isValid;

  if (idxTo > idxFrom) {
    start = +start + 1;

    if (rowTo > rowFrom) {
      row = +rowFrom + 1;
    } else {
      row = +rowFrom - 1;
    }

    for (let i = start; i <= +end; i++) {
      if (i == +idxTo && row == +rowTo) {
        isValid = true;
      } else if (board[row][i] !== 0) {
        isValid = false;
        break;
      }
      if (rowTo > rowFrom) {
        row++;
      } else {
        row--;
      }
    }
  } else {
    end = +end - 1;

    row = +rowTo;

    for (let i = start; i <= +end; i++) {
      if (i == +idxTo && row == +rowTo) {
        isValid = true;
      } else if (board[row][i] !== 0) {
        isValid = false;
        break;
      }
      if (rowTo > rowFrom) {
        row--;
      } else {
        row++;
      }
    }
  }

  if (isValid) {
    if (board[rowTo][idxTo] !== 0) {
      turn == "white"
        ? piecesTaken.black.push(board[rowTo][idxTo])
        : piecesTaken.white.push(board[rowTo][idxTo]);
    }
    return true;
  }

  return false;
}

export function moveKnight(event, coords, piecesTaken, board, turn) {
  let [rowTo, idxTo] = event.target.id.split(".");
  let [rowFrom, idxFrom] = coords.split(".");

  if (idxTo !== idxFrom && rowTo == rowFrom) return false;
  if (idxTo == idxFrom && rowTo !== rowFrom) return false;

  if (+rowTo + 2 == rowFrom || +rowTo - 2 == rowFrom) {
    if (+idxTo + 1 == idxFrom || +idxTo - 1 == idxFrom) {
      if (board[rowTo][idxTo] !== 0) {
        turn == "white"
          ? piecesTaken.black.push(board[rowTo][idxTo])
          : piecesTaken.white.push(board[rowTo][idxTo]);
      }
      return true;
    }
    return false;
  }
  if (+rowTo + 1 == rowFrom || +rowTo - 1 == rowFrom) {
    if (+idxTo + 2 == idxFrom || +idxTo - 2 == idxFrom) {
      if (board[rowTo][idxTo] !== 0) {
        turn == "white"
          ? piecesTaken.black.push(board[rowTo][idxTo])
          : piecesTaken.white.push(board[rowTo][idxTo]);
      }
      return true;
    }
    return false;
  }

  return false;
}
