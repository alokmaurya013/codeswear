const https = require('https');
const PaytmChecksum = require('paytmchecksum');
import Order from '../../models/Order'
import connectDb from '../../middleware/mongoose'
import pincodes from '../../pincode.json'
import Products from '../../models/Products';
const handler=async(req, res)=>{
    if (req.method == 'POST') {
        if(!Object.keys(pincodes).includes(req.body.pincode)){
            res.status(404).json({success:false,"error":"This Pincode is not serviceable",cartClear:false})
            return;
        }
        let product,sumTotal=0
        let cart=req.body.cart;
        if(req.body.subTotal<=0){
            res.status(404).json({success:false,"error":"Cart Empty! and Please build your cart and try again!",cartClear:false})
            return;
        }
        for(let item in cart){
            sumTotal+=cart[item].price*cart[item].qty
             product=await Products.findOne({slug:item})
             if(product.availableQty<cart.qty){
               res.status(404).json({success:false,'error':"Some items in your cart are out of stack.Please try again",cartClear:true})
             }
             if(product.price!=cart[item].price){
                res.status(404).json({success:false,"error":"The price of some items in your cart has changed",cartClear:true})
                return;
             }
        }
        if(sumTotal!=req.body.subTotal){
            res.status(404).json({success:false,"error":"The price of some items in your cart has changed",cartClear:true})
            return;
        }
        if(req.body.phone.length!=10||!Number.isInteger(Number(req.body.phone))){
            res.status(404).json({success:false,"error":"Please enter your 10 digit phone number",cartClear:false})
            return;
        }
        if(req.body.pincode.length!=6||!Number.isInteger(Number(req.body.pincode))){
            res.status(404).json({success:false,"error":"Please enter your 6 digit pincode",cartClear:false})
             return;
        }
        let order=new Order({
            email:req.body.email,
            orderId:req.body.oid,
            address:req.body.address,
            city:req.body.city,
            phone:req.body.phone,
            name:req.body.name,
            state:req.body.state,
            pincode:req.body.pincode,
            amount:req.body.subTotal,
            products:req.body.cart
        })
        await order.save()
        var paytmParams = {};
        paytmParams.body = {
            "requestType": "Payment",
            "mid": process.env.NEXT_PUBLIC_PAYTM_MID,
            "websiteName": "YOUR_WEBSITE_NAME",
            "orderId": req.body.oid,
            "callbackUrl": `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction}`,
            "txnAmount": {
                "value": req.body.subTotal,
                "currency": "INR",
            },
            "userInfo": {
                "custId": req.body.email,
            },
        };
   const checksum=await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MKEY) 
            paytmParams.head = {
                "signature": checksum
            };
            var post_data = JSON.stringify(paytmParams);
            const requestAsync = () => {
                return new Promise((resolve, reject) => {
                    var options = {
                        hostname: 'securegw.paytm.in',
                        port: 443,
                        path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${req.body.oid}`,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': post_data.length
                        }
                    };
                    var response = "";
                    var post_req = https.request(options, function (post_res) {
                        post_res.on('data', function (chunk) {
                            response += chunk;
                        });
                        post_res.on('end', function () {
                            let ress=JSON.parse(response).body
                            ress.success=true;
                            ress.cartClear=false;
                            resolve(ress)
                        });
                
                    });
                    post_req.write(post_data);
                    post_req.end();
                })
            }
        let myr=await requestAsync();
       res.status(200).json(myr)
    }
}
export default connectDb(handler);