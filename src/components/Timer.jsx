import classes from "./Timer.module.css";
import { turnActions, timerActions } from "../store";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

let newTime;

let miliseconds;
let seconds;
let minutes;
let date;

function Timer({ color }) {
  let dispatch = useDispatch();
  let minutesMiliseconds = useSelector((state) => state.timer.time.minutes);
  let secondsInput = useSelector((state) => state.timer.time.seconds);
  let increment = useSelector((state) => state.timer.time.increment);
  let isActive = useSelector((state) => state.timer[color]);

  const [timer, setTimer] = useState(minutesMiliseconds + secondsInput);
  let deadline;

  miliseconds = JSON.parse(JSON.stringify(timer));

  seconds = miliseconds / 1000;
  minutes = seconds / 60;
  if (increment) {
    increment = increment * 1000;
  }

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

  // if (isActive == false && deadline !== undefined) {
  //   console.log("we are here");
  //   clearInterval(deadline);
  //   if (increment) {
  //     console.log("we are here");
  //     newTime = timer + increment;
  //     setTimer(newTime);
  //   }
  // }

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
