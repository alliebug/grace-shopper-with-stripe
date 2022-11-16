import axios from 'axios';

// This is used for the cart, but a storee/singleOrder.js file would be extremely similar.

const SET_CART = 'SET_CART';
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_QTY = 'UPDATE_QTY';

const _setCart = (cart) => ({ type: SET_CART, cart });
const _addItem = (item) => ({ type: ADD_ITEM, item });
const _removeItem = (removedItem) => ({ type: REMOVE_ITEM, removedItem });
const _updateQty = (item) => ({ type: UPDATE_QTY, item });

export const fetchCart = (orderId) => {
  return async (dispatch) => {
    try {
      const { data: cart } = await axios.get(`/api/cart/${orderId}`);
      dispatch(_setCart(cart));
    } catch (error) {
      console.log('store/cart/:orderId fetchCart ERROR: ', error);
      throw error;
    }
  };
};

export const addToCart = (orderId, product, quantityInput) => {
  return async (dispatch) => {
    try {
      console.log('Add to cart thunk -- orderId: ', orderId);
      const { data: item } = await axios.post(`/api/cart/${orderId}`, {
        num_items: quantityInput,
        product,
      });
      dispatch(_addItem(item));
    } catch (error) {
      console.log('store/cart/:orderId addToCart ERROR: ', error);
      throw error;
    }
  };
};

export const removeItem = (item) => {
  return async (dispatch) => {
    try {
      const { data: removedItem } = await axios.delete(
        `/api/cart/${item.orderId}`,
        { data: { item } }
      );
      dispatch(_removeItem(removedItem));
    } catch (error) {
      console.log('store/cart/:orderId removeItem ERROR: ', error);
      throw error;
    }
  };
};

export const updateQty = (newQty, item) => {
  return async (dispatch) => {
    try {
      console.log('LINE 61 newQty =', newQty, 'item =', item);
      const { data: updatedItem } = await axios.put(
        `/api/cart/${item.orderId}`,
        { newQty, item }
      );
      console.log('updateQty -- updatedItem =', updatedItem);
      dispatch(_updateQty(updatedItem));
    } catch (error) {
      console.log('store/cart/:orderId updateQty ERROR: ', error);
      throw error;
    }
  };
};

const initialState = [];

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CART:
      return action.cart;
    case ADD_ITEM:
      const arr = state.filter(
        (product) => product.productId !== action.item.productId
      );
      return arr.concat(action.item);
    case REMOVE_ITEM:
      return state.filter((product) => product.id !== action.removedItem.id);
    case UPDATE_QTY:
      const originArr = state.filter(
        (item) => item.productId !== action.item.productId
      );
      return originArr.concat(action.item);
    default:
      return state;
  }
}
