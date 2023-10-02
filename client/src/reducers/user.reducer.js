import { createSlice } from "@reduxjs/toolkit";

const reducer = createSlice({
  name: "user",
  initialState: { value: null, picture: null },
  reducers: {
    setUser(state, action) {

      state.value = action.payload; 
    },
    uploadPicture(state, action) {      
      state.picture = action.payload;
    },
  },
});

export const selectUser = (state) => {
  return state.user.value;
};

export const { setUser, uploadPicture } = reducer.actions;
export default reducer;
