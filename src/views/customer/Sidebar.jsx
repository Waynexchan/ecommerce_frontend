import { useEffect, useState } from 'react';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import axios from 'axios'; 
import { Link } from 'react-router-dom';

function Sidebar() {
  const [profile, setProfile] = useState({});
  const [orderCount, setOrderCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const userData = UserData();

  useEffect(() => {
    const source = axios.CancelToken.source(); // 使用 axios.CancelToken

    if (userData?.user_id) {
      apiInstance.get(`user/profile/${userData?.user_id}/`, { cancelToken: source.token })
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) { // 使用 axios.isCancel
            console.error(err);
          }
        });

      apiInstance.get(`customer/orders/${userData.user_id}/`, { cancelToken: source.token })
        .then((res) => {
          setOrderCount(res.data.results.length);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) { // 使用 axios.isCancel
            console.error(err);
          }
        });

      apiInstance.get(`customer/notification/${userData.user_id}/`, { cancelToken: source.token })
        .then((res) => {
          setNotificationCount(res.data.length);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) { // 使用 axios.isCancel
            console.error(err);
          }
        });
    }

    return () => {
      source.cancel('Component unmounted and request canceled');
    };
  }, [userData?.user_id]);

    const defaultImage = "https://multivendor-swecommerce-bucket.s3.eu-north-1.amazonaws.com/static/image/default-user.jpg";

    return (
        <div className="col-lg-3">
            <div className="d-flex justify-content-center align-items-center flex-column mb-4 shadow rounded-3">
                <img
                    src={profile.image || defaultImage}
                    style={{ width: 120, height: 129, objectFit: "cover", borderRadius: "50%" }}
                    alt="Profile"
                />
                <div className="text-center">
                    <h3 className="mb-0">{profile.full_name}</h3>
                    <p className="mt-0">
                        <Link to={`/customer/settings/`}>Edit Account</Link>
                    </p>
                </div>
            </div>
            <ol className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">
                            <Link to='/customer/account/' className='text-dark'>Account</Link>
                        </div>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">
                            <Link to='/customer/orders/' className='text-dark'>Orders</Link>
                        </div>
                    </div>
                    <span className="badge bg-primary rounded-pill">{orderCount}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">
                            <Link to='/customer/wishlist/' className='text-dark'>WishList</Link>
                        </div>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">
                            <Link to='/customer/notifications/' className='text-dark'>Notification</Link>
                        </div>
                    </div>
                    <span className="badge bg-primary rounded-pill">{notificationCount}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">
                            <Link to='/customer/settings/' className='text-dark'>Settings</Link>
                        </div>
                    </div>
                </li>
            </ol>
        </div>
    );
}

export default Sidebar;
