import React, { useState, useEffect } from 'react';

function CartID() {
    const generateRandomString = () => {
        const length = 30;
        const characters = "ABCDEFGHIJKL12345678";
        let randomString = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }

        localStorage.setItem("randomString", randomString);
        return randomString;
    };

    const existingRandomString = localStorage.getItem("randomString");
    if (!existingRandomString) {
        return generateRandomString();
    } else {
        return existingRandomString;
    }
}

export default CartID;
