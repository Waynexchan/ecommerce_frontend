import { useState, useEffect, useContext, useRef , useCallback} from 'react';
import { useParams } from 'react-router-dom';
import apiInstance from '../../utils/axios';
import GetCurrentAddress from '../plugin/UserCountry';
import UserData from '../plugin/UserData';
import CartID from '../plugin/CartID';
import moment from 'moment';
import Swal from 'sweetalert2';
import { CartContext } from '../plugin/Context';

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

function ProductDetail() {
    const [product, setProduct] = useState({});
    const [error, setError] = useState(null);
    const [specifications, setSpecifications] = useState([]);
    const [vendor, setVendor] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [color, setColor] = useState([]);
    const [size, setSize] = useState([]);
    const [colorValue, setColorValue] = useState("No Color");
    const [sizeValue, setSizeValue] = useState("No Size");
    const [qtyValue, setQtyValue] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [createReview, setCreateReview] = useState({
        user_id: 0, product_id: product?.id, review: "", rating: 0
    });
    const [cartCount, setCartCount] = useContext(CartContext);
    const param = useParams();
    const currentAddress = GetCurrentAddress();
    const userData = UserData();
    const cart_id = CartID();
    const reviewsRef = useRef(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await apiInstance.get(`products/${param.slug}/`);
                setProduct(res.data);
                setSpecifications(res.data.specification);
                setGallery(res.data.gallery);
                setSize(res.data.size);
                setColor(res.data.color);
                setVendor(res.data.vendor);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Failed to load product details');
            }
        };
        fetchProductDetails();
    }, [param.slug]);
    
    const fetchReviewData = useCallback(async () => {
        if (product.id) {
            try {
                const res = await apiInstance.get(`reviews/${product.id}/`);
                setReviews(Array.isArray(res.data.results) ? res.data.results : []);
            } catch (error) {
                console.error("Error fetching review data:", error);
            }
        }
    }, [product.id]);

    useEffect(() => {
        fetchReviewData();
    }, [fetchReviewData]);

    const handleReviewChange = (event) => {
        setCreateReview({
            ...createReview,
            [event.target.name]: event.target.value
        });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
    
        if (!userData) {
            Swal.fire({
                icon: 'warning',
                title: 'You need to login',
                text: 'Please login to submit a review.',
            });
            return; 
        }
    
        const formdata = new FormData();
        formdata.append("user_id", userData.user_id);
        formdata.append("product_id", createReview.product_id);
        formdata.append("rating", createReview.rating);
        formdata.append("review", createReview.review);
    
        try {
            const res = await apiInstance.post(`reviews/${createReview.product_id}/`, formdata);
            console.log(res.data);
            fetchReviewData();
        } catch (err) {
            console.error('Error submitting review:', err);
        }
    };

    const handleColorButtonClick = (event) => {
        const colorNameInput = event.target.closest('.color_button').parentNode.querySelector('.color_name');
        setColorValue(colorNameInput.value);
    };

    const handleSizeButtonClick = (event) => {
        const sizeNameInput = event.target.closest('.size_button').parentNode.querySelector('.size_name');
        setSizeValue(sizeNameInput.value);
    };

    const handleQuantityChange = (event) => {
        setQtyValue(event.target.value);
    }

    const handleAddToCart = async () => {
        try {
            const formdata = new FormData();
            formdata.append("product_id", product.id);
            formdata.append('user_id', userData?.user_id || "0");
            formdata.append("qty", qtyValue);
            formdata.append("price", product.price);
            formdata.append("shipping_amount", product.shipping_amount);
            formdata.append("country", currentAddress.country);
            formdata.append("size", sizeValue);
            formdata.append("color", colorValue);
            formdata.append("cart_id", cart_id);

            const response = await apiInstance.post(`cart-view/`, formdata);
            console.log(response.data);

            const url = userData ? `cart-list/${cart_id}/${userData?.user_id}` : `cart-list/${cart_id}/`;
            const cartResponse = await apiInstance.get(url);
            setCartCount(cartResponse.data.length);

            Toast.fire({
                icon: 'success',
                title: response.data.message,
            });
        } catch (error) {
            console.log(error);
        }
    }

    const addToWishlist = async () => {
        try {
            const formData = new FormData();
            formData.append('product_id', product.id);
            formData.append('user_id', userData?.user_id);

            const response = await apiInstance.post(`customer/wishlist/${userData?.user_id}/`, formData);
            console.log(response.data);

            Swal.fire({
                icon: 'success',
                title: response.data.message,
            });
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

    if (error) {
        return <div>{error}</div>;
    }

    if (!product.title) {
        return <div>Loading...</div>;
    }

    const handleScrollToReviews = (event) => {
        event.preventDefault();
        if (reviewsRef.current) {
            reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main className="mb-4 mt-4">
            <div className="container">
                <section className="mb-9">
                    <div className="row gx-lg-5">
                        <div className="col-md-6 mb-4 mb-md-0">
                            <div className="">
                                <div className="row gx-2 gx-lg-3">
                                    <div className="col-12 col-lg-12">
                                        <div className="lightbox">
                                            <img
                                                src={product.image}
                                                style={{
                                                    width: "100%",
                                                    height: 500,
                                                    objectFit: "cover",
                                                    borderRadius: 10
                                                }}
                                                alt="Gallery image 1"
                                                className="ecommerce-gallery-main-img active w-100 rounded-4"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 d-flex">
                                    {gallery.map((g, index) => (
                                        <div className="p-3" key={index}>
                                            <img
                                                src={g.image}
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 10
                                                }}
                                                alt="Gallery image 1"
                                                className="ecommerce-gallery-main-img active w-100 rounded-4"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-4 mb-md-0">
                            <div>
                                <h1 className="fw-bold mb-3">{product.title}</h1>
                                <div className="d-flex text-primary justify-content-center align-items-center">
                                    <ul className="mb-3 d-flex p-0" style={{ listStyle: "none" }}>
                                        <li>
                                            {[...Array(5)].map((star, index) => (
                                                <i
                                                    key={index}
                                                    className={`fas fa-star fa-sm ${index < averageRating ? 'text-warning' : 'text-muted'} ps-0`}
                                                    title={index < averageRating ? "Good" : "Bad"}
                                                />
                                            ))}
                                        </li>
                                        <li style={{ marginLeft: 10, fontSize: 13 }}>
                                            <a href="#pills-contact" className="text-decoration-none" onClick={handleScrollToReviews}>
                                                <strong className="me-2">{averageRating}/5</strong>({reviews.length} reviews)
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <h5 className="mb-3">
                                    <s className="text-muted me-2 small align-middle">${product.old_price}</s>
                                    <span className="align-middle">${product.price}</span>
                                </h5>
                                <p className="text-muted">{product.description}</p>
                                <div className="table-responsive">
                                    <table className="table table-sm table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <th className="ps-0 w-25" scope="row"><strong>Category</strong></th>
                                                <td>{product.category?.title}</td>
                                            </tr>
                                            {specifications.map((s, index) => (
                                                <tr key={index}>
                                                    <th className="ps-0 w-25" scope="row"><strong>{s.title}</strong></th>
                                                    <td>{s.content}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <hr className="my-5" />
                                <form>
                                    <div className="row flex-column">
                                        <div className="col-md-6 mb-4">
                                            <div className="form-outline">
                                                <label className="form-label" htmlFor="quantity"><b>Quantity</b></label>
                                                <input
                                                    type="number"
                                                    id="quantity"
                                                    className="form-control quantity"
                                                    min={1}
                                                    value={qtyValue}
                                                    onChange={handleQuantityChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <div className="form-outline">
                                                <label className="form-label" htmlFor="sizeSelection"><b>Size:</b> <span>{sizeValue}</span></label>
                                            </div>
                                            <div className="d-flex">
                                                {size?.map((s, index) => (
                                                    <div key={index}>
                                                        <input type="hidden" className="size_name" id={`size_${index}`} value={s.name} />
                                                        <button
                                                            className="btn btn-secondary m-1 size_button"
                                                            type="button"
                                                            onClick={handleSizeButtonClick}
                                                        >{s.name}</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <div className="form-outline">
                                                <label className="form-label" htmlFor="colorSelection"><b>Color:</b> <span>{colorValue}</span></label>
                                            </div>
                                            <div className="d-flex">
                                                {color?.map((c, index) => (
                                                    <div key={index}>
                                                        <input
                                                            type="hidden"
                                                            className="color_name"
                                                            id={`color_${index}`}
                                                            value={c.name}
                                                            readOnly
                                                        />
                                                        <button
                                                            className="btn p-3 m-1 color_button"
                                                            type="button"
                                                            style={{ background: `${c.color_code}` }}
                                                            onClick={handleColorButtonClick}
                                                        ></button>
                                                    </div>
                                                ))}
                                            </div>
                                            <hr />
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-primary btn-block me-2"
                                        onClick={handleAddToCart}
                                    >
                                        <i className="fas fa-cart-plus me-2" /> Add to cart
                                    </button>
                                    <button type="button" className="btn btn-danger btn-floating" data-mdb-toggle="tooltip" title="Add to wishlist" onClick={addToWishlist}>
                                        <i className="fas fa-heart" />
                                    </button>
                                </form>

                            </div>
                        </div>
                    </div>
                </section>
                <hr />
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Specifications</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Vendor</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Review</button>
                    </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                        <div className="table-responsive">
                            <table className="table table-sm table-borderless mb-0">
                                <tbody>
                                    {specifications?.map((s, index) => (
                                        <tr key={index}>
                                            <th className="ps-0 w-25" scope="row"><strong>{s.title}</strong></th>
                                            <td>{s.content}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                        <div className="card mb-3" style={{ maxWidth: 400 }}>
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img
                                        src={vendor?.image}
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            objectFit: "cover"
                                        }}
                                        alt="User Image"
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{vendor?.name}</h5>
                                        <p className="card-text">{vendor?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabIndex={0} ref={reviewsRef}>
                        <div className="container mt-5">
                            <div className="row">
                                <div className="col-md-6">
                                    <h2>Create a New Review</h2>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="rating" className="form-label">Rating</label>
                                            <select name="rating" onChange={handleReviewChange} className="form-select" id="rating">
                                                <option value="1">1 Star</option>
                                                <option value="2">2 Star</option>
                                                <option value="3">3 Star</option>
                                                <option value="4">4 Star</option>
                                                <option value="5">5 Star</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="reviewText" className="form-label">Review</label>
                                            <textarea
                                                className="form-control"
                                                id="reviewText"
                                                rows={4}
                                                name='review'
                                                placeholder="Write your review"
                                                value={createReview.review}
                                                onChange={handleReviewChange}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Submit Review</button>
                                    </form>
    
                                </div>
                                <div className="col-md-6">
                                    <h2>Existing Reviews</h2>
                                    <div className=" mb-3">
                                        {reviews?.map((r, index) => (
                                            <div className="row border p-2 g-0" key={index}>
                                                <div className="col-md-3">
                                                    <img
                                                        src={r.profile.image}
                                                        alt="User Image"
                                                        className="img-fluid"
                                                    />
                                                </div>
                                                <div className="col-md-9">
                                                    <div className="card-body">
                                                        <h5 className="card-title">{r.profile.full_name}</h5>
                                                        <p className="card-text">{moment(r.date).format("MMM D, YYYY ")}</p>
                                                        <p className="card-text">
                                                            {r.review} <br />
                                                            {[...Array(5)].map((star, idx) => (
                                                                <i
                                                                    key={idx}
                                                                    className={`fas fa-star ${idx < r.rating ? 'text-warning' : 'text-muted'}`}
                                                                />
                                                            ))}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
    
    
}

export default ProductDetail;
