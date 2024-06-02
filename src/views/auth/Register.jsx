import {useState, useEffect} from 'react'
import { register } from '../../utils/auth'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auths'

function Register() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    }, []);

    const resetForm = () => {
        setFullname('');
        setEmail('');
        setPhone('');
        setPassword('');
        setPassword2('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set isLoading to true when the form is submitted
        setIsLoading(true);

        const { error } = await register(fullname, email, phone, password, password2);
        if (error) {
            alert(JSON.stringify(error));
        } else {
            navigate('/');
            resetForm();
        }

        // Reset isLoading to false when the operation is complete
        setIsLoading(false);
    };

    return (
        <>
            <div>
            Register
            </div>
            <form onSubmit={handleSubmit}>
                <input 
                    type='text'
                    placeholder='Full Name'
                    name=''
                    id=''
                    onChange={(e) =>setFullname(e.target.value)}
                />
                <br />
                <br />
                <input 
                    type='email'
                    placeholder='Email'
                    name=''
                    id=''
                    onChange={(e) =>setEmail(e.target.value)}
                />
                <br />
                <br />
                <input 
                    type='number'
                    placeholder='Mobile number'
                    name=''
                    id=''
                    onChange={(e) =>setPhone(e.target.value)}
                />
                <br />
                <br />
                <input 
                    type='password'
                    placeholder='Enter Password'
                    name=''
                    id=''
                    onChange={(e) =>setPassword(e.target.value)}
                />
                <br />  
                <br />  
                <input 
                    type='password'
                    placeholder='Confirm Password'
                    name=''
                    id=''
                    onChange={(e) =>setPassword2(e.target.value)}
                />
                <br /> 
                <br />
                <button type='sumit'>Register</button>
            </form>
        </>
    )
}

export default Register
