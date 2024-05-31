import React, { useEffect,useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
const Orders = () => {
    const router = useRouter()
    const [orders,setOrders]=useState([]);
    useEffect(() => {
        const fetchOrders = async () => {
            let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myOrders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: JSON.parse(localStorage.getItem('myuser')).token }),
            })
            let res = await a.json()
            setOrders(res.orders);
        }
        if (!localStorage.getItem('myuser')) {
            router.push('/')
        } else {
            fetchOrders()
        }

    }, [router.query])
    return (
        <div className='min-h-screen'>
            <h1 className='font-semibold text-xl p-8 text-center'>My Orders</h1>
            <div class="flex flex-col">
                <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                        <div class="overflow-hidden">

                            <table class="min-w-full">
                                <thead class="bg-white border-b">
                                    <tr>
                                        <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                            #Order Id
                                        </th>
                                        <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                            Email
                                        </th>
                                        <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                        Amount
                                        </th>
                                        <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                       Details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((item)=>{
                                     return <tr key={item._id} class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.orderId}</td>
                                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                            {item.email}
                                        </td>
                                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                            {item.amount}
                                        </td>
                                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                            <Link href={'/order?id'+item._id}>Details</Link>
                                        </td>
                                    </tr>
                                     })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Orders
