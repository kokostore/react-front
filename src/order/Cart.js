import React, { useState, useEffect } from "react";
import { getCart, removeItem} from "./cartHelpers";
import PostCard from "../post/PostCard";
import {Link} from 'react-router-dom';
import Checkout from "./Checkout";

const Cart = () => {
	const [items, setItems] = useState([]);

	useEffect(() => {
		setItems(getCart());
	}, []);

	const showItems = items => {
		return (
			<div>
			    <h2>Your cart has {`${items.length}`} items</h2>
			    <hr/>
			    {items.map((post, i) => (
			    	<PostCard post={post} i={i} showAddToCartButton={false} cartUpdate={true} showRemoveProductButton={true} />
			    	))}
			</div>

		);
	};

	const noItemsMessage = () => (
	    <h2>
	        Your cart is empty. <br /> <Link to="/users"> Continue Shoppping </Link>
	    </h2>
	);

	return (
	<div className="container">
    	<div className="row">
    	    <div className="col-6">
    	    {items.length > 0 ? showItems(items) : noItemsMessage()}
    	    </div>

    	    <div className="col-6">
    	        <h2 className="mb-4"> Your cart summary </h2>
    	        <hr />
    	        <Checkout products={items} />
    	    <p>
    	        show checkout options / shipping address / total / update
    	        quantity
    	    </p>
    	    </div>

	    </div>
	</div>
	);
};


export default Cart;