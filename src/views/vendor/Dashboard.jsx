import { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './Sidebar';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import { Bar, Line } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true
});

function Dashboard() {
  const [stats, setStats] = useState({});
  const [orderChartData, setOrderChartData] = useState([]);
  const [productsChartData, setProductsChartData] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const userId = UserData()?.vendor_id;

  const fetchData = useCallback(async (source) => {
    try {
      const [statsRes, productsRes, ordersRes, orderChartRes, productChartRes] = await Promise.all([
        apiInstance.get(`vendor/stats/${userId}/`, { cancelToken: source.token }),
        apiInstance.get(`vendor/products/${userId}/`, { cancelToken: source.token }),
        apiInstance.get(`vendor/orders/${userId}/`, { cancelToken: source.token }),
        apiInstance.get(`vendor-orders-chart/${userId}/`, { cancelToken: source.token }),
        apiInstance.get(`vendor-product-chart/${userId}/`, { cancelToken: source.token })
      ]);

      setStats(statsRes.data[0]);
      setProducts(productsRes.data.results || []);
      setOrders(ordersRes.data.results || []);
      setOrderChartData(orderChartRes.data);
      setProductsChartData(productChartRes.data);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error fetching data:', error);
      }
    }
  }, [userId]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchData(source);

    return () => {
      source.cancel('Component unmounted and request canceled');
    };
  }, [fetchData]);

  const order_months = useMemo(() => orderChartData.map(item => item.month), [orderChartData]);
  const order_counts = useMemo(() => orderChartData.map(item => item.orders), [orderChartData]);
  const product_months = useMemo(() => productsChartData.map(item => item.month), [productsChartData]);
  const product_counts = useMemo(() => productsChartData.map(item => item.orders), [productsChartData]);

  const order_data = useMemo(() => ({
    labels: order_months,
    datasets: [
      {
        label: "Total Orders",
        data: order_counts,
        fill: true,
        backgroundColor: 'green',
        borderColor: "green"
      }
    ]
  }), [order_months, order_counts]);

  const product_data = useMemo(() => ({
    labels: product_months,
    datasets: [
      {
        label: "Total Products",
        data: product_counts,
        fill: true,
        backgroundColor: 'blue',
        borderColor: "blue"
      }
    ]
  }), [product_months, product_counts]);

  const handleDeleteProduct = useCallback(async (productPid) => {
    try {
      await apiInstance.delete(`vendor-delete-product/${userId}/${productPid}/`);
      const res = await apiInstance.get(`vendor/products/${userId}/`);
      setProducts(res.data.results || []);
      Toast.fire({
        icon: 'success',
        title: 'Product Deleted'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }, [userId]);

  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="row mb-3">
            <div className="col-xl-3 col-lg-6 mb-2">
              <div className="card card-inverse card-success">
                <div className="card-block bg-success p-3">
                  <div className="rotate">
                    <i className="bi bi-grid fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Products</h6>
                  <h1 className="display-1">{stats?.products}</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 mb-2">
              <div className="card card-inverse card-danger">
                <div className="card-block bg-danger p-3">
                  <div className="rotate">
                    <i className="bi bi-cart-check fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Orders</h6>
                  <h1 className="display-1">{stats?.orders}</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 mb-2">
              <div className="card card-inverse card-info">
                <div className="card-block bg-info p-3">
                  <div className="rotate">
                    <i className="bi bi-people fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Customers</h6>
                  <h1 className="display-1">{stats?.customers}</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 mb-2">
              <div className="card card-inverse card-warning">
                <div className="card-block bg-warning p-3">
                  <div className="rotate">
                    <i className="bi bi-currency-dollar fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Revenue</h6>
                  <h1 className="display-1">${stats?.revenue}</h1>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="container">
            <div className="row my-3">
              <div className="col">
                <h4>Chart Analytics</h4>
              </div>
            </div>
            <div className="row my-2">
              <div className="col-lg-6 py-1">
                <div className="card">
                  <div className="card-body">
                    <Bar data={order_data} style={{ height: 300 }} />
                  </div>
                </div>
              </div>

              <div className="col-lg-6 py-1">
                <div className="card">
                  <div className="card-body">
                    <Bar data={product_data} style={{ height: 300 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a id="layouts" />
          <hr />
          <div className="row mb-3 container">
            <div className="col-lg-12" style={{ marginBottom: 100 }}>
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    href="#home1"
                    role="tab"
                    data-toggle="tab"
                  >
                    Products
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#profile1"
                    role="tab"
                    data-toggle="tab"
                  >
                    Orders
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <br />
                <div role="tabpanel" className="tab-pane active" id="home1">
                  <h4>Products</h4>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Orders</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(products) && products.map((p, index) => (
                        <tr key={index}>
                          <th scope="row">
                            <img src={p.image} style={{ width: "100px", height: "70px", objectFit: "cover", borderRadius: "10px" }} alt='' />
                          </th>
                          <td>{p.title}</td>
                          <td>${p.price}</td>
                          <td>{p.stock_qty}</td>
                          <td>{p.orders}</td>
                          <td>{p.status.toUpperCase()}</td>
                          <td>
                            <Link to={`/detail/${p.slug}/`} className="btn btn-primary mb-1 me-2">
                              <i className="fas fa-eye" />
                            </Link>
                            <Link to={`/vendor/product/update/${p.pid}/`} className="btn btn-success mb-1 me-2">
                              <i className="fas fa-edit" />
                            </Link>
                            <button onClick={() => handleDeleteProduct(p.pid)} className="btn btn-danger mb-1">
                              <i className="fas fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div role="tabpanel" className="tab-pane active" id="profile1">
                  <h4>Orders</h4>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">#Order ID</th>
                        <th scope="col">Total</th>
                        <th scope="col">Payment Status</th>
                        <th scope="col">Delivery Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(orders) && orders.map((o, index) => (
                        <tr key={index}>
                          <th scope="row">#{o.oid}</th>
                          <td>${o.total}</td>
                          <td>{o.payment_status?.toUpperCase()}</td>
                          <td>{o.order_status?.toUpperCase()}</td>
                          <td>{moment(o.date).format("MMM DD, YYYY")}</td>
                          <td>
                            <Link to={`/vendor/orders/${o.oid}/`} className="btn btn-primary mb-1">
                              <i className="fas fa-eye"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
