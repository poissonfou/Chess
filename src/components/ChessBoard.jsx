import { useState } from "react";

import classes from "./ChessBoard.module.css";
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

    console.log(board, color, coords);

    let [rowTo, idxTo] = event.target.id.split(".");
    let [rowFrom, idxFrom] = coords.split(".");

    if (rowTo == rowFrom && idxTo == idxFrom) return false;

    if (color !== turn && coords) {
      if (piece.includes("p")) {
        // console.log(`to ${rowTo} ${idxTo}, from ${rowFrom} ${idxFrom}`);

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
      if (piece.includes("k")) {
        console.log("king move");
        if (board[rowTo][idxTo] === 0) {
          console.log("checking");

          if (+rowTo + 1 == +rowFrom) {
            if (
              +idxTo + 1 == +idxFrom ||
              +idxTo - 1 == +idxFrom ||
              idxTo == idxFrom
            )
              return true;
            return false;
          }
          if (+rowTo - 1 == +rowFrom) {
            if (
              +idxTo + 1 == +idxFrom ||
              +idxTo - 1 == +idxFrom ||
              idxTo == idxFrom
            )
              return true;
            return false;
          }
          if (+rowTo - 1 !== +rowFrom || +rowTo + 1 !== +rowFrom) return false;
          if (+idxTo + 1 == +idxFrom || +idxTo - 1 == +idxFrom) return true;
          return false;
        }

        return color === turn;
      }
    }
  }

  function handleMove(piece, color, event) {
    console.log(piece, color, event);
    if (piece == "" && selectedPiece.length == 0) {
      return;
    }

    if (selectedPiece.length == 0 && piece !== "" && turn == color) {
      selectedPiece.push({ coords: event.target.id, piece: piece.slice(1, 3) });
      return;
    }

    console.log(selectedPiece);

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
