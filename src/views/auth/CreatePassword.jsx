import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import apiInstance from '../../utils/axios'

function CreatePassword() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const otp = searchParams.get("otp")
    const uidb64 = searchParams.get("uidb64")
    const [isLoading, setIsLoading] = useState(false)

    const handlePasswordSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match")
            setIsLoading(false)
        } else {
            const formData = {
                password,
                uidb64,
                otp
            }

            try {
                await apiInstance.post(`user/password-change/`, formData)
                alert("Password Changed Successfully")
                navigate("/login")
                setIsLoading(false)
            } catch (error) {
                alert("An error occurred while trying to change the password")
                setIsLoading(false)
            }
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
                                        <h3 className="text-center">Create New Password</h3>
                                        <br />

                                        <div className="tab-content">
                                            <div
                                                className="tab-pane fade show active"
                                                id="pills-login"
                                                role="tabpanel"
                                                aria-labelledby="tab-login"
                                            >
                                                <form onSubmit={handlePasswordSubmit}>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="password">
                                                            Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            value={password}
                                                            className="form-control"
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="confirm-password">
                                                            Confirm Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            name="confirm-password"
                                                            value={confirmPassword}
                                                            className="form-control"
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            required
                                                        />
                                                    </div>

                                                    <button className='btn btn-primary btn-rounded w-100 mb-4' type="submit" disabled={isLoading}>
                                                        {isLoading ? 'Processing...' : 'Save Password'}
                                                        <i className="fas fa-check-circle" />
                                                    </button>

                                                    <div className="text-center">
                                                        <p>
                                                            Want to sign in? <Link to="/login">Login</Link>
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
    )
}

export default CreatePassword
