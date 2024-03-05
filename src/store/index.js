import { createSlice, configureStore } from "@reduxjs/toolkit";

const moves = [];

const movesSlice = createSlice({
  name: "moves",
  initialState: moves,
  reducers: {
    push(state, action) {
      state.push(action.payload);
    },
    pop(state) {
      state.pop();
    },
  },
});

export const store = configureStore({
  reducer: { moves: movesSlice.reducer },
});

export const movesActions = movesSlice.actions;
