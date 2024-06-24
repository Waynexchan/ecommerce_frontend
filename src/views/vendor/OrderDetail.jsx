import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import { Link, useParams } from 'react-router-dom';

function OrderDetail() {
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);

    const param = useParams();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await apiInstance.get(`vendor/orders/${UserData()?.vendor_id}/${param.order_oid}/`);
                setOrder(res.data);
                setOrderItems(res.data.orderitem);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        if (apiInstance) {
            fetchOrderDetails();
        }
    }, [apiInstance, param.order_oid]);

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
                                            <i className="fas fa-shopping-cart text-primary" /> Order ID: #{order.oid}
                                        </h3>
                                        <div className="row gx-xl-5">
                                            <div className="col-lg-3 mb-4 mb-lg-0">
                                                <div className="rounded shadow" style={{ backgroundColor: "#B2DFDB" }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center">
                                                            <div className="">
                                                                <p className="mb-1">Total</p>
                                                                <h2 className="mb-0">${order?.total}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Other columns */}
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
                                                            <th className='text-danger'>Discount</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orderItems?.map((orderItem, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <img
                                                                            src={orderItem?.product?.image}
                                                                            style={{ width: 80 }}
                                                                            alt=""
                                                                        />
                                                                        <Link to={`/detail/${orderItem.product.slug}`} className="fw-bold text-dark ms-2 mb-0">
                                                                            {orderItem?.product?.title}
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <p className="fw-normal mb-1">${orderItem.price}</p>
                                                                </td>
                                                                <td>
                                                                    <p className="fw-normal mb-1">{orderItem.qty}</p>
                                                                </td>
                                                                <td>
                                                                    <span className="fw-normal mb-1">${orderItem.sub_total}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="fw-normal mb-1 text-danger">-${orderItem.saved}</span>
                                                                </td>
                                                                <td>
                                                                    {orderItem.tracking_id == null || orderItem.tracking_id === 'undefined'
                                                                        ? <Link className="btn btn-primary" to={`/vendor/orders/${param.order_oid}/item/${orderItem.id}/tracking/`}> Add Tracking <i className='fas fa-plus'></i></Link>
                                                                        : <Link className="btn btn-secondary" to={`/vendor/orders/${param.order_oid}/item/${orderItem.id}/tracking/`}> Edit Tracking <i className='fas fa-edit'></i></Link>
                                                                    }
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

export default OrderDetail;
