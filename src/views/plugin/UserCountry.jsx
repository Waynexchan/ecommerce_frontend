import { useState, useEffect } from "react";

function GetCurrentAddress() {
    const [address, setAddress] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const { latitude, longitude } = pos.coords;

                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        
                        setAddress(data.address);
                    })
                    .catch(err => {
                        console.error('Error fetching address:', err);
                    });
            },
            err => {
                console.error('Error getting geolocation:', err);
            }
        );
    }, []);

    return address;
}

export default GetCurrentAddress;
