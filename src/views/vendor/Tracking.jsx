import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiInstance from '../../utils/axios';

function Tracking() {
    const [trackingInfo, setTrackingInfo] = useState('');
    const { order_oid, order_item_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrackingInfo = async () => {
            try {
                const res = await apiInstance.get(`vendor/orders/${order_oid}/item/${order_item_id}/tracking/`);
                const orderItem = res.data.results[0]; // Ensure this correctly references the first result
                setTrackingInfo(orderItem.tracking_id || '');
            } catch (error) {
                console.error('Error fetching tracking info:', error);
            }
        };

        fetchTrackingInfo();
    }, [order_oid, order_item_id]);

    const handleSave = useCallback(async () => {
        try {
            await apiInstance.post(`vendor/orders/${order_oid}/item/${order_item_id}/tracking/`, { tracking_id: trackingInfo });
            navigate(`/vendor/orders/${order_oid}/`);
        } catch (error) {
            console.error('Error saving tracking info:', error);
        }
    }, [trackingInfo, order_oid, order_item_id, navigate]);

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
