import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiInstance from '../../utils/axios';
import GetCurrentAddress from '../plugin/UserCountry';
import UserData from '../plugin/UserData';
import CartID from '../plugin/CartID';
import Swal from 'sweetalert2';
import { CartContext } from '../plugin/Context';

function StoreFooter() {

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiInstance.get('category/')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleCategoryClick = (slug) => {
    navigate(`/products/category/${slug}`);
  };

  return (
      <div>
        <footer className="bg-light text-center text-lg-start">
          {/* Grid container */}
          <div className="container-fluid p-4">
            <div className="row">
              <div className="col-md-6 mb-4 mb-md-0 d-flex justify-content-center justify-content-md-start align-items-center">
                <strong>Get connected with us on social networks</strong>
              </div>
              <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
                {/* Facebook */}
                <a
                  className="btn btn-primary btn-sm btn-floating me-2"
                  style={{ backgroundColor: "#3b5998" }}
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-facebook-f" />
                </a>
                {/* Twitter */}
                <a
                  className="btn text-white btn-sm btn-floating me-2"
                  style={{ backgroundColor: "#55acee" }}
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-twitter" />
                </a>
                {/* Pinterest */}
                <a
                  className="btn text-white btn-sm btn-floating me-2"
                  style={{ backgroundColor: "#c61118" }}
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-pinterest" />
                </a>
                {/* Youtube */}
                <a
                  className="btn text-white btn-sm btn-floating me-2"
                  style={{ backgroundColor: "#ed302f" }}
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-youtube" />
                </a>
                {/* Instagram */}
                <a
                  className="btn text-white btn-sm btn-floating me-2"
                  style={{ backgroundColor: "#ac2bac" }}
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-instagram" />
                </a>
              </div>
            </div>
            <hr className="my-3" />
            {/*Grid row*/}
            <div className="row">
              {/*Grid column*/}
              <div className="col-lg-4 mb-4 mb-lg-0">
                <p>
                  <strong>About us</strong>
                </p>
                <p>
                We specialize in sourcing and delivering exclusive, high-end products from the world’s most prestigious brands. 
                Our mission is to provide discerning clients with access to the latest collections and limited-edition items, 
                ensuring a seamless and personalized shopping experience.
                </p>
              </div>
              {/*Grid column*/}
              {/*Grid column*/}
              <div className="col-lg-3 mb-4 mb-lg-0">
                <p>
                  <strong>Useful links</strong>
                </p>
                <ul className="list-unstyled mb-0">
                  <li>
                    <Link to="/return-policy" className="text-dark">
                      Return policy
                    </Link>
                  </li>
                  
                
                </ul>
              </div>
              {/*Grid column*/}
              {/*Grid column*/}
              <div className="col-lg-3 mb-4 mb-lg-0">
                <p>
                  <strong>Products</strong>
                </p>
                <ul className="list-unstyled">
                  {categories.map((category, index) => (
                  <li key={index}>
                    <a onClick={() => handleCategoryClick(category.slug)} style={{ cursor: 'pointer' }} className="text-dark">
                      {category.title}
                    </a>
                  </li>
                  ))}
                </ul>
              </div>
              {/*Grid column*/}
              {/*Grid column*/}
              <div className="col-lg-2 mb-4 mb-lg-0">
                <p>
                  <strong>Support</strong>
                </p>
                <ul className="list-unstyled">
                  <li>
                    <Link to="/complaints" className="text-dark">
                      Complaints
                    </Link>
                  </li>
                  <li>
                    <Link to="/help-center" className="text-dark">
                      Help center
                    </Link>
                  </li>
                  <li>
                    <Link to="/payment" className="text-dark">
                      Payment Method
                    </Link>
                  </li>
                </ul>
              </div>
              {/*Grid column*/}
            </div>
            {/*Grid row*/}
          </div>
          {/* Grid container */}
          {/* Copyright */}
          <div
            className="text-center p-3"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          >
            © 2020 Copyright:
            <a className="text-dark" href="https://mdbootstrap.com/">
              MDBootstrap.com
            </a>
          </div>
          {/* Copyright */}
        </footer>

      </div>
  )
}

export default StoreFooter
