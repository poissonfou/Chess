import Rook from "../Pieces/Rook";
import Knight from "../Pieces/Knight";
import Bishop from "../Pieces/Bishop";
import Queen from "../Pieces/Queen";

import classes from "./PromotionTooltip.module.css";

function PromotionTooltip({ color, promote }) {
  return (
    <div
      className={`${classes["tooltip__body"]} ${
        color == "b" ? classes["tooltip__body--bottom--board"] : ""
      }`}
    >
      <div className={classes["btn__container"]}>
        <button
          className={color + "q"}
          onClick={() => promote(new Queen(color, null, "q"))}
        ></button>
      </div>
      <div className={classes["btn__container"]}>
        <button
          className={color + "r"}
          onClick={() => promote(new Rook(color, null, "r"))}
        ></button>
      </div>
      <div className={classes["btn__container"]}>
        <button
          className={color + "n"}
          onClick={() => promote(new Knight(color, null, "n"))}
        ></button>
      </div>
      <div className={classes["btn__container"]}>
        <button
          className={color + "b"}
          onClick={() => promote(new Bishop(color, null, "b"))}
        ></button>
      </div>
    </div>
  );
}
export default PromotionTooltip;
