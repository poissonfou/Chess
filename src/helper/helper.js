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

      coords = { row: row, idx: idx };
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
    coords = { row, idx };
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

export function isChecking(board, kingsPosition, identifier) {
  let start;
  let end;
  let piecesAttacking = [];
  let row;
  let idx;
  let checking = true;
  let piece;

  let identifierHook = identifier + "h";
  let identifierQueen = identifier + "q";
  let identifierBishop = identifier + "b";
  let identifierKnight = identifier + "n";

  //checking pawns
  piece = board[kingsPosition.row][kingsPosition.idx];

  if (piece !== 0) {
    if (piece.indexOf("w") !== -1) {
      if (
        board[kingsPosition.row - 1][kingsPosition.idx + 1] == "bp" ||
        board[kingsPosition.row - 1][kingsPosition.idx - 1] == "bp"
      ) {
        if (board[kingsPosition.row - 1][kingsPosition.idx + 1] == "bp") {
          row = kingsPosition.row - 1;
          idx = kingsPosition.idx + 1;
        } else {
          row = kingsPosition.row - 1;
          idx = kingsPosition.idx - 1;
        }

        piecesAttacking.push({ row, idx });
      }
    } else {
      if (
        board[kingsPosition.row + 1][kingsPosition.idx + 1] == "wp" ||
        board[kingsPosition.row + 1][kingsPosition.idx - 1] == "wp"
      ) {
        if (board[kingsPosition.row + 1][kingsPosition.idx + 1] == "wp") {
          row = kingsPosition.row + 1;
          idx = kingsPosition.idx + 1;
        } else {
          row = kingsPosition.row + 1;
          idx = kingsPosition.idx - 1;
        }

        piecesAttacking.push({ row, idx });
      }
    }
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
        start = i < kingsPosition.idx ? i : kingsPosition.idx;
        end = i > kingsPosition.idx ? i : kingsPosition.idx;

        for (let j = start + 1; j < end; j++) {
          if (board[kingsPosition.row][j] !== 0) {
            checking = false;
            break;
          }
        }

        if (checking) {
          piecesAttacking.push({
            row: kingsPosition.row,
            idx: i,
          });
        }

        break;
      }
    }
  }

  //checking vertical
  checking = true;

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
          checking = false;
          break;
        }
      }

      if (checking) {
        piecesAttacking.push({
          row: i,
          idx: kingsPosition.idx,
        });
      }
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

export function isCheckMate(board, kingsPosition, identifier, piecesChecking) {
  let possibleMoves = [];
  let piecesAttacking;
  let canBeTaken;
  let newBoard = JSON.parse(JSON.stringify(board));
  let newKingsPosition = {};

  let kingRow;
  let finalKingRow;

  let kingIdx = kingsPosition.idx - 1;
  let finalKingIdx = kingIdx + 3;

  //checking if king can move

  if (kingsPosition.row == 0 && kingsPosition.idx == 4) {
    kingRow = kingsPosition.row + 1;
    finalKingRow = kingRow - 2;

    for (let j = kingRow; j > finalKingRow; j--) {
      for (let i = kingIdx; i < finalKingIdx; i++) {
        if (j == kingsPosition.row && i == kingsPosition.idx) continue;
        if (board[j][i] == undefined) continue;
        if (board[j][i] == 0 || board[j][i].includes(identifier)) {
          newBoard[j][i] = board[kingsPosition.row][kingsPosition.idx];
          newBoard[kingsPosition.row][kingsPosition.idx] = 0;

          newKingsPosition.row = j;
          newKingsPosition.idx = i;

          piecesAttacking = isChecking(newBoard, newKingsPosition, identifier);

          newBoard = JSON.parse(JSON.stringify(board));

          if (piecesAttacking.length) {
            continue;
          }

          return false;
        }
      }
    }
  }

  if (kingsPosition.row == 7 && kingsPosition.idx == 4) {
    kingRow = kingsPosition.row - 1;
    finalKingRow = kingRow + 2;
  } else {
    kingRow = kingsPosition.row + 1;
    finalKingRow = kingRow + 2;
  }

  for (let j = kingRow; j < finalKingRow; j++) {
    for (let i = kingIdx; i < finalKingIdx; i++) {
      if (j == kingsPosition.row && i == kingsPosition.idx) continue;
      if (board[j][i] == undefined) continue;
      if (board[j][i] == 0 || board[j][i].includes(identifier)) {
        newBoard[j][i] = board[kingsPosition.row][kingsPosition.idx];
        newBoard[kingsPosition.row][kingsPosition.idx] = 0;

        newKingsPosition.row = j;
        newKingsPosition.idx = i;

        piecesAttacking = isChecking(newBoard, newKingsPosition, identifier);

        newBoard = JSON.parse(JSON.stringify(board));

        if (piecesAttacking.length) {
          continue;
        }

        return false;
      }
    }
  }

  if (!possibleMoves.length) {
    if (piecesChecking.length >= 2) return true;

    identifier = identifier == "w" ? "b" : "w";

    canBeTaken = isChecking(board, piecesChecking[0], identifier);

    if (canBeTaken.length) return false;

    identifier = identifier == "w" ? "b" : "w";

    if (
      board[piecesChecking[0].row][piecesChecking[0].idx] == identifier + "h" ||
      board[piecesChecking[0].row][piecesChecking[0].idx] == identifier + "p"
    )
      return true;

    let idx, row;

    if (
      board[piecesChecking[0].row][piecesChecking[0].idx] == identifier + "b" ||
      board[piecesChecking[0].row][piecesChecking[0].idx] == identifier + "q"
    ) {
      idx = piecesChecking[0].idx + 1;
      row = piecesChecking[0].row + 1;

      for (let i = idx; i < kingsPosition.idx; i++) {
        canBeTaken = isChecking(board, { row: row, idx: i }, identifier);
        if (canBeTaken.length) return false;
        row++;
      }
    }

    if (
      board[piecesChecking[0].row][piecesChecking[0].idx] == identifier + "h" ||
      board[piecesChecking[0].row][piecesChecking[0].idx] == identifier + "q"
    ) {
      row = piecesChecking[0].row + 1;

      for (let i = piecesChecking[0].row; i < kingsPosition.row; i++) {
        canBeTaken = isChecking(
          board,
          { row: i, idx: piecesChecking[0].idx },
          identifier
        );
        if (canBeTaken.length) return false;
      }
    }
  }

  return true;
}
