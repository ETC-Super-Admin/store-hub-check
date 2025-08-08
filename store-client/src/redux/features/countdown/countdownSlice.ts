import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountdownState {
  startDate: string | null;
  endDate: string | null;
}

const initialState: CountdownState = {
  startDate: null,
  endDate: null,
};

const countdownSlice = createSlice({
  name: "countdown",
  initialState,
  reducers: {
    setCountdownDates(state, action: PayloadAction<{ startDate: string; endDate: string }>) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const { setCountdownDates } = countdownSlice.actions;
export default countdownSlice.reducer;
