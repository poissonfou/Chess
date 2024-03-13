import classes from "./PiecesTaken.module.css";

export default function PiecesTaken({ piecesTaken, color }) {
  let identifier = color == "white" ? "w" : "b";

  let extraValue = 0;
  let oponentValue = 0;
  let oponentColor = color == "white" ? "black" : "white";
  let oponentIdentifier = color == "white" ? "b" : "w";

  piecesTaken[color].forEach((piece) => {
    if (piece.includes("p")) extraValue++;
    if (piece.includes("n") || piece.includes(`${identifier + "b"}`))
      extraValue += 3;
    if (piece.includes("h")) extraValue += 5;
    if (piece.includes("q")) extraValue += 9;
  });

  piecesTaken[oponentColor].forEach((piece) => {
    if (piece.includes("p")) oponentValue++;
    if (piece.includes("n") || piece.includes(`${oponentIdentifier + "b"}`))
      oponentValue += 3;
    if (piece.includes("h")) oponentValue += 5;
    if (piece.includes("q")) oponentValue += 9;
  });

  extraValue = extraValue - oponentValue;

  return (
    <div
      className={
        extraValue >= 1
          ? `${classes["pieces-taken"]} ${classes["pieces-taken-extra"]}`
          : `${classes["pieces-taken"]}`
      }
    >
      <div>
        {piecesTaken[color].map((piece, index) => {
          if (typeof piece == "string" && piece.includes("p")) {
            return <span className={classes[piece]} key={index}></span>;
          }
        })}
      </div>
      <div>
        {piecesTaken[color].map((piece, index) => {
          if (typeof piece == "string" && piece.includes("n")) {
            return <span className={classes[piece]} key={index}></span>;
          }
        })}
      </div>
      <div>
        {piecesTaken[color].map((piece, index) => {
          if (
            typeof piece == "string" &&
            piece.includes(`${identifier + "b"}`)
          ) {
            return <span className={classes[piece]} key={index}></span>;
          }
        })}
      </div>
      <div>
        {piecesTaken[color].map((piece, index) => {
          if (typeof piece == "string" && piece.includes("h")) {
            return <span className={classes[piece]} key={index}></span>;
          }
        })}
      </div>
      <div>
        {piecesTaken[color].map((piece, index) => {
          if (typeof piece == "string" && piece.includes("q")) {
            return <span className={classes[piece]} key={index}></span>;
          }
        })}
      </div>
      {extraValue >= 1 && <p>{"+" + extraValue}</p>}
    </div>
  );
}
