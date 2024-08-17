import classes from "./Controls.module.css";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  movesActions,
  timerActions,
  turnActions,
  movesBtnsActions,
} from "../store/index";

function Controls({ movesIdx }) {
  const [tab, setTab] = useState(1);
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [activeGame, setActiveGame] = useState(false);
  const [showSurrenderTooltip, setShowSurrenderTootip] = useState(false);
  const [showDrawTooltip, setShowDrawTootip] = useState(false);

  const turn = useSelector((state) => state.turn.turn);
  const moves = JSON.parse(
    JSON.stringify(useSelector((state) => state.moves.moves))
  );
  const games = useSelector((state) => state.games.games);

  //adding a move with empty notation if array's length is not even
  //to add a full line to the UI
  if (moves.length % 2 != 0) {
    moves.push({
      piece: {
        color: "",
        type: "",
      },
      notation: "",
    });
  }

  const dispatch = useDispatch();

  const minutesRef = useRef(0);
  const secondsRef = useRef(0);
  const incrementRef = useRef(0);

  //chaging UI if the game is reset
  useEffect(() => {
    if (!turn && !moves.length) {
      setActiveGame(() => false);
    }
  }, [moves.length]);

  function setTime(event, timeString) {
    //getting the time values from the id
    const [minutes, increment] = event.target.id.split(".");

    dispatch(
      timerActions.setTime({
        minutes: +minutes,
        seconds: 0,
        increment: +increment,
      })
    );

    setSelectedTime(() => timeString);
  }

  function setCustomTime() {
    let minutes = minutesRef.current.value;
    let seconds = secondsRef.current.value;
    let increment = incrementRef.current.value;

    if (!minutes && !seconds) return;

    //building the UI string
    let timeString = `${minutes}`;

    if (secondsRef.current.value < 10) {
      timeString += `:0${seconds}`;
    } else {
      timeString += `:${seconds}`;
    }

    if (increment != 0 && seconds != 0) {
      timeString += `|${increment}`;
    }

    if (increment != 0 && seconds == 0) {
      timeString = `${minutes}|${increment}`;
    }

    dispatch(
      timerActions.setTime({
        minutes: +minutes,
        seconds: +seconds,
        increment: +increment,
      })
    );

    setSelectedTime(() => timeString);
  }

  function surrender(color) {
    dispatch(turnActions.setTurn(null));
    dispatch(
      movesActions.pushAMove({
        piece: {
          color: "",
          type: "",
        },
        notation: color == "white" ? "0-1" : "1-0",
      })
    );
    setShowSurrenderTootip((prev) => !prev);
  }

  function draw() {
    dispatch(turnActions.setTurn(null));
    dispatch(
      movesActions.pushAMove({
        piece: {
          color: "",
          type: "",
        },
        notation: "1/2",
      })
    );
    setShowDrawTootip((prev) => !prev);
  }

  function selectSavedGame(moves) {
    dispatch(movesActions.setState(moves));
    setActiveGame(() => true);
  }

  return (
    <div className={classes["grid__controls"]}>
      <div className={classes["controls__container"]}>
        {!activeGame && (
          <nav>
            <div
              onClick={() => setTab(1)}
              className={`${tab == 1 && classes["highlight__tab"]}`}
            >
              <i className="bi bi-plus-square-fill"></i>
              <p>New Game</p>
            </div>
            <div
              onClick={() => setTab(2)}
              className={`${tab == 2 && classes["highlight__tab"]}`}
            >
              <i className="bi bi-border-all"></i>
              <p>Games</p>
            </div>
          </nav>
        )}
        <div
          className={`${classes["controls__body"]} ${
            !activeGame ? classes["correct__ui__active__game"] : ""
          }`}
        >
          {!activeGame && (
            <>
              {tab == 1 && (
                <>
                  <div className={classes["selected__time"]}>
                    {selectedTime}
                  </div>
                  <div className={classes["time__options__container"]}>
                    <div className={classes["time__options"]}>
                      <p>Bullet</p>
                      <button id="1.0" onClick={(e) => setTime(e, "1:00")}>
                        1 min
                      </button>
                      <button id="1.1" onClick={(e) => setTime(e, "1|1")}>
                        1|1
                      </button>
                      <button id="1.2" onClick={(e) => setTime(e, "1|2")}>
                        1|2
                      </button>
                    </div>
                    <div className={classes["time__options"]}>
                      <p>Blitz</p>
                      <button id="3.0" onClick={(e) => setTime(e, "3:00")}>
                        3 min
                      </button>
                      <button id="3.2" onClick={(e) => setTime(e, "3|2")}>
                        3|2
                      </button>
                      <button id="5.0" onClick={(e) => setTime(e, "5:00")}>
                        5 min
                      </button>
                    </div>
                    <div className={classes["time__options"]}>
                      <p>Rapid</p>
                      <button id="10.0" onClick={(e) => setTime(e, "10:00")}>
                        10 min
                      </button>
                      <button id="15.10" onClick={(e) => setTime(e, "15|10")}>
                        15|10
                      </button>
                      <button id="30.0" onClick={(e) => setTime(e, "30:00")}>
                        30 min
                      </button>
                    </div>
                    <div
                      className={`${classes["time__options"]} ${classes["time__options--custom"]}`}
                    >
                      <p>Custom</p>
                      <input
                        ref={minutesRef}
                        onChange={() => setCustomTime()}
                        type="text"
                        placeholder="minutes"
                        name="minutes"
                      />
                      <input
                        ref={secondsRef}
                        onChange={() => setCustomTime()}
                        type="text"
                        placeholder="seconds"
                        name="seconds"
                      />
                      <input
                        ref={incrementRef}
                        onChange={() => setCustomTime()}
                        type="text"
                        placeholder="increment"
                        name="increment"
                      />
                    </div>
                  </div>
                  <div className={classes["play__btn__container"]}>
                    <button
                      className={classes["play__btn"]}
                      onClick={() => {
                        setActiveGame(() => true);
                        dispatch(turnActions.setTurn("w"));
                      }}
                    >
                      Play
                    </button>
                  </div>
                </>
              )}

              {tab == 2 && (
                <>
                  {!games.length ? (
                    <div className={classes["no__games__msg"]}>
                      <i className="bi bi-border-all"></i>
                      <p>No saved games.</p>
                    </div>
                  ) : (
                    <div className={classes["games__log__container"]}>
                      {games.map((game, idx) => {
                        let classColor;

                        if (game.result == "1-0") {
                          classColor = "wk";
                        } else if (game.result == "0-1") {
                          classColor = "bk";
                        } else {
                          classColor = "draw";
                        }

                        return (
                          <div
                            className={classes["game__log"]}
                            key={idx}
                            onClick={() => selectSavedGame(game.moves)}
                          >
                            <div
                              className={`${classes["result__box"]} ${classColor}`}
                            ></div>
                            <div className={classes["move__count_display"]}>
                              <div
                                className={`${"wn"} ${
                                  classes["piece___icon__log"]
                                }`}
                              ></div>
                              <span>{game.moves.length}</span>
                            </div>
                            <span>{game.date}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          )}
          {activeGame && (
            <>
              <div className={classes["moves__display"]}>
                <div className={classes["white__moves"]}>
                  {moves.map((move, idx) => {
                    if (idx % 2 != 0) return;
                    let lineNumber = 0;
                    let highlight = movesIdx == idx;

                    if (!highlight && movesIdx == null) {
                      if (!moves[moves.length - 1].piece.color.length) {
                        highlight =
                          idx == moves.length - 2 && moves[idx].piece.color;
                      }
                    }

                    for (let i = 0; i < moves.length; i++) {
                      if (i > idx) break;
                      if (i % 2 == 0) lineNumber++;
                    }

                    return (
                      <div
                        className={classes["move__notation__container"]}
                        key={idx}
                      >
                        <span>{lineNumber}-</span>
                        <div
                          className={`${classes["move__notation"]} ${
                            highlight && classes["highlight__move"]
                          }`}
                        >
                          <div
                            className={`${move.piece.color}${move.piece.type}`}
                          ></div>
                          {move.notation}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={classes["black__moves"]}>
                  {moves.map((move, idx) => {
                    if (idx % 2 == 0) return;
                    let highlight = movesIdx == idx;

                    if (!highlight && movesIdx == null) {
                      if (moves[moves.length - 1].piece.color.length) {
                        highlight = idx == moves.length - 1;
                      }

                      if (
                        !moves[moves.length - 1].notation &&
                        !moves[moves.length - 2].piece.color.length
                      )
                        highlight = idx == moves.length - 3;
                    }

                    return (
                      <div
                        className={classes["move__notation__container"]}
                        key={idx}
                      >
                        <div
                          className={`${classes["move__notation"]} ${
                            highlight && classes["highlight__move"]
                          }`}
                        >
                          <div
                            className={`${move.piece.color}${move.piece.type}`}
                          ></div>
                          {move.notation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {!turn && (
                <button
                  className={`${classes["play__btn"]} ${classes["play__btn--new--game"]}`}
                  onClick={() => {
                    setActiveGame(() => false);
                    dispatch(movesActions.resetState());
                    dispatch(
                      timerActions.setTime({
                        minutes: 10,
                        increment: 0,
                        seconds: 0,
                      })
                    );
                  }}
                >
                  New Game
                </button>
              )}
              <div className={classes["game__controls"]}>
                {turn && (
                  <>
                    {showSurrenderTooltip && (
                      <div className={classes["surrender__tooltip"]}>
                        <div onClick={() => surrender("white")}></div>
                        <div onClick={() => surrender("black")}></div>
                      </div>
                    )}
                    {showDrawTooltip && (
                      <div className={classes["draw__tooltip"]}>
                        <p>Are you sure?</p>
                        <div className={classes["draw__tooltip__btns"]}>
                          <div onClick={draw}>Yes</div>
                          <div
                            onClick={() => setShowDrawTootip((prev) => !prev)}
                          >
                            No
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={classes["player__actions__controls"]}>
                      <span
                        className="material-symbols-outlined"
                        onClick={() => setShowSurrenderTootip((prev) => !prev)}
                        title="surrender"
                      >
                        flag
                      </span>
                      <span
                        title="draw"
                        onClick={() => setShowDrawTootip((prev) => !prev)}
                      >
                        1/2
                      </span>
                    </div>
                  </>
                )}
                {!turn && (
                  <div className={classes["movements__controls"]}>
                    <span
                      className="material-symbols-outlined"
                      onClick={() =>
                        dispatch(movesBtnsActions.setAction("begin"))
                      }
                    >
                      first_page
                    </span>
                    <span
                      className="material-symbols-outlined"
                      onClick={() =>
                        dispatch(movesBtnsActions.setAction("back"))
                      }
                    >
                      chevron_left
                    </span>
                    <span
                      className="material-symbols-outlined"
                      onClick={() =>
                        dispatch(movesBtnsActions.setAction("forth"))
                      }
                    >
                      chevron_right
                    </span>
                    <span
                      className="material-symbols-outlined"
                      onClick={() =>
                        dispatch(movesBtnsActions.setAction("end"))
                      }
                    >
                      last_page
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Controls;
