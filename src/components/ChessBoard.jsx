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
import { movesActions, turnActions, timerActions } from "../store";

import { getCoords, isChecking, isCheckMate } from "../helper/helper";

import BoardRow from "./BoardRow";

const arrBoard = [
  ["bh", "bn", "bb", "bq", "bk", "bb", "bn", "bh"],
  ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["wh", "wn", "wb", "wq", "wk", "wb", "wn", "wh"],
];

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

function ChessBoard() {
  const [board, setBoard] = useState(arrBoard);
  const [selectedPiece, setSelectedPiece] = useState([]);
  const dispatch = useDispatch();
  let turn = useSelector((state) => state.turn.turn);

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

    let move = [];
    move.push(selectedPiece[0].piece);
    move.push(+rowTo);
    move.push(+idxTo);

    dispatchMove("push", move);

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
    } else {
      newBoard[rowTo][idxTo] = selectedPiece[0].piece;
      newBoard[rowFrom][idxFrom] = 0;
    }

    identifier = turn == "white" ? "b" : "w";

    piecesAttacking = isChecking(newBoard, kingsPosition[turn], identifier);

    if (piecesAttacking.length !== 0) {
      resetPiece();
      dispatchMove("pop");
      piecesTaken[kingColor].pop();
      console.log("invalid move!");
      return;
    }

    if (piecesAttacking.length) return;

    identifier = turn == "white" ? "w" : "b";

    piecesAttacking = isChecking(
      newBoard,
      kingsPosition[kingColor],
      identifier
    );

    if (piecesAttacking.length) {
      identifier = turn == "white" ? "b" : "w";

      console.log(piecesAttacking);
      checkMate = isCheckMate(
        newBoard,
        kingsPosition[kingColor],
        identifier,
        piecesAttacking,
        enPassant
      );
    }

    if (turn == "white") {
      dispatch(timerActions.setRunningTimer("black"));
    } else {
      dispatch(timerActions.setRunningTimer("white"));
    }

    setBoard([...newBoard]);

    if (enPassant && !turn.includes(selectedPiece[0].piece[0])) {
      setEnPassant(false);
    }

    resetPiece();

    if (checkMate) {
      console.log("game ended");
      dispatch(turnActions.changeTurn(null));
      dispatch(timerActions.setRunningTimer(null));
      return;
    }

    dispatchTurn();
  }

  return (
    <div className={classes.board}>
      <div className={classes["board-nums"]}>
        <span>8</span>
        <span>7</span>
        <span>6</span>
        <span>5</span>
        <span>4</span>
        <span>3</span>
        <span>2</span>
        <span>1</span>
      </div>
      <div>
        {arrBoard.map((_, idx) => (
          <BoardRow
            key={idx}
            dark={idx % 2 !== 0}
            rowData={board[idx]}
            row={+idx}
            onClick={handleMove}
          />
        ))}
      </div>
      <div className={classes["board-letters"]}>
        <span>a</span>
        <span>b</span>
        <span>c</span>
        <span>d</span>
        <span>e</span>
        <span>f</span>
        <span>g</span>
        <span>h</span>
      </div>
    </div>
  );
}

export default ChessBoard;
