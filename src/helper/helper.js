import { gamesActions } from "../store";

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

export function resetPiecesTaken(piecesTaken) {
  piecesTaken.black = [];
  piecesTaken.white = [];
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

function canDiagonalBeCovered(
  board,
  piecesChecking,
  kingsPosition,
  opositeIdentifier,
  identifier,
  row,
  idx
) {
  console.log(row, idx);
  if (identifier == "b") {
    if (board[row + 1][idx] == "wp") {
      let newBoard = JSON.parse(JSON.stringify(board));
      newBoard[piecesChecking[0].row][piecesChecking[0].idx] = "bq";
      newBoard[row][idx] = "wp";
      newBoard[row + 1][idx] = 0;

      let canBeCovered = isChecking(newBoard, kingsPosition, opositeIdentifier);

      return !canBeCovered.length ? true : false;
    }
  } else {
    if (board[row - 1][idx] == "wp") {
      let newBoard = JSON.parse(JSON.stringify(board));
      newBoard[piecesChecking[0].row][piecesChecking[0].idx] = "wq";
      newBoard[row][idx] = "bp";

      let canBeCovered = isChecking(newBoard, kingsPosition, opositeIdentifier);

      return !canBeCovered.length ? true : false;
    }
  }
}

function canHorizontalBeCovered(
  board,
  piecesChecking,
  kingsPosition,
  opositeIdentifier,
  identifier,
  idx
) {
  if (identifier == "b") {
    if (board[kingsPosition.row + 1][idx] == "wp") {
      let newBoard = JSON.parse(JSON.stringify(board));
      newBoard[piecesChecking[0].row][piecesChecking[0].idx] = "bh";
      newBoard[piecesChecking[0].row][idx] = "wp";

      let canBeCovered = isChecking(
        newBoard,
        kingsPosition,
        opositeIdentifier,
        false
      );

      if (!canBeCovered.length) return true;
    }
  } else {
    if (board[kingsPosition.row - 1][idx] == "bp") {
      let newBoard = JSON.parse(JSON.stringify(board));
      newBoard[piecesChecking[0].row][piecesChecking[0].idx] = "wh";
      newBoard[piecesChecking[0].row][idx] = "bp";

      let canBeCovered = isChecking(
        newBoard,
        kingsPosition,
        opositeIdentifier,
        false
      );

      if (!canBeCovered.length) return true;
    }
  }
  return false;
}

export function canKingMove(
  kingsPosition,
  kingRow,
  finalKingRow,
  kingIdx,
  finalKingIdx,
  board,
  identifier
) {
  let newKingsPosition = {};
  let piecesAttacking;
  let newBoard = JSON.parse(JSON.stringify(board));

  if (kingsPosition.row == 0) {
    for (let j = kingRow; j > finalKingRow; j--) {
      for (let i = kingIdx; i < finalKingIdx; i++) {
        if (j < 0 || i < 0 || j > 7 || i > 7) continue;
        if (j == kingsPosition.row && i == kingsPosition.idx) continue;
        if (board[j][i] == 0 || board[j][i][0] == identifier) {
          newBoard[j][i] = board[kingsPosition.row][kingsPosition.idx];
          newBoard[kingsPosition.row][kingsPosition.idx] = 0;

          newKingsPosition.row = j;
          newKingsPosition.idx = i;

          piecesAttacking = isChecking(newBoard, newKingsPosition, identifier);

          newBoard = JSON.parse(JSON.stringify(board));

          if (piecesAttacking.length) {
            continue;
          }

          return true;
        }
      }
    }
    return false;
  } else {
    for (let j = kingRow; j <= finalKingRow; j++) {
      for (let i = kingIdx; i <= finalKingIdx; i++) {
        if (j > 7 || i > 7 || i < 0 || j < 0) continue;
        if (j == kingsPosition.row && i == kingsPosition.idx) continue;
        if (board[j][i] == 0 || board[j][i][0] == identifier) {
          newBoard[j][i] = board[kingsPosition.row][kingsPosition.idx];
          newBoard[kingsPosition.row][kingsPosition.idx] = 0;

          newKingsPosition.row = j;
          newKingsPosition.idx = i;

          piecesAttacking = isChecking(newBoard, newKingsPosition, identifier);

          newBoard = JSON.parse(JSON.stringify(board));

          if (piecesAttacking.length) {
            continue;
          }

          return true;
        }
      }
    }
    return false;
  }
}

export function isChecking(
  board,
  kingsPosition,
  identifier,
  runPawnCheck = true
) {
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
  let identifierKing = identifier + "k";

  //checking pawns
  piece = board[kingsPosition.row][kingsPosition.idx];

  if (piece !== 0 && runPawnCheck) {
    if (piece.indexOf("w") !== -1) {
      if (kingsPosition.row - 1 > 1) {
        if (board[kingsPosition.row - 1][kingsPosition.idx + 1] == "bp") {
          row = kingsPosition.row - 1;
          idx = kingsPosition.idx + 1;
          piecesAttacking.push({ row, idx });
        } else if (
          board[kingsPosition.row - 1][kingsPosition.idx - 1] == "bp"
        ) {
          row = kingsPosition.row - 1;
          idx = kingsPosition.idx - 1;
          piecesAttacking.push({ row, idx });
        }
      }
    } else {
      if (kingsPosition.row + 1 < 6) {
        if (board[kingsPosition.row + 1][kingsPosition.idx + 1] == "wp") {
          row = kingsPosition.row + 1;
          idx = kingsPosition.idx + 1;
          piecesAttacking.push({ row, idx });
        } else if (
          board[kingsPosition.row + 1][kingsPosition.idx - 1] == "wp"
        ) {
          row = kingsPosition.row + 1;
          idx = kingsPosition.idx - 1;
          piecesAttacking.push({ row, idx });
        }
      }
    }
  }

  //checking for king

  let kingRow, finalKingRow;

  let kingIdx = kingsPosition.idx - 1;
  let finalKingIdx = kingIdx + 2;

  if (kingsPosition.row == 0) {
    kingRow = kingsPosition.row + 1;
    finalKingRow = kingRow - 2;
  } else {
    kingRow = kingsPosition.row - 1;
    finalKingRow = kingRow + 2;
  }

  //checking for king
  if (kingsPosition.row == 0) {
    for (let j = kingRow; j > finalKingRow; j--) {
      for (let i = kingIdx; i < finalKingIdx; i++) {
        if (j < 0 || i < 0 || j > 7 || i > 7) continue;
        if (j == kingsPosition.row && i == kingsPosition.idx) continue;

        if (board[j][i] == identifierKing) {
          if (piece !== 0) {
            if (piece.includes("k")) {
              piecesAttacking.push({ row: j, idx: i });
              continue;
            }
          }
          let opositeIdentifier = identifier == "w" ? "b" : "w";
          let newBoard = JSON.parse(JSON.stringify(board));
          newBoard[j][i] = 0;
          newBoard[kingsPosition.row][kingsPosition.idx] = board[j][i];

          let kingIsChecked = isChecking(
            newBoard,
            kingsPosition,
            opositeIdentifier
          );

          if (!kingIsChecked.length) piecesAttacking.push({ row: j, idx: i });
        }
      }
    }
  } else {
    for (let j = kingRow; j <= finalKingRow; j++) {
      for (let i = kingIdx; i <= finalKingIdx; i++) {
        if (j < 0 || i < 0 || j > 7 || i > 7) continue;
        if (j == kingsPosition.row && i == kingsPosition.idx) continue;

        if (board[j][i] == identifierKing) {
          if (piece !== 0) {
            if (piece.includes("k")) {
              piecesAttacking.push({ row: j, idx: i });
              continue;
            }
          }

          let opositeIdentifier = identifier == "w" ? "b" : "w";
          let newBoard = JSON.parse(JSON.stringify(board));
          newBoard[j][i] = 0;
          newBoard[kingsPosition.row][kingsPosition.idx] = board[j][i];

          let kingIsChecked = isChecking(
            newBoard,
            kingsPosition,
            opositeIdentifier
          );

          if (!kingIsChecked.length) piecesAttacking.push({ row: j, idx: i });
        }
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
      break;
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
  let canBeTaken;
  let opositeIdentifier;

  let kingRow;
  let finalKingRow;
  let kingIdx = kingsPosition.idx - 1;
  let finalKingIdx = kingIdx + 2;

  //checking if king can move
  if (kingsPosition.row == 0) {
    kingRow = kingsPosition.row + 1;
    finalKingRow = kingRow - 2;
  } else {
    kingRow = kingsPosition.row - 1;
    finalKingRow = kingRow + 2;
  }

  if (
    canKingMove(
      kingsPosition,
      kingRow,
      finalKingRow,
      kingIdx,
      finalKingIdx,
      board,
      identifier
    )
  )
    return false;

  if (piecesChecking.length >= 2) return true;

  opositeIdentifier = identifier == "w" ? "b" : "w";

  //cheking if piece can be taken
  canBeTaken = isChecking(board, piecesChecking[0], opositeIdentifier);

  let validCapture;
  let checking;

  for (let i = 0; i < canBeTaken.length; i++) {
    let newBoard = JSON.parse(JSON.stringify(board));
    newBoard[piecesChecking[0].row][piecesChecking[0].idx] =
      board[canBeTaken[i].row][canBeTaken[i].idx];
    newBoard[canBeTaken[i].row][canBeTaken[i].idx] = 0;

    checking = isChecking(newBoard, kingsPosition, identifier);
    if (!checking.length) {
      validCapture = true;
      break;
    }
  }

  if (validCapture) return false;
  //checking if piece can be covered

  //KNIGHT AND PAWNS
  if (
    board[piecesChecking[0].row][piecesChecking[0].idx] == identifier + "p" ||
    board[piecesChecking[0].row][piecesChecking[0].idx] == identifier + "n"
  )
    return true;

  let idx, row;

  //BISHOP
  if (board[piecesChecking[0].row][piecesChecking[0].idx] == identifier + "b") {
    idx =
      kingsPosition.idx < piecesChecking[0].idx
        ? piecesChecking[0].idx - 1
        : piecesChecking[0].idx + 1;

    row =
      kingsPosition.row < piecesChecking[0].row
        ? piecesChecking[0].row - 1
        : piecesChecking[0].row + 1;

    if (kingsPosition.idx < piecesChecking[0].idx) {
      for (let i = idx; i > kingsPosition.idx; i--) {
        canBeTaken = isChecking(
          board,
          { row: row, idx: i },
          opositeIdentifier,
          false
        );

        if (
          canDiagonalBeCovered(
            board,
            piecesChecking,
            kingsPosition,
            opositeIdentifier,
            identifier,
            row,
            i
          )
        )
          return false;

        if (canBeTaken.length) return false;
        if (kingsPosition.row < piecesChecking[0].row) {
          row++;
        } else {
          row--;
        }
      }
    } else {
      for (let i = idx; i < kingsPosition.idx; i++) {
        canBeTaken = isChecking(
          board,
          { row: row, idx: i },
          opositeIdentifier,
          false
        );

        if (
          canDiagonalBeCovered(
            board,
            piecesChecking,
            kingsPosition,
            opositeIdentifier,
            identifier,
            row,
            i
          )
        )
          return false;

        if (canBeTaken.length) return false;
        if (kingsPosition.row < piecesChecking[0].row) {
          row++;
        } else {
          row--;
        }
      }
    }
  }

  // HOOKS
  if (board[piecesChecking[0].row][piecesChecking[0].idx] == identifier + "h") {
    //checking vertical
    if (piecesChecking[0].row !== kingsPosition.row) {
      row =
        kingsPosition.row < piecesChecking[0].row
          ? piecesChecking[0].row - 1
          : piecesChecking[0].row + 1;

      if (kingsPosition.row < piecesChecking[0].row) {
        for (let i = row; i < kingsPosition.row; i++) {
          canBeTaken = isChecking(
            board,
            { row: i, idx: piecesChecking[0].idx },
            opositeIdentifier
          );

          if (canBeTaken.length) return false;
        }
      } else {
        for (let i = row; i > kingsPosition.row; i--) {
          canBeTaken = isChecking(
            board,
            { row: i, idx: piecesChecking[0].idx },
            opositeIdentifier
          );

          if (canBeTaken.length) return false;
        }
      }
    } else {
      //checking horizontal
      idx =
        kingsPosition.idx < piecesChecking[0].idx
          ? piecesChecking[0].idx + 1
          : piecesChecking[0].idx - 1;

      if (kingsPosition.idx < piecesChecking[0].idx) {
        for (let i = idx; i < kingsPosition.idx; i++) {
          canBeTaken = isChecking(
            board,
            { row: kingsPosition.row, idx: i },
            opositeIdentifier,
            false
          );

          if (
            canHorizontalBeCovered(
              board,
              piecesChecking,
              kingsPosition,
              opositeIdentifier,
              identifier,
              i
            )
          )
            return false;

          if (canBeTaken.length) return false;
        }
      } else {
        for (let i = idx; i > kingsPosition.idx; i--) {
          canBeTaken = isChecking(
            board,
            { row: kingsPosition.row, idx: i },
            opositeIdentifier,
            false
          );

          if (
            canHorizontalBeCovered(
              board,
              piecesChecking,
              kingsPosition,
              opositeIdentifier,
              identifier,
              i
            )
          )
            return false;

          if (canBeTaken.length) return false;
        }
      }
    }
  }

  //  QUEEN
  if (board[piecesChecking[0].row][piecesChecking[0].idx] == identifier + "q") {
    //checking horizontal

    if (piecesChecking[0].row == kingsPosition.row) {
      idx =
        kingsPosition.idx < piecesChecking[0].idx
          ? piecesChecking[0].idx + 1
          : piecesChecking[0].idx - 1;

      if (kingsPosition.idx < piecesChecking[0].idx) {
        for (let i = idx; i < kingsPosition.idx; i++) {
          canBeTaken = isChecking(
            board,
            { row: kingsPosition.row, idx: i },
            opositeIdentifier,
            false
          );

          if (
            canHorizontalBeCovered(
              board,
              piecesChecking,
              kingsPosition,
              opositeIdentifier,
              identifier,
              i
            )
          )
            return false;

          if (canBeTaken.length) return false;
        }
      } else {
        for (let i = idx; i > kingsPosition.idx; i--) {
          canBeTaken = isChecking(
            board,
            { row: kingsPosition.row, idx: i },
            opositeIdentifier,
            false
          );

          if (
            canHorizontalBeCovered(
              board,
              piecesChecking,
              kingsPosition,
              opositeIdentifier,
              identifier,
              i
            )
          )
            return false;

          if (canBeTaken.length) return false;
        }
      }
    } else if (piecesChecking[0].idx == kingsPosition.idx) {
      //checking vertical
      row =
        kingsPosition.row < piecesChecking[0].row
          ? piecesChecking[0].row - 1
          : piecesChecking[0].row + 1;

      if (kingsPosition.row < piecesChecking[0].row) {
        for (let i = row; i < kingsPosition.row; i++) {
          canBeTaken = isChecking(
            board,
            { row: i, idx: piecesChecking[0].idx },
            opositeIdentifier,
            false
          );

          if (canBeTaken.length) return false;
        }
      } else {
        for (let i = row; i > kingsPosition.row; i--) {
          canBeTaken = isChecking(
            board,
            { row: i, idx: piecesChecking[0].idx },
            opositeIdentifier,
            false
          );

          if (canBeTaken.length) return false;
        }
      }
    } else {
      //checking diagonal
      console.log("checking diagonal");
      idx =
        kingsPosition.idx < piecesChecking[0].idx
          ? piecesChecking[0].idx - 1
          : piecesChecking[0].idx + 1;

      row =
        kingsPosition.row < piecesChecking[0].row
          ? piecesChecking[0].row - 1
          : piecesChecking[0].row + 1;

      if (kingsPosition.idx < piecesChecking[0].idx) {
        for (let i = idx; i > kingsPosition.idx; i--) {
          canBeTaken = isChecking(
            board,
            { row: row, idx: i },
            opositeIdentifier,
            false
          );

          if (
            canDiagonalBeCovered(
              board,
              piecesChecking,
              kingsPosition,
              opositeIdentifier,
              identifier,
              row,
              i
            )
          )
            return false;

          if (canBeTaken.length) return false;
          if (kingsPosition.row < piecesChecking[0].row) {
            row++;
          } else {
            row--;
          }
        }
      } else {
        for (let i = idx; i < kingsPosition.idx; i++) {
          canBeTaken = isChecking(
            board,
            { row: row, idx: i },
            opositeIdentifier,
            false
          );

          if (
            canDiagonalBeCovered(
              board,
              piecesChecking,
              kingsPosition,
              opositeIdentifier,
              identifier,
              row,
              i
            )
          )
            return false;

          if (canBeTaken.length) return false;
          if (kingsPosition.row < piecesChecking[0].row) {
            row++;
          } else {
            row--;
          }
        }
      }
    }
  }

  return true;
}

export function isDraw(
  kingsPosition,
  pieceIdentifier,
  board,
  opositeColor,
  turn
) {
  let kingRow, finalKingRow;

  let kingIdx = kingsPosition[opositeColor].idx - 1;
  let finalKingIdx = kingIdx + 2;

  if (kingsPosition[opositeColor].row == 0) {
    kingRow = kingsPosition[opositeColor].row + 1;
    finalKingRow = kingRow - 2;
  } else {
    kingRow = kingsPosition[opositeColor].row - 1;
    finalKingRow = kingRow + 2;
  }

  let canMove = canKingMove(
    kingsPosition[opositeColor],
    kingRow,
    finalKingRow,
    kingIdx,
    finalKingIdx,
    board,
    pieceIdentifier
  );

  if (!canMove) {
    pieceIdentifier = turn == "white" ? "b" : "w";
    let piece;

    for (let row = 0; row < board.length; row++) {
      for (let idx = 0; idx < board[row].length; idx++) {
        if (board[row][idx] == 0) continue;
        if (board[row][idx][0] == pieceIdentifier) {
          piece = board[row][idx][1];

          if (piece == "h") {
            let possibleMoves = [];
            let counter = 1;
            let idxRef = idx - 1;
            let rowRef = row - 1;
            let opositePiece = pieceIdentifier == "w" ? "b" : "w";

            while (counter <= 4) {
              if (counter < 3) {
                if (board[row][idxRef] !== undefined) {
                  if (
                    board[row][idxRef] == 0 ||
                    board[row][idxRef][0] == opositePiece
                  )
                    possibleMoves.push({
                      rowTo: row,
                      idxTo: idxRef,
                      rowFrom: row,
                      idxFrom: idx,
                    });
                }
                idxRef = idx + 1;
              } else {
                if (board[rowRef] && board[rowRef][idx] !== undefined) {
                  if (
                    board[rowRef][idx] == 0 ||
                    board[rowRef][idx][0] == opositePiece
                  )
                    possibleMoves.push({
                      rowTo: rowRef,
                      idxTo: idx,
                      rowFrom: row,
                      idxFrom: idx,
                    });
                }

                rowRef = row + 1;
              }
              counter++;
            }

            if (!possibleMoves.length) continue;

            for (let i = 0; i < possibleMoves.length; i++) {
              let previewBoard = JSON.parse(JSON.stringify(board));
              previewBoard[possibleMoves[i].rowFrom][
                possibleMoves[i].idxFrom
              ] = 0;
              previewBoard[possibleMoves[i].rowTo][possibleMoves[i].idxTo] =
                board[row][idx];

              let piecesAttacking = isChecking(
                previewBoard,
                kingsPosition[opositeColor],
                opositePiece
              );

              if (piecesAttacking.length == 0) {
                return false;
              }
            }
          }

          if (piece == "b") {
            let possibleMoves = [];
            let counter = 1;
            let idxRef = idx - 1;
            let rowRef = row + 1;
            let opositePiece = pieceIdentifier == "w" ? "b" : "w";

            while (counter < 5) {
              if (counter <= 2) {
                if (board[rowRef] && board[rowRef][idxRef] !== undefined) {
                  if (
                    board[rowRef][idxRef] == 0 ||
                    board[rowRef][idxRef][0] == opositePiece
                  )
                    possibleMoves.push({
                      rowFrom: row,
                      idxFrom: idx,
                      rowTo: rowRef,
                      idxTo: idxRef,
                    });
                }

                idxRef = idx + 1;
              } else {
                if (board[rowRef] && board[rowRef][idxRef] !== undefined) {
                  if (
                    board[rowRef][idxRef] == 0 ||
                    board[rowRef][idxRef][0] == opositePiece
                  )
                    possibleMoves.push({
                      rowFrom: row,
                      idxFrom: idx,
                      rowTo: rowRef,
                      idxTo: idxRef,
                    });
                }

                idxRef = idx - 1;
              }

              if (counter == 2) {
                rowRef = row - 1;
              }

              counter++;
            }

            if (!possibleMoves.length) continue;

            for (let i = 0; i < possibleMoves.length; i++) {
              let previewBoard = JSON.parse(JSON.stringify(board));
              previewBoard[possibleMoves[i].rowFrom][
                possibleMoves[i].idxFrom
              ] = 0;
              previewBoard[possibleMoves[i].rowTo][possibleMoves[i].idxTo] =
                board[row][idx];

              let piecesAttacking = isChecking(
                previewBoard,
                kingsPosition[opositeColor],
                opositePiece
              );

              if (piecesAttacking.length == 0) {
                return false;
              }
            }
          }

          if (piece == "n") {
            let possibleMoves = [];
            let counter = 1;
            let idxRef = idx - 1;
            let rowRef = row + 2;
            let opositePiece = pieceIdentifier == "w" ? "b" : "w";

            while (counter < 9) {
              if (counter <= 2) {
                if (board[rowRef] && board[rowRef][idxRef] !== undefined) {
                  if (
                    board[rowRef][idxRef] == 0 ||
                    board[rowRef][idxRef][0] == opositePiece
                  )
                    possibleMoves.push({
                      rowFrom: row,
                      idxFrom: idx,
                      rowTo: rowRef,
                      idxTo: idxRef,
                    });
                }
                idxRef = idx + 1;
              } else if (counter <= 4) {
                if (board[rowRef] && board[rowRef][idxRef] !== undefined) {
                  if (
                    board[rowRef][idxRef] == 0 ||
                    board[rowRef][idxRef][0] == opositePiece
                  )
                    possibleMoves.push({
                      rowFrom: row,
                      idxFrom: idx,
                      rowTo: rowRef,
                      idxTo: idxRef,
                    });
                }
                idxRef = idx - 1;
              } else if (counter <= 6) {
                if (board[rowRef] && board[rowRef][idxRef] !== undefined) {
                  if (
                    board[rowRef][idxRef] == 0 ||
                    board[rowRef][idxRef][0] == opositePiece
                  )
                    possibleMoves.push({
                      rowFrom: row,
                      idxFrom: idx,
                      rowTo: rowRef,
                      idxTo: idxRef,
                    });
                }
                idxRef = idx + 2;
              } else {
                if (board[rowRef] && board[rowRef][idxRef] !== undefined) {
                  if (
                    board[rowRef][idxRef] == 0 ||
                    board[rowRef][idxRef][0] == opositePiece
                  )
                    possibleMoves.push({
                      rowFrom: row,
                      idxFrom: idx,
                      rowTo: rowRef,
                      idxTo: idxRef,
                    });
                }

                idxRef = idx + 2;
              }

              if (counter == 2) {
                rowRef = row - 2;
              }
              if (counter == 4) {
                rowRef = row - 1;
                idxRef = idx - 2;
              }
              if (counter == 6) {
                rowRef = row + 1;
                idxRef = idx - 2;
              }

              counter++;
            }

            if (!possibleMoves.length) continue;

            for (let i = 0; i < possibleMoves.length; i++) {
              let previewBoard = JSON.parse(JSON.stringify(board));
              previewBoard[possibleMoves[i].rowFrom][
                possibleMoves[i].idxFrom
              ] = 0;
              previewBoard[possibleMoves[i].rowTo][possibleMoves[i].idxTo] =
                board[row][idx];

              let piecesAttacking = isChecking(
                previewBoard,
                kingsPosition[opositeColor],
                opositePiece
              );

              if (piecesAttacking.length == 0) {
                return false;
              }
            }
          }

          if (piece == "q") {
            let possibleMoves = [];
            let counter = 1;
            let idxRef = idx - 1;
            let rowRef = row;
            let opositePiece = pieceIdentifier == "w" ? "b" : "w";

            while (counter < 9) {
              if (counter <= 2) {
                if (board[rowRef] && board[rowRef][idxRef] !== undefined) {
                  if (
                    board[rowRef][idxRef] == 0 ||
                    board[rowRef][idxRef][0] == opositePiece
                  )
                    possibleMoves.push({
                      rowFrom: row,
                      idxFrom: idx,
                      rowTo: rowRef,
                      idxTo: idxRef,
                    });
                }
                idxRef = idx + 1;
              } else {
                if (board[rowRef] && board[rowRef][idxRef] !== undefined) {
                  if (
                    board[rowRef][idxRef] == 0 ||
                    board[rowRef][idxRef][0] == opositePiece
                  )
                    possibleMoves.push({
                      rowFrom: row,
                      idxFrom: idx,
                      rowTo: rowRef,
                      idxTo: idxRef,
                    });
                }
              }

              if (counter == 2) {
                rowRef = row + 1;
                idxRef = idx;
              }
              if (counter == 3) {
                idxRef = idx - 1;
              }
              if (counter == 4) {
                idxRef = idx + 1;
              }

              if (counter == 5) {
                rowRef = row - 1;
                idxRef = idx;
              }

              if (counter == 6) {
                idxRef = idx - 1;
              }

              if (counter == 7) {
                idxRef = idx + 1;
              }

              counter++;
            }

            if (!possibleMoves.length) continue;

            for (let i = 0; i < possibleMoves.length; i++) {
              let previewBoard = JSON.parse(JSON.stringify(board));
              previewBoard[possibleMoves[i].rowFrom][
                possibleMoves[i].idxFrom
              ] = 0;
              previewBoard[possibleMoves[i].rowTo][possibleMoves[i].idxTo] =
                board[row][idx];

              let piecesAttacking = isChecking(
                previewBoard,
                kingsPosition[opositeColor],
                opositePiece
              );

              if (piecesAttacking.length == 0) {
                return false;
              }
            }
          }

          if (piece == "p") {
            let possibleMoves = [];
            if (pieceIdentifier == "w") {
              let counter = 1;
              let rowRef = row - 1;
              let idxRef = idx - 1;
              let opositePiece = pieceIdentifier == "w" ? "b" : "w";

              while (counter < 3) {
                if (board[rowRef] && board[rowRef][idxRef] !== undefined) {
                  if (board[rowRef][idxRef][0] == opositePiece)
                    possibleMoves.push({
                      rowTo: rowRef,
                      idxTo: idxRef,
                      rowFrom: row,
                      idxFrom: idx,
                    });
                }

                idxRef = idx + 1;
                counter++;
              }

              if (!possibleMoves.length) {
                if (board[row - 1] && board[row - 1][idx] !== 0) {
                  continue;
                } else {
                  return false;
                }
              }

              for (let i = 0; i < possibleMoves.length; i++) {
                let previewBoard = JSON.parse(JSON.stringify(board));
                previewBoard[possibleMoves[i].rowFrom][
                  possibleMoves[i].idxFrom
                ] = 0;
                previewBoard[possibleMoves[i].rowTo][possibleMoves[i].idxTo] =
                  board[row][idx];

                let piecesAttacking = isChecking(
                  previewBoard,
                  kingsPosition[opositeColor],
                  opositePiece
                );

                if (piecesAttacking.length == 0) {
                  return false;
                }
              }
            } else {
              let counter = 1;
              let rowRef = row + 1;
              let idxRef = idx - 1;
              let opositePiece = pieceIdentifier == "w" ? "b" : "w";

              while (counter < 3) {
                if (board[rowRef] && board[rowRef][idxRef] !== undefined) {
                  if (board[rowRef][idxRef][0] == opositePiece)
                    possibleMoves.push(board[rowRef][idxRef]);
                }

                idxRef = idx + 1;
                counter++;
              }

              if (!possibleMoves.length) {
                if (board[row + 1] && board[row + 1][idx] !== 0) {
                  continue;
                } else {
                  return false;
                }
              }

              for (let i = 0; i < possibleMoves.length; i++) {
                let previewBoard = JSON.parse(JSON.stringify(board));
                previewBoard[possibleMoves[i].rowFrom][
                  possibleMoves[i].idxFrom
                ] = 0;
                previewBoard[possibleMoves[i].rowTo][possibleMoves[i].idxTo] =
                  board[row][idx];

                let piecesAttacking = isChecking(
                  previewBoard,
                  kingsPosition[opositeColor],
                  opositePiece
                );

                if (piecesAttacking.length == 0) {
                  return false;
                }
              }
            }
          }
        }
      }
    }
    return true;
  }
}

export function saveGame(
  dispatch,
  fullLogMoves,
  result,
  moves,
  fullTime,
  ...timeSections
) {
  if (moves.length == 0) return;
  let time;
  let minutesMiliseconds, secondsInput, increment;
  if (timeSections.length) {
    [minutesMiliseconds, secondsInput, increment] = timeSections;
  }

  if (fullTime == 0) {
    let miliseconds = minutesMiliseconds + secondsInput;

    let seconds = miliseconds / 1000;
    let minutes = seconds / 60;

    let dateTime = new Date();
    dateTime.setSeconds(seconds);
    dateTime.setMinutes(minutes);

    seconds = dateTime.getSeconds();
    minutes = dateTime.getMinutes();

    if (seconds == 0) {
      seconds += "0";
    }

    if (increment == 0) {
      time = `${minutes}:${seconds}`;
    } else if (increment && seconds == 0) {
      time = `${minutes}|${increment}`;
    } else {
      time = `${minutes}:${seconds}|${increment}`;
    }
  } else {
    time = fullTime;
  }

  let date = new Date();
  let Fulldate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  dispatch(
    gamesActions.addGame({
      moves,
      fullLogMoves,
      result,
      date: Fulldate,
      time,
    })
  );
}
