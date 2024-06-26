import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function UpdateProduct() {
    const userData = UserData();
    const param = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        title: '',
        image: null,
        description: '',
        category: '',
        price: '',
        old_price: '',
        shipping_amount: '',
        stock_qty: '',
        vendor: userData?.vendor_id || null,
    });

    const [specifications, setSpecifications] = useState([{ title: '', content: '' }]);
    const [colors, setColors] = useState([{ name: '', color_code: '' }]);
    const [sizes, setSizes] = useState([{ name: '', price: '' }]);
    const [gallery, setGallery] = useState([{ image: '' }]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await apiInstance.get(`category/`);
            setCategory(res.data.results || []);
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await apiInstance.get(`vendor-product-update/${userData?.vendor_id}/${param.pid}/`);
            setProduct(res.data);
            setColors(res.data.color);
            setSizes(res.data.size);
            setSpecifications(res.data.specification);
            setGallery(res.data.gallery);
        };
        fetchProduct();
    }, [param.pid, userData?.vendor_id]);

    const handleAddMore = (setStateFunction) => {
        setStateFunction((prevState) => [...prevState, {}]);
    };

    const handleRemove = (index, setStateFunction) => {
        setStateFunction((prevState) => prevState.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, field, value, setStateFunction) => {
        setStateFunction((prevState) => {
            const newState = [...prevState];
            newState[index][field] = value;
            return newState;
        });
    };

    const handleImageChange = (index, event, setStateFunction) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setStateFunction((prevState) => {
                    const newState = [...prevState];
                    newState[index].image = { file, preview: reader.result };
                    return newState;
                });
            };

            reader.readAsDataURL(file);
        } else {
            setStateFunction((prevState) => {
                const newState = [...prevState];
                newState[index].image = null;
                newState[index].preview = null;
                return newState;
            });
        }
    };

    const handleProductInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'stock_qty' && value < 1) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Stock Quantity must be greater than or equal to 1',
            });
            setProduct({
                ...product,
                [name]: 1, // Reset to 1 if the input value is less than 1
            });
        } else {
            setProduct({
                ...product,
                [name]: ['price', 'old_price', 'shipping_amount', 'stock_qty'].includes(name) ? parseFloat(value) : value,
            });
        }
    };

    const handleProductFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setProduct({
                    ...product,
                    image: {
                        file: file,
                        preview: reader.result,
                    },
                });
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', product.title);
        formData.append('description', product.description);
        formData.append('category', product.category.id || product.category); // Ensure category is sent correctly
        formData.append('price', parseFloat(product.price));
        formData.append('old_price', parseFloat(product.old_price));
        formData.append('shipping_amount', parseFloat(product.shipping_amount));
        formData.append('stock_qty', parseInt(product.stock_qty, 10));

        if (product.image && product.image.file) {
            formData.append('image', product.image.file);
        }

        specifications.forEach((specification, index) => {
            formData.append(`specifications[${index}][title]`, specification.title);
            formData.append(`specifications[${index}][content]`, specification.content);
        });

        colors.forEach((color, index) => {
            formData.append(`colors[${index}][name]`, color.name);
            formData.append(`colors[${index}][color_code]`, color.color_code);
            if (color.image && color.image.file) {
                formData.append(`colors[${index}][image]`, color.image.file);
            }
        });

        sizes.forEach((size, index) => {
            formData.append(`sizes[${index}][name]`, size.name);
            const sizePrice = parseFloat(size.price);
            if (!isNaN(sizePrice)) {
                formData.append(`sizes[${index}][price]`, sizePrice);
            } else {
                console.warn(`Skipping size with invalid price: ${size.price}`);
            }
        });

        gallery.forEach((item, index) => {
            if (item.image && item.image.file) {
                formData.append(`gallery[${index}][image]`, item.image.file);
            }
        });

        try {
            const response = await apiInstance.patch(`vendor-product-update/${userData?.vendor_id}/${param.pid}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire({
                icon: 'success',
                title: "Product updated successfully",
                timer: 1500
            });

            navigate(`/vendor/products/`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                < Sidebar />
                <div className="col-md-9 col-lg-10 main mt-4">
                    <div className="container">
                        <form onSubmit={handleSubmit} className="main-body" encType="multipart/form-data">
                            <div className="tab-content" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Product Details</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <div className="row text-dark">
                                                        <div className="col-lg-6 mb-2">
                                                            <label htmlFor="productImage" className="mb-2">
                                                                Product Thumbnail
                                                            </label>
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                name="image"
                                                                id="productImage"
                                                                onChange={handleProductFileChange}
                                                            />
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <label htmlFor="productTitle" className="mb-2">
                                                                Title
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="title"
                                                                id="productTitle"
                                                                value={product.title || ''}
                                                                onChange={handleProductInputChange}
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                        <div className="col-lg-12 mb-2">
                                                            <label htmlFor="productDescription" className="mb-2">
                                                                Description
                                                            </label>
                                                            <textarea
                                                                className="form-control"
                                                                id="productDescription"
                                                                cols={30}
                                                                rows={10}
                                                                name="description"
                                                                value={product.description || ''}
                                                                onChange={handleProductInputChange}
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                        <div className="col-lg-12 mb-2">
                                                            <label htmlFor="productCategory" className="mb-2">
                                                                Category
                                                            </label>
                                                            <select
                                                                className="select form-control"
                                                                id="productCategory"
                                                                name="category"
                                                                value={product.category || ''}
                                                                onChange={handleProductInputChange}
                                                            >
                                                                <option value="">- Select -</option>
                                                                {Array.isArray(category) && category.map((c, index) => (
                                                                    <option key={index} value={c.id}>{c.title}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <label htmlFor="productPrice" className="mb-2">
                                                                Sale Price
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="price"
                                                                id="productPrice"
                                                                value={product.price || ''}
                                                                onChange={handleProductInputChange}
                                                                autoComplete="off"
                                                                min="1"
                                                            />
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <label htmlFor="productOldPrice" className="mb-2">
                                                                Regular Price
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="old_price"
                                                                id="productOldPrice"
                                                                value={product.old_price || ''}
                                                                onChange={handleProductInputChange}
                                                                autoComplete="off"
                                                                min="1"
                                                            />
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <label htmlFor="productShippingAmount" className="mb-2">
                                                                Shipping Amount
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="shipping_amount"
                                                                id="productShippingAmount"
                                                                value={product.shipping_amount || ''}
                                                                onChange={handleProductInputChange}
                                                                autoComplete="off"
                                                                min="0"
                                                            />
                                                        </div>
                                                        <div className="col-lg-6 mb-2">
                                                            <label htmlFor="productStockQty" className="mb-2">
                                                                Stock Qty
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="stock_qty"
                                                                id="productStockQty"
                                                                value={product.stock_qty || ''}
                                                                onChange={handleProductInputChange}
                                                                autoComplete="off"
                                                                min="0"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Product Image</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    {gallery.map((item, index) => (
                                                        <div className="row text-dark" key={index}>
                                                            <div className="col-lg-6 mb-2">
                                                                {item.image && (item.image.preview ? (
                                                                    <img src={item.image.preview} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 5 }} alt="" />
                                                                ) : (
                                                                    <img src={item.image} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 5 }} alt="" />
                                                                ))}
                                                                {!item.image && (
                                                                    <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 5 }} alt="" />
                                                                )}
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <label htmlFor={`galleryImage-${index}`} className="">
                                                                    Product Image
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    id={`galleryImage-${index}`}
                                                                    onChange={(e) => handleImageChange(index, e, setGallery)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-3 ">
                                                                <button onClick={() => handleRemove(index, setGallery)} className='btn btn-danger mt-4'>Remove</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {gallery.length < 1 &&
                                                        <h4>No Images Selected</h4>
                                                    }
                                                    <button onClick={() => handleAddMore(setGallery)} type='button' className="btn btn-primary mt-5">
                                                        <i className="fas fa-plus" /> Add Image
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Specifications</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    {specifications.map((specification, index) => (
                                                        <div className="row text-dark" key={index}>
                                                            <div className="col-lg-5 mb-2">
                                                                <label htmlFor={`specTitle-${index}`} className="">
                                                                    Title
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id={`specTitle-${index}`}
                                                                    value={specification.title || ''}
                                                                    onChange={(e) => handleInputChange(index, 'title', e.target.value, setSpecifications)}
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <label htmlFor={`specContent-${index}`} className="">
                                                                    Content
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id={`specContent-${index}`}
                                                                    value={specification.content || ''}
                                                                    onChange={(e) => handleInputChange(index, 'content', e.target.value, setSpecifications)}
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div className="col-lg-2 ">
                                                                <button onClick={() => handleRemove(index, setSpecifications)} className='btn btn-danger mt-4'>Remove</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {specifications.length < 1 &&
                                                        <h4>No specifications selected</h4>
                                                    }
                                                    <button onClick={() => handleAddMore(setSpecifications)} type='button' className="btn btn-primary mt-5">
                                                        <i className="fas fa-plus" /> Add Specifications
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="pills-size" role="tabpanel" aria-labelledby="pills-size-tab">
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Sizes</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    {sizes.map((s, index) => (
                                                        <div className="row text-dark" key={index}>
                                                            <div className="col-lg-3 mb-2">
                                                                <label htmlFor={`sizeName-${index}`} className="mb-2">
                                                                    Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name=""
                                                                    placeholder="XXL"
                                                                    id={`sizeName-${index}`}
                                                                    value={s.name || ''}
                                                                    onChange={(e) => handleInputChange(index, 'name', e.target.value, setSizes)}
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor={`sizePrice-${index}`} className="mb-2">
                                                                    Price
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="$20"
                                                                    className="form-control"
                                                                    name=""
                                                                    id={`sizePrice-${index}`}
                                                                    value={s.price || ''}
                                                                    onChange={(e) => handleInputChange(index, 'price', e.target.value, setSizes)}
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div className="col-lg-3 mt-2">
                                                                <button type='button' onClick={() => handleRemove(index, setSizes)} className='btn btn-danger mt-4'>Remove</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {sizes.length < 1 &&
                                                        <h4>No Size Added</h4>
                                                    }
                                                    <button type='button' onClick={() => handleAddMore(setSizes)} className="btn btn-primary mt-2">
                                                        <i className="fas fa-plus" /> Add More Sizes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="pills-color" role="tabpanel" aria-labelledby="pills-color-tab">
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Color</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    {colors.map((c, index) => (
                                                        <div className="row text-dark" key={index}>
                                                            <div className="col-lg-5">
                                                                <label htmlFor={`colorName-${index}`} className="">
                                                                    Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Green"
                                                                    id={`colorName-${index}`}
                                                                    onChange={(e) => handleInputChange(index, 'name', e.target.value, setColors)}
                                                                    value={c.name || ''}
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <label htmlFor={`colorCode-${index}`} className="">
                                                                    Code
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="#f4f7f6"
                                                                    className="form-control"
                                                                    id={`colorCode-${index}`}
                                                                    onChange={(e) => handleInputChange(index, 'color_code', e.target.value, setColors)}
                                                                    value={c.color_code || ''}
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                <button onClick={() => handleRemove(index, setColors)} className='btn btn-danger mt-4'>Remove</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {colors.length < 1 &&
                                                        <h4>No color selected</h4>
                                                    }
                                                    <button className="btn btn-primary mt-5" type='button' onClick={() => handleAddMore(setColors)}>
                                                        <i className="fas fa-plus" /> Add Color
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <ul className="nav nav-pills mb-3 d-flex justify-content-center mt-5" id="pills-tab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                                Basic Information
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                                                Gallery
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">
                                                Specifications
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-size-tab" data-bs-toggle="pill" data-bs-target="#pills-size" type="button" role="tab" aria-controls="pills-size" aria-selected="false">
                                                Size
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-color-tab" data-bs-toggle="pill" data-bs-target="#pills-color" type="button" role="tab" aria-controls="pills-color" aria-selected="false">
                                                Color
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="d-flex justify-content-center mb-5">
                                        <button className="btn btn-success w-50" type='submit'>
                                            Update Product <i className="fa fa-check-circle" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
