import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react';
import {
  AiOutlineShoppingCart, AiFillCloseCircle, AiFillPlusCircle,
  AiFillMinusCircle
} from 'react-icons/ai';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';

const Navbar = ({ logout, user,cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  const [dropdown, setDropdown] = useState(false)
  const [sidebar, setSidebar] = useState()
  const router = useRouter()
  

  useEffect(() => {
    Object.keys(cart).length !== 0 && setSidebar(true)
    let exempted = ['/checkout', '/order', '/orders', '/myaccounts']
    if (exempted.includes(router.pathname)) {
      setSidebar(false)
    }
  }, [])

  const ref = useRef()
  const toggleCart = () => {
    setSidebar(!sidebar)
  }
  return (
    <>
      {!sidebar && <span onMouseOver={() => { setDropdown(true) }}
       onMouseLeave={() => { setDropdown(false) }} className='fixed right-9 top-4 z-30 cursor-pointer'>
        {dropdown && <div className='absolute right-5 bg-pink-300 top-5  rounded-md px-5 py-4 w-32 z-30'>
          <ul>
            <Link href={'/myaccount'}><li className='py-1 text-sm hover:text-gray-700'>My Account</li></Link>
            <Link href={'/orders'}><li className='py-1text-sm hover:text-gray-700'>My Orders</li></Link>
            <li onClick={logout} className='py-1 text-sm hover:text-gray-700'>Logout</li>
          </ul>
        </div>}

        {user&&<MdAccountCircle className="text-xl md:text-3xl mx-2" />}
      </span>}
      <div className={`flex flex-col md:flex-row md:justify-start justify-between items-center py-2 shadow-md sticky top-0 bg-white z-10 ${!sidebar && 'overflow-hidden'}`}>
        <div className="logo mr-auto md:mx-5">
          <Link href={'/'}><Image src="/logo.png" alt="" width={200} height={40} /></Link>
        </div>
        <div className="nav">
          <ul className='flex items-center space-x-4 font-bold md:text-md'>
            <Link href={'/tshirts'}><li className='hover:text-gray-600'>Tshirts</li></Link>
            <Link href={'/hoodies'}><li className='hover:text-gray-600'>Hoodies</li></Link>
            <Link href={'/stickers'}><li className='hover:text-gray-600'>Stickers</li></Link>
            <Link href={'/mugs'}><li className='hover:text-gray-600'>Mugs</li></Link>
          </ul>
        </div>
        <div onClick={toggleCart} className="cursor-pointer cart flex absolute right-0 top-2 mx-5">

          {!user&&<Link href={'/login'}><button className='bg-pink-600 px-2 py-1 rounded-md text-sm text-white mx-2'>
          Login</button></Link>}

          <AiOutlineShoppingCart className=" text-xl md:text-3xl" />
        </div>
        <div ref={ref} className={`w-72 h-[100vh] top-0 sideCart absolute  bg-pink-100 px-4 py-10 transition-all ${sidebar ? 'right-0' : '-right-96'}`}>
          <h2 className='font-bold text-xl text-center'>Shoping Cart</h2>
          <span onClick={toggleCart} className='absolute top-2 right-2 cursor-pointer text-2xl text-pink-500'><AiFillCloseCircle /></span>
          <ol className='list-decimal font-semibold'>
            {Object.keys(cart).length == 0 && <div className='my-4 font-semibold'>
              Your cart is Empty</div>}
            {Object.keys(cart).map((k) => {
              return <li key={k}>
                <div className='item flex my-5'>
                  <div className='w-2/3 font-semibold'>{cart[k].name}({cart[k].size}/{cart[k].variant})</div>
                  <div className='w-1/3 font-semibold  flex item-center justify-center '>
                    <AiFillMinusCircle onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer text-pink-500' />
                    <span className='mx-2 text-sm'>{cart[k].qty}</span>
                      <AiFillPlusCircle onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} />
                      </div>
                </div>
              </li>
            })}
          </ol>
        </div>
        <div className='font-bold my-2'>SubTotal:{subTotal}</div>
        <div className='flex'>
          <Link href={'/checkout'}>
            <button disabled={Object.keys(cart).length == 0} className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2
          px-2 focus:outline-none hover:bg-pink-600 rounded text-md"><BsFillBagCheckFill className="m-1" />Checkout</button>
          </Link>
          <button disabled={Object.keys(cart).length == 0} onClick={clearCart} className='disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2
        px-2 focus:outline-none hover:bg-pink-600 rounded text-md'>Clear Cart</button>
        </div>
      </div>
    </>
  )
}
export default Navbar