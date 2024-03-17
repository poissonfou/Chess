import { useSelector, useDispatch } from "react-redux";

export const useGameInfo = () => {
  let dispatch = useDispatch();

  let moves = useSelector((state) => state.moves.moves);
  let minutesMiliseconds = useSelector((state) => state.timer.time.minutes);
  let secondsInput = useSelector((state) => state.timer.time.seconds);
  let increment = useSelector((state) => state.timer.time.increment);

  return {
    dispatch,
    moves,
    minutesMiliseconds,
    secondsInput,
    increment,
  };
};
