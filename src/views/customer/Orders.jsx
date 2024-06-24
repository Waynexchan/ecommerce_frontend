import { useState, useEffect } from 'react';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

function Orders() {
    const [orders, setOrders] = useState([]);
    const userData = UserData();

    useEffect(() => {
        if (userData?.user_id) {
            apiInstance.get(`customer/orders/${userData.user_id}/`)
                .then((res) => {
                    setOrders(res.data.results); // Access the results array
                    
                })
                .catch(err => console.error(err));
        }
    }, [userData?.user_id]);

    const statusCounts = orders.reduce((counts, order) => {
        const status = order.order_status.toLowerCase();
        counts[status] = (counts[status] || 0) + 1;
        return counts;
    }, {});

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
                                            <i className="fas fa-shopping-cart text-primary" /> Orders{" "}
                                        </h3>
                                        <div className="row gx-xl-5">
                                            <div className="col-lg-4 mb-4 mb-lg-0">
                                                <div className="rounded shadow" style={{ backgroundColor: "#B2DFDB" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <p className="mb-1">Orders</p>
                                                                <h2 className="mb-0">{orders?.length}</h2>
                                                            </div>
                                                            <div className="flex-grow-1 ms-5">
                                                                <div className="p-3 badge-primary rounded-4">
                                                                    <i className="fas fa-shopping-cart fs-4" style={{ color: "#004D40" }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 mb-4 mb-lg-0">
                                                <div className="rounded shadow" style={{ backgroundColor: "#D1C4E9" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <p className="mb-1">Pending Delivery</p>
                                                                <h2 className="mb-0">{statusCounts.pending || 0}</h2>
                                                            </div>
                                                            <div className="flex-grow-1 ms-5">
                                                                <div className="p-3 badge-primary rounded-4">
                                                                    <i className="fas fa-clock fs-4" style={{ color: "#6200EA" }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 mb-4 mb-lg-0">
                                                <div className="rounded shadow" style={{ backgroundColor: "#BBDEFB" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <p className="mb-1">Fulfilled Orders</p>
                                                                <h2 className="mb-0">{statusCounts.fulfilled || 0}</h2>
                                                            </div>
                                                            <div className="flex-grow-1 ms-5">
                                                                <div className="p-3 badge-primary rounded-4">
                                                                    <i className="fas fa-check-circle fs-4" style={{ color: "#01579B" }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    <section className="">
                                        <div className="row rounded shadow p-3">
                                            <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                                                <table className="table align-middle mb-0 bg-white">
                                                    <thead className="bg-light">
                                                        <tr>
                                                            <th>Order ID</th>
                                                            <th>Payment Status</th>
                                                            <th>Order Status</th>
                                                            <th>Total</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orders.map((order) => (
                                                            <tr key={order.oid}>
                                                                <td>
                                                                    <p className="fw-bold mb-1">#{order.oid?.toUpperCase()}</p>
                                                                    <p className="text-muted mb-0">
                                                                        {new Date(order.date).toLocaleDateString()}
                                                                    </p>
                                                                </td>
                                                                <td>
                                                                    <p className="fw-normal mb-1">{order.payment_status?.toUpperCase()}</p>
                                                                </td>
                                                                <td>
                                                                    <p className="fw-normal mb-1">{order.order_status?.toUpperCase()}</p>
                                                                </td>
                                                                <td>
                                                                    <span className="fw-normal mb-1">${order.total}</span>
                                                                </td>
                                                                <td>
                                                                    <Link to={`/customer/orders/${order.oid}/`} className="btn btn-link btn-sm btn-rounded">
                                                                        View <i className="fas fa-eye" />
                                                                    </Link>
                                                                    <Link to={`/customer/invoice/${order.oid}/`} className="btn btn-link btn-sm btn-rounded">
                                                                        Invoice <i className="fas fa-file-invoice" />
                                                                    </Link>
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
    );
}

export default Orders;
