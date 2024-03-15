import classes from "./Timer.module.css";
import { turnActions, timerActions, hasEndedActions } from "../store";

import { useEffect, useState } from "react";
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
  let turn = useSelector((state) => state.turn.turn);
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
    newTime = JSON.parse(JSON.stringify(timer)) - 1000;

    clearInterval(deadline);

    setTimer(newTime);
  }

  if (isActive) {
    deadline = setInterval(getTime, 1000);
  } else {
    clearInterval(deadline);
  }

  useEffect(() => {
    if (timer == 0 && turn !== null) {
      console.log("game ended");
      //solve this problem later

      dispatch(turnActions.changeTurn(color == "white" ? "black" : "white"));
      dispatch(hasEndedActions.setHasEnded());
      dispatch(hasEndedActions.setShowPopup());
      dispatch(timerActions.setRunningTimer(null));
    }
  }, [timer]);

  if (seconds == 0) {
    seconds = seconds + "0";
  }

  if (seconds > 0 && seconds < 10) {
    seconds = "0" + seconds;
  }

  return (
    <div
      className={
        isActive
          ? `${classes.timer} ${classes["timer-highlight"]}`
          : `${classes.timer}`
      }
    >
      {timer == -1 ? <p>0:00</p> : <p>{`${minutes}:${seconds}`}</p>}
    </div>
  );
}

export default Timer;
