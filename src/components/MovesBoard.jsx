import classes from "./MovesBoard.module.css";
import arrow from "../assets/arrow-right-short.svg";

import { useSelector, useDispatch } from "react-redux";
import {
  turnActions,
  timerActions,
  hasEndedActions,
  movesActions,
} from "../store";
import { useState, useRef } from "react";

function MovesBoard({ board, setBoard }) {
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [validInput, setvalidInput] = useState(true);
  let minutesRef = useRef(0);
  let secondsRef = useRef(0);
  let incrementRef = useRef(0);

  let moves = useSelector((state) => state.moves.moves);
  let turn = useSelector((state) => state.turn.turn);
  let hasEnded = useSelector((state) => state.hasEnded.hasEnded);
  let showPopup = useSelector((state) => state.hasEnded.showPopup);
  let dispatch = useDispatch();
  let movesBlack = [];
  let movesWhite = [];

  function authInput(event) {
    let isNumber;
    if (event.target.name == "minutes") {
      let val = minutesRef.current.value;
      isNumber = val == "" ? true : /^[0-9]+$/.test(val);
    }

    if (event.target.name == "seconds") {
      let val = secondsRef.current.value;
      isNumber = val == "" ? true : /^[0-9]+$/.test(val);
    }

    if (event.target.name == "increment") {
      let val = incrementRef.current.value;
      isNumber = val == "" ? true : /^[0-9]+$/.test(val);
    }

    setvalidInput(isNumber);
  }

  function setGame(event) {
    event.preventDefault();

    dispatch(timerActions.setRunningTimer("white"));
    dispatch(timerActions.changeKeys());
    dispatch(turnActions.changeTurn("white"));
  }

  function setTimer(event) {
    let time;
    let minutes;
    let seconds;
    let increment;
    let timeSelected;
    if (event !== undefined) {
      time = event.target.id.split(".");
      minutes = +time[0];
      seconds = 0;
      increment = +time[1];
      timeSelected = event.target.innerHTML;
    } else {
      minutes = +minutesRef.current.value;
      seconds = +secondsRef.current.value !== "" ? secondsRef.current.value : 0;
      increment = +incrementRef.current.value;
      if (seconds < 10) seconds = "0" + +seconds;
      if (!seconds && increment) {
        timeSelected = minutes + "|" + increment;
      } else if (seconds && !increment) {
        timeSelected = minutes + ":" + seconds;
      } else {
        timeSelected = minutes + ":" + seconds + "|" + increment;
      }
    }

    if (minutes == 0 && seconds == 0) return;

    minutes = minutes * 60000;
    seconds = +secondsRef.current.value * 1000;

    dispatch(timerActions.setTime({ minutes, seconds, increment }));
    dispatch(timerActions.changeKeys());
    setSelectedTime(timeSelected);
  }

  function showTimeOptions() {
    console.log("we are here");
    dispatch(movesActions.empty());
    setBoard([...board]);
    dispatch(
      timerActions.setTime({
        minutes: 600000,
        seconds: 0,
        increment: 0,
      })
    );
    dispatch(timerActions.setRunningTimer(null));
    dispatch(timerActions.changeKeys());
    dispatch(hasEndedActions.setHasEnded());
    if (showPopup) {
      dispatch(hasEndedActions.setShowPopup());
    }
    dispatch(turnActions.changeTurn(null));
  }

  if (moves.length !== 0) {
    movesWhite = moves.filter((move) => {
      let key = move[0];
      return key[0].includes("w");
    });

    movesBlack = moves.filter((move) => {
      let key = move[0];
      return key[0].includes("b") && !key[0].includes("w");
    });
  }

  return (
    <div>
      {turn == null && (
        <div className={classes["start-game-div"]}>
          <form onSubmit={setGame}>
            <div>
              <button type="button" className={classes["selected-time"]}>
                {selectedTime}
              </button>
              <div className={classes["time-options"]}>
                <div>
                  <p>Bullet</p>
                  <div className={classes["time-options-item"]}>
                    <button id="1.0" onClick={setTimer} type="button">
                      1 min
                    </button>
                    <button id="1.1" onClick={setTimer} type="button">
                      1|1
                    </button>
                    <button id="1.2" onClick={setTimer} type="button">
                      1|2
                    </button>
                  </div>
                </div>
                <div>
                  <p>Blitz</p>
                  <div className={classes["time-options-item"]}>
                    <button id="3.0" onClick={setTimer} type="button">
                      3 min
                    </button>
                    <button id="3.2" onClick={setTimer} type="button">
                      3|2
                    </button>
                    <button id="5.0" onClick={setTimer} type="button">
                      5 min
                    </button>
                  </div>
                </div>
                <div>
                  <p>Rapid</p>
                  <div className={classes["time-options-item"]}>
                    <button id="10.0" onClick={setTimer} type="button">
                      10 min
                    </button>
                    <button id="15.10" onClick={setTimer} type="button">
                      15|10
                    </button>
                    <button id="30.0" onClick={setTimer} type="button">
                      30 min
                    </button>
                  </div>
                </div>
                <div>
                  <p>Custom</p>
                  {validInput == false && <p>Please enter only numbers</p>}
                  <div className={classes["custom-time-inputs"]}>
                    <input
                      name="minutes"
                      ref={minutesRef}
                      type="text"
                      onChange={authInput}
                      placeholder="minutes"
                    />
                    <input
                      name="seconds"
                      ref={secondsRef}
                      type="text"
                      onChange={authInput}
                      placeholder="seconds"
                    />
                    <input
                      name="increment"
                      ref={incrementRef}
                      onChange={authInput}
                      type="text"
                      placeholder="increment"
                    />
                    <button onClick={() => setTimer()} type="button">
                      <img src={arrow} alt="arrow icon" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button className={classes["play-button"]}>Play</button>
          </form>
        </div>
      )}
      {turn !== null && (
        <div>
          <div
            className={
              hasEnded
                ? `${classes["moves-log"]} ${classes["expanded-moves-log"]}`
                : `${classes["moves-log"]}`
            }
          >
            <h1>Moves</h1>
            <div
              className={
                movesWhite.length > 8
                  ? `${classes["entrys"]} ${classes.overflow}`
                  : `${classes["entrys"]}`
              }
            >
              {movesWhite.length > 0 && (
                <div>
                  <ol className={classes["entry-white"]}>
                    {movesWhite.map((move, index) => (
                      <li key={index}>
                        <span>{index + 1 + " - "}</span>
                        <div
                          className={`${classes[move[0][0]]} ${
                            classes["piece"]
                          } `}
                        ></div>

                        {move[0][1]}
                        {move[0][2]}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {movesBlack.length > 0 && (
                <div>
                  <ul className={classes["entry-black"]}>
                    {movesBlack.map((move, index) => (
                      <li key={index}>
                        <div
                          className={`${classes[move[0][0]]} ${
                            classes["piece"]
                          } `}
                        ></div>
                        {move[0][1]}
                        {move[0][2]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {hasEnded && (
              <button
                className={classes["play-button"]}
                onClick={showTimeOptions}
              >
                New Game
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovesBoard;
