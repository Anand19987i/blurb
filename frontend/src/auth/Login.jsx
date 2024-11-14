import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { USER_API_END_POINT } from '@/utils/constant';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import store from '@/redux/store';
import { setLoading, setToken, setUser } from '@/redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
    });
    const { loading, user, token } = useSelector(store => store.auth);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            console.log('Login Response:', res.data); // Log the entire response

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                dispatch(setToken(res.data.token));  // Ensure token is in the response
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('auth_token', res.data.token);  // Store token in localStorage
                console.log("Token Stored:", res.data.token);  // Check if token is being saved
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setLoading(false));
        }
    };


    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    const handleGoogleSuccess = async (response) => {
        try {
            dispatch(setLoading(true));
            const { credential } = response;  // This is the Google token
            const res = await axios.post(`${USER_API_END_POINT}/google-login`, { token: credential }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                dispatch(setToken(res.data.token));
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('token', res.data.token);
                console.log("Token Stored:", res.data.token);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setLoading(false));
        }
    };




    const handleGoogleFailure = (error) => {
        console.error('Google Sign-In was unsuccessful', error);
    };

    return (
        <div className='flex flex-col lg:flex-row w-screen h-screen sm:flex-wrap md:flex bg-slate-950'>
            <div className="flex justify-center items-center flex-col w-full h-screen lg:w-1/4 md:basis-1/4 p-10 m-w-40 shadow-xl lg:border-none">
                <form onSubmit={handleSubmit}>
                    <h1 className='text-white text-2xl mb-4 font-bold'>Blurb</h1>
                    <h1 className='text-white text-4xl mb-4'>Login to your account</h1>
                    <span className='text-slate-300 font-semibold'>Don't have an account? <Link to='/register'><span className='text-white border-b-2'>Sign Up</span></Link></span>
                    <br />
                    <Label className="text-white mt-10">Email ID</Label>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        placeholder="Enter a valid email"
                        onChange={handleChange}
                        required
                        className="my-3"
                    />
                    <Label className="text-white">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        placeholder="Enter a password"
                        onChange={handleChange}
                        required
                        className="my-3"
                    />
                    <Button type="submit" variant="default" className="mt-4 p-5 bg-white mx-auto text-slate-900 hover:bg-gray-200">Login</Button>
                    <div className="flex items-center justify-center mt-10">
                        <hr className="flex-1 border-slate-300" />
                        <p className="text-slate-500 mx-4">Or Sign in with Google</p>
                        <hr className="flex-1 border-slate-300" />
                    </div>

                    <div className='mt-10 '>
                        <GoogleLogin
                            clientId="698779511388-tlb24vrlon8ihjtqtr6sv8gjk6pak82n.apps.googleusercontent.com"
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                        />
                    </div>
                </form>
            </div>
            <div className='w-0 h-screen lg:border border-slate-400 '></div>
            <div className="hidden md:flex flex-col items-start w-full lg:w-2/3 h-full p-10 lg:p-20 fade-in-up">
                <h2 className='text-white text-3xl mb-4 font-semibold'>Welcome to Blurb</h2>
                <p className='text-white text-base lg:text-lg'>
                    Blurb is a community-driven platform where you can ask questions, share knowledge, and connect with others.
                    Whether you're looking for insights on a specific topic or want to contribute your expertise, Blurb offers a variety of features tailored to your needs.
                </p>
                <p className='text-white text-base lg:text-lg mt-4'>
                    Join us today to explore a wealth of information and engage with a vibrant community!
                </p>
            </div>

        </div>
    );
};

export default Login;
