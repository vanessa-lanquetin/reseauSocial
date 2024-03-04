import { createSlice } from "@reduxjs/toolkit";

const reducer = createSlice({
  name: "user",
  initialState: { value: null, picture: null, bio:null },
  reducers: {
    setUser(state, action) {
      state.value = action.payload;
    },
    uploadPicture(state, action) {
      state.picture = action.payload;
    },

    updateBio(state, action) {
      state.bio = action.payload;
    },
  },
});

export const selectUser = (state) => {
  return state.user.value;
};

export const { setUser, uploadPicture, updateBio } = reducer.actions;
export default reducer;
