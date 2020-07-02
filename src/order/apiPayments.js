import React, { useState} from "react";
import {isAuthenticated } from '../auth/index'

export const getCost=(userId,token,items)=>{
	return fetch(`${process.env.REACT_APP_API_URL}/order/getcost/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
		},
		body:JSON.stringify(items)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
} 


export const getRazorpayOrderId = (amount) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;
    return fetch(`${process.env.REACT_APP_API_URL}/razorpay/getOrderId/${userId}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({amount})
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const razorpay_verify = (userId, data, token) => {
   return fetch(`${process.env.REACT_APP_API_URL}/check_success/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const pay=(amount, currency, email, contact, notes, address, order_id, method, methodoptions)=>{
    
    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;
    return new Promise((resolve, reject) => {
    let data = {
        amount,currency,email,contact,order_id,
        notes: {
            ...notes,
            address
        },
        method,
        ...methodoptions,
    };
    // eslint-disable-next-line no-undef
    const razorpay = new Razorpay({
        key: `${process.env.REACT_APP_RAZORPAY_KEY_ID}`,
    });

    razorpay.createPayment(data);
    razorpay.focus()
    razorpay.on('payment.success', async(resp)=> {
        // const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = resp
        const reply= await razorpay_verify(userId, data,token)
        if(reply.payment_status===true){
            console.log('Payment Successful!')
            alert('Payment Successful!')
            //save this object: {...data, ...reply, ...resp}
            resolve({...data,...reply,...resp});        // to be removed, returning the entire object only for reference
        }
    })             
    razorpay.on('payment.error', (resp)=>{reject(resp.error)}); 
    })
} 