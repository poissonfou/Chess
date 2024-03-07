import { createSlice, configureStore } from "@reduxjs/toolkit";

const moves = { moves: [] };
let turn = { turn: null };
let timer = {
  white: false,
  forceRenderWhite: 5,
  black: false,
  forceRenderBlack: 2,
  time: -1,
};

const movesSlice = createSlice({
  name: "moves",
  initialState: moves,
  reducers: {
    push(state, action) {
      state.moves.push(action.payload);
    },
    pop(state) {
      state.pop();
    },
  },
});

const turnSlice = createSlice({
  name: "turn",
  initialState: turn,
  reducers: {
    changeTurn(state, action) {
      state.turn = action.payload;
    },
  },
});

const timerSlice = createSlice({
  name: "timer",
  initialState: timer,
  reducers: {
    setRunningTimer(state, action) {
      if (action.payload == "white") {
        state[action.payload] = true;
        state.black = false;
      } else if (action.payload == "black") {
        state[action.payload] = true;
        state.white = false;
      } else {
        state.black = false;
        state.white = false;
      }
    },
    setTime(state, action) {
      state.time = action.payload;
    },
    changeKeys(state) {
      state.forceRenderWhite = state.forceRenderWhite + 1;
      state.forceRenderBlack = state.forceRenderBlack + 1;
    },
  },
});

export const store = configureStore({
  reducer: {
    moves: movesSlice.reducer,
    turn: turnSlice.reducer,
    timer: timerSlice.reducer,
  },
});

export const movesActions = movesSlice.actions;
export const turnActions = turnSlice.actions;
export const timerActions = timerSlice.actions;
