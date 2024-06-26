import { useState, useEffect } from 'react';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import Sidebar from './Sidebar';
import swal from 'sweetalert2';
import axios from 'axios';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const userData = UserData();

  const fetchWishlist = async (source) => {
    try {
      if (userData?.user_id) {
        const res = await apiInstance.get(`customer/wishlist/${userData.user_id}/`, { cancelToken: source.token });
        const wishlistData = res.data.results ? res.data.results : [];
        setWishlist(wishlistData);
      } else {
        console.error('User data is not available.');
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error fetching wishlist:', error);
      }
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (userData?.user_id) {
      fetchWishlist(source);
    } else {
      console.error('User data is not available.');
    }

    return () => {
      source.cancel('Component unmounted and request canceled');
    };
  }, [userData?.user_id]);

  const addToWishlist = async (productId, userId) => {
    if (!userId) {
      console.error('User ID is not available.');
      return;
    }

    const existingItem = wishlist.find(item => item.product_id === productId);

    if (existingItem) {
      // DELETE request to remove item from wishlist
      try {
        const response = await apiInstance.delete(`customer/wishlist/${userId}/${existingItem.id}/`);
        setWishlist(prevWishlist => prevWishlist.filter(item => item.product_id !== productId)); // 手動更新狀態
        swal.fire({
          icon: 'success',
          title: response.data.message,
        });
      } catch (error) {
        console.log(error);
        swal.fire({
          icon: 'error',
          title: 'Error updating wishlist',
        });
      }
    } else {
      // POST request to add item to wishlist
      try {
        const formdata = { product_id: productId, user_id: userId };
        const response = await apiInstance.post(`customer/wishlist/${userId}/`, formdata);
        fetchWishlist(); 
        swal.fire({
          icon: 'success',
          title: response.data.message,
        });
      } catch (error) {
        console.log(error);
        swal.fire({
          icon: 'error',
          title: 'Error adding to wishlist',
        });
      }
    }
  };

  return (
    <main className="mt-5">
      <div className="container">
        <section className="">
          <div className="row">
            <Sidebar />
            <div className="col-lg-9 mt-1">
              <section className="">
                <main className="mb-5" style={{}}>
                  <div className="container">
                    <section className="">
                      <div className="row">
                        <h3 className="mb-3">
                          <i className="fas fa-heart text-danger" /> Wishlist
                        </h3>
                        {Array.isArray(wishlist) &&
                          wishlist.map((w, index) => (
                            <div className="col-lg-4 col-md-12 mb-4" key={index}>
                              <div className="card">
                                <div className="bg-image hover-zoom ripple" data-mdb-ripple-color="light">
                                  <img
                                    src={w.product_image}
                                    className="w-100"
                                    style={{ width: '100px', height: '300px', objectFit: 'cover' }}
                                    alt={w.product_title}
                                  />
                                  <a href="#!">
                                    <div className="mask">
                                      <div className="d-flex justify-content-start align-items-end h-100">
                                        <h5>
                                          <span className="badge badge-primary ms-2">New</span>
                                        </h5>
                                      </div>
                                    </div>
                                    <div className="hover-overlay">
                                      <div
                                        className="mask"
                                        style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}
                                      />
                                    </div>
                                  </a>
                                </div>
                                <div className="card-body">
                                  <a href="" className="text-reset">
                                    <h6 className="card-title mb-3 ">{w.product_category}</h6>
                                  </a>
                                  <a href="" className="text-reset">
                                    <p>{w.product_title}</p>
                                  </a>
                                  <h6 className="mb-3">${w.product_price}</h6>
                                  <button
                                    type="button"
                                    className="btn btn-danger px-3 me-1 mb-1"
                                    onClick={() => addToWishlist(w.product_id, userData?.user_id)}
                                  >
                                    <i className="fas fa-heart" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        {wishlist.length < 1 && <h6 className="container p-4">Your wishlist is Empty</h6>}
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
  );
}

export default Wishlist;
