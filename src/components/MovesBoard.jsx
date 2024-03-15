import classes from "./MovesBoard.module.css";
import { resetPiecesTaken } from "../helper/helper";
import arrow from "../assets/arrow-right-short.svg";

import { useSelector, useDispatch } from "react-redux";
import {
  turnActions,
  timerActions,
  hasEndedActions,
  movesActions,
} from "../store";
import { useState, useRef } from "react";

function MovesBoard({
  initialBoard,
  board,
  setBoard,
  piecesTaken,
  fullLogMoves,
  moveBackward,
  moveFoward,
  setMoveFoward,
  setMoveBackward,
}) {
  let moves = useSelector((state) => state.moves.moves);
  let turn = useSelector((state) => state.turn.turn);
  let hasEnded = useSelector((state) => state.hasEnded.hasEnded);
  let showPopup = useSelector((state) => state.hasEnded.showPopup);

  const [selectedTime, setSelectedTime] = useState("10:00");
  const [validInput, setvalidInput] = useState(true);
  const [AbandonPopup, setAbandonPopup] = useState(false);
  const [DrawPopup, setDrawPopup] = useState(false);

  let minutesRef = useRef(0);
  let secondsRef = useRef(0);
  let incrementRef = useRef(0);

  let dispatch = useDispatch();
  let movesBlack = [];
  let movesWhite = [];
  let extraMargin = "";
  let lastMove = [];
  let propMoveBackward = moveBackward;
  let propMoveFoward = moveFoward;

  function retractMoves(direction, currentSelectedMove) {
    if (direction == "backwards") {
      if (currentSelectedMove.idx == -1) return;

      console.log("we are here");

      const move = fullLogMoves[currentSelectedMove.idx];
      let newBoard = JSON.parse(JSON.stringify(board));
      let key = currentSelectedMove.move[0][0];

      newBoard[move[key].rowFrom][move[key].idxFrom] = key;
      console.log(newBoard);
      if (move[key].enPassant) {
        newBoard[move[key].rowTo][move[key].idxTo] = 0;
        newBoard[move[key].rowFrom][move[key].idxTo] = move[key].pieceTaken;
      } else {
        newBoard[move[key].rowTo][move[key].idxTo] = move[key].pieceTaken;
      }

      setMoveBackward({
        move: moves[currentSelectedMove.idx - 1],
        idx: currentSelectedMove.idx - 1,
      });

      setMoveFoward({
        move: moves[currentSelectedMove.idx],
        idx: currentSelectedMove.idx,
      });

      setBoard([...newBoard]);
    } else {
      if (currentSelectedMove.idx > moves.length - 1) return;

      console.log(currentSelectedMove, currentMove);

      console.log("we are here");

      const move = fullLogMoves[currentSelectedMove.idx];
      let newBoard = JSON.parse(JSON.stringify(board));
      let key = currentSelectedMove.move[0][0];

      newBoard[move[key].rowTo][move[key].idxTo] = key;

      if (move[key].enPassant) {
        newBoard[move[key].rowFrom][move[key].idxFrom] = 0;
        newBoard[move[key].rowFrom][move[key].idxTo] = 0;
      } else {
        newBoard[move[key].rowFrom][move[key].idxFrom] = 0;
      }

      setMoveBackward({
        move: moves[currentSelectedMove.idx - 1],
        idx: currentSelectedMove.idx - 1,
      });

      setMoveFoward({
        move: moves[currentSelectedMove.idx + 1],
        idx: currentSelectedMove.idx + 1,
      });

      setBoard([...newBoard]);
    }
  }

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

  function showAbandonPopup() {
    let prevValue = AbandonPopup;
    prevValue = !prevValue;
    setAbandonPopup(prevValue);
  }

  function showDrawnPopup() {
    let preValue = DrawPopup;
    preValue = !preValue;
    setDrawPopup(preValue);
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
    setBoard([...initialBoard]);
    resetPiecesTaken(piecesTaken);
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

  function drawGame() {
    showDrawnPopup();
    dispatch(turnActions.changeTurn("draw"));
    dispatch(hasEndedActions.setHasEnded());
    dispatch(hasEndedActions.setShowPopup());
    dispatch(timerActions.setRunningTimer(null));
  }

  function abandonGame(color) {
    showAbandonPopup();
    dispatch(turnActions.changeTurn(color));
    dispatch(hasEndedActions.setHasEnded());
    dispatch(hasEndedActions.setShowPopup());
    dispatch(timerActions.setRunningTimer(null));
  }

  if (moves.length !== 0) {
    movesWhite = moves.filter((move, index) => {
      let key = move[0];
      let isValid = key[0].includes("w");

      if (isValid && index == moves.length - 1) {
        lastMove = { move, index };
      }

      return isValid;
    });

    movesBlack = moves.filter((move, index) => {
      let key = move[0];
      let isValid = key[0].includes("b") && !key[0].includes("w");

      if (isValid && index == moves.length - 1) {
        lastMove = { move, index: index + 2 };
      }

      return isValid;
    });
  }

  if (movesBlack.length === 0) {
    extraMargin = classes["extra-margin"];
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
          <div className={classes["moves-log"]}>
            <h1>Moves</h1>
            <div
              className={
                movesWhite.length > 7
                  ? `${classes["entrys"]} ${classes.overflow} ${extraMargin}`
                  : `${classes["entrys"]} ${extraMargin}`
              }
            >
              {movesWhite.length > 0 && (
                <div>
                  <ol className={classes["entry-white"]}>
                    {movesWhite.map((move, index) => {
                      let highlightLastMove =
                        JSON.stringify(move) == JSON.stringify(lastMove.move) &&
                        index == movesWhite.length - 1;

                      return (
                        <li key={index}>
                          <span>{index + 1 + " - "}</span>
                          <div
                            className={
                              highlightLastMove
                                ? `${classes["highlight-last-move"]}`
                                : ``
                            }
                          >
                            <div
                              className={`${classes[move[0][0]]} ${
                                classes["piece"]
                              } ${classes["adjust-white-size"]}`}
                            ></div>

                            {move[0][1]}
                            {move[0][2]}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}

              {movesBlack.length > 0 && (
                <div>
                  <ul className={classes["entry-black"]}>
                    {movesBlack.map((move, index) => {
                      let highlightLastMove =
                        JSON.stringify(move) == JSON.stringify(lastMove.move) &&
                        index == movesBlack.length - 1;

                      return (
                        <li
                          key={index}
                          className={
                            highlightLastMove
                              ? `${classes["highlight-last-move"]}`
                              : ``
                          }
                        >
                          <div
                            className={
                              JSON.stringify(move) ==
                                JSON.stringify(lastMove.move) &&
                              index == lastMove.index
                                ? `${classes[move[0][0]]} ${classes["piece"]} ${
                                    classes["highlight-last-move"]
                                  }`
                                : `${classes[move[0][0]]} ${classes["piece"]} `
                            }
                          ></div>
                          {move[0][1]}
                          {move[0][2]}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            {!hasEnded ? (
              <div className={classes["actions"]}>
                <div
                  className={classes["abandon-button"]}
                  onClick={showAbandonPopup}
                >
                  {AbandonPopup && (
                    <div className={classes["abandon-popup"]}>
                      <div onClick={() => abandonGame("black")}>
                        <div className={classes.white}></div>
                        <p>White</p>
                      </div>
                      <div onClick={() => abandonGame("white")}>
                        <div className={classes.black}></div>
                        <p> Black</p>
                      </div>
                    </div>
                  )}
                  <i className="bi bi-flag-fill"></i>
                  <p>Abandon</p>
                </div>
                <div
                  className={classes["draw-button"]}
                  onClick={showDrawnPopup}
                >
                  {DrawPopup && (
                    <div className={classes["draw-popup"]}>
                      <p>Are you sure?</p>
                      <div>
                        <button onClick={drawGame}>Yes</button>
                        <button onClick={showDrawnPopup}>No</button>
                      </div>
                    </div>
                  )}
                  <p>Draw</p>
                </div>
                <div className={classes["move-buttons"]}>
                  <i
                    className="bi bi-chevron-compact-left"
                    onClick={() => retractMoves("backwards", moveBackward)}
                  ></i>
                  <i
                    className="bi bi-chevron-compact-right"
                    onClick={() => retractMoves("fowards", moveFoward)}
                  ></i>
                </div>
              </div>
            ) : (
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
