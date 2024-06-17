import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiInstance from '../../utils/axios';

function CategoryProduct() {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        apiInstance.get(`products/category/${slug}/`)
            .then((response) => {
                
                setProducts(response.data);
            })
            .catch((error) => console.error('Error fetching products by category:', error));
    }, [slug]);

    return (
        <div>
            <h2>Products in {slug}</h2>
            <div className="row">
                {products.map((product, index) => (
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
                                    {/* Variation button and dropdown */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryProduct;
