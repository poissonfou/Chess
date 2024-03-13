import classes from "./Popup.module.css";

import {
  movesActions,
  timerActions,
  hasEndedActions,
  turnActions,
} from "../store";
import { useSelector, useDispatch } from "react-redux";

export default function Popup({ board, setBoard }) {
  const dispatch = useDispatch();
  const turn = useSelector((state) => state.turn.turn);
  let minutesMiliseconds = useSelector((state) => state.timer.time.minutes);
  let secondsInput = useSelector((state) => state.timer.time.seconds);
  let increment = useSelector((state) => state.timer.time.increment);

  let miliseconds = minutesMiliseconds + secondsInput;

  let capitalLetter;
  let lowerCase;
  let seconds = miliseconds / 1000;
  let minutes = seconds / 60;
  let date = new Date();
  date.setSeconds(seconds);
  date.setMinutes(minutes);

  seconds = date.getSeconds();
  minutes = date.getMinutes();

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  function restartGame() {
    dispatch(movesActions.empty());
    setBoard([...board]);
    dispatch(
      timerActions.setTime({
        minutes: minutesMiliseconds,
        seconds: secondsInput,
        increment: increment,
      })
    );
    dispatch(timerActions.setRunningTimer("white"));
    dispatch(timerActions.changeKeys());
    dispatch(hasEndedActions.setHasEnded());
    dispatch(hasEndedActions.setShowPopup());
    dispatch(turnActions.changeTurn("white"));
  }

  function closePopup() {
    dispatch(hasEndedActions.setShowPopup());
  }

  if (turn !== null) {
    capitalLetter = turn[0].toUpperCase();
    lowerCase = turn.slice(1);
  }

  return (
    <div className={classes.popup}>
      <i className="bi bi-x-lg" onClick={closePopup}></i>
      {turn == "draw" && <h1 className={classes["draw-message"]}>Draw!</h1>}
      {(turn == "white" || turn == "black") && (
        <h1>{capitalLetter + lowerCase + " has won!"}</h1>
      )}
      <button onClick={restartGame}>{"New " + minutes + ":" + seconds} </button>
    </div>
  );
}
