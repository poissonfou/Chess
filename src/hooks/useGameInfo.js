import { useSelector, useDispatch } from "react-redux";

export const useGameInfo = () => {
  let dispatch = useDispatch();
  let minutesMiliseconds = useSelector((state) => state.timer.time.minutes);
  let secondsInput = useSelector((state) => state.timer.time.seconds);
  let increment = useSelector((state) => state.timer.time.increment);

  return {
    dispatch,
    minutesMiliseconds,
    secondsInput,
    increment,
  };
};
