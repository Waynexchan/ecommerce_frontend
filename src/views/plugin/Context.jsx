import React, { useState, createContext } from "react";
import PropTypes from 'prop-types';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState({});
    const [cartCount, setCartCount] = useState(0);

    return (
        <CartContext.Provider value={{ cart, setCart, cartTotal, setCartTotal, cartCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
