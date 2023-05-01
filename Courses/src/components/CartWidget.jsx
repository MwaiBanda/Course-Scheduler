import React, { useState } from 'react';

const CartWidget = () => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <div>
      <span>Cart: {cartItems.length} items</span>
      <a href="/cart">View Cart</a>
    </div>
  );
};

export default CartWidget;