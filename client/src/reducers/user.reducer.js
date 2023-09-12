import { createSlice } from "@reduxjs/toolkit";

const reducer = createSlice({
  initialState: { value: null },
  name: "user",
  reducers: {
    setUser(state, actions) {
      state.value = actions.payload
    },
  },
});

export const selectUser = (state) => {
  return state.user.value
}
export const { setUser } = reducer.actions;
export default reducer