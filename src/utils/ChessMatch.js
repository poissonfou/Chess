const CHESSMATCH = class ChessMatch {
  constructor() {
    this.piecesTaken = { white: [], black: [] };
  }

  getPiecesTaken() {
    return this.piecesTaken;
  }

  setPiecesTaken(color, piece) {
    let val;

    if (piece == "p") val = 1;
    if (piece == "n" || piece == "b") val = 3;
    if (piece == "r") val = 5;
    if (piece == "q") val = 9;

    this.piecesTaken[color].push({ piece, val });

    function bubbleSort(arr) {
      let noSwaps;
      const swap = (arr, idx1, idx2) => {
        [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
      };
      for (let i = arr.length; i > 0; i--) {
        noSwaps = true;
        for (let j = 0; j < i - 1; j++) {
          if (arr[j].val > arr[j + 1].val) {
            swap(arr, j, j + 1);
            noSwaps = false;
          }
        }
        if (noSwaps) break;
      }
      return arr;
    }

    this.piecesTaken[color] = bubbleSort(this.piecesTaken[color]);
  }

  overwritePiecesTaken(color, newPiecesTaken) {
    this.piecesTaken[color] = newPiecesTaken;
  }

  canPieceBeTaken(board, piece) {
    const playerColor = piece.getColor();
    const opponentColor = playerColor == "w" ? "b" : "w";
    const pieceRow = piece.getPosition().row;
    const pieceColumn = piece.getPosition().column;

    const HVCheck = this.checkVerticalAndHorizontal(
      board,
      pieceRow,
      pieceColumn,
      playerColor,
      opponentColor
    );

    const diagonalCheck = this.checkDiagonal(
      board,
      pieceRow,
      pieceColumn,
      playerColor,
      opponentColor
    );

    const KnightCheck = this.checkForKnights(
      board,
      pieceRow,
      pieceColumn,
      opponentColor
    );

    return [...HVCheck, ...diagonalCheck, ...KnightCheck];
  }

  checkVerticalAndHorizontal(
    board,
    pieceRow,
    pieceColumn,
    playerColor,
    opponentColor
  ) {
    //checking the king current column, going down first

    //this array stores the opponent pieces that would not attack the king
    //in the vertical or horizontal
    const harmlessPiecesHV = ["b", "p", "n", "k"];

    const piecesChecking = [];

    let row = pieceRow + 1;
    let goingUp = false;

    if (row == 8) {
      row = pieceRow - 1;
      goingUp = true;
    }

    while (true) {
      if (row < 0 || row > 7) break;

      //checks if there is a harmless enemy piece convering
      const isHarmlessPieceCovering =
        board[row][pieceColumn]?.getColor() == opponentColor &&
        harmlessPiecesHV.includes(board[row][pieceColumn]?.getType());

      if (
        (board[row][pieceColumn]?.getColor() == playerColor ||
          isHarmlessPieceCovering) &&
        !goingUp
      ) {
        row = pieceRow - 1;
        goingUp = true;
        if (row == -1) break;
      }

      if (board[row][pieceColumn]?.getColor() == playerColor && goingUp) break;

      if (goingUp && isHarmlessPieceCovering) break;

      if (
        board[row][pieceColumn]?.getColor() == opponentColor &&
        (board[row][pieceColumn]?.getType() == "q" ||
          board[row][pieceColumn]?.getType() == "r")
      ) {
        piecesChecking.push(board[row][pieceColumn]);
        break;
      }

      if (!goingUp) {
        row++;
      } else {
        row--;
      }
    }

    //checks the king's current row, going right first;
    let column = pieceColumn + 1;
    let goingLeft = false;

    if (column == 8) {
      column = pieceColumn - 1;
      goingLeft = true;
    }

    while (true) {
      if (column < 0 || column > 7) break;

      //checks if there is a harmless enemy piece convering
      const isHarmlessPieceCovering =
        board[pieceRow][column]?.getColor() == opponentColor &&
        harmlessPiecesHV.includes(board[pieceRow][column]?.getType());

      if (
        (board[pieceRow][column]?.getColor() == playerColor ||
          isHarmlessPieceCovering) &&
        !goingLeft
      ) {
        column = pieceColumn - 1;
        goingLeft = true;
        if (column == -1) break;
      }

      if (board[pieceRow][column]?.getColor() == playerColor && goingLeft)
        break;

      if (goingUp && isHarmlessPieceCovering) break;

      if (
        board[pieceRow][column]?.getColor() == opponentColor &&
        (board[pieceRow][column]?.getType() == "q" ||
          board[pieceRow][column]?.getType() == "r")
      ) {
        piecesChecking.push(board[pieceRow][column]);
        break;
      }

      if (!goingLeft) {
        column++;
      } else {
        column--;
      }
    }

    return piecesChecking;
  }

  checkDiagonal(board, pieceRow, pieceColumn, playerColor, opponentColor) {
    //checks the diagonals to the right of the king

    //this array stores the opponents pieces that can't attack in a diagonal
    const harmlessPiecesDiagonal = ["n", "r"];

    const piecesChecking = [];

    let row = pieceRow - 1;
    let column = pieceColumn + 1;
    let goingDown = false;

    //covers issue of king being in row 0
    if (row == -1) {
      row = pieceRow + 1;
      goingDown = true;
    }

    //goes up the matrix first (row--) and then gows down(row++)
    while (true) {
      if ((column > 7 || row > 7) && goingDown) break;

      const areValuesInValid = row == -1 || column == 8;

      let isHarmlessPieceCovering;

      if (!areValuesInValid) {
        //checks if one the harmless pieces is covering the diagonal
        isHarmlessPieceCovering =
          board[row][column]?.getColor() == opponentColor &&
          harmlessPiecesDiagonal.includes(board[row][column]?.getType());
      }

      const InvalidOrCovering = areValuesInValid || isHarmlessPieceCovering;

      if (
        (InvalidOrCovering || board[row][column]?.getColor() == playerColor) &&
        !goingDown
      ) {
        goingDown = true;
        row = pieceRow + 1;
        column = pieceColumn + 1;
        if (column > 7 || row > 7) break;
      }

      if (board[row][column]?.getColor() == playerColor && goingDown) break;

      if (isHarmlessPieceCovering && goingDown) break;

      if (
        board[row][column]?.getColor() == opponentColor &&
        (board[row][column]?.getType() == "b" ||
          board[row][column]?.getType() == "q")
      ) {
        piecesChecking.push(board[row][column]);
        break;
      }

      //if the opponent's piece found was a pawn, will check if it is
      //in the adjacent column to the king's
      if (
        board[row][column]?.getColor() == opponentColor &&
        board[row][column]?.getType() == "p"
      ) {
        if (column - 1 == pieceColumn || column + 1 == pieceColumn) {
          piecesChecking.push(board[row][column]);
          break;
        }
      }

      column++;
      if (!goingDown) {
        row--;
      } else {
        row++;
      }
    }

    //checks the diagonals to the left of the king
    row = pieceRow - 1;
    column = pieceColumn - 1;
    goingDown = false;

    //covers issue of king being in row 0
    if (row == -1) {
      row = pieceRow + 1;
      goingDown = true;
    }

    while (true) {
      if ((column < 0 || row > 7) && goingDown) break;

      const areValuesInValid = row == -1 || column == -1;

      let isHarmlessPieceCovering;
      if (!areValuesInValid) {
        //checks if one the harmless pieces is covering the diagonal
        isHarmlessPieceCovering =
          board[row][column]?.getColor() == opponentColor &&
          harmlessPiecesDiagonal.includes(board[row][column]?.getType());
      }

      const InvalidOrCovering = areValuesInValid || isHarmlessPieceCovering;

      if (
        (InvalidOrCovering || board[row][column]?.getColor() == playerColor) &&
        !goingDown
      ) {
        goingDown = true;
        row = pieceRow + 1;
        column = pieceColumn - 1;
        if (column < 0 || row > 7) break;
      }

      if (board[row][column]?.getColor() == playerColor && goingDown) break;

      if (isHarmlessPieceCovering && goingDown) break;

      if (
        board[row][column]?.getColor() == opponentColor &&
        (board[row][column]?.getType() == "b" ||
          board[row][column]?.getType() == "q")
      ) {
        piecesChecking.push(board[row][column]);
        break;
      }

      //if the opponent's piece found was a pawn, will check if it is
      //in the adjacent column to the king's
      if (
        board[row][column]?.getColor() == opponentColor &&
        board[row][column]?.getType() == "p"
      ) {
        if (column - 1 == pieceColumn || column + 1 == pieceColumn) {
          piecesChecking.push(board[row][column]);
          break;
        }
      }

      column--;
      if (!goingDown) {
        row--;
      } else {
        row++;
      }
    }

    return piecesChecking;
  }

  checkForKnights(board, pieceRow, pieceColumn, opponentColor) {
    const piecesChecking = [];
    //checking for knights
    //Here we knight that are in front or behind the king
    let row = pieceRow - 2;
    let goingDown = false;

    if (row < 0) {
      row = pieceRow + 2;
      goingDown = true;
    }

    while (row < 8) {
      if (
        pieceColumn + 1 < 8 &&
        board[row][pieceColumn + 1]?.getColor() == opponentColor &&
        board[row][pieceColumn + 1]?.getType() == "n"
      ) {
        piecesChecking.push(board[row][pieceColumn + 1]);
        break;
      }

      if (
        pieceColumn - 1 > -1 &&
        board[row][pieceColumn - 1]?.getColor() == opponentColor &&
        board[row][pieceColumn - 1]?.getType() == "n"
      ) {
        piecesChecking.push(board[row][pieceColumn - 1]);
        break;
      }

      if (goingDown) break;

      if (!goingDown) {
        row = pieceRow + 2;
        goingDown = true;
      }
    }

    //Here we check for knights to the left and right of the king
    row = pieceRow - 1;
    goingDown = false;

    if (row < 0) {
      row = pieceRow + 1;
      goingDown = true;
    }

    while (row < 8) {
      if (
        pieceColumn + 2 < 8 &&
        board[row][pieceColumn + 2]?.getColor() == opponentColor &&
        board[row][pieceColumn + 2]?.getType() == "n"
      ) {
        piecesChecking.push(board[row][pieceColumn + 2]);
        break;
      }

      if (
        pieceColumn - 2 > -1 &&
        board[row][pieceColumn - 2]?.getColor() == opponentColor &&
        board[row][pieceColumn - 2]?.getType() == "n"
      ) {
        piecesChecking.push(board[row][pieceColumn - 2]);
        break;
      }

      if (goingDown) break;

      if (!goingDown) {
        row = pieceRow + 1;
        goingDown = true;
      }
    }

    return piecesChecking;
  }

  isItCheckmate(board, piecesChecking, king) {
    //checking if king can move
    const KingsOriginalPosition = king.getPosition();
    const kingMoves = king.possibleMoves(board);

    for (let i = 0; i < kingMoves.length; i++) {
      king.setPosition(kingMoves[i]);
      let piecesAttacking = this.canPieceBeTaken(board, king);
      if (!piecesAttacking.length) {
        king.setPosition(KingsOriginalPosition);
        return false;
      }
    }

    //if there are more than one piece attacking and the king can't move, declare checkmate
    if (piecesChecking.length > 1) return true;

    //check if piece attacking can be taken
    const piecesCapturingAttacker = this.canPieceBeTaken(
      board,
      piecesChecking[0]
    );

    if (piecesCapturingAttacker.length) return false;

    return true;
  }

  isItDraw(board, king) {
    //check if king has safe cases to move;

    const KingsOriginalPosition = king.getPosition();
    //getting possible moves
    const kingMoves = king.possibleMoves(board);

    let newBoard = [...board.map((row) => row)];
    for (let i = 0; i <= kingMoves.length && kingMoves.length; i++) {
      if (i == kingMoves.length) {
        newBoard[kingMoves[i - 1].row][kingMoves[i - 1].column] = null;
        newBoard[KingsOriginalPosition.row][KingsOriginalPosition.column] =
          king;
        break;
      }

      //making move on the board and checking if it is safe
      newBoard[kingMoves[i].row][kingMoves[i].column] = king;
      newBoard[KingsOriginalPosition.row][KingsOriginalPosition.column] = null;
      king.setPosition(kingMoves[i]);

      let piecesAttacking = this.canPieceBeTaken(newBoard, king);

      //undoing move
      newBoard[kingMoves[i].row][kingMoves[i].column] = null;
      newBoard[KingsOriginalPosition.row][KingsOriginalPosition.column] = king;

      if (!piecesAttacking.length) {
        king.setPosition(KingsOriginalPosition);
        return false;
      }
    }

    king.setPosition(KingsOriginalPosition);

    //looping through the board to find pieces of the king's color
    //and check if they can move
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        if (
          row == KingsOriginalPosition.row &&
          column == KingsOriginalPosition.column
        )
          continue;
        if (!board[row][column]) continue;
        if (board[row][column].getColor() == king.getColor()) {
          const possibleMoves = board[row][column].possibleMoves(board);
          if (!possibleMoves.length) continue;

          //looping through possible moves, making them on the board,
          //and checking if they don't jeopardize the king
          for (let i = 0; i < possibleMoves.length; i++) {
            const newBoard = [...board];
            const piece = board[row][column];
            const targetCase =
              newBoard[possibleMoves[i].row][possibleMoves[i].column];

            newBoard[possibleMoves[i].row][possibleMoves[i].column] = piece;
            newBoard[row][column] = null;

            const piecesAttacking = this.canPieceBeTaken(newBoard, king);

            newBoard[possibleMoves[i].row][possibleMoves[i].column] =
              targetCase;
            newBoard[row][column] = piece;

            if (piecesAttacking.length) continue;

            return false;
          }
        }
      }
    }

    return true;
  }
};

export default CHESSMATCH;
