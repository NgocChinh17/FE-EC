import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paiAt: "",
  isDelivered: false,
  isDeliveredAt: "",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state.orderItems.find(
        (item) => item.Product === orderItem.Product
      );

      if (itemOrder) {
        itemOrder.amount += orderItem.amount;
      } else {
        state.orderItems.push(orderItem);
      }
    },

    updateProductAmount: (state, action) => {
      const { idProduct, newAmount } = action.payload;
      const itemOrder = state.orderItems.find((item) => item.Product === idProduct);

      if (itemOrder) {
        itemOrder.amount = newAmount;
      }
    },

    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;
      state.orderItems = state.orderItems.filter((item) => item.Product !== idProduct);
    },

    clearOrder: (state) => {
      state.orderItems = [];
    },
  },
});

export const { addOrderProduct, removeOrderProduct, updateProductAmount, clearOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
