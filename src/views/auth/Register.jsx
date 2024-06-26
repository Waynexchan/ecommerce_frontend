import { useState, useEffect } from 'react';
import { register } from '../../utils/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auths';
import Swal from 'sweetalert2';
import axios from 'axios';

function Register() {
    const [form, setForm] = useState({
        fullname: '',
        email: '',
        phone: '',
        password: '',
        password2: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
          navigate('/');
        }
      }, [isLoggedIn, navigate]);

    const resetForm = () => {
        setForm({
            fullname: '',
            email: '',
            phone: '',
            password: '',
            password2: '',
        });
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const source = axios.CancelToken.source();

        try {
            const { error } = await register(form.fullname, form.email, form.phone, form.password, form.password2, source.token);
            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error,
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Account created successfully',
                });
                navigate('/');
                resetForm();
            }
        } catch (err) {
            if (!axios.isCancel(err)) {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Unexpected Error',
                    text: 'An unexpected error occurred.',
                });
            }
        } finally {
            setIsLoading(false);
        }

        return () => {
            source.cancel("Component unmounted and request canceled");
        };
    };

    return (
        <>
            <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
                <div className="container">
                    <section className="">
                        <div className="row d-flex justify-content-center">
                            <div className="col-xl-5 col-md-8">
                                <div className="card rounded-5">
                                    <div className="card-body p-4">
                                        <h3 className="text-center">Register Account</h3>
                                        <br />
                                        <div className="tab-content">
                                            <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                                                <form onSubmit={handleSubmit}>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="fullname">
                                                            Full Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="fullname"
                                                            name="fullname"
                                                            value={form.fullname}
                                                            placeholder="Full Name"
                                                            required
                                                            className="form-control"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="email">
                                                            Email
                                                        </label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            value={form.email}
                                                            placeholder="Email Address"
                                                            required
                                                            className="form-control"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="phone">
                                                            Mobile Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="phone"
                                                            name="phone"
                                                            value={form.phone}
                                                            placeholder="Mobile Number"
                                                            required
                                                            className="form-control"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="password">
                                                            Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="password"
                                                            name="password"
                                                            value={form.password}
                                                            placeholder="Password"
                                                            required
                                                            className="form-control"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="password2">
                                                            Confirm Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="password2"
                                                            name="password2"
                                                            value={form.password2}
                                                            placeholder="Confirm Password"
                                                            required
                                                            className="form-control"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <button className='btn btn-primary w-100' type="submit" disabled={isLoading}>
                                                        {isLoading ? (
                                                            <>
                                                                <span className="mr-2">Processing...</span>
                                                                <i className="fas fa-spinner fa-spin" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="mr-2">Sign Up</span>
                                                                <i className="fas fa-user-plus" />
                                                            </>
                                                        )}
                                                    </button>
                                                    <div className="text-center">
                                                        <p className='mt-4'>
                                                            Already have an account? <Link to="/login/">Login</Link>
                                                        </p>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

export default Register;
