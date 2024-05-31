import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const myaccount = () => {
  const [name, setName] = useState(' ')
  const [email, setEmail] = useState(' ')
  const [phone, setPhone] = useState(' ')
  const [pincode, setPincode] = useState(' ')
  const [address, setAddress] = useState(' ')
  const [user, setUser] = useState({ value: null })
  const [password, setPassword] = useState(' ')
  const [cpassword, setCpassword] = useState(' ')
  const [npassword, setNpassword] = useState(' ')
  const router = useRouter()
  useEffect(() => {
    const myuser = JSON.parse(localStorage.getItem('myuser'))
    if (!myuser) {
      router.push('/')
    }
    if (myuser && myuser.token) {
      setUser(myuser)
      setEmail(myuser.email)
      fetchData(myuser.token)
    }
  }, [])
  const fetchData = async (token) => {
    let data = { token: user.token }
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    let res = await a.JSON();
    setName(res.name)
    setAddress(res.address)
    setPincode(res.pincode)
    setPhone(res.phone)
  }
  const handleUserSubmit = async () => {
    let data = { token: user.token, address, name, phone, pincode }
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    let res = await a.JSON();
    if (res.success) {
      toast.success("Successfully Updated", {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Error Updating Passward", {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }
  const handlePasswordSubmit = async () => {
    let res;
    if (npassword == cpassword) {
      let data = { token: user.token, password, cpassword, npassword }
      let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatepassward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      })
      res = await a.JSON();
    }else{
      res={success:false}
    }
    if(res.success){
    toast.success("Successfully Updated Password", {
      position: "top-left",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }else{
    toast.error("Successfully Updated Password", {
      position: "top-left",
      autoClose:1000,
      hideProgressBar:false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  setPassword(' ')
  setNpassword(' ')
  setCpassword(' ')
  }
  const handleChange = async (e) => {
    if (e.target.name = 'name') {
      setName(e.target.value)
    }
    else if (e.target.name = 'phone') {
      setPhone(e.target.value)
    }
    else if (e.target.name = 'address') {
      setAddress(e.target.value)
    } else if (e.target.name = 'pincode') {
      setPincode(e.target.value)
    }
    else if (e.target.name = 'password') {
      setPassword(e.target.value)
    } else if (e.target.name = 'cpassword') {
      setCpassword(e.target.value)
    } else if (e.target.name = 'npassword') {
      setNpassword(e.target.value)
    }
  }
  return (
    <div className='container mx-auto my-9'>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1 className='text-3xl text-center font-bold'>Update your Account</h1> myAccount
      <h1 className='font-bold text-3xl my-8 text-center'>checkout</h1>
      <h2 className='font-bold text-xl'>1.Delivery Details</h2>
      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input onChange={handleChange} value={name} type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email(Can not be updated)</label>
            {user && user.token ? <input value={user.email} type="email" id="email" name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly /> : <input onChange={handleChange} value={email} type="email" id="email" name="email"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />}
          </div>
        </div>
      </div>
      <div className='px-2 w-full'>
        <div className="mb-4">
          <label HtmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
          <textarea onChange={handleChange} value={address} type="text" cols="30" rows="3" id="address" name="address" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"></textarea>
        </div>
      </div>
      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">10 Digit Phone Number</label>
            <input placeholder='Your 10 Digit Phone Number' onChange={handleChange} value={phone} type="phone" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input onChange={handleChange} value={pincode} type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>
      <button onClick={handleUserSubmit} className="m-2 disabled:bg-pink-300 flex mb-5 text-white bg-pink-500 border-0 py-2
          px-2 focus:outline-none hover:bg-pink-600 rounded text-md">Submit</button>
      <h2 className='font-bold text-xl'>2.Change Passward</h2>
      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="passward" className="leading-7 text-sm text-gray-600">Password</label>
            <input onChange={handleChange} value={password} type="passward" id="passward" name="passward" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="npassword" className="leading-7 text-sm text-gray-600">New Password</label>
            <input onChange={handleChange} value={npassword} type="npassword" id="npassword" name="npassword" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="cpassword" className="leading-7 text-sm text-gray-600">Confirm Password</label>
            <input onChange={handleChange} value={cpassword} type="password" id="cpassword" name="cpassword" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>
      <button onClick={handlePasswordSubmit} className="m-2 disabled:bg-pink-300 flex text-white bg-pink-500 border-0 py-2
          px-2 focus:outline-none hover:bg-pink-600 rounded text-md">Submit</button>
    </div>
  )
}

export default myaccount