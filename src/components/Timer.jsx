import classes from "./Timer.module.css";
import { turnActions, timerActions } from "../store";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

let newTime;

let miliseconds;
let seconds;
let minutes;
let date;

function Timer({ isActive }) {
  let dispatch = useDispatch();
  let timeLimit = useSelector((state) => state.timer.time);
  const [timer, setTimer] = useState(timeLimit);
  let deadline;

  miliseconds = JSON.parse(JSON.stringify(timer));

  seconds = miliseconds / 1000;
  minutes = seconds / 60;

  date = new Date();
  date.setSeconds(seconds);
  date.setMinutes(minutes);

  seconds = date.getSeconds();
  minutes = date.getMinutes();

  function getTime() {
    newTime = timer - 1000;
    clearInterval(deadline);
    setTimer(newTime);
  }

  if (isActive) {
    deadline = setInterval(getTime, 1000);
  }

  if (!isActive) {
    clearInterval(deadline);
  }

  if (timer == 0) {
    console.log("game ended");
    //solve this problem later
    dispatch(turnActions.changeTurn(null));
    dispatch(timerActions.setRunningTimer(null));
  }

  if (seconds == 0) {
    seconds = seconds + "0";
  }

  if (seconds > 0 && seconds < 10) {
    seconds = "0" + seconds;
  }

  return (
    <div className={classes.timer}>
      {timer == -1 ? <p>0:00</p> : <p>{`${minutes}:${seconds}`}</p>}
    </div>
  );
}

export default Timer;
