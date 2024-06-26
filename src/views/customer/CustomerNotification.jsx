import { useState, useEffect } from "react";
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import Swal from 'sweetalert2'
import moment from "moment";
import axios from 'axios'; // 確保引入 axios

function CustomerNotification() {
    const [notifications, setNotification] = useState([]);
  
    const fetchNoti = (source) => {
      apiInstance.get(`customer/notification/${UserData().user_id}/`, { cancelToken: source.token })
        .then((res) => {
          setNotification(res.data.results);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            console.error(err);
            setNotification([]);
          }
        });
    };
  
    useEffect(() => {
      const source = axios.CancelToken.source();
      fetchNoti(source);
  
      return () => {
        source.cancel('Component unmounted and request canceled');
      };
    }, []);
  
    const MarkNotiAsSeen = (notiId) => {
      const source = axios.CancelToken.source();
  
      apiInstance.get(`customer/notification/${UserData().user_id}/${notiId}/`, { cancelToken: source.token })
        .then((res) => {
          fetchNoti(source);
        });
  
      Swal.fire({
        icon: "success",
        text: "Notification Marked As Seen"
      });
  
      return () => {
        source.cancel('Component unmounted and request canceled');
      };
    };

    return (
        <main className="mt-5">
            <div className="container">
                <section className="">
                <div className="row">
                    {/* Sidebar Here */}
                    <Sidebar/>
                    <div className="col-lg-9 mt-1">
                    <section className="">
                        <main className="mb-5" style={{}}>
                        <div className="container px-4">
                            <section className="">
                            <h3 className="mb-3">
                                <i className="fas fa-bell" /> Notifications{" "}
                            </h3>
                            <div className="list-group">
                                {Array.isArray(notifications) && notifications.length > 0 ? (
                                    notifications?.map((n, index) => (
                                        <a key={index}
                                         href="#" 
                                         className="list-group-item list-group-item-action "
                                         aria-current="true"
                                         >
                                         <div className="d-flex w-100 justify-content-between">
                                             <h5 className="mb-1">Order Confirmed</h5>
                                             <small>{moment(n.data).format("MMM D, YYYY")}</small>
                                         </div>
                                         <p className="mb-1">
                                             Your order has been confirmed
                                         </p>
                                         
                                             <button onClick={() => MarkNotiAsSeen( n.id)} className='btn btn-success mt-3'><i className='fas fa-eye'></i></button>
                                         
                                         </a>    
                                    ))
                                ) : (
                                    <p>No notifications Yet.</p>
                                )}
                            </div>
                            </section>
                        </div>
                        </main>
                    </section>
                    </div>
                </div>
                </section>
            </div>
        </main>
    )
}

export default CustomerNotification;
