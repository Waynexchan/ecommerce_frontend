import { useState, useEffect } from 'react';
import { login } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auths';
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    }, []);

    const resetForm = () => {
        setEmail("");
        setPassword("");
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await login(email, password);
            if (error) {
                alert(error);
            } else {
                navigate("/");
                resetForm();
            }
        } catch (err) {
            console.error(err);
            alert("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <section>
                <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
                    <div className="container">
                        <section className="">
                            <div className="row d-flex justify-content-center">
                                <div className="col-xl-5 col-md-8">
                                    <div className="card rounded-5">
                                        <div className="card-body p-4">
                                            <h3 className="text-center">Login</h3>
                                            <br />
                                            <div className="tab-content">
                                                <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                                                    <form onSubmit={handleLogin}>
                                                        <div className="form-outline mb-4">
                                                            <label className="form-label" htmlFor="loginEmail">
                                                                Email Address
                                                            </label>
                                                            <input
                                                                type="email"
                                                                id="loginEmail"
                                                                name="email"
                                                                value={email}
                                                                className="form-control"
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                required
                                                                autoComplete="email"
                                                            />
                                                        </div>
                                                        <div className="form-outline mb-4">
                                                            <label className="form-label" htmlFor="loginPassword">
                                                                Password
                                                            </label>
                                                            <input
                                                                type="password"
                                                                id="loginPassword"
                                                                name="password"
                                                                value={password}
                                                                className="form-control"
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                required
                                                                autoComplete="current-password"
                                                            />
                                                        </div>
                                                        <button className='btn btn-primary w-100' type="submit" disabled={isLoading}>
                                                            {isLoading ? (
                                                                <>
                                                                    <span className="mr-2 ">Processing...</span>
                                                                    <i className="fas fa-spinner fa-spin" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="mr-2">Sign In </span>
                                                                    <i className="fas fa-sign-in-alt" />
                                                                </>
                                                            )}
                                                        </button>
                                                        <div className="text-center">
                                                            <p className='mt-4'>
                                                                Not a member? <Link to="/register">Register</Link>
                                                            </p>
                                                            <p className='mt-0'>
                                                                <Link to="/forgot-password/" className='text-danger'>Forgot Password?</Link>
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
            </section>
        </>
    );
}

export default Login;
