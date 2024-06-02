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
    }, [isLoggedIn, navigate]);

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
        <div>
            <h2>Welcome Back</h2>
            <p>Login To Continue</p>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <br />
                <input
                    type="password"
                    name="password"
                    id="password"
                    className='form-control'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <br />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <hr />
                <Link to="/forgot-password">Forgot Password</Link>
            </form>
        </div>
    );
}

export default Login;
