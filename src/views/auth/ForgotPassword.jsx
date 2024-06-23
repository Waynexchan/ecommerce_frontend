import { useState } from 'react';
import apiInstance from '../../utils/axios';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await apiInstance.get(`user/password-reset/${email}`);
            alert("An Email Has been Sent to you.");
            setIsLoading(false);
        } catch (error) {
            alert("Email Does Not Exist");
            setIsLoading(false);
        }
    }

    return (
        <section>
            <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
                <div className="container">
                    <section className="">
                        <div className="row d-flex justify-content-center">
                            <div className="col-xl-5 col-md-8">
                                <div className="card rounded-5">
                                    <div className="card-body p-4">
                                        <h3 className="text-center">Forgot Password</h3>
                                        <br />
                                        <div className="tab-content">
                                            <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                                                <form onSubmit={handleSubmit}>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="loginName">Email Address</label>
                                                        <input
                                                            type="email"
                                                            id="loginName"
                                                            name="email"
                                                            value={email}
                                                            className="form-control"
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <button className='btn btn-primary btn-rounded w-100 mb-4' type="submit" disabled={isLoading}>
                                                        {isLoading ? 'Processing...' : 'Send Email'}
                                                        <i className="fas fa-paper-plane" />
                                                    </button>
                                                    <div className="text-center">
                                                        <p>Want to sign in? <Link to="/login">Login</Link></p>
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
    );
}

export default ForgotPassword;
