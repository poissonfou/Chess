import { useState } from "react";

import classes from "./ChessBoard.module.css";
import { movePawn, moveKing } from "../helper/moves";

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

function ChessBoard() {
  const [board, setBoard] = useState(arrBoard);
  const [turn, setTurn] = useState("white");
  const [selectedPiece, setSelectedPiece] = useState([]);
  // const [piecesTaken, setPiecesTaken] = useState({ white: [], black: [] });

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

    if (color !== turn && coords) {
      if (piece.includes("p")) {
        return movePawn(event, board, coords, piece, piecesTaken);
      }
      if (piece.includes("k")) {
        return moveKing(event, board, coords, turn, piecesTaken);
      }
      if (piece.includes("h")) {
        if (idxTo !== idxFrom && rowTo !== rowFrom) return false;

        if (rowTo == rowFrom) {
          let start = idxTo < idxFrom ? idxTo : idxFrom;
          let end = idxTo > idxFrom ? idxTo : idxFrom;
          let isValid;

          if (start === idxFrom) {
            if (+start + 1 == idxTo) {
              isValid = true;
            } else {
              start = +start + 1;
              for (let i = start; i <= +end; i++) {
                if (board[rowTo][i] !== 0) {
                  isValid = false;
                  return;
                }
              }
              isValid = isValid === undefined ? true : false;
            }
          } else {
            if (+start + 1 == idxFrom) {
              isValid = true;
            } else {
              start = +start + 1;
              console.log(start, end, board[rowTo]);
              for (let i = start; i <= +end; i++) {
                if (board[rowTo][i] !== 0) {
                  isValid = false;
                  return;
                }
              }
              isValid = isValid === undefined ? true : false;
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

        return true;
      }
    }
    return false;
  }

  function handleMove(piece, color, event) {
    if (piece == "" && selectedPiece.length == 0) {
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
      newBoard[rowTo][idxTo] = selectedPiece[0].piece;
      newBoard[rowFrom][idxFrom] = 0;
      return [...newBoard];
    });

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
