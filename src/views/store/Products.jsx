import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import apiInstance from '../../utils/axios';
import GetCurrentAddress from '../plugin/UserCountry';
import UserData from '../plugin/UserData';
import CartID from '../plugin/CartID';
import Swal from 'sweetalert2';
import { CartContext } from '../plugin/Context';

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [colorValue, setColorValue] = useState('No Color');
  const [sizeValue, setSizeValue] = useState('No Size');
  const [quantityValue, setQuantityValue] = useState(1);

  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});

  const [cartCount, setCartCount] = useContext(CartContext);

  const currentAddress = GetCurrentAddress();
  const userData = UserData();
  const cartId = CartID();

  const handleColorButtonClick = (event, productId, colorName) => {
    setColorValue(colorName);
    setSelectedColors((prevSelectedColors) => ({
      ...prevSelectedColors,
      [productId]: colorName,
    }));
  };

  const handleSizeButtonClick = (event, productId, sizeName) => {
    setSizeValue(sizeName);
    setSelectedSizes((prevSelectedSizes) => ({
      ...prevSelectedSizes,
      [productId]: sizeName,
    }));
  };

  const handleQuantityChange = (event, productId) => {
    setQuantityValue(event.target.value);
  };

  useEffect(() => {
    apiInstance.get('products/')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    apiInstance.get('category/')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleAddToCart = async (productId, price, shippingAmount) => {
    const formData = new FormData();

    formData.append('product_id', productId);
    formData.append('user_id', userData?.user_id);
    formData.append('qty', quantityValue);
    formData.append('price', price);
    formData.append('shipping_amount', shippingAmount);
    formData.append('country', currentAddress.country);
    formData.append('size', sizeValue);
    formData.append('color', colorValue);
    formData.append('cart_id', cartId);

    try {
      const response = await apiInstance.post('cart-view/', formData);
      console.log(response.data);

      const url = userData ? `cart-list/${cartId}/${userData?.user_id}` : `cart-list/${cartId}/`;
      const cartResponse = await apiInstance.get(url);
      setCartCount(cartResponse.data.length);

      Toast.fire({
        icon: 'success',
        title: response.data.message,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToWishlist = async (productId, userId) => {
    try {
      const formData = new FormData();
      formData.append('product_id', productId);
      formData.append('user_id', userId);

      const response = await apiInstance.post(`customer/wishlist/${userId}/`, formData);
      console.log(response.data);

      Swal.fire({
        icon: 'success',
        title: response.data.message,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <>
      <div>
        <main className="mt-5">
          <div className="container">
            <section className="text-center">
              <div className="row">
                {products?.map((product, index) => (
                  <div className="col-lg-4 col-md-12 mb-4" key={index}>
                    <div className="card">
                      <div className="bg-image hover-zoom ripple" data-mdb-ripple-color="light">
                        <Link to={`/detail/${product.slug}/`}>
                          <img
                            src={product.image}
                            className="w-100"
                            style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                            alt={product.title}
                          />
                        </Link>
                      </div>
                      <div className="card-body">
                        <Link to={`/detail/${product.slug}/`} className="text-reset">
                          <h5 className="card-title mb-3">{product.title}</h5>
                        </Link>
                        <a href="" className="text-reset">
                          <p>{product.category?.title}</p>
                        </a>
                        <div className="d-flex justify-content-center">
                          <h6 className="mb-3">${product.price}</h6>
                          <h6 className="mb-3 text-muted ms-2">
                            <strike>${product.old_price}</strike>
                          </h6>
                        </div>

                        <div className="btn-group">
                          <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id="dropdownMenuClickable"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="false"
                            aria-expanded="false"
                          >
                            Variation
                          </button>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuClickable">
                            <div className="d-flex flex-column">
                              <li className="p-1">
                                <b>Quantity</b>
                              </li>
                              <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                <li>
                                  <input
                                    className="form-control"
                                    onChange={(e) => handleQuantityChange(e, product.id)}
                                    type="number"
                                  />
                                </li>
                              </div>
                            </div>

                            {product.size?.length > 0 && (
                              <div className="d-flex flex-column">
                                <li className="p-1">
                                  <b>Size</b>: {selectedSizes[product.id] || 'No size'}
                                </li>
                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                  {product.size?.map((size, index) => (
                                    <li key={index}>
                                      <button
                                        onClick={(e) => handleSizeButtonClick(e, product.id, size.name)}
                                        className="btn btn-secondary btn-sm me-2 mb-1"
                                      >
                                        {size.name}
                                      </button>
                                    </li>
                                  ))}
                                </div>
                              </div>
                            )}

                            {product.color.length > 0 && (
                              <div className="d-flex flex-column mt-3">
                                <li className="p-1">
                                  <b>Color</b>: {selectedColors[product.id] || 'No Color'}
                                </li>
                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                  {product.color?.map((color, index) => (
                                    <li key={index}>
                                      <button
                                        className="btn btn-sm me-2 mb-1 p-3"
                                        style={{ backgroundColor: `${color.color_code}` }}
                                        onClick={(e) => handleColorButtonClick(e, product.id, color.name)}
                                      />
                                    </li>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="d-flex mt-3 p-1">
                              <button
                                type="button"
                                className="btn btn-primary me-1 mb-1"
                                onClick={() => handleAddToCart(product.id, product.price, product.shipping_amount)}
                              >
                                <i className="fas fa-shopping-cart" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger px-3 me-1 mb-1 ms-2"
                                onClick={() => addToWishlist(product.id, userData?.user_id)}
                              >
                                <i className="fas fa-heart" />
                              </button>
                            </div>
                          </ul>
                          <button
                            type="button"
                            className="btn btn-danger px-3 me-1 ms-2"
                            onClick={() => addToWishlist(product.id, userData?.user_id)}
                          >
                            <i className="fas fa-heart" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="row">
                  {categories.map((category, index) => (
                    <div className="col-lg-2" key={index}>
                      <img
                        src={category.image}
                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                        alt={category.title}
                      />
                      <h6>{category.title}</h6>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default Product;
