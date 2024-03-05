import "./App.css";

import ChessBoard from "./components/ChessBoard";
import MovesBoard from "./components/MovesBoard";

function App() {
  return (
    <div className="main-div">
      <ChessBoard />
      <MovesBoard />
    </div>
  );
}

export default App;
