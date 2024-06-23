import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import {  useParams } from 'react-router-dom';


function OrderDetail() {
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);

    const userData = UserData();
    const param = useParams();

    useEffect(() => {
        if (userData?.user_id) {
            apiInstance.get(`customer/order/${userData.user_id}/${param.order_oid}/`).then((res) => {
                setOrder(res.data);
                setOrderItems(res.data.orderitem);
            }).catch(err => console.error(err));
        }
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
                                    <section className="">
                                        <div className="row rounded shadow p-3">
                                            <div className="col-lg-12 mb-4 mb-lg-0">
                                                <table className="table align-middle mb-0 bg-white">
                                                    <thead className="bg-light">
                                                        <tr>
                                                            <th>Product</th>
                                                            <th>Price</th>
                                                            <th>Qty</th>
                                                            <th>Total</th>
                                                            <th>Tracking ID</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orderItems?.map((o, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <img
                                                                            src={o.product?.image}
                                                                            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "10px" }}
                                                                            alt=""
                                                                        />
                                                                        <p className="text-muted mb-0">{o.product?.title}</p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <p className="fw-normal mb-1">${o.price}</p>
                                                                </td>
                                                                <td>
                                                                    <p className="fw-normal mb-1">{o.qty}</p>
                                                                </td>
                                                                <td>
                                                                    <span className="fw-normal mb-1">${o.sub_total}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="fw-normal mb-1">{o.tracking_id}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
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
