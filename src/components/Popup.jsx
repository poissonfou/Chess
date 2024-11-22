import classes from "./Popup.module.css";

import { useDispatch } from "react-redux";
import { movesActions, timerActions } from "../store/index";

function Popup({ message, closePopup }) {
  const dispatch = useDispatch();

  return (
    <div className={classes["popup__body"]}>
      <span
        className={`${"material-symbols-outlined"} ${classes["close__btn"]}`}
        onClick={() => closePopup(() => null)}
      >
        close
      </span>
      <div className={classes["msg__container"]}>
        {(message[0] == "W" || message[0] == "B") && (
          <div
            className={`${message[0].toLowerCase()}k ${classes["piece__icon"]}`}
          ></div>
        )}
        <div className={classes["message"]}>{message}</div>
      </div>
      <button
        onClick={() => {
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
    </div>
  );
}

export default Popup;
