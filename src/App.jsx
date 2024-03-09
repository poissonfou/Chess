import "./App.css";
import { useSelector } from "react-redux";

import ChessBoard from "./components/ChessBoard";
import MovesBoard from "./components/MovesBoard";
import Timer from "./components/Timer";

let whiteKey;
let blackKey;

function App() {
  whiteKey = useSelector((state) => state.timer.forceRenderWhite);
  blackKey = useSelector((state) => state.timer.forceRenderBlack);

  return (
    <div className="main-div">
      <div>
        <Timer key={blackKey} color={"black"} />
        <ChessBoard />
        <Timer key={whiteKey} color={"white"} />
      </div>
      <MovesBoard />
    </div>
  );
}

export default App;
