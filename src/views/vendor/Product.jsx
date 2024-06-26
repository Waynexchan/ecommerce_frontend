import {useState, useEffect, useCallback} from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast:true,
    position:"top",
    showConfirmButton:false,
    timer:1500,
    timerProgressBar:true
  })

  function Product() {
    const [products, setProducts] = useState([]);
    const userData = UserData();

    const fetchProducts = useCallback(async () => {
        if (userData?.vendor_id) {
            try {
                const res = await apiInstance.get(`vendor/products/${userData.vendor_id}/`);
                const productsData = res.data.results ? res.data.results : [];
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
        }
    }, [userData?.vendor_id]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDeleteProduct = useCallback(async (productPid) => {
        try {
            await apiInstance.delete(`vendor-delete-product/${UserData()?.vendor_id}/${productPid}/`);
            fetchProducts();
            Toast.fire({
                icon: 'success',
                title: 'Product Deleted'
            });
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }, [fetchProducts]);

    const handleFilterProduct = useCallback(async (param) => {
        try {
            const response = await apiInstance.get(`vendor-product-filter/${userData?.vendor_id}?filter=${param}`);
            const productsData = response.data.results ? response.data.results : [];
            setProducts(productsData);
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    }, [userData?.vendor_id]);

    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
            {/* Side Bar Here */}
            <Sidebar />
            <div className="col-md-9 col-lg-10 main mt-2">
                <div className="row mb-3 container">
                <h4>
                    <i className="bi bi-grid" /> All Products
                </h4>
                <div className="dropdown">
                    <button
                    className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    >
                    Filter <i className="fas fa-sliders" />
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li>
                            <button className="dropdown-item" onClick={() => handleFilterProduct('no-filter')}>
                                No Filter
                            </button>
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={() => handleFilterProduct('published')}>
                                Status: Published
                            </button>
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={() => handleFilterProduct('draft')}>
                                Status: In Draft
                            </button>
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={() => handleFilterProduct('in-review')}>
                                Status: In-review
                            </button>
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={() => handleFilterProduct('disabled')}>
                                Status: Disabled
                            </button>
                        </li>
    
                        <hr />
                        <li>
                            <button className="dropdown-item" onClick={() => handleFilterProduct('latest')}>
                                Date: Latest
                            </button>
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={() => handleFilterProduct('oldest')}>
                                Date: Oldest
                            </button>
                        </li>
                    </ul>
                </div>
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
                                <th scope="row"><img src={p.image} style={{width: "100px", height: "70px", objectFit:"cover", borderRadius:"10px"}} alt=''/></th>
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
            </div>
            </div>
        </div>
    )
}

export default Product
