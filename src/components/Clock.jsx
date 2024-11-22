import classes from "./Clock.module.css";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { turnActions, movesActions } from "../store/index";

function Clock({ color }) {
  const [timeLeft, setTimeLeft] = useState("10:00");
  const [date] = useState(new Date());
  const [intervalState] = useState({ interval: null });

  const TIME_SELECTED = useSelector((state) => state.timer);
  const turn = useSelector((state) => state.turn.turn);
  const moves = useSelector((state) => state.moves.moves);

  const dispatch = useDispatch();

  //if time selected changes, set values to the date obj and change the text
  //in the clock
  //this also resets the clock after the moves array was cleared
  useEffect(() => {
    if (!moves.length && !turn) {
      date.setMinutes(TIME_SELECTED.minutes);
      date.setSeconds(TIME_SELECTED.seconds);

      let timeString = `${TIME_SELECTED.minutes}`;

      if (TIME_SELECTED.seconds < 10) {
        timeString += `:0${TIME_SELECTED.seconds}`;
      } else {
        timeString += `:${TIME_SELECTED.seconds}`;
      }

      setTimeLeft(() => timeString);
    }
  }, [TIME_SELECTED, moves]);

  //if turn is null, clear the interval
  //if turn different then the clocks color, clear interval, add an increment if it exists
  //if turn == color, set the interval to subtract 1 second from the date obj every second
  useEffect(() => {
    if (turn == null) {
      clearInterval(intervalState.interval);
      return;
    }

    if (turn != color) {
      clearInterval(intervalState.interval);
      if (
        TIME_SELECTED.increment &&
        (date.getMinutes() != TIME_SELECTED.minutes ||
          date.getSeconds() != TIME_SELECTED.seconds)
      ) {
        const currentSeconds = date.getSeconds();
        const increment = TIME_SELECTED.increment;

        date.setSeconds(currentSeconds + increment);

        const seconds = date.getSeconds();
        const minutes = date.getMinutes();

        setTimeLeft(
          () => `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
        );
      }
      return;
    }

    intervalState.interval = setInterval(() => {
      const currentSeconds = date.getSeconds();

      date.setSeconds(currentSeconds - 1);

      const seconds = date.getSeconds();
      const minutes = date.getMinutes();

      setTimeLeft(() => `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
    }, 1000);
  }, [turn]);

  //if the time is 0:00 end the game
  useEffect(() => {
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    if (!minutes && !seconds) {
      dispatch(turnActions.setTurn(null));
      dispatch(
        movesActions.pushAMove({
          isCheckmate: false,
          isDraw: false,
          piece: {
            color: "",
            type: "",
          },
          notation: color == "b" ? "1-0" : "0-1",
        })
      );
    }
  }, [date.getSeconds()]);

  return <div className={classes["clock__body"]}>{timeLeft}</div>;
}

export default Clock;
