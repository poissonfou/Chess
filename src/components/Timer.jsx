import classes from "./Timer.module.css";
import { turnActions, timerActions, hasEndedActions } from "../store";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveGame } from "../helper/helper";

let newTime;

let miliseconds;
let seconds;
let minutes;
let date;
let addIncrement = false;
let currentTime;

function Timer({ color, fullLogMoves }) {
  let dispatch = useDispatch();
  let minutesMiliseconds = useSelector((state) => state.timer.time.minutes);
  let secondsInput = useSelector((state) => state.timer.time.seconds);
  let increment = useSelector((state) => state.timer.time.increment);
  let turn = useSelector((state) => state.turn.turn);
  let isActive = useSelector((state) => state.timer[color]);
  let moves = useSelector((state) => state.moves.moves);

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
    newTime = JSON.parse(JSON.stringify(timer)) - 500;
    currentTime = newTime;

    clearInterval(deadline);

    setTimer(newTime);
  }

  if (isActive) {
    deadline = setInterval(getTime, 500);
  } else {
    clearInterval(deadline);
    if (!addIncrement && timer == currentTime) addIncrement = true;
    if (addIncrement && increment !== 0) {
      setTimer(() => {
        addIncrement = false;
        return timer + increment;
      });
    }
  }

  useEffect(() => {
    if (timer == 0 && turn !== null) {
      console.log("game ended");

      dispatch(turnActions.changeTurn(color == "white" ? "black" : "white"));
      dispatch(hasEndedActions.setHasEnded());
      dispatch(hasEndedActions.setShowPopup());
      dispatch(timerActions.setRunningTimer(null));

      saveGame(
        dispatch,
        fullLogMoves,
        color == "white" ? "0-1" : "1-0",
        moves,
        0,
        {
          minutesMiliseconds,
          secondsInput,
          increment,
        }
      );
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
