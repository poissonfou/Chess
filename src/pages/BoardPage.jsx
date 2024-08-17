import classes from "./BoardPage.module.css";

import Board from "../components/Board";
import Controls from "../components/Controls";

import { useState } from "react";

function BoardPage() {
  //this state is used in the buttons to review the game,
  //keeps track of where we're at in the array
  const [movesIdx, setMovesIdx] = useState(null);

  return (
    <div className={classes["main__container"]}>
      <Board setMovesIdx={setMovesIdx} movesIdx={movesIdx}></Board>
      <Controls movesIdx={movesIdx}></Controls>
    </div>
  );
}

export default BoardPage;
