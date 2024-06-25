import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiInstance from '../../utils/axios';

function Tracking() {
    const [trackingInfo, setTrackingInfo] = useState('');
    const { order_oid, order_item_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch existing tracking info if any
        apiInstance.get(`vendor/orders/${order_oid}/item/${order_item_id}/tracking/`).then(res => {
            const orderItem = res.data.results[0]; // Ensure this correctly references the first result
            setTrackingInfo(orderItem.tracking_id || '');
        });
    }, []);

    const handleSave = () => {
        // Save tracking info
        apiInstance.post(`vendor/orders/${order_oid}/item/${order_item_id}/tracking/`, { tracking_id: trackingInfo }).then(res => {
            navigate(`/vendor/orders/${order_oid}/`);
        });
    };

    return (
        <div>
            <h2>Add/Edit Tracking</h2>
            <input 
                type="text" 
                value={trackingInfo} 
                onChange={(e) => setTrackingInfo(e.target.value)} 
                placeholder="Enter Tracking ID" 
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

export default Tracking;
