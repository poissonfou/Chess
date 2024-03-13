import classes from "./PiecesTaken.module.css";

export default function PiecesTaken({ piecesTaken, color }) {
  let identifier = color == "white" ? "w" : "b";
  console.log(piecesTaken);
  return (
    <div className={classes["pieces-taken"]}>
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
    </div>
  );
}
