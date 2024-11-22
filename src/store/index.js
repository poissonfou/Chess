import { createSlice, configureStore } from "@reduxjs/toolkit";

const timer = {
  minutes: 10,
  seconds: 0,
  increment: 0,
};
const turn = { turn: null };
const games = {
  games: [],
};
const movesBtns = { action: "" };
const moves = { moves: [] };
const COLUMNS_CHAR = ["a", "b", "c", "d", "e", "f", "g", "h"];
let n = 0;

const timerSlice = createSlice({
  name: "timer",
  initialState: timer,
  reducers: {
    setTime(state, action) {
      state.minutes = action.payload.minutes;
      state.seconds = action.payload.seconds;
      state.increment = action.payload.increment;
    },
  },
});

const turnSlice = createSlice({
  name: "turn",
  initialState: turn,
  reducers: {
    setTurn(state, action) {
      state.turn = action.payload;
    },
  },
});

const movesSlice = createSlice({
  name: "moves",
  initialState: moves,
  reducers: {
    pushAMove(state, action) {
      const move = action.payload;

      if (!move.notation) {
        const row = 8 - move.destination.row;
        const column = COLUMNS_CHAR[move.destination.column];
        let notation = "";

        if (move.isCastling) {
          if (move.destination.column + 2 == move.piece.position.column) {
            notation += "0-0-0";
          } else {
            notation += "0-0";
          }
        } else if (move.pieceTaken.type) {
          notation += `x${column}${row}`;
        } else {
          notation += `${column}${row}`;
        }

        if (move.promoting) notation += `=${move.promoting.toUpperCase()}`;

        if (move.isDraw) notation += "#";
        if (move.isCheck) notation += "+";
        if (move.isCheckmate) notation += "+";

        move.notation = notation;
      }

      state.moves.push(action.payload);

      if (move.isCheckmate) {
        if (move.piece.color == "w") {
          state.moves.push({
            piece: {
              color: "",
              type: "",
            },
            notation: "1-0",
          });
        } else {
          state.moves.push({
            piece: {
              color: "",
              type: "",
            },
            notation: "0-1",
          });
        }
      }

      if (move.isDraw) {
        state.moves.push({
          piece: {
            color: "",
            type: "",
          },
          notation: "1/2-1/2",
        });
      }
    },
    resetState(state, action) {
      state.moves = [];
    },
    setState(state, action) {
      state.moves = action.payload;
    },
  },
});

const gamesSlice = createSlice({
  name: "games",
  initialState: games,
  reducers: {
    saveGame(state, action) {
      state.games.push(action.payload);
    },
  },
});

const movesBtnsSlice = createSlice({
  name: "movesBtns",
  initialState: movesBtns,
  reducers: {
    setAction(state, action) {
      state.action = action.payload + `${n}`;
      n++;
    },
  },
});

export const store = configureStore({
  reducer: {
    timer: timerSlice.reducer,
    turn: turnSlice.reducer,
    moves: movesSlice.reducer,
    games: gamesSlice.reducer,
    movesBtns: movesBtnsSlice.reducer,
  },
});

export const timerActions = timerSlice.actions;
export const turnActions = turnSlice.actions;
export const movesActions = movesSlice.actions;
export const gamesActions = gamesSlice.actions;
export const movesBtnsActions = movesBtnsSlice.actions;
