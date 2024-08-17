import classes from "./PlayerInfo.module.css";

function PlayerInfo({ piecesTaken, color }) {
  return (
    <div>
      <div className={classes["pieces__taken"]}>
        {piecesTaken.map((piece, idx) => {
          const pieceClass = color + piece.piece;
          return (
            <div
              className={`${pieceClass} ${classes["piece"]}`}
              key={idx}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default PlayerInfo;
