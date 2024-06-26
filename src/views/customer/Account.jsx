import { useState, useEffect } from 'react';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import axios from 'axios'; // 確保引入 axios
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';


function Account() {
  const [profile, setProfile] = useState({});
  const userData = UserData();

  useEffect(() => {
    const source = axios.CancelToken.source(); // 使用 axios.CancelToken

    if (userData?.user_id) {
      apiInstance.get(`user/profile/${userData.user_id}/`, { cancelToken: source.token })
        .then((res) => {
          setProfile(res.data);
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
    return (
        
        <main className="mt-5">
            <div className="container">
                <section className="">
                    <div className="row">
                        <Sidebar />
                        <div className="col-lg-9 mt-1">
                        <main className="mb-5" style={{}}>
                            <div className="container px-4">
                            <section className=""></section>
                            <section className="">
                                <div className="row rounded shadow p-3">
                                <h2>Hi {profile.full_name}, </h2>
                                <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                                    From your account dashboard. you can easily check &amp;
                                    view your <Link to={`/customer/orders/`} >orders</Link>, and   
                                    <Link to={`/customer/settings/`}> edit Account</Link>
                                </div>
                                </div>
                            </section>
                            </div>
                        </main>
                        </div>
                    </div>
                </section>
            </div>
        </main>

    )
}

export default Account
