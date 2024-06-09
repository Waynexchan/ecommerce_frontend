import { useState, useContext, useEffect } from "react";
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import Swal from 'sweetalert2'
import moment from "moment";

function CustomerNotification() {

    const [notifications, setNotification] = useState([]);
    

    const fetchNoti = () => {
        apiInstance.get(`customer/notification/${UserData().user_id}/`).then((res) =>{
            setNotification(res.data)
            
        }).catch(err => {
            console.error(err);
            setNotification([]); 
        });
    }

    useEffect(() => {
        fetchNoti()
    },[])

    const MarkNotiAsSeen = (notiId) => {
        apiInstance.get(`customer/notification/${UserData().user_id}/${notiId}/`).then((res) =>{
            fetchNoti()
        })
       
        Swal.fire({
            icon:   "success",
            text: "Notification Marked As Seen"

        })
    }

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
