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
let showPopup;
let hasEnded;
let moves;

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
let fullLogMoves = [];

function App() {
  const [board, setBoard] = useState(arrBoard);
  whiteKey = useSelector((state) => state.timer.forceRenderWhite);
  blackKey = useSelector((state) => state.timer.forceRenderBlack);
  showPopup = useSelector((state) => state.hasEnded.showPopup);
  hasEnded = useSelector((state) => state.hasEnded.hasEnded);
  moves = useSelector((state) => state.moves.moves);

  const [moveBackward, setMoveBackward] = useState({
    move: moves[moves.length - 1],
    idx: moves.length - 1,
  });
  const [moveFoward, setMoveFoward] = useState({
    move: moves[moves.length + 1],
    idx: moves.length + 1,
  });

  return (
    <div className="main-div">
      <div>
        <div className="player-info">
          <Timer key={blackKey} color={"black"} />
          <PiecesTaken piecesTaken={piecesTaken} color="white" />
        </div>
        {showPopup && (
          <Popup
            board={arrBoard}
            setBoard={setBoard}
            piecesTaken={piecesTaken}
          />
        )}
        <ChessBoard
          board={board}
          setBoard={setBoard}
          piecesTaken={piecesTaken}
          fullLogMoves={fullLogMoves}
        />
        <div className="player-info">
          <Timer key={whiteKey} color={"white"} />
          <PiecesTaken piecesTaken={piecesTaken} color="black" />
        </div>
      </div>
      <MovesBoard
        initialBoard={arrBoard}
        board={board}
        setBoard={setBoard}
        piecesTaken={piecesTaken}
        moveBackward={moveBackward}
        moveFoward={moveFoward}
        setMoveBackward={setMoveBackward}
        setMoveFoward={setMoveFoward}
        fullLogMoves={fullLogMoves}
      />
    </div>
  );
}

export default App;
