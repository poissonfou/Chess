import classes from "./BoardRow.module.css";

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

function BoardRow({ dark, rowData, row, onClick }) {
  let isDark = dark;
  let piece;
  let color;
  return (
    <div className={classes.row}>
      {cases.map((_, index) => {
        isDark = !isDark;

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
          ></div>
        );
      })}
    </div>
  );
}

export default BoardRow;
