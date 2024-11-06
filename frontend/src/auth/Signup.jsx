import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';

const Signup = () => {

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword:"",
    avatar: null
  });
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput({...input, [name]: value})
  }
  const fileHandler = (e) => {
    setInput({...input, avatar: e.target.files[0]})
  }
  
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("confirmPassword", input.confirmPassword);
    
    if (input.avatar) {
      formData.append("avatar", input.avatar);
    }

    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      if (response.status === 201) {
        console.log("SignUp successfully");
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <form onSubmit={submitHandler} className='flex flex-col bg-slate-800 p-5 my-10 rounded-xl gap-3'>
        <h1 className='text-2xl mx-auto font-semibold text-white'>SignUp</h1>
        <div className='flex flex-col text-white'>
          <label htmlFor="">Username: </label>
          <input type="text" onChange={changeHandler} required name="name" value={input.name} className='p-2 rounded-md text-slate-950' placeholder='enter your username' />
        </div>
        <div className='flex flex-col text-white'>
          <label htmlFor="">Email: </label>
          <input type="text" onChange={changeHandler} required name="email" value={input.email} className='p-2 rounded-md text-slate-950' placeholder='enter your valid email' />
        </div>
        <div className='flex flex-col text-white'>
          <label htmlFor="">Password: </label>
          <input type="password" onChange={changeHandler} required name="password" value={input.password} className='p-2 rounded-md text-slate-950' placeholder='enter a password' />
        </div>
        <div className='flex flex-col text-white'>
          <label htmlFor="">Confirm Password: </label>
          <input type="password" onChange={changeHandler} required name="confirmPassword" value={input.confirmPassword} className='p-2 rounded-md text-slate-950' placeholder='re-enter your password' />
        </div>
        <div className='flex flex-col text-white'>
          <label htmlFor="">Avatar: </label>
          <input onChange={fileHandler} type="file" name="avatar" className='border border-gray-500 cursor-pointer' accept='image/*' />
        </div>
        <div className='mx-auto my-4'>
          <button type='submit' className='bg-white text-slate-950 p-2 rounded-lg'>Signup</button>
        </div>
      </form>
    </div>
  )
}

export default Signup
