import "./App.css";
import { useState } from "react";
import { useSelector } from "react-redux";

import ChessBoard from "./components/ChessBoard";
import MovesBoard from "./components/MovesBoard";
import Timer from "./components/Timer";
import Popup from "./components/Popup";

let whiteKey;
let blackKey;
let showPopup;

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

function App() {
  const [board, setBoard] = useState(arrBoard);
  whiteKey = useSelector((state) => state.timer.forceRenderWhite);
  blackKey = useSelector((state) => state.timer.forceRenderBlack);
  showPopup = useSelector((state) => state.hasEnded.showPopup);

  return (
    <div className="main-div">
      <div>
        <Timer key={blackKey} color={"black"} />
        {showPopup && <Popup board={arrBoard} setBoard={setBoard} />}
        <ChessBoard board={board} setBoard={setBoard} />
        <Timer key={whiteKey} color={"white"} />
      </div>
      <MovesBoard board={arrBoard} setBoard={setBoard} />
    </div>
  );
}

export default App;
