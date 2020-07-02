import React , { useState, useEffect } from "react";
import {isAuthenticated} from "../auth";
import {Link} from "react-router-dom";
import {getRazorpayOrderId,getCost} from "./apiPayments"
import Pay from "./Checkout/Pay";
import { getCart } from "./cartHelpers";

const Checkout = ({products}) => {

	const [data, setData] = useState({
        loading: false,
        success: false,
        merchant_order_id: null,
        amount: null,
        currency: null,
        error: "",
		address: "",
		startPay:false
    });
    
	const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    // const getToken = (userId, token) => {
    // 	return new Promise((resolve, reject) => {
    //     getRazorpayOrderId(userId, token).then(res => {
    //         if (res.error) {
    //             console.log(res.error);
    //             setData({ ...data, error: res.error });
    //             reject(Error("Failed to load script"));
    //         } else {
    //         	// set state with amount currency and merchant order id for all merchants
    //             resolve(res);
    //         }

    //     }).catch(err => console.log(err));
    // })
    // };

	const showPayOptions=()=>{
		return <Pay back={backToCheckout} details={data} />
	}
	const backToCheckout=(event)=>{
		event.preventDefault()
		setData({...data,startPay:false})
	}

	const payButton=async()=>{
        // await .then(async(cart)=>{
        const cart=getCart();
        let items={}
        for(let item of Object.keys(cart) ){
            items[cart[item]._id]=cart[item].count
        }
        await getCost(userId,token,items)
                   .then(cost=>{
                        setData({...data,amount:cost,startPay:true})
                    })          
		
	}

	// const showSuccess = success => {
    //     return    <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
    //         Thanks! Your payment was successful!
    //     </div>
    // };

    // const showLoading = loading => loading && <h2 className="text-danger">Loading...</h2>;

	const showPay = () => (
		<div>
		{products.length > 0 ?  (
		    <button onClick={payButton} className="btn btn-success" >Pay</button>
			) : null}
		</div>
	);

	const showCheckout = () => {
		return isAuthenticated() ? (
            <div>{showPay()}</div>
		   	) : (
		   	<Link to="/signin">
		   	<button className="btn btn-primary"> Sign in to Checkout </button>
		   	</Link>
	    ) 
	};


	return (
		<div>
		    <h2>Total: INR {data.amount}</h2>
			{data.startPay?showPayOptions():showCheckout()}
		</div>
	);
};

export default Checkout;