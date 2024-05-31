import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AiFillPlusCircle,
  AiFillMinusCircle
} from 'react-icons/ai';
import { BsFillBagCheckFill } from 'react-icons/bs';
import Head from 'next/head';
import Script from 'next/script';
import { ToastContainer, toast } from 'react-toastify';
const Checkout = ({ cart, clearCart, subTotal, addToCart, removeFromCart }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [address, setAddress] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [user, setUser] = useState({ value: null })
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    const myuser = JSON.parse(localStorage.getItem('myuser'))
    if (myuser && myuser.token) {
      setUser(myuser)
      setEmail(myuser.email)
      fetchData(myuser.token)
      getPincode(pincode)
    }
  }, [])
  useEffect(() => {
    if (name.length > 3 && email.length > 3 && phone.length > 3 && address.length > 3 && pincode.length > 3) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [name, email, phone, pincode, address])
  const fetchData = async (token) => {
    let data = { token: token }
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    let res = await a.json();
    setName(res.name)
    setAddress(res.address)
    setPincode(res.pincode)
    setPhone(res.phone)
    getPincode(res.pincode);
  }
  const getPincode = async (pin) => {
    let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`)
    let pinJson = await pins.json()
    if (Object.keys(pinJson).includes(pin)) {
      setCity(pinJson[pin][0])
      setState(pinJson[pin][1])
    } else {
      setCity('')
      setState('')
    }
  }
  const handleChange = async (e) => {
    if (e.target.name == 'name') {
      setName(e.target.value)
    }
    else if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
    else if (e.target.name == 'phone') {
      setPhone(e.target.value)
    }
    else if (e.target.name == 'address') {
      setAddress(e.target.value)
    } else if (e.target.name == 'pincode') {
      setPincode(e.target.value)
      if (e.target.value.length == 6) {
        getPincode(e.target.value)
      }
      else {
        setCity('')
        setState('')
      }
    }

  }
  const initiatePayment = async () => {
    let oid = Math.floor(Math.random() * Date.now());
    const data = { cart, subTotal, oid, email: email, name, address, pincode, phone }
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    let txnRes = await a.json();
    if (txnRes.success) {
      let txnToken = txnRes.txnToken
      var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
          "orderId": oid,
          "token": txnToken,
          "tokenType": "TXN_TOKEN",
          "amount": subTotal
        },
        "handler": {
          "notifyMerchant": function (eventName, data) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          }
        }
      };
      window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
        window.Paytm.CheckoutJS.invoke();
      }).catch(function onError(error) {
        console.log("error => ", error);
      });
    } else {
      if (txnRes.cartClear) {
        clearCart()
      }
      toast.error(txnRes.error, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }
  return (
    <div className='container px-2 sm:m-auto min-h-screen'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Head>
        <title>Checkout-Codeswear.com</title>
        <meta name="viewport" content='width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0' />
      </Head>
      <Script type='appplication/javascript' crossOrigin='anonymous' src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`} onLoad="onScriptLoad();" />
      <h1 className='font-bold text-3xl my-8 text-center'>checkout</h1>
      <h2 className='font-bold text-xl'>1.Delivery Details</h2>

      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input onChange={handleChange} value={name} type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder='Enter the name' />
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            {user && user.token ? <input value={user.email} type="email" id="email" name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly /> : <input onChange={handleChange} value={email} type="email" id="email" name="email"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />}

          </div>
        </div>
      </div>
      <div className='px-2 w-full'>
        <div className="mb-4">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
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
      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
            <input onChange={handleChange} value={state} type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="city" className="leading-7 text-sm text-gray-600">District</label>
            <input onChange={handleChange} value={city} type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>
      <h2 className='font-semibold text-xl'>2.Review Cart Items & Pays</h2>
      <div className='sideCart bg-pink-100 p-6 m-2'>
        <ol className='list-decimal font-semibold'>
          {Object.keys(cart).length == 0 && <div className='my-4 font-semibold'>
            Your cart is Empty</div>}
          {Object.keys(cart).map((k) => {
            return <li key={k}>
              <div className='item flex my-5'>
                <div className='font-semibold'>{cart[k].name}</div>
                <div className='font-semibold  flex item-center justify-center w-1/3'>
                  <AiFillMinusCircle onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer text-pink-500' /><span className='mx-2 text-sm'>
                    {cart[k].qty}</span><AiFillPlusCircle onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} /></div>
              </div>
            </li>
          })}
        </ol>
        <span className='font-bold'>SubTotal:{subTotal}</span>
      </div>
      <div className='mx-8'>
        <Link href={'/checkout'}>
          <button disabled={disabled} onClick={initiatePayment} className=" disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2
          px-2 focus:outline-none hover:bg-pink-600 rounded text-md"><BsFillBagCheckFill className="m-1" />Pay:{subTotal}</button>
        </Link>
      </div>
    </div>
  )
}
export default Checkout;
