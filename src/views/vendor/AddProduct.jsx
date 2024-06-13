import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';

function AddProduct() {

    const userData = UserData()

    const [product, setProduct] =useState({
        title: '',
        image: null,
        description: '',
        category: '',
        price: '',
        old_price: '',
        shipping_amount: '',
        stock_qty: '',
        vendor: useState?.vendor_id,
    })

    const [specifications, setSpecifications] = useState([{title: '', content: ''}])
    const [colors, setColors] =useState([{name: '', color_code: ''}])
    const [sizes , setSizes] =useState([{name: '', price: ''}])
    const [gallery, setGallery] =useState([{image: ''}])
    const [category, setCategory] = useState([])
    

    const handleAddMore = (setStateFunction) => {
        setStateFunction((prevState) => [...prevState, {}])
    }

    const handleRemove = (index, setStateFunction) => {
        setStateFunction((prevState) => {
            const newState = [...prevState]
            newState.splice(index, 1)
            return newState
        })
    }

    const handleInputChange = (index, field, value, setStateFunction) =>{
        setStateFunction((prevState) => {
            const newState = [...prevState]
            newState[index][field] = value

            return newState
        })
    }

    const handleImageChange = (index, event, setStateFunction) => {
        const file = event.target.files[0]

        if (file) {
            const reader = new FileReader()

            reader.onloadend = () =>{
                setStateFunction((prevState) => {
                    const newState = [...prevState]
                    newState[index].image = {file, preview: reader.result}
                    return newState
                })
            }
            reader.readAsDataURL(file)
        }else{
            // Handle the case when no file is selected
            setStateFunction((prevState) => {
                const newState = [...prevState]
                newState[index].image = null
                newState[index].preview = null
                return newState
            })
        }
    }

    const handleProductInputChange = (event) => {
        setProduct({
            ...product,
            [event.target.name] : event.target.value
        })
        console.log(product)
    }

    const handleProductFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()

            reader.onloadend = () => {
                setProduct({
                    ...product,
                    image: {
                        file: event.target.files[0],
                        preview: reader.result
                    }
                })
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        apiInstance.get(`category/`).then((res) =>{
            setCategory(res.data)
        })
    },[])

    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                {/* Sidebar Here */}
                < Sidebar/>

                <div className="col-md-9 col-lg-10 main mt-4">
                <div className="container">
                    <div className="main-body">
                    <div className="tab-content" id="pills-tabContent">
                        <div
                        className="tab-pane fade show active"
                        id="pills-home"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab"
                        >
                        <div className="row gutters-sm shadow p-4 rounded">
                            <h4 className="mb-4">Product Details</h4>
                            <div className="col-md-12">
                            <div className="card mb-3">
                                <div className="card-body">
                                <form
                                    className="form-group"
                                    method="POST"
                                    noValidate=""
                                    encType="multipart/form-data"
                                >
                                    <div className="row text-dark">
                                    <div className="col-lg-6 mb-2">
                                        <label htmlFor="" className="mb-2">
                                        Product Thumbnail
                                        </label>
                                        <input
                                        type="file"
                                        className="form-control"
                                        name="image"
                                        onChange={handleProductFileChange}
                                        
                                        />
                                    </div>
                                    <div className="col-lg-6 mb-2 ">
                                        <label htmlFor="" className="mb-2">
                                        Title
                                        </label>
                                        <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={product.title || ''}
                                        onChange={handleProductInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-12 mb-2">
                                        <label htmlFor="" className="mb-2">
                                        Description
                                        </label>
                                        <textarea
                                        
                                        className="form-control"
                                        id=""
                                        cols={30}
                                        rows={10}
                                        defaultValue={""}
                                        name="description"
                                        value={product.description || ''}
                                        onChange={handleProductInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-12 mb-2">
                                        <label htmlFor="" className="mb-2">
                                        Category
                                        </label>
                                        <select
                                        
                                        className="select form-control"
                                        id=""
                                        name="category"
                                        value={product.category || ''}
                                        onChange={handleProductInputChange}
                                        >
                                        <option value="">- Select -</option>
                                        {category.map((c, index) => (
                                            <option key={index} value={c.id}>{c.title}</option>
                                        ))}
                                        
                                        </select>
                                    </div>
                                    
                                    <div className="col-lg-6 mb-2 ">
                                        <label htmlFor="" className="mb-2">
                                        Sale Price
                                        </label>
                                        <input
                                        type="text"
                                        className="form-control"
                                        name="price"
                                        value={product.price || ''}
                                        onChange={handleProductInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6 mb-2 ">
                                        <label htmlFor="" className="mb-2">
                                        Regular Price
                                        </label>
                                        <input
                                        type="text"
                                        className="form-control"
                                        name="old_price"
                                        value={product.old_price || ''}
                                        onChange={handleProductInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6 mb-2 ">
                                        <label htmlFor="" className="mb-2">
                                        Shipping Amount
                                        </label>
                                        <input
                                        type="text"
                                        className="form-control"
                                        name="shipping_amount"
                                        value={product.shipping_amount || ''}
                                        onChange={handleProductInputChange}
                                        />
                                    </div>
                                    <div className="col-lg-6 mb-2 ">
                                        <label htmlFor="" className="mb-2">
                                        Stock Qty
                                        </label>
                                        <input
                                        type="text"
                                        className="form-control"
                                        name="stock_qty"
                                        value={product.stock_qty || ''}
                                        onChange={handleProductInputChange}
                                        />
                                    </div>
                                    </div>
                                </form>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div
                        className="tab-pane fade"
                        id="pills-profile"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab"
                        >
                        <div className="row gutters-sm shadow p-4 rounded">
                            <h4 className="mb-4">Product Image</h4>
                            <div className="col-md-12">
                            <div className="card mb-3">
                                <div className="card-body">
                                    {gallery.map((item, index) => (
                                        <div className="row text-dark" key={index}>
                                        <div className="col-lg-6 mb-2">
                                            {item.image && (
                                                <img src={item.image.preview} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 5 }}  alt="" />                    
                                            )}

                                            {!item.image && (
                                                <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 5 }}  alt="" />                    

                                            )}
                                        </div>
                                        <div className="col-lg-3">
                                            <label htmlFor="" className="">
                                                Product Image
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) => handleImageChange(index, e, setGallery)}
                                            />                                   
                                        </div>
                                        <div className="col-lg-3 ">
                                            <button onClick={() => handleRemove(index, setGallery)} className='btn btn-danger mt-4'>Remove</button>                   
                                        </div>
                                    </div>
                                    ))}

                                    {gallery < 1 &&
                                        <h4>No Images Selected</h4>
                                    }
                                
                                
                                <button onClick={() => handleAddMore(setGallery)} className="btn btn-primary mt-5">
                                    <i className="fas fa-plus" /> Add Image
                                </button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div
                        className="tab-pane fade"
                        id="pills-contact"
                        role="tabpanel"
                        aria-labelledby="pills-contact-tab"
                        >
                        <div className="row gutters-sm shadow p-4 rounded">
                            <h4 className="mb-4">Specifications</h4>
                            <div className="col-md-12">
                            <div className="card mb-3">
                                <div className="card-body">
                                    {specifications.map((specification, index) => (
                                        <div className="row text-dark" key={index}>
                                            <div className="col-lg-5 mb-2">
                                                <label htmlFor="" className="">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    
                                                    value={specification.title || ''}
                                                    onChange={(e) => handleInputChange(index, 'title', e.target.value, setSpecifications)}
                                                />
                                            </div>
                                            <div className="col-lg-5 ">
                                                <label htmlFor="" className="">
                                                    Content
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    
                                                    value={specification.content || ''}                                          
                                                    onChange={(e) => handleInputChange(index, 'title', e.target.value, setSpecifications)}
                                                />
                                            </div>
                                            <div className="col-lg-2 ">
                                                <button onClick={() => handleRemove(index, setSpecifications)} className='btn btn-danger mt-4'>Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {specifications < 1 && 
                                        <h4>No specifications selected</h4>
                                    }
                                
                                    <button onClick={() => handleAddMore(setSpecifications)} className="btn btn-primary mt-5">
                                        <i className="fas fa-plus" /> Add Specifications
                                    </button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        
                        <div
                                        className="tab-pane fade"
                                        id="pills-size"
                                        role="tabpanel"
                                        aria-labelledby="pills-size-tab"
                                    >
                                        <div className="row gutters-sm shadow p-4 rounded">
                                            <h4 className="mb-4">Sizes</h4>
                                            <div className="col-md-12">
                                                <div className="card mb-3">
                                                    <div className="card-body">
                                                        {sizes.map((s, index) => (

                                                            <div className="row text-dark" key={ index}>
                                                                <div className="col-lg-3 mb-2">
                                                                    <label htmlFor="" className="mb-2">
                                                                        Size
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name=""
                                                                        placeholder="XXL"
                                                                        id=""
                                                                        value={s.name || ''}
                                                                        onChange={(e) => handleInputChange(index, 'name', e.target.value, setSizes)}

                                                                    />
                                                                </div>
                                                                <div className="col-lg-6 mb-2">
                                                                    <label htmlFor="" className="mb-2">
                                                                        Price
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        placeholder="$20"
                                                                        className="form-control"
                                                                        name=""
                                                                        id=""
                                                                        value={s.price || ''}
                                                                        onChange={(e) => handleInputChange(index, 'price', e.target.value, setSizes)}

                                                                    />
                                                                </div>
                                                                <div className="col-lg-3 mt-2">
                                                                    <button type='button' onClick={() => handleRemove(index, setSizes)} className='btn btn-danger mt-4'>Remove</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {sizes < 1 &&
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
                        <div
                        className="tab-pane fade"
                        id="pills-color"
                        role="tabpanel"
                        aria-labelledby="pills-color-tab"
                        >
                            <div className="row gutters-sm shadow p-4 rounded">
                                <h4 className="mb-4">Color</h4>
                                <div className="col-md-12">
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            {colors.map((c, index) =>(
                                                <div className="row text-dark" key={index}>
                                                    <div className="col-lg-5 ">
                                                        <label htmlFor="" className="">
                                                            {c.name}
                                                        </label>
                                                        <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Green"
                                                        onChange={(e) => handleInputChange(index, 'name', e.target.value, setColors)}
                                                        value={c.name || ''}
                                                        />
                                                    </div>
                                                    <div className="col-lg-5 ">
                                                        <label htmlFor="" className="">
                                                            {c.color_code}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="#f4f7f6"
                                                            className="form-control"
                                                            onChange={(e) => handleInputChange(index, 'color_code', e.target.value, setColors)}
                                                            value={c.color_code || ''}
                                                        />
                                                    </div>
                                                    <div className="col-lg-2 ">
                                                        <button onClick={() => handleRemove(index, setColors)} className='btn btn-danger mt-4'>Remove</button>                    
                                                                        
                                                    </div>
                                                </div>
                                            ))}

                                            {colors < 1 && 
                                                <h4>No color added</h4>
                                            }
                                            
                                            <button className="btn btn-primary mt-5" onClick={() => handleAddMore(setColors)}>
                                                <i className="fas fa-plus" /> Add Color
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                        <ul
                            className="nav nav-pills mb-3 d-flex justify-content-center mt-5"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                            <button
                                className="nav-link active"
                                id="pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home"
                                type="button"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected="true"
                            >
                                Basic Information
                            </button>
                            </li>
                            <li className="nav-item" role="presentation">
                            <button
                                className="nav-link"
                                id="pills-profile-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-profile"
                                type="button"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                            >
                                Gallery
                            </button>
                            </li>
                            <li className="nav-item" role="presentation">
                            <button
                                className="nav-link"
                                id="pills-contact-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-contact"
                                type="button"
                                role="tab"
                                aria-controls="pills-contact"
                                aria-selected="false"
                            >
                                Specifications
                            </button>
                            </li>
                            <li className="nav-item" role="presentation">
                            <button
                                className="nav-link"
                                id="pills-size-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-size"
                                type="button"
                                role="tab"
                                aria-controls="pills-size"
                                aria-selected="false"
                            >
                                Size
                            </button>
                            </li>
                            <li className="nav-item" role="presentation">
                            <button
                                className="nav-link"
                                id="pills-color-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-color"
                                type="button"
                                role="tab"
                                aria-controls="pills-color"
                                aria-selected="false"
                            >
                                Color
                            </button>
                            </li>
                        </ul>
                        <div className="d-flex justify-content-center mb-5">
                            <button className="btn btn-success w-50">
                            Create Product <i className="fa fa-check-circle" />{" "}
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>

    )
}

export default AddProduct
