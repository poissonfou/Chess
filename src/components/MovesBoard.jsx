import classes from "./MovesBoard.module.css";
import { resetPiecesTaken, saveGame } from "../helper/helper";
import arrow from "../assets/arrow-right-short.svg";

import { useSelector, useDispatch } from "react-redux";
import {
  turnActions,
  timerActions,
  hasEndedActions,
  movesActions,
} from "../store";
import { useState, useRef, useEffect } from "react";

let moveBackward, moveFoward;
let gameReplay = false;
let currentMove;

function MovesBoard({
  initialBoard,
  board,
  setBoard,
  piecesTaken,
  fullLogMoves,
  setHighlightCase,
}) {
  let moves = useSelector((state) => state.moves.moves);
  let turn = useSelector((state) => state.turn.turn);
  let hasEnded = useSelector((state) => state.hasEnded.hasEnded);
  let showPopup = useSelector((state) => state.hasEnded.showPopup);
  let games = useSelector((state) => state.games.games);

  const [selectedTime, setSelectedTime] = useState("10:00");
  const [validInput, setvalidInput] = useState(true);
  const [AbandonPopup, setAbandonPopup] = useState(false);
  const [DrawPopup, setDrawPopup] = useState(false);
  const [showPlay, setShowPlay] = useState(true);

  let minutesRef = useRef(0);
  let secondsRef = useRef(0);
  let incrementRef = useRef(0);

  let dispatch = useDispatch();
  let counter = 1;

  useEffect(() => {
    currentMove = undefined;

    moveBackward = {
      move: moves[moves.length - 1],
      idx: moves.length - 1,
    };

    if (moves.length == 1) {
      moveFoward = {
        move: moves[moves.length - 1],
        idx: moves.length - 1,
      };
    } else {
      moveFoward = {
        move: moves[moveBackward.idx - 1],
        idx: moveBackward.idx - 1,
      };
    }
  }, [moves]);

  function toggleTabs(val) {
    setShowPlay(val);
  }

  function retrieveGame(index) {
    let game = games[index];

    dispatch(movesActions.pushAllMoves(game.moves));
    fullLogMoves.push(...game.fullLogMoves);
    setShowPlay(false);
    dispatch(turnActions.changeTurn(""));
    dispatch(hasEndedActions.setHasEnded());
    gameReplay = true;
    currentMove = 0;
  }

  function returnToLatest() {
    if (moves.length == 0) return;

    moveBackward = {
      move: moves[moves.length - 1],
      idx: moves.length - 1,
    };

    moveFoward = {
      move: moves[moves.length - 1],
      idx: moves.length - 1,
    };

    const move = fullLogMoves[moveBackward.idx];
    let key = moveBackward.move[0][0];

    if (Object.keys(move)[0] !== key) {
      key = Object.keys(move)[0];
    }

    setBoard((prevBoard) => {
      return { board: prevBoard.finalBoard, finalBoard: prevBoard.finalBoard };
    });
    setHighlightCase({
      from: `${move[key].rowFrom}.${move[key].idxFrom}`,
      to: `${move[key].rowTo}.${move[key].idxTo}`,
    });

    gameReplay = false;
    currentMove = moves.length - 1;
  }

  function resetBoard() {
    if (moves.length == 0) return;

    moveBackward = {
      move: moves[0],
      idx: 0,
    };

    moveFoward = {
      move: moves[0],
      idx: 0,
    };

    setBoard((prevBoard) => {
      return { board: initialBoard, finalBoard: prevBoard.finalBoard };
    });
    setHighlightCase({ from: null, to: null });
    gameReplay = true;
    currentMove = -1;
  }

  function retractMoves(direction) {
    if (direction == "backwards") {
      if (moves.length == 0) return;

      if (moveBackward !== undefined && moveBackward.idx == -1) return;

      if (moveBackward == undefined) {
        moveBackward = {
          move: moves[moves.length - 1],
          idx: moves.length - 1,
        };
      }

      if (gameReplay) {
        moveBackward = {
          move: moves[0],
          idx: 0,
        };
      }

      currentMove = moveBackward.idx;

      const move = fullLogMoves[moveBackward.idx];
      let newBoard = JSON.parse(JSON.stringify(board));
      let key = moveBackward.move[0][0];

      if (Object.keys(move)[0] !== key) {
        key = Object.keys(move)[0];
      }

      newBoard[move[key].rowFrom][move[key].idxFrom] = key;

      if (move[key].enPassant) {
        newBoard[move[key].rowTo][move[key].idxTo] = 0;
        newBoard[move[key].rowFrom][move[key].idxTo] = move[key].pieceTaken;
      } else if (move[key].castling.castling) {
        newBoard[move[key].rowTo][move[key].idxTo] = 0;
        newBoard[move[key].rowFrom][move[key].idxFrom] = key;
        if (move[key].castling.side == "queenSide") {
          newBoard[move[key].rowTo][move[key].idxTo - 2] =
            move[key].castling.piece;
          newBoard[move[key].rowTo][move[key].idxTo + 1] = 0;
        } else {
          newBoard[move[key].rowTo][move[key].idxTo + 1] =
            move[key].castling.piece;
          newBoard[move[key].rowTo][move[key].idxTo - 1] = 0;
        }
      } else if (move[key].promoting.promoting) {
        newBoard[move[key].rowTo][move[key].idxTo] = move[key].pieceTaken;
        newBoard[move[key].rowFrom][move[key].idxFrom] = key;
      } else {
        newBoard[move[key].rowTo][move[key].idxTo] = move[key].pieceTaken;
      }

      setBoard((prevBoard) => {
        return { board: [...newBoard], finalBoard: prevBoard.finalBoard };
      });

      setHighlightCase({
        from: `${move[key].rowFrom}.${move[key].idxFrom}`,
        to: `${move[key].rowTo}.${move[key].idxTo}`,
      });

      if (moveBackward.idx == 0) {
        moveFoward = {
          move: moves[moveBackward.idx],
          idx: moveBackward.idx,
        };

        moveBackward = {
          move: moves[moveBackward.idx],
          idx: moveBackward.idx,
        };
      } else {
        moveFoward = {
          ...moveBackward,
        };

        moveBackward = {
          move: moves[moveBackward.idx - 1],
          idx: moveBackward.idx - 1,
        };
      }
      gameReplay = false;
    } else {
      if (moveFoward == undefined) return;

      if (moveFoward.idx >= moves.length) return;

      if (gameReplay) {
        moveFoward = {
          move: moves[0],
          idx: 0,
        };
      }

      currentMove = moveFoward.idx;

      const move = fullLogMoves[moveFoward.idx];
      let newBoard = JSON.parse(JSON.stringify(board));
      let key = moveFoward.move[0][0];

      if (Object.keys(move)[0] !== key) {
        key = Object.keys(move)[0];
      }

      newBoard[move[key].rowTo][move[key].idxTo] = key;

      if (move[key].enPassant) {
        newBoard[move[key].rowFrom][move[key].idxFrom] = 0;
        newBoard[move[key].rowFrom][move[key].idxTo] = move[key].pieceTaken;
      } else if (move[key].castling.castling) {
        newBoard[move[key].rowTo][move[key].idxTo] = key;
        newBoard[move[key].rowFrom][move[key].idxFrom] = 0;
        if (move[key].castling.side == "queenSide") {
          newBoard[move[key].rowTo][move[key].idxTo - 2] = 0;
          newBoard[move[key].rowTo][move[key].idxTo + 1] =
            move[key].castling.piece;
        } else {
          newBoard[move[key].rowTo][move[key].idxTo + 1] = 0;
          newBoard[move[key].rowTo][move[key].idxTo - 1] =
            move[key].castling.piece;
        }
      } else if (move[key].promoting.promoting) {
        newBoard[move[key].rowTo][move[key].idxTo] = move[key].promoting.piece;
        newBoard[move[key].rowFrom][move[key].idxFrom] = 0;
      } else {
        newBoard[move[key].rowFrom][move[key].idxFrom] = move[key].pieceTaken;
      }

      moveBackward = {
        move: moves[moveFoward.idx],
        idx: moveFoward.idx,
      };

      moveFoward = {
        move: moves[moveFoward.idx + 1],
        idx: moveFoward.idx + 1,
      };

      setBoard((prevBoard) => {
        return { board: [...newBoard], finalBoard: prevBoard.finalBoard };
      });

      setHighlightCase({
        from: `${move[key].rowFrom}.${move[key].idxFrom}`,
        to: `${move[key].rowTo}.${move[key].idxTo}`,
      });
      gameReplay = false;
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
    dispatch(movesActions.empty());
    setBoard((prevBoard) => {
      return { board: [...initialBoard], finalBoard: prevBoard.finalBoard };
    });
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
    setHighlightCase({ from: null, to: null });
  }

  function drawGame() {
    showDrawnPopup();
    dispatch(turnActions.changeTurn("draw"));
    dispatch(hasEndedActions.setHasEnded());
    dispatch(hasEndedActions.setShowPopup());
    dispatch(timerActions.setRunningTimer(null));
    saveGame(dispatch, fullLogMoves, "1/2", moves, selectedTime);
  }

  function abandonGame(color) {
    showAbandonPopup();
    dispatch(turnActions.changeTurn(color));
    dispatch(hasEndedActions.setHasEnded());
    dispatch(hasEndedActions.setShowPopup());
    dispatch(timerActions.setRunningTimer(null));

    saveGame(
      dispatch,
      fullLogMoves,
      color == "white" ? "1-0" : "0-1",
      moves,
      selectedTime
    );
  }

  return (
    <div>
      {turn == null && (
        <div className={classes["start-game-div"]}>
          <div className={classes.tabs}>
            <div
              className={
                showPlay
                  ? `${classes.play} ${classes.underline}`
                  : `${classes.play}`
              }
            >
              <h3 onClick={() => toggleTabs(true)}>Play</h3>
            </div>
            <div className={!showPlay ? ` ${classes.underline}` : ``}>
              <h3 onClick={() => toggleTabs(false)}>Games</h3>
            </div>
          </div>
          {showPlay && (
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
          )}
          {!showPlay && (
            <div
              className={
                games.length > 5
                  ? `${classes["games-log"]} ${classes.overflow}`
                  : `${classes["games-log"]}`
              }
            >
              {games.length == 0 ? (
                <h2>No Games.</h2>
              ) : (
                games.map((game, index) => (
                  <div
                    className={classes.game}
                    key={index}
                    onClick={() => retrieveGame(index)}
                  >
                    <h1>{game.result}</h1>
                    <div>
                      <p>{"Date: " + game.date}</p>
                      <p>{"Time: " + game.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
      {turn !== null && (
        <div>
          <div className={classes["moves-log"]}>
            <h1>Moves</h1>
            <div
              className={
                moves.length > 14
                  ? `${classes["entrys"]} ${classes.overflow}`
                  : `${classes["entrys"]}`
              }
            >
              {moves.length > 0 && (
                <div>
                  <div>
                    <ol className={classes["entry-white"]}>
                      {moves.map((move, index) => {
                        let adjustMargin = "";
                        if (moves.length == 1) {
                          adjustMargin = classes["adjust-margin"];
                        }

                        if (move[0][0][0] == "w") {
                          let highlight;
                          let number;
                          if (currentMove == undefined) {
                            highlight = index == moves.length - 1;
                            currentMove = undefined;
                          } else {
                            highlight = index == currentMove;
                          }

                          if (index == 0) {
                            number = <span>{index + 1 + " - "}</span>;
                          } else if (index == 2) {
                            number = <span>{index + " - "}</span>;
                          } else {
                            number = <span>{index - counter + " - "}</span>;
                            counter++;
                          }

                          return (
                            <li key={index}>
                              {number}
                              <div
                                className={
                                  highlight
                                    ? `${classes["highlight"]} ${adjustMargin}`
                                    : `${adjustMargin}`
                                }
                              >
                                <div
                                  className={`${classes[move[0][0]]} ${
                                    classes["piece"]
                                  } `}
                                ></div>

                                {move[0][1]}
                                {move[0][2]}
                              </div>
                            </li>
                          );
                        }
                      })}
                    </ol>
                  </div>
                  <div>
                    <ul className={classes["entry-black"]}>
                      {moves.map((move, index) => {
                        if (move[0][0][0] == "b") {
                          let highlight;
                          if (currentMove == undefined) {
                            highlight = index == moves.length - 1;
                            currentMove = undefined;
                          } else {
                            highlight = index == currentMove;
                          }
                          return (
                            <li
                              key={index}
                              className={
                                highlight ? `${classes["highlight"]}` : ``
                              }
                            >
                              <div
                                className={`${classes[move[0][0]]} ${
                                  classes["piece"]
                                } `}
                              ></div>
                              {move[0][1]}
                              {move[0][2]}
                            </li>
                          );
                        }
                      })}
                    </ul>
                  </div>
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
                  <span onClick={resetBoard} title="go to beginning">
                    {"<<"}
                  </span>
                  <span
                    onClick={() => retractMoves("backwards")}
                    className={classes.backwards}
                    title="backwards"
                  >
                    {"<"}
                  </span>
                  <span
                    onClick={() => retractMoves("forwards")}
                    className={classes.forwards}
                    title="forwards"
                  >
                    {">"}
                  </span>
                  <span onClick={returnToLatest} title="go to last move">
                    {">>"}
                  </span>
                </div>
              </div>
            ) : (
              <div className={classes["endgame-actions"]}>
                <button
                  className={classes["play-button"]}
                  onClick={showTimeOptions}
                >
                  New Game
                </button>
                <div className={classes["move-buttons"]}>
                  <span onClick={resetBoard} title="go to beginning">
                    {"<<"}
                  </span>
                  <span
                    onClick={() => retractMoves("backwards")}
                    className={classes.backwards}
                    title="backwards"
                  >
                    {"<"}
                  </span>
                  <span
                    onClick={() => retractMoves("forwards")}
                    className={classes.forwards}
                    title="forwards"
                  >
                    {">"}
                  </span>
                  <span onClick={returnToLatest} title="go to last move">
                    {">>"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovesBoard;
