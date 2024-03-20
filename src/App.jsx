import "./App.css";
import { useState } from "react";
import { useSelector } from "react-redux";

import ChessBoard from "./components/ChessBoard";
import MovesBoard from "./components/MovesBoard";
import Timer from "./components/Timer";
import Popup from "./components/Popup";
import PiecesTaken from "./components/PiecesTaken";

let whiteKey;
let blackKey;
let moves;
let turn;

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
let fullLogMoves = [];

function App() {
  const [board, setBoard] = useState({ board: arrBoard, finalBoard: [] });
  const [highlightCase, setHighlightCase] = useState({ from: null, to: null });
  whiteKey = useSelector((state) => state.timer.forceRenderWhite);
  blackKey = useSelector((state) => state.timer.forceRenderBlack);
  let { showPopup, hasEnded } = useSelector((state) => state.hasEnded);
  moves = useSelector((state) => state.moves.moves);
  turn = useSelector((state) => state.turn.turn);

  if (hasEnded && turn !== "") {
    fullLogMoves = [];
  }

  function updateKingsPosition(turn, final, hasMoved) {
    kingsPosition[turn].row = final.row;
    kingsPosition[turn].idx = final.idx;
    kingsPosition[turn].hasMoved = hasMoved;
  }

  return (
    <div className="main-div">
      <div>
        <div className="player-info">
          <Timer key={blackKey} color={"black"} fullLogMoves={fullLogMoves} />
          <PiecesTaken piecesTaken={piecesTaken} color="white" />
        </div>
        {showPopup && (
          <Popup
            board={arrBoard}
            setBoard={setBoard}
            piecesTaken={piecesTaken}
            setHighlightCase={setHighlightCase}
          />
        )}
        <ChessBoard
          board={board.board}
          setBoard={setBoard}
          piecesTaken={piecesTaken}
          moves={moves}
          fullLogMoves={fullLogMoves}
          highlightCase={highlightCase}
          setHighlightCase={setHighlightCase}
          kingsPosition={kingsPosition}
          updateKingsPosition={updateKingsPosition}
        />
        <div className="player-info">
          <Timer key={whiteKey} color={"white"} fullLogMoves={fullLogMoves} />
          <PiecesTaken piecesTaken={piecesTaken} color="black" />
        </div>
      </div>
      <MovesBoard
        initialBoard={arrBoard}
        board={board.board}
        setBoard={setBoard}
        piecesTaken={piecesTaken}
        fullLogMoves={fullLogMoves}
        setHighlightCase={setHighlightCase}
        updateKingsPosition={updateKingsPosition}
      />
    </div>
  );
}

export default App;
