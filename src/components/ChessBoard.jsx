import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import classes from "./ChessBoard.module.css";

import {
  movePawn,
  moveKing,
  moveHook,
  moveBishop,
  moveKnight,
  moveQueen,
} from "../helper/moves";

import {
  movesActions,
  turnActions,
  timerActions,
  promotingPieceActions,
  hasEndedActions,
} from "../store";

import {
  canKingMove,
  getCoords,
  isChecking,
  isCheckMate,
  saveGame,
} from "../helper/helper";

import BoardRow from "./BoardRow";
import { useGameInfo } from "../hooks/useGameInfo";

let kingsPosition = {
  white: { row: 7, idx: 4, hasMoved: false },
  black: { row: 0, idx: 4, hasMoved: false },
};
let hooksMoved = {
  white: { queenSide: false, kingSide: false },
  black: { queenSide: false, kingSide: false },
};
let castle = { isCastling: false, side: null };
let enPassant = false;
let pieceIdentifier;
let piecesAttacking = [];
let opositeColor;
let checkMate;
let boardLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
let boardNumber = [8, 7, 6, 5, 4, 3, 2, 1];
let promoting = false;

function ChessBoard({
  board,
  setBoard,
  piecesTaken,
  fullLogMoves,
  highlightCase,
  setHighlightCase,
}) {
  let moves = useSelector((state) => state.moves.moves);
  let { minutesMiliseconds, secondsInput, increment } = useGameInfo();
  const dispatch = useDispatch();
  const [selectedPiece, setSelectedPiece] = useState([]);

  let turn = useSelector((state) => state.turn.turn);

  let promotingPiece = useSelector((state) => state.promotingPiece);

  function promotePiece(piece) {
    let newBoard = JSON.parse(JSON.stringify(board));

    newBoard[promotingPiece.rowTo][promotingPiece.idxTo] = piece;

    piecesAttacking = isChecking(
      newBoard,
      kingsPosition[opositeColor],
      pieceIdentifier
    );

    if (piecesAttacking.length) {
      checkMate = isCheckMate(
        newBoard,
        kingsPosition[opositeColor],
        pieceIdentifier,
        piecesAttacking
      );
    }

    let move = [];
    move.push(piece);

    let moveLog = {};

    moveLog[selectedPiece[0].piece] = {};
    moveLog[selectedPiece[0].piece].rowFrom = promotingPiece.rowFrom;
    moveLog[selectedPiece[0].piece].idxFrom = promotingPiece.idxFrom;
    moveLog[selectedPiece[0].piece].rowTo = promotingPiece.rowTo;
    moveLog[selectedPiece[0].piece].idxTo = promotingPiece.idxTo;
    moveLog[selectedPiece[0].piece].pieceTaken = 0;
    moveLog[selectedPiece[0].piece].enPassant = false;
    moveLog[selectedPiece[0].piece].castling = {
      castling: false,
      side: null,
      piece: null,
    };
    moveLog[selectedPiece[0].piece].promoting = {
      promoting: true,
      piece: piece,
    };

    if (promotingPiece.idxFrom !== promotingPiece.idxTo) {
      move.push(boardLetters[promotingPiece.idxFrom]);
      moveLog[selectedPiece[0].piece].pieceTaken = promotingPiece.pieceTaken;
      let pieceTaken_ =
        "x" +
        boardLetters[promotingPiece.idxTo] +
        boardNumber[promotingPiece.rowTo];

      if (piecesAttacking.length) {
        checkMate ? (pieceTaken_ += "++") : (pieceTaken_ += "+");
      }

      move.push(pieceTaken_ + "=" + piece[1].toUpperCase());
    } else {
      move.push(boardLetters[promotingPiece.idxTo]);
      if (piecesAttacking.length) {
        checkMate
          ? move.push(
              boardNumber[promotingPiece.rowTo] +
                "=" +
                piece[1].toUpperCase() +
                "++"
            )
          : move.push(
              boardNumber[promotingPiece.rowTo] +
                "=" +
                piece[1].toUpperCase() +
                "+"
            );
      } else {
        move.push(
          boardNumber[promotingPiece.rowTo] + "=" + piece[1].toUpperCase()
        );
      }
    }

    fullLogMoves.push(moveLog);

    setBoard(() => {
      return { board: [...newBoard], finalBoard: [...newBoard] };
    });

    dispatchMove("push", move);

    if (turn == "white") {
      dispatch(timerActions.setRunningTimer("black"));
    } else {
      dispatch(timerActions.setRunningTimer("white"));
    }

    dispatch(
      promotingPieceActions.setPiece({
        idxTo: null,
        rowTo: null,
        idxFrom: null,
        rowFrom: null,
      })
    );

    dispatchTurn();
  }

  function resetPiece() {
    setSelectedPiece((prevSelectedPiece) => {
      let resetPiece = prevSelectedPiece;
      resetPiece.pop();
      return resetPiece;
    });
  }

  const dispatchMove = (action, ...move) => {
    if (action == "push") {
      dispatch(movesActions.push(move));
    } else {
      dispatch(movesActions.pop());
    }
  };

  function updateKingsPosition(turn, final, hasMoved) {
    kingsPosition[turn].row = final.row;
    kingsPosition[turn].idx = final.idx;
    kingsPosition[turn].hasMoved = hasMoved;
  }

  function updateHooksMoved(turn, side, hasMoved) {
    hooksMoved[turn][side] = hasMoved;
  }

  function updateCastle(isCastling, side) {
    castle.isCastling = isCastling;
    castle.side = side;
  }

  function setEnPassant(val) {
    enPassant = val;
  }

  function dispatchTurn() {
    if (turn == "white") {
      dispatch(turnActions.changeTurn("black"));
    } else {
      dispatch(turnActions.changeTurn("white"));
    }
  }

  function authMove(event, [{ coords, piece }]) {
    let [rowTo, idxTo] = event.target.id.split(".");
    let [rowFrom, idxFrom] = coords.split(".");

    if (rowTo == rowFrom && idxTo == idxFrom) return false;

    const { initial, final } = getCoords(event, coords);

    if (enPassant && !piece.includes("p")) {
      setEnPassant(false);
    }

    if (piece.includes("p")) {
      return movePawn(
        initial,
        final,
        board,
        piece,
        piecesTaken,
        enPassant,
        setEnPassant
      );
    }
    if (piece.includes("k")) {
      return moveKing(
        initial,
        final,
        board,
        turn,
        piecesTaken,
        kingsPosition[turn],
        updateKingsPosition,
        hooksMoved,
        updateCastle
      );
    }
    if (piece.includes("h")) {
      return moveHook(
        initial,
        final,
        piecesTaken,
        board,
        turn,
        hooksMoved,
        updateHooksMoved
      );
    }
    if (piece.includes("n")) {
      return moveKnight(initial, final, piecesTaken, board, turn);
    }
    if (piece.includes("q")) {
      return moveQueen(turn, initial, final, board, piecesTaken, piece);
    }
    if (piece.includes("b")) {
      return moveBishop(initial, final, piecesTaken, board, turn, piece);
    }

    return false;
  }

  function handleMove(piece, color, event) {
    if (piece == "" && selectedPiece.length == 0) {
      return;
    }

    if (color !== turn && !selectedPiece.length) {
      return;
    }

    if (color == turn && selectedPiece) {
      let updateState = JSON.parse(JSON.stringify(selectedPiece));
      updateState.pop();
      updateState.push({ coords: event.target.id, piece: piece.slice(1, 3) });
      setSelectedPiece(updateState);
      setHighlightCase({ from: event.target.id, to: null });
      return;
    }

    if (selectedPiece.length == 0 && piece !== "" && turn == color) {
      let updateState = JSON.parse(JSON.stringify(selectedPiece));
      updateState.push({ coords: event.target.id, piece: piece.slice(1, 3) });
      setSelectedPiece(updateState);
      setHighlightCase({ from: event.target.id, to: null });
      return;
    }

    if (!authMove(event, selectedPiece)) {
      resetPiece();
      console.log("invalid move!");
      return;
    }

    let [rowTo, idxTo] = event.target.id.split(".");
    let [rowFrom, idxFrom] = selectedPiece[0].coords.split(".");

    if (selectedPiece[0].piece.includes("wp") && rowTo == 0) {
      promoting = true;
    }

    if (selectedPiece[0].piece.includes("bp") && rowTo == 7) {
      promoting = true;
    }

    let newBoard = JSON.parse(JSON.stringify(board));
    if (enPassant && idxTo !== idxFrom) {
      newBoard[rowTo][idxTo] = selectedPiece[0].piece;
      newBoard[rowFrom][idxTo] = 0;
      newBoard[rowFrom][idxFrom] = 0;
    } else if (castle.isCastling) {
      newBoard[rowTo][idxTo] = selectedPiece[0].piece;
      newBoard[rowFrom][idxFrom] = 0;

      if (castle.side == "kingSide") {
        newBoard[rowTo][+idxTo - 1] = turn == "white" ? "wh" : "bh";
        newBoard[rowTo][+idxTo + 1] = 0;
      } else {
        newBoard[rowTo][+idxTo + 1] = turn == "white" ? "wh" : "bh";
        newBoard[rowTo][+idxTo - 2] = 0;
      }
    } else {
      newBoard[rowTo][idxTo] = selectedPiece[0].piece;
      newBoard[rowFrom][idxFrom] = 0;
    }

    pieceIdentifier = turn == "white" ? "b" : "w";
    opositeColor = turn == "white" ? "black" : "white";

    piecesAttacking = isChecking(
      newBoard,
      kingsPosition[turn],
      pieceIdentifier
    );

    if (piecesAttacking.length !== 0) {
      resetPiece();
      if (board[rowTo][idxTo] !== 0) piecesTaken[opositeColor].pop();
      console.log("invalid move!");
      return;
    }

    pieceIdentifier = turn == "white" ? "w" : "b";

    piecesAttacking = isChecking(
      newBoard,
      kingsPosition[opositeColor],
      pieceIdentifier
    );

    if (piecesAttacking.length) {
      checkMate = isCheckMate(
        newBoard,
        kingsPosition[opositeColor],
        pieceIdentifier,
        piecesAttacking
      );
    }

    if (promoting == false) {
      let move = [];
      let moveLog = {};
      let pieceTaken;

      moveLog[selectedPiece[0].piece] = {};
      moveLog[selectedPiece[0].piece].rowFrom = +rowFrom;
      moveLog[selectedPiece[0].piece].idxFrom = +idxFrom;
      moveLog[selectedPiece[0].piece].rowTo = +rowTo;
      moveLog[selectedPiece[0].piece].idxTo = +idxTo;
      moveLog[selectedPiece[0].piece].pieceTaken = 0;
      moveLog[selectedPiece[0].piece].enPassant = false;
      moveLog[selectedPiece[0].piece].castling = {
        castling: false,
        side: null,
        piece: null,
      };
      moveLog[selectedPiece[0].piece].promoting = {
        promoting: false,
        piece: null,
      };

      move.push(selectedPiece[0].piece);

      if (board[rowTo][idxTo] == 0) {
        if (castle.isCastling) {
          moveLog[selectedPiece[0].piece].castling.castling = true;
          moveLog[selectedPiece[0].piece].castling.piece =
            turn == "white" ? "wh" : "bh";

          if (castle.side == "queenSide") {
            move.push("0-0-0");
            if (piecesAttacking.length) {
              checkMate ? move.push("++") : move.push("++");
            } else {
              move.push("");
            }
            moveLog[selectedPiece[0].piece].castling.side = "queenSide";
          } else {
            move.push("0-0");
            if (piecesAttacking.length) {
              checkMate ? move.push("++") : move.push("++");
            } else {
              move.push("");
            }

            moveLog[selectedPiece[0].piece].castling.side = "kingSide";
          }
          updateCastle(false, null);
        } else {
          if (enPassant && idxFrom !== idxTo) {
            moveLog[selectedPiece[0].piece].enPassant = true;
            moveLog[selectedPiece[0].piece].pieceTaken = board[rowFrom][idxTo];

            pieceTaken = "x" + boardLetters[idxTo] + boardNumber[rowFrom];
            move.push(boardLetters[idxFrom]);

            if (piecesAttacking.length) {
              checkMate ? (pieceTaken += "++") : (pieceTaken += "+");
            }

            move.push(pieceTaken);
          } else {
            move.push(boardLetters[idxTo]);
            if (piecesAttacking.length) {
              checkMate
                ? move.push(boardNumber[rowTo] + "++")
                : move.push(boardNumber[rowTo] + "+");
            } else {
              move.push(boardNumber[rowTo]);
            }
          }
        }
      } else {
        move.push(boardLetters[idxFrom]);

        moveLog[selectedPiece[0].piece].pieceTaken = board[rowTo][idxTo];

        pieceTaken = "x" + boardLetters[idxTo] + boardNumber[rowTo];

        if (piecesAttacking.length) {
          checkMate ? (pieceTaken += "++") : (pieceTaken += "+");
        }

        move.push(pieceTaken);
      }

      fullLogMoves.push(moveLog);
      dispatchMove("push", move);
    }

    if (enPassant && !turn.includes(selectedPiece[0].piece[0])) {
      setEnPassant(false);
    }

    if (promoting) {
      dispatch(
        promotingPieceActions.setPiece({
          rowTo: +rowTo,
          idxTo: +idxTo,
          idxFrom: +idxFrom,
          rowFrom: +rowFrom,
          pieceTaken: board[rowTo][idxTo],
        })
      );
    }

    setBoard(() => {
      return { board: [...newBoard], finalBoard: [...newBoard] };
    });

    if (promoting) {
      promoting = false;
      return;
    }

    setHighlightCase((prevState) => {
      return { from: prevState.from, to: event.target.id };
    });

    if (checkMate) {
      piecesAttacking = [];
      checkMate = false;
      dispatch(turnActions.changeTurn(turn));
      dispatch(hasEndedActions.setHasEnded());
      dispatch(hasEndedActions.setShowPopup());
      dispatch(timerActions.setRunningTimer(null));

      saveGame(
        dispatch,
        fullLogMoves,
        turn == "white" ? "1-0" : "0-1",
        moves,
        0,
        minutesMiliseconds,
        secondsInput,
        increment
      );
      return;
    }

    //check for draw
    if (!piecesAttacking.length) {
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
        newBoard,
        pieceIdentifier
      );

      if (!canMove) {
        pieceIdentifier = turn == "white" ? "b" : "w";
        let piece;
        let notDraw = false;

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
                    pieceIdentifier
                  );

                  if (piecesAttacking.length == 0) {
                    notDraw = true;
                    break;
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
                    pieceIdentifier
                  );

                  if (piecesAttacking.length == 0) {
                    notDraw = true;
                    break;
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
                    pieceIdentifier
                  );

                  if (piecesAttacking.length == 0) {
                    notDraw = true;
                    break;
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
                    pieceIdentifier
                  );

                  if (piecesAttacking.length == 0) {
                    notDraw = true;
                    break;
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
                      notDraw = true;
                      break;
                    }
                  }

                  for (let i = 0; i < possibleMoves.length; i++) {
                    let previewBoard = JSON.parse(JSON.stringify(board));
                    previewBoard[possibleMoves[i].rowFrom][
                      possibleMoves[i].idxFrom
                    ] = 0;
                    previewBoard[possibleMoves[i].rowTo][
                      possibleMoves[i].idxTo
                    ] = board[row][idx];

                    let piecesAttacking = isChecking(
                      previewBoard,
                      kingsPosition[opositeColor],
                      pieceIdentifier
                    );

                    if (piecesAttacking.length == 0) {
                      notDraw = true;
                      break;
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
                      notDraw = true;
                      break;
                    }
                  }

                  for (let i = 0; i < possibleMoves.length; i++) {
                    let previewBoard = JSON.parse(JSON.stringify(board));
                    previewBoard[possibleMoves[i].rowFrom][
                      possibleMoves[i].idxFrom
                    ] = 0;
                    previewBoard[possibleMoves[i].rowTo][
                      possibleMoves[i].idxTo
                    ] = board[row][idx];

                    let piecesAttacking = isChecking(
                      previewBoard,
                      kingsPosition[opositeColor],
                      pieceIdentifier
                    );

                    if (piecesAttacking.length == 0) {
                      notDraw = true;
                      break;
                    }
                  }
                }
              }

              if (notDraw) break;
            }
          }
          if (notDraw) break;
        }

        if (!notDraw) {
          console.log("draw - king can't move");
          dispatch(turnActions.changeTurn("draw"));
          dispatch(hasEndedActions.setHasEnded());
          dispatch(hasEndedActions.setShowPopup());
          dispatch(timerActions.setRunningTimer(null));

          saveGame(
            dispatch,
            fullLogMoves,
            "1/2",
            moves,
            0,
            minutesMiliseconds,
            secondsInput,
            increment
          );
          return;
        }
      }
    }

    resetPiece();

    if (turn == "white") {
      dispatch(timerActions.setRunningTimer("black"));
    } else {
      dispatch(timerActions.setRunningTimer("white"));
    }

    dispatchTurn();
  }

  return (
    <div className={classes.board}>
      <ul className={classes["board-nums"]}>
        <li>8</li>
        <li>7</li>
        <li>6</li>
        <li>5</li>
        <li>4</li>
        <li>3</li>
        <li>2</li>
        <li>1</li>
      </ul>
      <div>
        {board.map((_, idx) => (
          <BoardRow
            key={idx}
            dark={idx % 2 == 0}
            rowData={board[idx]}
            row={+idx}
            promotePiece={promotePiece}
            onClick={handleMove}
            highlightCase={highlightCase}
          />
        ))}
      </div>
      <ul className={classes["board-letters"]}>
        <li>a</li>
        <li>b</li>
        <li>c</li>
        <li>d</li>
        <li>e</li>
        <li>f</li>
        <li>g</li>
        <li>h</li>
      </ul>
    </div>
  );
}

export default ChessBoard;
