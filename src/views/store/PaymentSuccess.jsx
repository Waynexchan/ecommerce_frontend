import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import apiInstance from '../../utils/axios';

function PaymentSuccess() {
    const [loading, setIsLoading] = useState(true);
    const [orderResponse, setOrderResponse] = useState({});
    const [order, setOrder] = useState({});
    const param = useParams();
    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const paypalOrderId = urlParams.get('paypal_order_id');
    
    const handleViewOrder = () => {
        navigate(`/customer/orders/${order.oid}/`);
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await apiInstance.get(`checkout/${param?.order_oid}/`);
                setOrder(res.data);
            } catch (error) {
                console.error("Error fetching order details", error);
            }
        };
        fetchOrderDetails();
    }, [param]);

    useEffect(() => {
        const processPayment = async () => {
            const formData = new FormData();
            formData.append('order_oid', param?.order_oid);
            formData.append('session_id', sessionId);
            formData.append('paypal_order_id', paypalOrderId);
    
            setIsLoading(true);
            try {
                const res = await apiInstance.post('payment-success/', formData);
                setOrderResponse(res.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error during payment processing", error);
                setIsLoading(false);
            }
        };
        processPayment();
    }, [param?.order_oid, sessionId, paypalOrderId]);

    return (
        <div>
            <main>
                <main className="mb-4 mt-4 h-100">
                    <div className="container">
                        <section>
                            <div className="gx-lg-5">
                                <div className="row pb50">
                                    <div className="col-lg-12">
                                        <div className="dashboard_title_area"></div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="application_statics">
                                            <div className="account_user_deails dashboard_page">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <div className="col-lg-12">
                                                        {loading ? (
                                                            <div className="border border-3 border-warning">
                                                                <div className="card bg-white shadow p-5">
                                                                    <div className="mb-4 text-center">
                                                                        <i className="fas fa-clock text-warning" style={{ fontSize: 100 }} />
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <h1>Pending...</h1>
                                                                        <p>We are verifying your payment, please hold on :)</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {orderResponse.message === "Already Paid" ? (
                                                                    <div className="border border-3 border-success">
                                                                        <div className="card bg-white shadow p-5">
                                                                            <div className="mb-4 text-center">
                                                                                <i className="fas fa-check-circle text-success" style={{ fontSize: 100 }} />
                                                                            </div>
                                                                            <div className="text-center">
                                                                                <h1>Already Paid!</h1>
                                                                                <p>You have already paid for this order, thank you.</p>
                                                                                <button onClick={handleViewOrder} className="btn btn-success mt-3">
                                                                                    View Order <i className="fas fa-eye" />
                                                                                </button>
                                                                                <Link to={`/customer/invoice/${order.oid}/`} className="btn btn-primary mt-3 ms-2">
                                                                                    Download Invoice <i className="fas fa-file-invoice" />
                                                                                </Link>
                                                                                <Link className="btn btn-secondary mt-3 ms-2" to="/">
                                                                                    Go Home <i className="fas fa-arrow-left" />
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="border border-3 border-success">
                                                                        <div className="card bg-white shadow p-5">
                                                                            <div className="text-center">
                                                                                <h1>Thank You!</h1>
                                                                                <p>
                                                                                    Thank you, please note your order id <b>#{order.oid}</b><br />
                                                                                    We have sent an order summary to your linked email address <b>({order.email})</b>
                                                                                </p>
                                                                                <button onClick={handleViewOrder} className="btn btn-success mt-3">
                                                                                    View Order <i className="fas fa-eye" />
                                                                                </button>
                                                                                <Link to={`/customer/invoice/${order.oid}/`} className="btn btn-primary mt-3 ms-2">
                                                                                    Download Invoice <i className="fas fa-file-invoice" />
                                                                                </Link>
                                                                                <Link className="btn btn-secondary mt-3 ms-2" to="/">
                                                                                    Go Home <i className="fas fa-arrow-left" />
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </main>
        </div>
    );
}

export default PaymentSuccess;
