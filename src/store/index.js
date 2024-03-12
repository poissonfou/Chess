import { createSlice, configureStore } from "@reduxjs/toolkit";

const moves = { moves: [] };
let turn = { turn: null };
let hasEnded = { hasEnded: false, showPopup: false };
let timer = {
  white: false,
  forceRenderWhite: 5,
  black: false,
  forceRenderBlack: 2,
  time: {
    minutes: 600000,
    seconds: 0,
    increment: 0,
  },
};
let promotingPiece = { idx: null, row: null, idxFrom: null };

const movesSlice = createSlice({
  name: "moves",
  initialState: moves,
  reducers: {
    push(state, action) {
      state.moves.push(action.payload);
    },
    pop(state) {
      state.moves.pop();
    },
    empty(state) {
      state.moves = [];
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
      state.time.minutes = action.payload.minutes;
      state.time.seconds = action.payload.seconds;
      state.time.increment = action.payload.increment;
    },
    changeKeys(state) {
      state.forceRenderWhite = state.forceRenderWhite + 1;
      state.forceRenderBlack = state.forceRenderBlack + 1;
    },
  },
});

const promotingPieceSlice = createSlice({
  name: "promotingPiece",
  initialState: promotingPiece,
  reducers: {
    setPiece(state, action) {
      state.row = action.payload.row;
      state.idx = action.payload.idx;
      state.idxFrom = action.payload.idxFrom;
    },
  },
});

const hasEndedSlice = createSlice({
  name: "hasEnded",
  initialState: hasEnded,
  reducers: {
    setHasEnded(state) {
      state.hasEnded = !state.hasEnded;
    },
    setShowPopup(state) {
      state.showPopup = !state.showPopup;
    },
  },
});

export const store = configureStore({
  reducer: {
    moves: movesSlice.reducer,
    turn: turnSlice.reducer,
    timer: timerSlice.reducer,
    promotingPiece: promotingPieceSlice.reducer,
    hasEnded: hasEndedSlice.reducer,
  },
});

export const movesActions = movesSlice.actions;
export const turnActions = turnSlice.actions;
export const timerActions = timerSlice.actions;
export const promotingPieceActions = promotingPieceSlice.actions;
export const hasEndedActions = hasEndedSlice.actions;
