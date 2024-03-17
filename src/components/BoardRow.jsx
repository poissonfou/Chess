import classes from "./BoardRow.module.css";
import { useSelector } from "react-redux";

const cases = [
  <div></div>,
  <div></div>,
  <div></div>,
  <div></div>,
  <div></div>,
  <div></div>,
  <div></div>,
  <div></div>,
];

function BoardRow({ dark, rowData, row, promotePiece, onClick }) {
  let isDark = dark;
  let piece;
  let color;
  let tooltip;
  let promotingState = useSelector((state) => state.promotingPiece);
  let showTooltip = false;

  if (row == 0 && promotingState.idxTo !== null) {
    tooltip = (
      <div className={classes.tooltip}>
        <button
          className={classes.wq}
          onClick={() => promotePiece("wq")}
        ></button>
        <button
          className={classes.wh}
          onClick={() => promotePiece("wh")}
        ></button>
        <button
          className={classes.wb}
          onClick={() => promotePiece("wb")}
        ></button>
        <button
          className={classes.wn}
          onClick={() => promotePiece("wn")}
        ></button>
      </div>
    );
  }
  if (row == 7 && promotingState.idxTo !== null) {
    tooltip = (
      <div className={classes.tooltip}>
        <button
          className={classes.bq}
          onClick={() => promotePiece("bq")}
        ></button>
        <button
          className={classes.bh}
          onClick={() => promotePiece("bh")}
        ></button>
        <button
          className={classes.bb}
          onClick={() => promotePiece("bb")}
        ></button>
        <button
          className={classes.bn}
          onClick={() => promotePiece("bn")}
        ></button>
      </div>
    );
  }

  return (
    <div className={classes.row}>
      {cases.map((_, index) => {
        isDark = !isDark;
        showTooltip =
          promotingState.idxTo === index && promotingState.rowTo === row;
        return (
          <div
            key={`${row}.${+index}`}
            id={`${row}.${+index}`}
            className={`${isDark ? classes.dark : classes.light} ${
              rowData[index] !== 0 ? classes[rowData[index]] : ""
            }`}
            onClick={(event) => {
              piece = rowData[index] !== 0 ? classes[rowData[index]] : "";
              if (piece !== "") {
                color = rowData[index].includes("w") ? "white" : "black";
              } else {
                color = "";
              }

              return onClick(piece, color, event);
            }}
          >
            {showTooltip == true && tooltip}
          </div>
        );
      })}
    </div>
  );
}

export default BoardRow;
