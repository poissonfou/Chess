import "./App.css";
import { useSelector } from "react-redux";

import ChessBoard from "./components/ChessBoard";
import MovesBoard from "./components/MovesBoard";
import Timer from "./components/Timer";

let isActiveWhite;
let isActiveBlack;
let whiteKey;
let blackKey;

function App() {
  isActiveWhite = useSelector((state) => state.timer["white"]);
  isActiveBlack = useSelector((state) => state.timer["black"]);
  whiteKey = useSelector((state) => state.timer.forceRenderWhite);
  blackKey = useSelector((state) => state.timer.forceRenderBlack);

  return (
    <div className="main-div">
      <div>
        <Timer key={blackKey} isActive={isActiveBlack} />
        <ChessBoard />
        <Timer key={whiteKey} isActive={isActiveWhite} />
      </div>
      <MovesBoard />
    </div>
  );
}

export default App;
