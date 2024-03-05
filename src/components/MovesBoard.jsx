import classes from "./MovesBoard.module.css";

import { useSelector } from "react-redux";

function MovesBoard() {
  let moves = useSelector((state) => state.moves);
  let movesBlack = [];

  let movesWhite = moves.filter((move) => {
    let key = move[0];
    return key[0].includes("w");
  });

  movesBlack = moves.filter((move) => {
    let key = move[0];
    return key[0].includes("b") && !key[0].includes("w");
  });

  return (
    <div>
      <div className={classes.board}>
        {movesWhite.length > 0 && (
          <ol>
            {movesWhite.map((move, index) => (
              <li key={index}>
                <div className={classes[move[0][0]]}></div>
                {move[0][1]}
                {move[0][2]}
              </li>
            ))}
          </ol>
        )}

        {movesBlack.length > 0 && (
          <ul>
            {movesBlack.map((move, index) => (
              <li key={index}>
                <div className={classes[move[0][0]]}></div>
                {move[0][1]}
                {move[0][2]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MovesBoard;
