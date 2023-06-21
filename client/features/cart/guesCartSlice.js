import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = JSON.parse(localStorage.getItem("guestCart")) || [];

export const guestCartSlice = createSlice({
  name: "guestCart",
  initialState,
  reducers: {
    addToGuestCart: (state, action) => {
      const existingProduct = state.find(
        (item) => item.id === action.payload.id
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem("guestCart", JSON.stringify(state));
    },
    removeFromGuestCart: (state, action) => {
      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        const product = state[index];
        product.quantity -= 1;
        if (product.quantity <= 0) {
          state.splice(index, 1);
        }
      }
      localStorage.setItem("guestCart", JSON, stringify(state));
    },
    clearGuestCart: (state) => {
      state = [];
      localStorage.setItem("guestCart", JSON.stringify(state));
    },
  },
});


export const { addToGuestCart, removeFromGuestCart, clearGuestCart } =
  guestCartSlice.actions;

  export const selectGuestCart = (state) => state.guestCart;


export default guestCartSlice.reducer;
