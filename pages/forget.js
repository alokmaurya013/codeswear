import { React, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
const Forgot = () => {
  const [email, setEmail] = useState(' ')
  const [password, setPassword] = useState(' ')
  const [cpassword, setCpassword] = useState(' ')

  const router = useRouter()
  const handleChange = async (e) => {
    if (e.target.name == 'password') {
      setPassword(e.target.value)
    }
    if (e.target.name == 'cpassword') {
      setCpassword(e.target.value)
    }
    if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
  }
  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/')
    }
  }, [])
  const sendResetEmail = async () => {
    let data = {
      email,
      sendMail: true
    }
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let res = await a.json()
    if (res.successs) {
      console.log("Password reset instruction have been sent to your email")
    } else {
      console.log("error")
    }
  }
  const resetPassword = async () => {
    if (password == cpassword) {
      let data = {
        password,
        sendMail: false
      }
      let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let res = await a.json()
      if (res.successs) {
        console.log("Password has been changed")
      } else {
        console.log("error")
      }
    }
  }
  return (
    <div className="flex min-h-screen items-start justify-center pt-28 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="/codeswearcircle.png" alt="Your Company" />
          <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-gray-900"> Forgot Password </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or
            <Link href={'/login'} className="font-medium text-pink-600 hover:text-pink-500">Login</Link>
          </p>
        </div>
        {router.query.token &&
          <div>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label for="password" className="sr-only">New Password</label>
                <input value={password} onChange={handleChange} id="password" name="password" type="password" autocomplete="password" required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm" placeholder="New Password" />
              </div>
              <div>
                <label for="cpassword" className="sr-only">Confirm Password</label>
                <input value={cpassword} onChange={handleChange} id="cpassword" name="cpassword" type="password" autocomplete="password" required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm" placeholder="Confirm Password" />
              </div>
            </div>
            <div>
              <button onClick={resetPassword} type="submit" className="my-4 group relative flex w-full justify-center rounded-md border border-transparent bg-pink-600 py-2 px-4 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-pink-500 group-hover:text-pink-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                  </svg>
                </span>
                Continue
              </button>
            </div>
            {password != cpassword &&
              <span className="text-red-600">Passward do not match</span>}
            {password && password == cpassword &&
              <span className="text-green-400">Passward match</span>}

          </div>
        }
        {!router.query.token &&
        <div>
        <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label for="email-address" className="sr-only">Email address</label>
              <input value={email} onChange={handleChange} id="email-address" name="email" type="email" autocomplete="email" required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm" placeholder="Email address" />
            </div>
          </div>
          <div>
            <button onClick={sendResetEmail} type="submit" className="my-4 group relative flex w-full justify-center rounded-md border border-transparent bg-pink-600 py-2 px-4 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-pink-500 group-hover:text-pink-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                </svg>
              </span>
              Continue
            </button>
          </div>
          </div>}
      </div>
    </div>
  )
}
export default Forgot;