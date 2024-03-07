import classes from "./MovesBoard.module.css";

import { useSelector, useDispatch } from "react-redux";
import { turnActions, timerActions } from "../store";

function MovesBoard() {
  let moves = useSelector((state) => state.moves.moves);
  let turn = useSelector((state) => state.turn.turn);
  let dispatch = useDispatch();
  let movesBlack = [];

  function setGame(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    let timer = +data.time * 60000;

    dispatch(timerActions.setTime(timer));
    dispatch(timerActions.setRunningTimer("white"));
    dispatch(timerActions.changeKeys());
    dispatch(turnActions.changeTurn("white"));
  }

  let movesWhite = moves.filter((move) => {
    let key = move[0];
    return key[0].includes("w");
  });

  movesBlack = moves.filter((move) => {
    let key = move[0];
    return key[0].includes("b") && !key[0].includes("w");
  });

  return (
    <div>
      {turn == null && (
        <div className={classes["start-game-div"]}>
          <form onSubmit={setGame}>
            <div>
              <label htmlFor="time">Chose the time:</label>
              <select name="time" id="time">
                <option value="1">1 min.</option>
                <option value="2">2 min.</option>
                <option value="3">3 min.</option>
                <option value="10">10 min.</option>
                <option value="15">15 min.</option>
                <option value="30">30 min.</option>
              </select>
            </div>
            <button>Play</button>
          </form>
        </div>
      )}
      {turn !== null && (
        <div className={classes.board}>
          {movesWhite.length > 0 && (
            <ol>
              {movesWhite.map((move, index) => (
                <li key={index}>
                  <div className={classes[move[0][0]]}></div>
                  {move[0][1]}
                  {move[0][2]}
                </li>
              ))}
            </ol>
          )}

          {movesBlack.length > 0 && (
            <ul>
              {movesBlack.map((move, index) => (
                <li key={index}>
                  <div className={classes[move[0][0]]}></div>
                  {move[0][1]}
                  {move[0][2]}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default MovesBoard;
