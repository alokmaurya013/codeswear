import Order from '../../models/Order'
import connectDb from '../../middleware/mongoose'
import Products from '../../models/Products';
import PaytmChecksum from "paytmchecksum";

const handler=async(req,res)=>{
    let order;
    var paytmchecksum=" ";
    
var paytmParams={}

const received_data=req.body;
for(var key in received_data){
   if(key=="CHECKSUMHASH"){
      paytmchecksum=received_data[key];
   }else{
    paytmParams[key]=received_data[key]
   }
}
var isValidChecksum=checksum_lib.verifySignature(paytmParams,process.env.PAYTM_MKEY,paytmchecksum);
if(!isValidChecksum){
   res.status(500).send("Some error")
   return;
}
    if(req.body.STATUS=='TXN_SUCCESS'){
      order=await Order.findOneAndUpdate({orderId:req.body.ORDERID},{status:'Paid',paymentInfo:JSON.stringify(req.body)},{transactionid:req.body.TXNID})
      let products=order.products
      for(let slug in products){
      await Products.findOneAndUpdate(
          {slug:slug},
          {$inc:{"availableQty":-products[slug].qty}}
      )
      }
    }else if(req.status=='PENDING'){
       order= await Order.findOneAndUpdate({orderId:req.body.ORDERID},{status:'Pending',paymentInfo:JSON.stringify(req.body)},{transactionid:req.body.TXNID})
    }

    res.redirect('/order?id=&clearCart=1&id='+order._id,200);
}
export default connectDb(handler);