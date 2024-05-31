import Navbar from '../components/Navbar'
import '../styles/globals.css'
import Footer from '../components/Footer'

import { useEffect,useState } from 'react'
import { useRouter } from 'next/router'
import LoadingBar from 'react-top-loading-bar'

export default function App({ Component, pageProps }){
  const [cart,setCart]=useState({})
  const [subTotal,setSubTotal]=useState(0)
  const [user,setUser]=useState({value:null})
  const [key,setKey]=useState(0)
  const [progress,setProgress]=useState(0)
  const router=useRouter();

  useEffect(()=>{
    router.events.on('routeChangeStart',()=>{
      setProgress(40)
    })
    router.events.on('routeChangeComplete',()=>{
      setProgress(100)
    })
    try{
      if(localStorage.getItem("cart")){
        setCart(JSON.parse(localStorage.getItem("cart")))
        saveCart(JSON.parse(localStorage.getItem("cart")))
      }
    }catch(error){
        localStorage.clear()
    }
    const token=localStorage.getItem('token');
    if(token){
      setUser({value:token});
      setKey(Math.random());
    }
    },[router.query])

    const logout=()=>{
      localStorage.removeItem("myuser")
      setUser({value:null})
      setKey(Math.random())
      router.push('/')
    }

  const saveCart=(myCart)=>{
    localStorage.setItem("cart",JSON.stringify(myCart))
    let subT=0;
    let ke=Object.keys(myCart)
    for(let i=0;i<ke.length;i++){
        subT+=  myCart[ke[i]].price*myCart[ke[i]].qty;
    }
    setSubTotal(subT);
  }

  const addToCart=(itemCode,qty,price,name,size,variant)=>{
    if(Object.keys(cart).length==0){
      setKey(Math.random())
    }
      let newCart=cart;
      if(itemCode in cart){
        newCart[itemCode].qty=cart[itemCode].qty+qty
      }else{
         newCart[itemCode]={qty:1,price,name,size,variant}
      }
      setCart(newCart)
      saveCart(newCart)
  }

  const buyNow=(itemCode,qty,price,name,size,variant)=>{
    let newCart={}
    newCart[itemCode]={qty:1,price,name,size,variant}
    setCart(newCart)
    saveCart(newCart)
    router.push('/checkout')
  }

  const clearCart=()=>{
    setCart({})
    saveCart({})
  }

  const removeFromCart=(itemCode,qty,price,name,size,variant)=>{
    let newCart=JSON.parse(JSON.stringify(cart));
    if(itemCode in cart){
      newCart[itemCode].qty=cart[itemCode].qty-qty
    }
    if(newCart[itemCode]["qty"]<=0){
       delete newCart[itemCode]
    }
    setCart(newCart)
    saveCart(newCart)
}

  return <>
  <LoadingBar
  color='#ff2d55'
  progress={progress}
  waitingTime={400}
  onLoaderFinished={()=>setProgress(0)}
  />
  
  {<Navbar logout={logout} user={user} key={key} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal}/>}
  <Component  buyNow={buyNow} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} {...pageProps}/>
  <Footer cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal}/>
  </>
}
