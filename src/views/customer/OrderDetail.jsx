import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // 確保引入 axios

function OrderDetail() {
    const [order, setOrder] = useState({});
    const userData = UserData();
    const param = useParams();
  
    useEffect(() => {
      const source = axios.CancelToken.source();
  
      if (userData?.user_id) {
        apiInstance.get(`customer/order/${userData.user_id}/${param.order_oid}/`, { cancelToken: source.token })
          .then((res) => {
            setOrder(res.data);
          })
          .catch((err) => {
            if (!axios.isCancel(err)) {
              console.error(err);
            }
          });
      }
  
      return () => {
        source.cancel('Component unmounted and request canceled');
      };
    }, [userData?.user_id, param.order_oid]);

    return (
        <main className="mt-5">
            <div className="container">
                <section className="">
                    <div className="row">
                        <Sidebar />
                        <div className="col-lg-9 mt-1">
                            <main className="mb-5">
                                <div className="container px-4">
                                    <section className="mb-5">
                                        <h3 className="mb-3">
                                            {" "}
                                            <i className="fas fa-shopping-cart text-primary" /> #{order.oid}{" "}
                                        </h3>
                                        <div className="row gx-xl-5">
                                            <div className="col-lg-3 mb-4 mb-lg-0">
                                                <div className="rounded shadow" style={{ backgroundColor: "#B2DFDB" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <p className="mb-1">Total</p>
                                                                <h2 className="mb-0">${order.total}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 mb-4 mb-lg-0">
                                                <div className="rounded shadow" style={{ backgroundColor: "#D1C4E9" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <p className="mb-1">Payment Status</p>
                                                                <h2 className="mb-0">{order.payment_status?.toUpperCase()}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 mb-4 mb-lg-0">
                                                <div className="rounded shadow" style={{ backgroundColor: "#BBDEFB" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <p className="mb-1">Order Status</p>
                                                                <h2 className="mb-0">{order.order_status?.toUpperCase()}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 mb-4 mb-lg-0">
                                                <div className="rounded shadow" style={{ backgroundColor: "#bbfbeb" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <p className="mb-1">Shipping Amount</p>
                                                                <h2 className="mb-0">${order.shipping_amount}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 mb-4 mb-lg-0 mt-5">
                                                <div className="rounded shadow" style={{ backgroundColor: "#bbf7fb" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <p className="mb-1">Tax Fee</p>
                                                                <h2 className="mb-0">${order.tax_fee}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 mb-4 mb-lg-0 mt-5">
                                                <div className="rounded shadow" style={{ backgroundColor: "#eebbfb" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <p className="mb-1">Service Fee</p>
                                                                <h2 className="mb-0">${order.service_fee}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 mb-4 mb-lg-0 mt-5">
                                                <div className="rounded shadow" style={{ backgroundColor: "#bbc5fb" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <p className="mb-1">Discount Fee</p>
                                                                <h2 className="mb-0 text-danger">-${order.saved}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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

export default OrderDetail;
