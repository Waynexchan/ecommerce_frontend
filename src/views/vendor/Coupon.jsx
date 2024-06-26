import { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

function Coupon() {
    const [stats, setStats] = useState({});
    const [coupons, setCoupons] = useState([]);
    const [createCoupons, setCreateCoupons] = useState({
        code: "",
        discount: "",
        active: true
    });

    const fetchCouponData = useCallback(async (source) => {
        try {
            const statsRes = await apiInstance.get(`vendor-coupon-stats/${UserData()?.vendor_id}/`, { cancelToken: source.token });
            setStats(statsRes.data[0]);

            const couponsRes = await apiInstance.get(`vendor-coupon-list/${UserData()?.vendor_id}/`, { cancelToken: source.token });
            setCoupons(couponsRes.data.results || []);
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching coupon data:', error);
            }
        }
    }, []);

    useEffect(() => {
        const source = axios.CancelToken.source();
        fetchCouponData(source);

        return () => {
            source.cancel('Component unmounted and request canceled');
        };
    }, [fetchCouponData]);

    const handleDeleteCoupon = useCallback(async (couponId) => {
        try {
            await apiInstance.delete(`vendor-coupon-detail/${UserData()?.vendor_id}/${couponId}/`);
            const source = axios.CancelToken.source();
            fetchCouponData(source);
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    }, [fetchCouponData]);

    const handleCreateCouponChange = useCallback((event) => {
        setCreateCoupons({
            ...createCoupons,
            [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
        });
    }, [createCoupons]);

    const handleCreateCoupon = useCallback(async (e) => {
        e.preventDefault();
    
        const formdata = new FormData();
        formdata.append('vendor_id', UserData()?.vendor_id);
        formdata.append('code', createCoupons.code);
        formdata.append('discount', createCoupons.discount);
        formdata.append('active', createCoupons.active);
    
        await apiInstance.post(`vendor-coupon-create/${UserData()?.vendor_id}/`, formdata).then((res) => {
            console.log(res.data);
        });
        const source = axios.CancelToken.source();
        fetchCouponData(source);
    
        Swal.fire({
            icon: 'success',
            title: "Coupon Created"
        });
    }, [createCoupons, fetchCouponData]);

    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                <Sidebar />
                <div className="col-md-9 col-lg-10 main mt-4">
                    <div className="row mb-3">
                        <div className="col-xl-6 col-lg-6 mb-2">
                            <div className="card card-inverse card-success">
                                <div className="card-block bg-success p-3">
                                    <div className="rotate">
                                        <i className="bi bi-tag fa-5x"></i>
                                    </div>
                                    <h6 className="text-uppercase">Total Coupons</h6>
                                    <h1 className="display-1">{stats.total_coupons}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 mb-2">
                            <div className="card card-inverse card-danger">
                                <div className="card-block bg-danger p-3">
                                    <div className="rotate">
                                        <i className="bi bi-check-circle fa-5x"></i>
                                    </div>
                                    <h6 className="text-uppercase">Active Coupons</h6>
                                    <h1 className="display-1">{stats.active_coupons}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row container">
                        <div className="col-lg-12">
                            <h4 className="mt-3 mb-4">
                                <i className="bi bi-tag"> Coupons</i>
                            </h4>
                            <table className="table">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">Code</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Discount</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.length > 0 ? (
                                        coupons.map((c, index) => (
                                            <tr key={index}>
                                                <td>{c.code}</td>
                                                <td>Percentage</td>
                                                <td>{c.discount}</td>
                                                <td>{c.active ? 'Active' : 'In-Active'}</td>
                                                <td>
                                                    <Link to={`/vendor/coupon/${c.id}/`} className="btn btn-primary mb-1 ms-2">
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button onClick={() => handleDeleteCoupon(c.id)} className="btn btn-danger mb-1 ms-2">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">
                                                <h5 className="mt-4 p-3">No coupons yet</h5>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i className='fas fa-plus'></i>Create Coupon
                            </button>
                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={handleCreateCoupon}>
                                                <div className="mb-3">
                                                    <label htmlFor="code" className="form-label">Code</label>
                                                    <input type="text" className="form-control" id="code" name='code' onChange={handleCreateCouponChange} value={createCoupons.code} placeholder='Enter Coupon Code' />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="discount" className="form-label">Discount</label>
                                                    <input type="text" className="form-control" id="discount" name='discount' onChange={handleCreateCouponChange} value={createCoupons.discount} placeholder='Enter Coupon discount' />
                                                </div>
                                                <div className="mb-3 form-check">
                                                    <input checked={createCoupons.active} onChange={handleCreateCouponChange} name='active' type="checkbox" className="form-check-input" id="exampleCheck1" />
                                                    <label className="form-check-label" htmlFor="exampleCheck1">
                                                        Activate Coupon
                                                    </label>
                                                </div>
                                                <button type="submit" className="btn btn-primary">Create Coupon</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Coupon;
