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

import { getCoords, isChecking, isCheckMate } from "../helper/helper";

import BoardRow from "./BoardRow";

let piecesTaken = { white: [], black: [] };
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
let identifier;
let piecesAttacking = [];
let kingColor;
let checkMate;
let boardLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
let boardNumber = [8, 7, 6, 5, 4, 3, 2, 1];
let promoting = false;

function ChessBoard({ board, setBoard }) {
  const [selectedPiece, setSelectedPiece] = useState([]);
  const dispatch = useDispatch();
  let turn = useSelector((state) => state.turn.turn);
  let promotingPiece = useSelector((state) => state.promotingPiece);

  function promotePiece(piece) {
    let newBoard = JSON.parse(JSON.stringify(board));

    newBoard[promotingPiece.row][promotingPiece.idx] = piece;

    let move = [];
    move.push(piece);

    if (board[promotingPiece.row][promotingPiece.idx] == 0) {
      move.push(boardLetters[promotingPiece.idx]);
      move.push(boardNumber[promotingPiece.row] + "=" + piece[1].toUpperCase());
    } else {
      move.push(boardLetters[promotingPiece.idxFrom]);
      let pieceTaken =
        "x" +
        boardLetters[promotingPiece.idx] +
        boardNumber[promotingPiece.row];
      move.push(pieceTaken + "=" + piece[1].toUpperCase());
    }

    setBoard([...newBoard]);

    dispatchMove("push", move);

    if (turn == "white") {
      dispatch(timerActions.setRunningTimer("black"));
    } else {
      dispatch(timerActions.setRunningTimer("white"));
    }

    dispatch(
      promotingPieceActions.setPiece({ idx: null, row: null, idxFrom: null })
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

  function authMove(event, color, [{ coords, piece }]) {
    if (color !== turn && !coords) {
      return false;
    }

    let [rowTo, idxTo] = event.target.id.split(".");
    let [rowFrom, idxFrom] = coords.split(".");

    if (rowTo == rowFrom && idxTo == idxFrom) return false;

    if (color !== turn && coords) {
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

    if (selectedPiece.length == 0 && piece !== "" && turn == color) {
      selectedPiece.push({ coords: event.target.id, piece: piece.slice(1, 3) });
      return;
    }

    if (!authMove(event, color, selectedPiece)) {
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

    kingColor = turn == "white" ? "black" : "white";

    let newBoard = JSON.parse(JSON.stringify(board));
    if (enPassant) {
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
      castle.isCastling = false;
      castle.side = null;
    } else {
      newBoard[rowTo][idxTo] = selectedPiece[0].piece;
      newBoard[rowFrom][idxFrom] = 0;
    }

    identifier = turn == "white" ? "b" : "w";

    piecesAttacking = isChecking(newBoard, kingsPosition[turn], identifier);

    if (piecesAttacking.length !== 0) {
      resetPiece();
      dispatchMove("pop");
      if (board[rowTo][idxTo] !== 0) piecesTaken[kingColor].pop();
      console.log("invalid move!");
      return;
    }

    identifier = turn == "white" ? "w" : "b";

    piecesAttacking = isChecking(
      newBoard,
      kingsPosition[kingColor],
      identifier
    );

    if (piecesAttacking.length) {
      identifier = turn == "white" ? "w" : "b";

      checkMate = isCheckMate(
        newBoard,
        kingsPosition[kingColor],
        identifier,
        piecesAttacking,
        enPassant
      );
    }

    if (promoting == false) {
      let move = [];
      move.push(selectedPiece[0].piece);

      if (board[rowTo][idxTo] == 0) {
        if (piecesAttacking.length && !checkMate) {
          move.push(boardLetters[idxTo]);
          move.push(boardNumber[rowTo] + "+");
        }
        if (piecesAttacking.length && checkMate) {
          move.push(boardLetters[idxTo]);
          move.push(boardNumber[rowTo] + "++");
        } else {
          move.push(boardLetters[idxTo]);
          move.push(boardNumber[rowTo]);
        }
      } else {
        move.push(boardLetters[idxFrom]);
        let pieceTaken = "x" + boardLetters[idxTo] + boardNumber[rowTo];
        move.push(pieceTaken);
      }

      dispatchMove("push", move);
    }

    setBoard([...newBoard]);

    if (enPassant && !turn.includes(selectedPiece[0].piece[0])) {
      setEnPassant(false);
    }

    resetPiece();

    if (checkMate) {
      console.log("game ended");

      let move = [];
      move.push("");

      if (turn == "white") {
        move.push("1-0");
      } else {
        move.push("0-1");
      }

      dispatch(hasEndedActions.setHasEnded());
      dispatch(hasEndedActions.setShowPopup());
      dispatch(timerActions.setRunningTimer(null));
      return;
    }

    if (promoting) {
      console.log("we are here");
      promoting = false;
      dispatch(
        promotingPieceActions.setPiece({
          row: +rowTo,
          idx: +idxTo,
          idxFrom: idxFrom,
        })
      );
      return;
    }

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
            dark={idx % 2 !== 0}
            rowData={board[idx]}
            row={+idx}
            promotePiece={promotePiece}
            onClick={handleMove}
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
