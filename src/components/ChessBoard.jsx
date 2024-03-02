import { useState } from "react";

import classes from "./ChessBoard.module.css";
import {
  movePawn,
  moveKing,
  moveHook,
  moveBishop,
  moveKnight,
  moveQueen,
} from "../helper/moves";

import { getCoords, isChecking } from "../helper/helper";

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
let kingsPosition = { white: { row: 7, idx: 4 }, black: { row: 0, idx: 4 } };
let enPassant = false;
let identifier;
// let isValid;

function ChessBoard() {
  const [board, setBoard] = useState(arrBoard);
  const [turn, setTurn] = useState("white");
  const [selectedPiece, setSelectedPiece] = useState([]);
  // const [piecesTaken, setPiecesTaken] = useState({ white: [], black: [] });

  function updateKingsPosition(turn, final) {
    if (turn == "white") {
      kingsPosition.white.row = final.row;
      kingsPosition.white.idx = final.idx;
      return;
    }
    kingsPosition.black.row = final.row;
    kingsPosition.black.idx = final.idx;
  }

  function setEnPassant(val) {
    enPassant = val;
  }

  function changeTurns() {
    setTurn((prevTurn) => {
      if (prevTurn == "white") return "black";
      return "white";
    });
  }

  function authMove(event, color, [{ coords, piece }]) {
    if (color !== turn && !coords) {
      return false;
    }

    let [rowTo, idxTo] = event.target.id.split(".");
    let [rowFrom, idxFrom] = coords.split(".");

    if (rowTo == rowFrom && idxTo == idxFrom) return false;

    identifier = turn == "white" ? "b" : "w";

    if (isChecking(board, kingsPosition[turn], identifier)) {
      console.log("checking");
    } else {
      console.log("not checking");
    }

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
          updateKingsPosition
        );
      }
      if (piece.includes("h")) {
        return moveHook(initial, final, piecesTaken, board, turn);
      }
      if (piece.includes("n")) {
        return moveKnight(initial, final, piecesTaken, board, turn);
      }
      if (piece.includes("q")) {
        return moveQueen(initial, final, board, piecesTaken, piece);
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
      setSelectedPiece((prevSelectedPiece) => {
        let reset = prevSelectedPiece;
        reset = [];
        return reset;
      });
      console.log("invalid move!");
      return;
    }

    let [rowTo, idxTo] = event.target.id.split(".");
    let [rowFrom, idxFrom] = selectedPiece[0].coords.split(".");

    setBoard((prevBoard) => {
      let newBoard = prevBoard;
      if (enPassant) {
        newBoard[rowTo][idxTo] = selectedPiece[0].piece;
        newBoard[rowFrom][idxTo] = 0;
        newBoard[rowFrom][idxFrom] = 0;
      } else {
        newBoard[rowTo][idxTo] = selectedPiece[0].piece;
        newBoard[rowFrom][idxFrom] = 0;
      }
      return [...newBoard];
    });

    if (enPassant && !turn.includes(selectedPiece[0].piece[0])) {
      setEnPassant(false);
    }

    setSelectedPiece((prevSelectedPiece) => {
      let reset = prevSelectedPiece;
      reset = [];
      return reset;
    });

    changeTurns();
  }

  return (
    <div>
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
      <div className={classes.board}>
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
