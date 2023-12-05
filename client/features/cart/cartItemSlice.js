import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCart = createAsyncThunk(
  "cartItems/addToCart",
  async ({ userId, productId }) => {
    try {
      const response = await axios.post(`/api/cartItems/${userId}`, {
        productId,
        userId,
      });
      return response.data;
    } catch (error) {
      throw Error("Failed to add item to cart");
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cartitem/fetchCartItems",
  async (userId) => {
    try {
      const response = await axios.get(`/api/cartItems/${userId}`);
      return response.data;
    } catch (error) {
      throw Error("Failed to fetch cartItem");
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cartItems/removeCartItem",
  async ({ userId, productId }) => {
    try {
      const response = await axios.delete(
        `/api/cartItems/${userId}/${productId}`
      );
      return { data: response.data, userId };
    } catch (error) {
      throw Error("Failed to delete cartItem");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cartItems/updateCartItem",
  async ({ userId, productId, quantity }) => {
    try {
      const response = await axios.put(`api/cartItems/${userId}/${productId}`, {
        quantity,
      });
      return { data: response.data, userId };
    } catch (error) {
      throw Error("Failed to update carItem");
    }
  }
);

export const clearAllItems = createAsyncThunk(
  "cartItems/clearAllItems",
  async (userId, { dispatch }) => {
    try {
      console.log("Clearing all items for userId:", userId);
      await axios.delete(`/api/cartItems/${userId}/clearAllItems`);
      console.log("Clear all items successful");
      // Dispatch fetchCartItems to refresh the cart items after clearing
      dispatch(fetchCartItems(userId));
      return userId;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("No items found in the cart");
      } else {
        console.log("Failed to clear Cart");
      }
      throw error; // Re-throw the error to be handled by the component
    }
  }
);

export const clearCart = createAsyncThunk(
  "cartItems/clearCart",
  async (userId) => {
    try {
      console.log("Clearing cart for userId:", userId);
      const response = await axios.delete(`/api/cartItems/${userId}`);
      console.log("Clear cart response:", response.data);
      return userId;
    } catch (error) {
      if (error.response.status === 404) {
        console.log("Item not found");
      } else {
        console.log("Failed to clear Cart");
      }
    }
  }
);

const initialState = {
  cartItem: [],
  status: "idle",
  error: null,
};

export const cartItemSlice = createSlice({
  name: "cartItem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.status = "succeeded";
      console.log(action.payload);
      state.cartItem = [...state.cartItem, action.payload];
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
    builder.addCase(fetchCartItems.pending, (state) => {
      state.status = "loading";
    }),
      builder.addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        state.cartItem = action.payload;
      }),
      builder.addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userId = action.payload.userId;
      state.cartItem = state.cartItem.filter(
        (item) => item.id !== action.payload
      );
    });
    builder.addCase(removeCartItem.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.cartItem.findIndex(
        (item) => item.id === action.payload
      );
      if (index !== -1) {
        state.cartItem[index] = action.payload;
      }
    });
    builder.addCase(updateCartItem.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(clearAllItems.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.cartItem = [];
    });
    builder.addCase(clearAllItems.rejected, (state, action) => {
      state.status = "failed";
      if (action.error.response && action.error.response.status === 404) {
        console.log("No items found in the cart");
      } else {
        console.log("Failed to clear Cart");
      }
    });
    builder.addCase(clearCart.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(clearCart.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.cartItem = [];
    });
    builder.addCase(clearCart.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export default cartItemSlice.reducer;
