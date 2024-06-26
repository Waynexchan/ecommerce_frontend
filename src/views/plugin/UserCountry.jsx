import { useState, useEffect } from "react";

function useCurrentAddress() {
    const [address, setAddress] = useState('');

    useEffect(() => {
        const handleSuccess = (pos) => {
            const { latitude, longitude } = pos.coords;
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

            fetch(url)
                .then(res => res.json())
                .then(data => setAddress(data.address))
                .catch(err => console.error('Error fetching address:', err));
        };

        const handleError = (err) => {
            console.error('Error getting geolocation:', err);
            setAddress('Unable to retrieve address');
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        } else {
            console.error('Geolocation is not supported by this browser.');
            setAddress('Geolocation not supported');
        }
    }, []);

    return address;
}

export default useCurrentAddress;
