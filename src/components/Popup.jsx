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

  let seconds = miliseconds / 1000;
  let minutes = seconds / 60;
  let date = new Date();
  date.setSeconds(seconds);
  date.setMinutes(minutes);

  seconds = date.getSeconds();
  minutes = date.getMinutes();

  function restartGame() {
    dispatch(movesActions.empty());
    setBoard([...board]);
    dispatch(timerActions.setTime({ minutes, seconds, increment }));
    dispatch(timerActions.setRunningTimer("white"));
    dispatch(timerActions.changeKeys());
    dispatch(hasEndedActions.setHasEnded());
    dispatch(turnActions.changeTurn("white"));
  }

  function closePopup() {
    dispatch(hasEndedActions.setShowPopup());
  }

  let capitalLetter = turn[0].toUpperCase();
  let lowerCase = turn.slice(1);

  return (
    <div className={classes.popup}>
      <i className="bi bi-x-lg" onClick={closePopup}></i>
      <h1>{capitalLetter + lowerCase + " has won!"}</h1>
      <button onClick={restartGame}>{"New " + minutes + ":" + seconds} </button>
    </div>
  );
}
