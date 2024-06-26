import { useState, useEffect } from 'react';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // 確保引入 axios

function Invoice() {
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const userData = UserData();
    const param = useParams();

    useEffect(() => {
        const source = axios.CancelToken.source();

        if (userData?.user_id) {
        apiInstance.get(`customer/invoice/${userData.user_id}/${param.order_oid}/`, { cancelToken: source.token })
            .then((res) => {
            setOrder(res.data);
            setOrderItems(res.data.order_items);
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <>
                <div className="row d-flex justify-content-center p-2">
                    <div className="receipt-main col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3">
                        <div className="d-flex justify-content-between">
                            <div className="row">
                                <div className="receipt-header">
                                    <div className="col-xs-6 col-sm-6 col-md-6">
                                        <div className="receipt-left">
                                            <img
                                                className="img-responsive"
                                                alt="iamgurdeeposahan"
                                                src="https://multivendor-swecommerce-bucket.s3.eu-north-1.amazonaws.com/static/image/sw.jpg"
                                                style={{ width: 71, borderRadius: 43 }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-12 text-left">
                                        <div className="receipt-right">
                                            <h5 className="margin-top-10">
                                                S & W Luxury 9195<span className="text-warning">.</span>
                                            </h5>
                                            <p>
                                                <i className="fa fa-phone" /> +852 60614857
                                            </p>
                                            <p>
                                                <i className="fa fa-envelope" /> cs@swluxury9195.com
                                            </p>
                                            <p>
                                                <i className="fa fa-location-arrow" /> Hong Kong
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="receipt-header receipt-header-mid">
                                    <div className="col-xs-12 col-sm-12 col-md-12 text-left">
                                        <div className="receipt-right">
                                            <h5>Customer Details</h5>
                                            <p>
                                                <b>
                                                    <i className="fa fa-user" />
                                                </b>
                                                {order.full_name}
                                            </p>
                                            <p>
                                                <b>
                                                    <i className="fa fa-envelope" />
                                                </b>{order.email}
                                            </p>
                                            <p>
                                                <b>
                                                    <i className="fa fa-phone" />
                                                </b>{order.mobile}
                                            </p>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="col-xs-12 col-sm-12 col-md-12">
                                        <div className="receipt-left">
                                            <h6>
                                                INVOICE ID #{order.oid}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>

                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th style={{color: 'black'}}>Product</th>
                                        <th style={{color: 'black'}}>Price</th>
                                        <th style={{color: 'black'}}>Qty</th>
                                        <th style={{color: 'black'}}>Sub Total</th>
                                        <th style={{color: 'black'}}>Discount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems?.map((o, index) => (
                                        <tr key={index}>
                                            <td className="col-md-5">
                                                {o?.product?.title}
                                            </td>
                                            <td className="col-md-2">
                                                ${o?.price}
                                            </td>
                                            <td className="col-md-2">
                                                {o?.qty}
                                            </td>
                                            <td className="col-md-2">
                                                ${o?.sub_total}
                                            </td>
                                            <td className="col-md-2">
                                                ${o?.saved}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="row">
                                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 d-flex justify-content-start">
                                    {/* 可以在這裡添加額外的內容 */}
                                </div>
                                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 d-flex justify-content-end">
                                    <div className="receipt-right">
                                        <h5>Summary</h5>
                                        <p className="mb-2">
                                            <b>Sub Total: </b>
                                            ${order.sub_total}
                                        </p>
                                        <p className="mb-2">
                                            <b>Shipping: </b>
                                            ${order.shipping_amount}
                                        </p>
                                        <p className="mb-2">
                                            <b>Tax: </b>
                                            ${order.tax_fee}
                                        </p>
                                        <p className="mb-2">
                                            <b>Service Fee: </b>
                                            ${order.service_fee}
                                        </p>
                                        <br />
                                        <p className="mb-2">
                                            <b>Total: </b>
                                            ${order.total}
                                        </p>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-center align-items-center">
                            <button onClick={handlePrint} id="printButton" className="btn btn-dark">
                                Print <i className="fas fa-print" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Print Windows */}
            </>
        </div>
    );
}

export default Invoice;
