import React, { useReducer, useState } from 'react';
import './App.css'; 
import productImage1 from './components/1.jpg'; 
import productImage2 from './components/2.jpg'; 
import productImage3 from './components/3.jpg'; 
import productImage4 from './components/4.jpg'; 
import productImage5 from './components/5.jpg'; 
import productImage6 from './components/6.jpg'; 
import { FaShoppingCart } from "react-icons/fa";

const initialState = { items: [], totalAmount: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };
        const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { ...state, items: updatedItems, totalAmount: newTotalAmount };
      } else {
        const newItems = [...state.items, action.payload];
        const newTotalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { ...state, items: newItems, totalAmount: newTotalAmount };
      }
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload.id);
      const updatedTotalAmount = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { ...state, items: filteredItems, totalAmount: updatedTotalAmount };
    case 'UPDATE_QUANTITY':
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (itemIndex >= 0) {
        const updatedItemList = [...state.items];
        updatedItemList[itemIndex] = {
          ...updatedItemList[itemIndex],
          quantity: action.payload.quantity,
        };
        const newAmount = updatedItemList.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { ...state, items: updatedItemList, totalAmount: newAmount };
      }
      return state;
    default:
      throw new Error('Unknown action type');
  }
}

const products = [
  { id: 1, name: 'Green Crochet Tshirt', price: 40, image: productImage1 },
  { id: 2, name: 'White Cuban Shirt', price: 20, image: productImage2 },
  { id: 3, name: 'White graphic Tshirt', price: 30, image: productImage3 },
  { id: 4, name: 'Penn State SweatShirt', price: 30, image: productImage4 },
  { id: 5, name: 'Graphic acidwash Tshirt', price: 30, image: productImage5 },
  { id: 6, name: 'Striped sweatshirt oversized', price: 30, image: productImage6 },
];

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isCartVisible, setCartVisible] = useState(false);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  // Calculate the total quantity of items in the cart
  const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <header className="header">
        <h1>Shein.IN</h1>
        <button className="cart-toggle" onClick={() => setCartVisible(prev => !prev)}>
          <FaShoppingCart />
          {totalQuantity > 0 && <span className="item-count">{totalQuantity}</span>}
        </button>
      </header>
      <div><h2>Best Selling Tshirts!!!</h2></div>
      <main className="main-content">
        <section className="product-list">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => addItem({ ...product, quantity: 1 })}>Add to Cart</button>
            </div>
          ))}
        </section>

        {isCartVisible && (
          <aside className="shopping-cart">
            <h2>Shopping Cart</h2>
            <ul>
              {state.items.map(item => (
                <li key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  {item.name} - ${item.price} x {item.quantity}
                  <button onClick={() => removeItem(item.id)}>Remove</button>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}>-</button>
                </li>
              ))}
            </ul>
            <h3>Total Amount: ${state.totalAmount.toFixed(2)}</h3>
            <label>Address</label><br/>
            <textarea placeholder='Enter Address' rows={8} cols={36}></textarea><br />
            <button>Pay Now</button>
            <button>Pay on Delivery</button>
          </aside>
        )}
      </main>
    </div>
  );
}

export default App;
