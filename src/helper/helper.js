export function getCoords(event, coords) {
  let [rowTo, idxTo] = event.target.id.split(".");
  let [rowFrom, idxFrom] = coords.split(".");

  return {
    initial: { row: +rowFrom, idx: +idxFrom },
    final: { row: +rowTo, idx: +idxTo },
  };
}

export function setPiecesTaken(turn, final, board, piecesTaken) {
  turn == "white"
    ? piecesTaken.black.push(board[final.row][final.idx])
    : piecesTaken.white.push(board[final.row][final.idx]);
}

export function authDiagonal(board, initial, final, piece) {
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

export function authVerticalAndHorizontal(board, initial, final) {
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

export function checkDiagonal(
  board,
  diagonal,
  kingsPosition,
  identifierBishop,
  identifierQueen
) {
  let idx = kingsPosition.idx;
  let row = kingsPosition.row;
  let checking;
  let path = [];
  let coords;

  while (true) {
    if (diagonal == 1) {
      row--;
      idx--;

      if (idx < 0 || row < 0) {
        break;
      }
    } else if (diagonal == 2) {
      row--;
      idx++;

      if (idx > 7 || row < 0) {
        break;
      }
    } else if (diagonal == 3) {
      row++;
      idx--;

      if (idx < 0 || row > 7) {
        break;
      }
    } else {
      row++;
      idx++;

      if (idx > 7 || row > 7) {
        break;
      }
    }

    if (
      board[row][idx] == identifierBishop ||
      board[row][idx] == identifierQueen
    ) {
      checking = path.every((el) => {
        return el == 0;
      });

      coords = { diagonal: { row: row, idx: idx } };
      break;
    }
    path.push(board[row][idx]);
  }

  return {
    checking,
    coords,
  };
}

export function checkHorses(direction, kingsPosition, board, identifierKnight) {
  let idx;
  let row;
  let coords;
  let checking = true;

  if (direction == "up-minus") {
    idx = kingsPosition.idx - 1;
    row = kingsPosition.row - 2;
  }

  if (direction == "up-plus") {
    idx = kingsPosition.idx + 1;
    row = kingsPosition.row - 2;
  }

  if (direction == "down-minus") {
    idx = kingsPosition.idx - 1;
    row = kingsPosition.row + 2;
  }

  if (direction == "down-plus") {
    idx = kingsPosition.idx + 1;
    row = kingsPosition.row + 2;
  }

  if (direction == "turn-left-minus") {
    idx = kingsPosition.idx - 2;
    row = kingsPosition.row - 1;
  }

  if (direction == "turn-left-plus") {
    idx = kingsPosition.idx - 2;
    row = kingsPosition.row + 1;
  }

  if (direction == "turn-right-minus") {
    idx = kingsPosition.idx + 2;
    row = kingsPosition.row - 1;
  }

  if (direction == "turn-right-plus") {
    idx = kingsPosition.idx + 2;
    row = kingsPosition.row + 1;
  }

  if (idx > 7 || idx < 0 || row > 7 || row < 0)
    return {
      cheking: false,
      coords: 0,
    };

  if (board[row][idx] == identifierKnight) {
    coords = { knight: { row, idx } };
    return {
      checking,
      coords,
    };
  }
  return {
    cheking: false,
    coords: 0,
  };
}

export function isChecking(
  board,
  kingsPosition,
  identifier,
  pawnChecking,
  moves,
  sub
) {
  let start;
  let end;
  let piecesAttacking = [];
  let pawn, pawnRow, pawnIdx;
  let idx;

  let identifierHook = identifier + "h";
  let identifierQueen = identifier + "q";
  let identifierBishop = identifier + "b";
  let identifierKnight = identifier + "n";
  let identifierPawn = identifier + "p";

  //checking pawns
  //Check for pawn check in this function, you have the info of the  kingsPosition,
  //check that on the board, if it is white or black, and them do the calcs
  idx = moves.length - sub;
  pawn = moves[idx];
  if (pawnChecking && sub == 2) {
    pawnRow = pawn[identifierPawn].row;
    pawnIdx = pawn[identifierPawn].idx;

    if (board[pawnRow][pawnIdx] == identifierPawn) {
      if (identifierPawn == "bp") {
        if (
          board[pawnRow + 1][pawnIdx - 1] == "wk" ||
          board[pawnRow + 1][pawnIdx + 1] == "wk"
        ) {
          piecesAttacking.push({
            pawn: {
              row: pawn[identifierPawn].row,
              idx: pawn[identifierPawn].idx,
            },
          });
        }
      } else {
        if (
          board[pawnRow - 1][pawnIdx - 1] == "wk" ||
          board[pawnRow - 1][pawnIdx + 1] == "wk"
        ) {
          piecesAttacking.push({
            pawn: {
              row: pawn[identifierPawn].row,
              idx: pawn[identifierPawn].idx,
            },
          });
        }
      }
    }
  } else if (pawnChecking && sub == 1) {
    piecesAttacking.push({
      pawn: {
        row: pawn[identifierPawn].row,
        idx: pawn[identifierPawn].idx,
      },
    });
  }

  //checking horizontal
  if (
    board[kingsPosition.row].includes(identifierHook) ||
    board[kingsPosition.row].includes(identifierQueen)
  ) {
    console.log("checking horizontal");
    for (let i = 0; i < board[kingsPosition.row].length; i++) {
      if (
        board[kingsPosition.row][i] == identifierHook ||
        board[kingsPosition.row][i] == identifierQueen
      ) {
        console.log("bro wwhy", kingsPosition);
        start = i < kingsPosition.idx ? i : kingsPosition.idx;
        end = i > kingsPosition.idx ? i : kingsPosition.idx;

        for (let j = start + 1; j < end; j++) {
          if (board[kingsPosition.row][j] !== 0) {
            break;
          }
        }
        piecesAttacking.push({
          horizontal: { row: kingsPosition.row, idx: i },
        });
        break;
      }
    }
  }

  //checking vertical

  for (let i = 0; i < board.length; i++) {
    if (
      board[i][kingsPosition.idx] == identifierHook ||
      board[i][kingsPosition.idx] == identifierQueen
    ) {
      console.log("checking vertical");
      let start = i < kingsPosition.row ? i : kingsPosition.row;
      let end = i > kingsPosition.row ? i : kingsPosition.row;

      for (let j = start + 1; j < end; j++) {
        if (board[j][kingsPosition.idx] !== 0) {
          break;
        }
      }
      piecesAttacking.push({
        vertical: { row: i, idx: kingsPosition.idx },
      });
    }
  }

  //check diagonal
  let diagonals = [1, 2, 3, 4];

  for (let i = 0; i < diagonals.length; i++) {
    let { checking, coords } = checkDiagonal(
      board,
      diagonals[i],
      kingsPosition,
      identifierBishop,
      identifierQueen
    );
    if (checking) {
      piecesAttacking.push(coords);
      break;
    }
  }

  let directions = [
    "up-minus",
    "up-plus",
    "down-minus",
    "down-plus",
    "turn-left-minus",
    "turn-left-plus",
    "turn-right-minus",
    "turn-right-plus",
  ];

  //check horses
  for (let i = 0; i < directions.length; i++) {
    let { checking, coords } = checkHorses(
      directions[i],
      kingsPosition,
      board,
      identifierKnight
    );

    if (checking) {
      piecesAttacking.push(coords);
      break;
    }
  }
  return piecesAttacking;
}
